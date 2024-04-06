import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterOutlet],
  template: `<div class="p-5"><router-outlet /></div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesComponent {}
