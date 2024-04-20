import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Entity } from '@coursetrak/types';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { AlertService } from '../services/alert.service';
import { SupabaseService } from '../services/supabase.service';

type State = {
  loading: boolean;
  entities: Entity[];
  count: number;
};

export const EntitiesStore = signalStore(
  withState({ loading: false, entities: [], count: 0 } as State),
  withMethods(
    (
      state,
      supabase = inject(SupabaseService),
      snackBar = inject(MatSnackBar),
      dialog = inject(MatDialog),
      alert = inject(AlertService)
    ) => {
      async function getEntities() {
        patchState(state, { loading: true });
        const { data, error, count } = await supabase.client
          .from('entities')
          .select('id, name, short_name, created_at', { count: 'exact' })
          .order('short_name', { ascending: true });

        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          return;
        }

        patchState(state, {
          entities: data,
          loading: false,
          count: count ?? 0,
        });
      }

      async function saveEntity(request: Partial<Entity>) {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from('entities')
          .upsert([request]);

        if (error) {
          patchState(state, { loading: false });
          console.error(error);
          snackBar.open('Algo salio mal. Intente nuevamente');
          return;
        }
        patchState(state, { loading: false });
        dialog.closeAll();
        snackBar.open('Entidad guardada exitosamente.');
        await getEntities();
      }

      async function deleteEntity(id: string) {
        patchState(state, { loading: true });
        const confirm = await alert.openDialogPromise({
          message: 'Desea borrar esta sociedad?',
          title: 'Confirmar borrado',
        });

        if (!confirm) {
          return;
        }

        const { error } = await supabase.client
          .from('entities')
          .delete()
          .eq('id', id);

        if (error) {
          patchState(state, { loading: false });
          console.error(error);
          snackBar.open('Algo salio mal. Intente nuevamente');
          return;
        }

        patchState(state, {
          loading: false,
          entities: state.entities().filter((x) => x.id !== id),
        });
        snackBar.open('Entidad eliminada exitosamente.');
      }

      return { getEntities, saveEntity, deleteEntity };
    }
  ),
  withHooks({
    onInit({ getEntities }) {
      getEntities();
    },
  })
);
