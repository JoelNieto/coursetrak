import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormArray,
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
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Option, Question } from '@coursetrak/types';
import { v4 } from 'uuid';
import { CoursesStore } from './courses.store';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggle,
    MatProgressBar,
    ReactiveFormsModule,
  ],
  template: `<form [formGroup]="form" (ngSubmit)="saveChanges()">
    @if(store.loading()) {
    <mat-progress-bar mode="indeterminate" />
    }
    <h2 mat-dialog-title>Pregunta</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Texto pregunta</mat-label>
        <textarea
          matInput
          formControlName="question"
          placeholder="Ingrese pregunta"
        ></textarea>
      </mat-form-field>
      <div formArrayName="options">
        <p class="mat-body-strong mb-2">Opciones</p>
        @for(option of options.controls; track option; let idx = $index) {
        <div class="flex gap-3 items-baseline" [formGroupName]="idx">
          <mat-form-field class="basis-1/2">
            <mat-label>Opcion</mat-label>
            <input type="text" matInput formControlName="option_text" />
          </mat-form-field>
          <div class="basis-1/4 flex gap-4 items-baseline">
            <mat-slide-toggle formControlName="is_correct">
              Correcto
            </mat-slide-toggle>
            <button
              mat-stroked-button
              color="warn"
              type="button"
              (click)="removeOptions(idx)"
            >
              <mat-icon>delete</mat-icon>
              Borrar
            </button>
          </div>
        </div>
        }
        <button
          mat-stroked-button
          color="accent"
          type="button"
          (click)="addOption()"
        >
          <mat-icon>playlist_add</mat-icon>
          Opcion
        </button>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close type="button">
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
export class QuestionFormComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(v4(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    question: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    options: new FormArray<FormGroup>([]),
  });
  public store = inject(CoursesStore);
  private data: Question | undefined = inject(MAT_DIALOG_DATA);

  get options() {
    return this.form.get('options') as FormArray;
  }

  ngOnInit() {
    if (!!this.data) {
      this.form.patchValue(this.data);
      this.data.options?.forEach((option) => {
        this.addOption(option);
      });
    }
  }

  public addOption(option?: Partial<Option>) {
    const optionForm = new FormGroup({
      id: new FormControl(v4(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      option_text: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      is_correct: new FormControl(false, { nonNullable: true }),
    });

    !!option && optionForm.patchValue(option);

    this.form.controls.options.push(optionForm);
  }

  removeOptions(index: number) {
    this.form.controls.options.removeAt(index);
  }

  saveChanges() {
    this.store.saveQuestion(this.form.getRawValue() as Question);
  }
}
