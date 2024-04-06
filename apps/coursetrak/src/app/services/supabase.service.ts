import { Injectable } from '@angular/core';
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
}
