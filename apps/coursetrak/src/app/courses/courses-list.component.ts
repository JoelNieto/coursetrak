import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [],
  template: `<h1 class="mat-h1">Cursos</h1>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesListComponent {}
