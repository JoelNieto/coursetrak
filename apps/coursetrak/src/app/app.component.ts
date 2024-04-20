import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthStore } from './stores/auth.store';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: `<router-outlet />`,
  styles: '',
})
export class AppComponent {
  title = 'coursetrak';
  public auth = inject(AuthStore);
}
