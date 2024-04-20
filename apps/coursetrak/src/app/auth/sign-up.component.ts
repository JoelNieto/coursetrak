import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { patchState } from '@ngrx/signals';

import { SupabaseService } from '../services/supabase.service';
import { AuthStore } from '../stores/auth.store';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `<div class=" w-screen h-svh flex items-center justify-center px-6">
    <div class="w-full lg:w-1/3">
      <h1 class="mat-h2">Registro</h1>
      <form [formGroup]="form" (ngSubmit)="signUp()">
        <mat-form-field>
          <mat-label>Correo electronico</mat-label>
          <input
            type="email"
            formControlName="email"
            matInput
            placeholder="usuario@dominio.com"
          />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Cedula</mat-label>
          <input
            type="text"
            matInput
            formControlName="document_id"
            placeholder="9-999-9999"
          />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Contrasena</mat-label>
          <input
            type="password"
            matInput
            formControlName="password"
            placeholder="*******"
          />
        </mat-form-field>
        <button
          mat-flat-button
          class="w-full"
          type="submit"
          [disabled]="form.invalid"
        >
          Registrarse
        </button>
      </form>
    </div>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  public form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    document_id: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private auth = inject(AuthStore);

  async signUp() {
    const { error, data } = await this.supabase.signUp(this.form.getRawValue());

    if (error) {
      console.error(error);
      this.snackBar.open('Algo salio mal. Intente de nuevo');
      return;
    }
    this.snackBar.open('Cuenta creada exitosamente.');
    patchState(this.auth, { session: data.session });

    this.router.navigate(['/']);
  }
}
