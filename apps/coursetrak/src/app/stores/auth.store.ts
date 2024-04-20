import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@coursetrak/types';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Session } from '@supabase/supabase-js';
import { filter, pipe, tap } from 'rxjs';

import { SupabaseService } from '../services/supabase.service';

type State = {
  loading: boolean;
  user: User | undefined;
  session: Session | null;
};

const initial: State = { loading: false, user: undefined, session: null };

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initial),
  withMethods(
    (
      state,
      supabase = inject(SupabaseService),
      snackBar = inject(MatSnackBar)
    ) => {
      async function getSession() {
        patchState(state, { loading: true });

        const {
          data: { session },
          error,
        } = await supabase.client.auth.getSession();

        if (error || !session) {
          console.log(error ?? 'No session');
          patchState(state, { loading: false });
          return;
        }

        patchState(state, { session });
      }

      async function signIn(email: string, password: string) {
        patchState(state, { ...initial, loading: true });
        const { error } = await supabase.client.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          return;
        }

        getSession();
      }

      async function updateProfile(request: Partial<User>) {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from('users')
          .update({ ...request, updated_at: new Date() })
          .eq('id', state.user()?.id)
          .select('*')
          .single();

        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          snackBar.open('Algo salio mal. Intente nuevamente');
          return;
        }

        patchState(state, { loading: false, user: data });
        snackBar.open('Perfil actualizado exitosamente');
      }

      async function getUser() {
        const { data, error } = await supabase.client
          .from('users')
          .select(
            'id, first_name, middle_name, father_name, mother_name, document_id, email, entity_id, birth_date, updated_at'
          )
          .eq('id', state.session()?.user.id)
          .single();
        if (error) {
          console.error(error);
          patchState(state, { loading: false, session: null });
          return;
        }

        patchState(state, { user: data, loading: false });
      }

      const fetchUser = rxMethod<Session | null>(
        pipe(
          filter(() => !!state.session()),
          tap(() => getUser())
        )
      );

      return { getSession, signIn, fetchUser, updateProfile };
    }
  ),
  withHooks({
    onInit({ fetchUser, session, getSession }) {
      getSession();
      fetchUser(session);
    },
  })
);
