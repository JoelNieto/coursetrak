import { computed, inject } from '@angular/core';
import { Course } from '@coursetrak/types';
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
  courses: Course[];
  filterText: string;
};

export const CourseAssignationStore = signalStore(
  withState({ loading: false, courses: [], filterText: '' } as State),
  withComputed((state) => {
    const filteredCourses = computed(() =>
      state
        .courses()
        .filter(
          (x) =>
            x.code.toLowerCase().includes(state.filterText()) ||
            x.title.toLowerCase().includes(state.filterText())
        )
    );
    return {};
  }),
  withMethods((state, supabase = inject(SupabaseService)) => {
    async function fetchCourses() {
      patchState(state, { loading: true });
      const { data, error, count } = await supabase.client
        .from('courses')
        .select('id, title, code, description, user_id, created_at', {
          count: 'exact',
        })
        .order('title', { ascending: true });

      if (error) {
        console.error(error);
        patchState(state, { loading: false });
        return;
      }

      patchState(state, { loading: false, courses: data });
    }
    return { fetchCourses };
  }),
  withHooks({
    onInit({ fetchCourses }) {
      fetchCourses();
    },
  })
);
