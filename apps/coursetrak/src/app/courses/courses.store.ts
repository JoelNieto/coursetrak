import { computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course, Lesson, Option, Question } from '@coursetrak/types';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { SupabaseService } from '../services/supabase.service';

type State = {
  loading: boolean;
  courses: Course[];
  currentCourse: Course | null;
  questions: Question[];
};

const initialState: State = {
  loading: false,
  courses: [],
  currentCourse: null,
  questions: [],
};

export const CoursesStore = signalStore(
  withState(initialState),
  withComputed((state) => ({
    lastSortNumber: computed(
      () =>
        state
          .currentCourse()
          ?.lessons?.sort((a, b) => a.sort - b.sort)
          .findLast((x) => x)?.sort ?? 0
    ),
  })),
  withMethods(
    (
      state,
      supabase = inject(SupabaseService),
      snackBar = inject(MatSnackBar),
      dialog = inject(MatDialog)
    ) => {
      async function getCourse(id: string): Promise<void> {
        const { data, error } = await supabase.client
          .from('courses')
          .select(
            'id, title, description, code, user_id, created_at, lessons:course_lessons(id, title, content, sort, created_at),assignations:course_assignations(user_id, assigned_at, completed_at, started_at, due_date)'
          )
          .eq('id', id)
          .single();
        if (error) {
          patchState(state, { loading: false });
          console.error(error);
        }

        patchState(state, { loading: false, currentCourse: data });
      }

      async function saveLesson(request: Partial<Lesson>) {
        patchState(state, { loading: true });
        const { error } = await supabase.client.from('course_lessons').upsert([
          {
            ...request,
            course_id: state.currentCourse()?.id,
            sort: request.sort ? request.sort : state.lastSortNumber() + 1,
          },
        ]);

        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          snackBar.open('Algo salio mal. Intente nuevamente');
          return;
        }

        snackBar.open('Leccion guardada exitosamente');
        dialog.closeAll();
      }

      async function fetchQuestions() {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from('evaluation_questions')
          .select(
            'id, question, options:question_options(id, option_text, is_correct, question_id), created_at'
          )
          .eq('course_id', state.currentCourse()?.id);
        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          return;
        }

        patchState(state, { loading: false, questions: data });
      }

      async function saveQuestion(request: Question) {
        patchState(state, { loading: true });
        const { question, id, options } = request;
        const { error } = await supabase.client
          .from('evaluation_questions')
          .upsert([{ id, question, course_id: state.currentCourse()?.id }]);

        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          return;
        }
        if (options) {
          await saveOptions({ options, question_id: id });
        }

        snackBar.open('Pregunta guardada exitosamente');

        fetchQuestions();
        dialog.closeAll();
      }

      async function saveOptions({
        options,
        question_id,
      }: {
        options: Partial<Option>[];
        question_id: string;
      }) {
        const { error } = await supabase.client
          .from('question_options')
          .upsert(options.map((x) => ({ ...x, question_id })));

        if (error) {
          throw new Error(error.message);
        }
      }

      return { getCourse, saveLesson, fetchQuestions, saveQuestion };
    }
  )
);
