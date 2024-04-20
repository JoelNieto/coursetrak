import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Entity } from '@coursetrak/types';
import { v4 } from 'uuid';
import { EntitiesStore } from './entities.store';

@Component({
  selector: 'app-entities-form',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressBarModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="saveEntity()">
      @if(store.loading()){<mat-progress-bar mode="indeterminate" />}
      <h2 mat-dialog-title>Datos de la entidad</h2>
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input type="text" formControlName="name" matInput />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Siglas</mat-label>
          <input type="text" matInput formControlName="short_name" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancelar</button>
        <button
          mat-flat-button
          cdkFocusInitial
          type="submit"
          [disabled]="form.invalid"
        >
          Guardar cambios
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitiesFormComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<EntitiesFormComponent>);
  public store = inject(EntitiesStore);
  public data: Entity | undefined = inject(MAT_DIALOG_DATA);
  form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    short_name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  saveEntity() {
    this.store.saveEntity(this.form.getRawValue());
  }
}
