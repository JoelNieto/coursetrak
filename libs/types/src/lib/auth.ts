import { Entity } from './entities';

export type SignUpCredentials = {
  email: string;
  password: string;
  document_id: string;
};

export type User = {
  id: string;
  email: string;
  document_id: string;
  first_name: string;
  middle_name: string;
  father_name: string;
  mother_name: string;
  entity_id?: string;
  entity?: Entity;
  birth_date: Date;
  updated_at: Date;
};
