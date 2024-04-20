import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Question } from '@coursetrak/types';
import { CoursesStore } from './courses.store';
import { QuestionFormComponent } from './question-form.component';

@Component({
  selector: 'app-courses-evaluations',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `<div class="flex items-center justify-between">
      <h3 class="mat-h4">Preguntas</h3>

      <button mat-flat-button (click)="editQuestion()">
        <mat-icon>add</mat-icon> Nueva
      </button>
    </div>
    <div class="flex flex-col gap-4 overflow-hidden">
      @for(question of store.questions();track question.id ) {
      <div
        class="flex items-center justify-between py-3 px-6 border border-gray-300 rounded-lg"
      >
        <p class="mat-body-strong">{{ question.question }}</p>
        <div class="flex gap-2">
          <button
            mat-icon-button
            color="warn"
            (click)="deleteQuestion(question.id)"
          >
            <mat-icon color="warn">delete</mat-icon>
          </button>
          <button mat-icon-button (click)="editQuestion(question)">
            <mat-icon color="primary">edit</mat-icon>
          </button>
        </div>
      </div>
      }
    </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesEvaluationsComponent implements OnInit {
  public store = inject(CoursesStore);
  private dialog = inject(MatDialog);
  private containerRef = inject(ViewContainerRef);

  ngOnInit() {
    this.store.fetchQuestions();
  }

  editQuestion(question?: Question) {
    this.dialog.open(QuestionFormComponent, {
      width: '32rem',
      minWidth: '50vw',
      maxWidth: '95vw',
      disableClose: true,
      viewContainerRef: this.containerRef,
      data: question,
    });
  }

  deleteQuestion(id: string) {
    console.log(id);
  }
}
