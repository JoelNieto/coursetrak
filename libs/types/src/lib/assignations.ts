import { Course, User } from '@coursetrak/types';

export type CourseAssignations = {
  course_id: string;
  course?: Course;
  user_id: string;
  user: User;
  assigned_at: Date;
  completed_at: Date;
  started_at: Date;
  due_date: Date;
};
