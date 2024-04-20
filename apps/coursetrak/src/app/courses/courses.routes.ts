import { Routes } from '@angular/router';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./courses.component').then((x) => x.CoursesComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./courses-list.component').then(
            (x) => x.CoursesListComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./course-home.component').then((x) => x.CourseHomeComponent),
      },
    ],
  },
];
