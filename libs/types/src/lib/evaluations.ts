export type Question = {
  id: string;
  course_id?: string;
  question: string;
  created_at?: Date;
  options?: Option[];
};

export type Option = {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  created_at?: Date;
};
