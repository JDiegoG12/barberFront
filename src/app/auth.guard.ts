import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

/**
 * Este guardia protege las rutas accesibles solo para usuarios con rol de CLIENTE.
 */
export const ClientGuard: CanActivateFn = (route, state) => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);

    const isLoggedIn = keycloakService.isUserInRole('CLIENT') && keycloakService.isUserInRole('ADMIN') === false && keycloakService.isUserInRole('BARBER') === false;
    if (!isLoggedIn) {
        router.navigate(['/']);
        return false;
    }
    return true;
};

/**
 * Este guardia protege las rutas accesibles solo para usuarios con rol de ADMINISTRADOR.
 */
export const AdminGuard: CanActivateFn = (route, state) => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);

    const isLoggedIn = keycloakService.isUserInRole('ADMIN');
    if (!isLoggedIn) {
        router.navigate(['/']);
        return false;
    }
    return true;
};

/**
 * Este guardia protege las rutas accesibles solo para usuarios con rol de BARBERO.
 */
export const BarberGuard: CanActivateFn = (route, state) => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);
    
    const isLoggedIn = keycloakService.isUserInRole('BARBER');
    if (!isLoggedIn) {
        router.navigate(['/']);
        return false;
    }
    return true;
};