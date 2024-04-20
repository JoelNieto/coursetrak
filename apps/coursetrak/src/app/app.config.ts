import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import localeEs from '@angular/common/locales/es-MX';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withViewTransitions,
} from '@angular/router';
import { es } from 'date-fns/locale';
import { appRoutes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { provideQuillConfig } from 'ngx-quill';

registerLocaleData(localeEs, 'es-MX');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideAnimationsAsync(),
    provideDateFnsAdapter(),
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: MAT_DATE_LOCALE, useValue: es },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { verticalPosition: 'top', duration: 3_000 },
    },
    provideQuillConfig({
      theme: 'snow',
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          [{ list: 'ordered' }, { list: 'bullet' }], // superscript/subscript// text direction
          ['clean'], // remove formatting button
          ['link', 'image', 'video'],
        ],
      },
    }),

    importProvidersFrom(EditorModule),
  ],
};
