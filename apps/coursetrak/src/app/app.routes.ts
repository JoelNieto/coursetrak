import { Route } from '@angular/router';
import { authGuardFn } from './guards';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivateChild: [authGuardFn],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./layout.component').then((x) => x.LayoutComponent),
        children: [
          {
            path: 'home',
            loadComponent: () =>
              import('./dashboard.component').then((x) => x.DashboardComponent),
          },
          {
            path: 'courses',
            loadChildren: () =>
              import('./courses/courses.routes').then((x) => x.COURSES_ROUTES),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./profile.component').then((x) => x.ProfileComponent),
          },
          {
            path: 'admin',
            loadComponent: () =>
              import('./admin/admin.component').then((x) => x.AdminComponent),
          },
          { path: '', redirectTo: 'home', pathMatch: 'full' },
        ],
      },
    ],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./auth/sign-in.component').then((x) => x.SignInComponent),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./auth/sign-up.component').then((x) => x.SignUpComponent),
      },
      {
        path: 'address',
        loadComponent: () =>
          import('./address/address.component').then((x) => x.AddressComponent),
      },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
