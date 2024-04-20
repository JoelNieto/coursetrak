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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Lesson } from '@coursetrak/types';
import { v4 } from 'uuid';
import { MatQuill } from '../components/mat-quill/mat-quill.component';
import { CoursesStore } from './courses.store';

@Component({
  selector: 'app-courses-items-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBar,
    MatQuill,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    @if(store.loading()) {
    <mat-progress-bar mode="indeterminate" />
    }
    <h2 mat-dialog-title>Leccion</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Titulo</mat-label>
        <input type="text" matInput formControlName="title" />
      </mat-form-field>
      <mat-form-field>
        <mat-quill theme="snow" format="html" formControlName="content" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>
        <mat-icon>close</mat-icon> Cancelar
      </button>
      <button mat-flat-button type="submit" [disabled]="form.invalid">
        Guardar cambios
      </button>
    </mat-dialog-actions>
  </form>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesItemsFormComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(v4(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    title: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    content: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  public store = inject(CoursesStore);
  private data: Lesson | undefined = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    !!this.data && this.form.patchValue(this.data);
  }

  saveChanges() {
    this.store.saveLesson(this.form.getRawValue());
  }
}
