import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { CoursesEvaluationsComponent } from './courses-evaluations.component';
import { CoursesItemsComponent } from './courses-items.component';
import { CoursesStore } from './courses.store';

@Component({
  selector: 'app-course-home',
  standalone: true,
  imports: [
    MatTabsModule,
    CoursesItemsComponent,
    MatProgressSpinner,
    CoursesEvaluationsComponent,
  ],
  template: `@if(store.currentCourse(); as course) {
    <div>
      <h2 class="mat-h2">{{ course.title }}</h2>
      <h3 class="mat-headline-6">{{ course.code }}</h3>
      <mat-tab-group>
        <mat-tab label="Lecciones">
          <ng-template matTabContent>
            <div class="p-5">
              <app-courses-items />
            </div>
          </ng-template>
        </mat-tab>
        <mat-tab label="Evaluaciones">
          <ng-template matTabContent>
            <div class="p-5"><app-courses-evaluations /></div>
          </ng-template>
        </mat-tab>
        <mat-tab label="Participantes"></mat-tab>
      </mat-tab-group>
    </div>
    } @else {
    <div class="flex w-full items-center justify-center h-80">
      <mat-progress-spinner mode="indeterminate" />
    </div>
    }`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseHomeComponent implements OnInit {
  public store = inject(CoursesStore);
  public id = input.required<string>();

  async ngOnInit() {
    await this.store.getCourse(this.id());
  }
}
