import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AlertDialogComponent } from './alert-dialog.component';

import { AuthStore } from './stores/auth.store';

@Component({
  selector: 'app-layout',
  template: `<mat-sidenav-container autosize class="sidenav-container">
    <mat-sidenav
      #drawer
      fixedInViewport
      [attr.role]="isHandset() ? 'dialog' : 'navigation'"
      [mode]="isHandset() ? 'over' : 'side'"
      [opened]="!isHandset()"
      [ngClass]="isCollapsed() ? 'w-20' : 'w-48'"
    >
      <div class="flex flex-col justify-between h-svh">
        <div>
          <mat-toolbar class="flex items-center justify-between"
            >@if(!isCollapsed()){<span>Coursetrak</span>}

            <button mat-icon-button (click)="toggleMenu()">
              <mat-icon>menu</mat-icon>
            </button>
          </mat-toolbar>
          <mat-nav-list>
            <a
              mat-list-item
              routerLinkActive="active"
              #home="routerLinkActive"
              [activated]="home.isActive"
              routerLink="home"
            >
              <mat-icon matListItemIcon>home</mat-icon>
              @if(!isCollapsed()) {
              <div matListItemTitle>Inicio</div>
              }
            </a>
            <a
              mat-list-item
              routerLinkActive="active"
              #courses="routerLinkActive"
              [activated]="courses.isActive"
              routerLink="courses"
            >
              <mat-icon matListItemIcon>school</mat-icon>
              @if(!isCollapsed()) {
              <div matListItemTitle>Cursos</div>
              }
            </a>
            <a mat-list-item href="#">Link 3</a>
          </mat-nav-list>
        </div>
        <mat-nav-list>
          <a
            mat-list-item
            routerLinkActive="admin"
            #admin="routerLinkActive"
            [activated]="admin.isActive"
            routerLink="admin"
          >
            <mat-icon matListItemIcon>manage_accounts</mat-icon>
            @if(!isCollapsed()) {
            <div matListItemTitle>Admin</div>
            }
          </a>
          <a
            mat-list-item
            routerLinkActive="profile"
            #profile="routerLinkActive"
            [activated]="profile.isActive"
            routerLink="profile"
          >
            <mat-icon matListItemIcon>account_circle</mat-icon>
            @if(!isCollapsed()) {
            <div matListItemTitle>Perfil</div>
            }
          </a>
        </mat-nav-list>
      </div>
    </mat-sidenav>
    <mat-sidenav-content>
      <router-outlet />
    </mat-sidenav-content>
  </mat-sidenav-container> `,
  styles: `
    .sidenav-container {
      height: 100%;
    }


    .sidenav .mat-toolbar {
      background: inherit;
    }

    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  `,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    NgClass,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class LayoutComponent implements OnInit {
  public isHandset = signal(false);
  public isCollapsed = signal(false);
  public auth = inject(AuthStore);
  private dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);
  private sidenav = viewChild.required(MatSidenav);
  private router = inject(Router);
  private injector = inject(Injector);

  ngOnInit(): void {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .subscribe({ next: (result) => this.isHandset.set(result.matches) });
    effect(
      () => {
        if (!this.auth.user()) {
          return;
        }

        if (!this.auth.user()?.first_name)
          this.dialog
            .open(AlertDialogComponent, {
              width: '24rem',
              data: {
                title: 'Datos incompletos',
                message: 'Favor actualizar sus datos personales',
                hideCancel: true,
              },
            })
            .afterClosed()
            .subscribe({
              next: (res) => {
                if (res) this.router.navigate(['/profile']);
              },
            });
      },
      { injector: this.injector }
    );
  }

  async toggleMenu() {
    if (this.isHandset()) {
      this.sidenav().toggle();
      this.isCollapsed.set(false);
      return;
    }
    this.sidenav().open();
    this.isCollapsed.update((value) => !value);
  }
}
