import { Course } from '@coursetrak/types';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../services/alert.service';

type State = {
  loading: boolean;
  courses: Course[];
  count: number;
};

const initial: State = { loading: false, courses: [], count: 0 };

export const AdminCoursesStore = signalStore(
  withState(initial),
  withMethods(
    (
      state,
      supabase = inject(SupabaseService),
      snackBar = inject(MatSnackBar),
      dialog = inject(MatDialog),
      alert = inject(AlertService)
    ) => {
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

        patchState(state, { loading: false, courses: data, count: count ?? 0 });
      }

      async function saveCourse(request: Partial<Course>) {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from('courses')
          .upsert([request]);

        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          snackBar.open('Algo salio mal. Intente nuevamente');
          return;
        }
        snackBar.open('Curso actualizado exitosamente');
        dialog.closeAll();
        await fetchCourses();
      }
      async function deleteCourse(id: string) {
        patchState(state, { loading: true });
        const confirm = await alert.openDialogPromise({
          message: 'Desea borrar este curso?',
          title: 'Confirmar borrado',
        });

        if (!confirm) return;

        const { error } = await supabase.client
          .from('courses')
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
          courses: state.courses().filter((x) => x.id !== id),
        });
        snackBar.open('Curso eliminado exitosamente');
      }

      return { fetchCourses, saveCourse, deleteCourse };
    }
  ),
  withHooks({
    onInit({ fetchCourses }) {
      fetchCourses();
    },
  })
);
