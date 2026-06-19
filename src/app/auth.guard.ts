import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

/**
 * Guardia que protege las rutas accesibles solo para usuarios con rol de CLIENTE.
 */
export const ClientGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.hasRole('CLIENT')) {
        router.navigate(['/']);
        return false;
    }
    return true;
};

/**
 * Guardia que protege las rutas accesibles solo para usuarios con rol de ADMINISTRADOR.
 */
export const AdminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.hasRole('ADMIN')) {
        router.navigate(['/']);
        return false;
    }
    return true;
};

/**
 * Guardia que protege las rutas accesibles solo para usuarios con rol de BARBERO.
 */
export const BarberGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.hasRole('BARBER')) {
        router.navigate(['/']);
        return false;
    }
    return true;
};
