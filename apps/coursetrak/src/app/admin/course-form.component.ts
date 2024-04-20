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
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Course } from '@coursetrak/types';
import { v4 } from 'uuid';
import { AdminCoursesStore } from './courses.store';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatProgressBar,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    <h2 mat-dialog-title>Datos del curso</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Titulo</mat-label>
        <input type="text" formControlName="title" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Codigo</mat-label>
        <input type="text" formControlName="code" matInput />
      </mat-form-field>
      <mat-form-field>
        <mat-label>Descripcion</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button type="button" mat-dialog-close>
        <mat-icon>close</mat-icon>Cancelar
      </button>
      <button mat-flat-button type="submit" [disabled]="form.invalid">
        Guardar cambios
      </button>
    </mat-dialog-actions>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseFormComponent implements OnInit {
  public form = new FormGroup({
    id: new FormControl(v4(), { nonNullable: true }),
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  private data: Course | undefined = inject(MAT_DIALOG_DATA);
  private store = inject(AdminCoursesStore);

  ngOnInit() {
    !!this.data && this.form.patchValue(this.data);
  }

  saveChanges() {
    this.store.saveCourse(this.form.getRawValue());
  }
}
