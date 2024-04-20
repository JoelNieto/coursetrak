import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AuthStore } from './stores/auth.store';
import { EntitiesStore } from './admin/entities.store';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    JsonPipe,
  ],
  providers: [EntitiesStore],
  template: `<div class="p-5">
    <h1 class="mat-h1">Perfil</h1>
    <form
      [formGroup]="form"
      class=" flex flex-col lg:grid lg:grid-cols-2 gap-3"
      (ngSubmit)="saveChanges()"
    >
      <mat-form-field>
        <mat-label>Nombre</mat-label>
        <input type="text" formControlName="first_name" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Segundo nombre</mat-label>
        <input type="text" formControlName="middle_name" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Apellido</mat-label>
        <input type="text" formControlName="father_name" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Apellido materno/casada</mat-label>
        <input type="text" formControlName="mother_name" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Cedula</mat-label>
        <input type="text" formControlName="document_id" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Correo</mat-label>
        <input type="email" formControlName="email" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Entidad</mat-label>
        <mat-select formControlName="entity_id">
          @for(entity of entities.entities(); track entity.id) {
          <mat-option [value]="entity.id"
            >{{ entity.name }} ({{ entity.short_name }})</mat-option
          >
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label for="birth_date"> Fecha de nacimiento </mat-label>
        <input
          formControlName="birth_date"
          matInput
          [matDatepicker]="birth_date"
        />
        <mat-datepicker-toggle matIconSuffix [for]="birth_date" />
        <mat-datepicker #birth_date />
      </mat-form-field>
      <div class="col-span-2">
        <button
          mat-flat-button
          type="submit"
          [disabled]="form.invalid || form.pristine"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public auth = inject(AuthStore);
  public entities = inject(EntitiesStore);
  form = new FormGroup({
    first_name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    middle_name: new FormControl('', { nonNullable: true }),
    father_name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    mother_name: new FormControl('', { nonNullable: true }),
    document_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    entity_id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birth_date: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  private injector = inject(Injector);

  ngOnInit(): void {
    effect(
      () => {
        const user = this.auth.user();
        if (user) {
          this.form.patchValue(user);
        }
      },
      { injector: this.injector }
    );
  }

  saveChanges() {
    this.auth.updateProfile(this.form.getRawValue());
  }
}
