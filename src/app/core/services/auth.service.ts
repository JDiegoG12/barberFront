import { Injectable, inject } from '@angular/core';
import { KeycloakService, KeycloakEventType  } from 'keycloak-angular';
import { User } from '../models/views/user.view.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  keycloakService: KeycloakService;

  constructor(keycloakService: KeycloakService) { 
    this.keycloakService = keycloakService;
    keycloakService.keycloakEvents$.subscribe({
      next(event) {
        if (event.type == KeycloakEventType.OnTokenExpired) {
          keycloakService.updateToken(20);
        }
      }
    });
  }

  // Obtener el perfil del usuario logueado
  async getUserProfile(): Promise<User | null> {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      
      if (isLoggedIn) {
        // CAMBIO AQUÍ: No usamos loadUserProfile(), leemos el token directamente.
        const token = this.keycloakService.getKeycloakInstance().tokenParsed;
        
        if (!token) return null;

        const roles = this.keycloakService.getUserRoles();
        const role = roles.includes('ADMIN') ? 'ADMIN' : roles.includes('BARBER') ? 'BARBER' : 'CLIENT';
        
        // El token tiene propiedades estándar de OIDC
        // Necesitas hacer cast a 'any' o definir una interfaz si TypeScript se queja
        const tokenData = token as any;

        return {
          id: token.sub!, // 'sub' es el ID único del usuario
          firstName: tokenData.given_name || tokenData.name || '', 
          lastName: tokenData.family_name || '',
          email: tokenData.email || '',
          role: role
        };
      }
    } catch (error) {
      console.error('Error getting user profile', error);
      return null;
    }
    return null;
  }

  // Método para iniciar sesión (redirecciona a Keycloak)
  login(): void {
    this.keycloakService.login({
      redirectUri: window.location.origin + '/client'
    });
  }

  // Método para cerrar sesión
  logout(): void {
    this.keycloakService.logout(window.location.origin);
  }
  
  // Verificar si está logueado (útil para Guards)
  async isLoggedIn(): Promise<boolean> {
    return await this.keycloakService.isLoggedIn();
  }

  /**
   * Redirige al usuario a su panel correspondiente según su rol.
   * - ADMIN -> /admin
   * - BARBER -> /barbero
   * - CLIENT -> /client
   */
  navigateToDashboard(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'BARBER':
        this.router.navigate(['/barbero']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}