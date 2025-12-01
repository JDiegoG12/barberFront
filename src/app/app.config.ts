import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { KeycloakAngularModule, KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'barbershop',
        clientId: 'frontend-client'
      },
      initOptions: {
        onLoad: 'check-sso', // 'login-required' , 'check-sso'
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      },
      enableBearerInterceptor: true
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
        withInMemoryScrolling({
        // Habilita que el router se desplace a un ancla si está presente en la URL
        anchorScrolling: 'enabled',
        // Opcional: Cuando navegues hacia atrás/adelante, restaura la posición de scroll anterior
        scrollPositionRestoration: 'enabled'
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    KeycloakService,
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    }
  ]
};
