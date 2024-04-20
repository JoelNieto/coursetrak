import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { EntitiesComponent } from './entities.component';
import { UsersComponent } from './users.component';
import { CoursesAdminComponent } from './courses-admin.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTabsModule,
    EntitiesComponent,
    UsersComponent,
    CoursesAdminComponent,
  ],
  template: ` <div class="p-5">
    <h2 class="mat-h2">Administracion</h2>
    <mat-tab-group>
      <mat-tab label="Cursos">
        <mat-tab-nav-panel>
          <app-courses-admin />
        </mat-tab-nav-panel>
      </mat-tab>
      <mat-tab label="Entidades">
        <mat-tab-nav-panel>
          <app-entities />
        </mat-tab-nav-panel>
      </mat-tab>
      <mat-tab label="Usuarios">
        <mat-tab-nav-panel>
          <app-users />
        </mat-tab-nav-panel>
      </mat-tab>
    </mat-tab-group>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {}
