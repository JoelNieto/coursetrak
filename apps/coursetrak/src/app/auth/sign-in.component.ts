import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  template: `<div class="flex h-svh w-svw flex-col items-center justify-center">
    <form class="w-96">
      <h1 class="mat-headline-2">Login</h1>
      <mat-form-field class="w-full">
        <mat-label>Nombre de usuario</mat-label>
        <input type="email" matInput />
      </mat-form-field>
      <mat-form-field class="w-full">
        <mat-label>Contrasena</mat-label>
        <input type="password" matInput />
      </mat-form-field>
      <button mat-flat-button class="w-full mb-2">Login</button>
      <a mat-stroked-button routerLink="../sign-up" class="w-full"
        >Registrarse</a
      >
    </form>
  </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {}
