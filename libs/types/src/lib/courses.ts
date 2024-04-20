import { BaseType } from './base';
import { Lesson } from './lessons';

export type Course = BaseType & {
  title: string;
  description: string;
  user_id: string;
  code: string;
  lessons?: Lesson[];
};
