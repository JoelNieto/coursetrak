import { Route } from '@angular/router';

export const appRoutes: Route[] = [
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
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
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
];
