import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import localeEn from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { LuxonDateAdapter, MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    importProvidersFrom(MatLuxonDateModule),
    { provide: DateAdapter, useClass: LuxonDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-EN' }
  ]
};
