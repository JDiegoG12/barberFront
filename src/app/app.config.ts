import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
// 1. Importamos 'withInMemoryScrolling' desde el router
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

// Función para inicializar Keycloak
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'barbershop',
        clientId: 'frontend-client'
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        // AGREGA ESTO: Fuerza el uso del estándar moderno (evita conflictos de hash/query)
        flow: 'standard' 
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer'
    });
}

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
    ),
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ]
};