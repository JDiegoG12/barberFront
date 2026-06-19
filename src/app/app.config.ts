import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
        withInMemoryScrolling({
        // Habilita que el router se desplace a un ancla si está presente en la URL
        anchorScrolling: 'enabled',
        // Cuando navegues hacia atrás/adelante, restaura la posición de scroll anterior
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideHttpClient()
  ]
};
