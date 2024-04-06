import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  template: `<mat-sidenav-container autosize class="sidenav-container">
    <mat-sidenav
      #drawer
      class="sidenav"
      fixedInViewport
      [attr.role]="isHandset() ? 'dialog' : 'navigation'"
      [mode]="isHandset() ? 'over' : 'side'"
      [opened]="!isHandset()"
      [ngClass]="isCollapsed() ? 'w-20' : 'w-48'"
    >
      <mat-toolbar class="flex items-center justify-between"
        >@if(!isCollapsed()){<span>Coursetrak</span>}
        <button mat-icon-button (click)="toggleMenu()">
          <mat-icon>menu</mat-icon>
        </button></mat-toolbar
      >
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
  private breakpointObserver = inject(BreakpointObserver);
  public isHandset = signal(false);
  public isCollapsed = signal(false);
  private sidenav = viewChild.required(MatSidenav);

  ngOnInit(): void {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .subscribe({ next: (result) => this.isHandset.set(result.matches) });
  }

  toggleMenu() {
    if (this.isHandset()) {
      this.sidenav().toggle();
      this.isCollapsed.set(false);
      return;
    }
    this.sidenav().open();
    this.isCollapsed.update((value) => !value);
  }
}
