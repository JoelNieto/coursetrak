import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Lesson } from '@coursetrak/types';
import { CoursesItemsFormComponent } from './courses-items-form.component';
import { CoursesStore } from './courses.store';

@Component({
  selector: 'app-courses-items',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  template: `<div class="flex justify-between">
      <h3 class="mat-h4">Lecciones</h3>
      <button mat-flat-button (click)="editLesson()">
        <mat-icon>add</mat-icon> Agregar
      </button>
    </div>
    <div class="flex flex-col gap-4 overflow-hidden">
      @for(lesson of store.currentCourse()?.lessons;track lesson.id ) {
      <div
        class="flex items-center justify-between py-3 px-6 border border-gray-300 rounded-lg"
      >
        <p class="mat-body-strong">{{ lesson.title }}</p>
        <div class="flex gap-2">
          <button
            mat-icon-button
            color="warn"
            (click)="deleteLesson(lesson.id)"
          >
            <mat-icon color="warn">delete</mat-icon>
          </button>
          <button mat-icon-button (click)="editLesson(lesson)">
            <mat-icon color="primary">edit</mat-icon>
          </button>
        </div>
      </div>
      }
    </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesItemsComponent {
  public store = inject(CoursesStore);
  private containerRef = inject(ViewContainerRef);
  private dialog = inject(MatDialog);

  editLesson(lesson?: Lesson): void {
    this.dialog.open(CoursesItemsFormComponent, {
      width: '80vw',
      minWidth: '80vw',
      viewContainerRef: this.containerRef,
      disableClose: true,
      data: lesson,
    });
  }

  deleteLesson(id: string) {
    console.log({ id });
  }
}
