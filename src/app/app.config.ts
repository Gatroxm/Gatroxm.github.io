import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserModule), // Asegúrate de importar HttpClientModule
    // Otros proveedores aquí
  ],
};
