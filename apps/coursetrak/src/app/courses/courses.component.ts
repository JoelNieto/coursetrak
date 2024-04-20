import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoursesStore } from './courses.store';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterOutlet],
  providers: [CoursesStore],
  template: `<div class="p-5"><router-outlet /></div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent {}
