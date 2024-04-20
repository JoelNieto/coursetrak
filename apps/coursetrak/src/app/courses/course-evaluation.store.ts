import { inject } from '@angular/core';
import { Question } from '@coursetrak/types';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { SupabaseService } from '../services/supabase.service';

type State = {
  loading: boolean;
  id: string;
  questions: Question[];
  isUpdated: boolean;
};

const initial: State = {
  loading: false,
  questions: [],
  id: '',
  isUpdated: false,
};

export const CourseEvaluationStore = signalStore(
  withState(initial),
  withMethods((state, supabase = inject(SupabaseService)) => {
    async function getEvaluation() {
      patchState(state, { loading: true });
      const { data, error } = await supabase.client
        .from('course_evaluations')
        .select('id, error_allowed, course_id, created_at')
        .eq('id', state.id())
        .single();

      if (error) {
        console.error(error);
        patchState(state, { loading: false });
        return;
      }
    }
    return { getEvaluation };
  })
);
