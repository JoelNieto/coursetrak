import { Injectable } from '@angular/core';
import { SignUpCredentials } from '@coursetrak/types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public client: SupabaseClient;
  constructor() {
    this.client = createClient(
      'https://sovnzsuyzdftvinthfpb.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvdm56c3V5emRmdHZpbnRoZnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzMjMzNTEsImV4cCI6MjAyNzg5OTM1MX0.bMmwXbyManKFhJfzXTblyuvY48DPJYqHjUrJW1QUh3o'
    );
  }

  public signUp(request: SignUpCredentials) {
    const { email, password, document_id } = request;
    return this.client.auth.signUp({
      email,
      password,
      options: { data: { email, document_id } },
    });
  }

  public async isLoggedIn(): Promise<boolean> {
    const {
      data: { session },
    } = await this.client.auth.getSession();
    console.log({ session });
    return !!session;
  }

  public signInWithEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    return this.client.auth.signInWithPassword({ email, password });
  }
}
