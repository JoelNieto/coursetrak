import { computed, inject } from '@angular/core';
import { User } from '@coursetrak/types';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { SupabaseService } from '../services/supabase.service';

type State = {
  loading: boolean;
  users: User[];
  queryText: string;
};

const initialState: State = { loading: false, users: [], queryText: '' };

export const UsersStore = signalStore(
  withState(initialState),
  withComputed((state) => {
    const searchText = computed(() => state.queryText().toLowerCase());
    const filtered = computed(() =>
      state
        .users()
        .filter(
          (user) =>
            user.first_name.toLowerCase().includes(searchText()) ||
            user.father_name.toLowerCase().includes(searchText()) ||
            user.document_id.toLowerCase().includes(searchText())
        )
    );
    return { filtered };
  }),
  withMethods((state, supabase = inject(SupabaseService)) => {
    async function fetchUsers() {
      patchState(state, { loading: true });

      const { data, error } = await supabase.client
        .from('users')
        .select(
          'id, first_name, middle_name, email, birth_date, updated_at, father_name, mother_name, document_id, entity_id, entity:entities(id, name, short_name)'
        );
      if (error) {
        console.error(error);
        patchState(state, { loading: false });
        return;
      }

      patchState(state, { loading: false, users: data as unknown as User[] });
    }
    return { fetchUsers };
  }),
  withHooks({
    async onInit({ fetchUsers }) {
      await fetchUsers();
    },
  })
);
