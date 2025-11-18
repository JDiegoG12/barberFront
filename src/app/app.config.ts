import { ApplicationConfig } from '@angular/core';
// 1. Importamos 'withInMemoryScrolling' desde el router
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 2. Añadimos la configuración de scroll como un segundo argumento
    provideRouter(
      routes,
      withInMemoryScrolling({
        // Habilita que el router se desplace a un ancla si está presente en la URL
        anchorScrolling: 'enabled',
        // Opcional: Cuando navegues hacia atrás/adelante, restaura la posición de scroll anterior
        scrollPositionRestoration: 'enabled'
      })
    )
  ]
};