import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakService, KeycloakEventType  } from 'keycloak-angular';
import { User } from '../models/views/user.view.model';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

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
          id: tokenData.preferred_username, // 'sub' es el ID único del usuario
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

  /**
   * Obtiene el ID del usuario actual de forma síncrona desde el token de Keycloak.
   * Devuelve `preferred_username` si está presente, si no usa `sub`. Retorna null si no está logueado.
   */
  getUserId(): string | null {
    try {
      const instance = this.keycloakService.getKeycloakInstance();
      const token = instance?.tokenParsed as any;
      if (!token) return null;
      // preferred_username suele contener el nombre único (puede variar según la configuración)
      return token.preferred_username || token.sub || null;
    } catch (e) {
      console.error('Error obteniendo userId del token', e);
      return null;
    }
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
        this.router.navigate(['/barber']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  /**
   * Obtiene información de múltiples usuarios por sus IDs.
   * Útil para mostrar nombres de clientes en listados.
   * 
   * @param userIds Lista de IDs de usuarios
   * @returns Observable con un Map donde la clave es el ID y el valor es un objeto con firstName y lastName
   */
  getUsersByIds(userIds: string[]): Observable<Map<string, { firstName: string, lastName: string, username: string }>> {
    if (!userIds || userIds.length === 0) {
      return of(new Map<string, { firstName: string, lastName: string, username: string }>());
    }

    return this.http.post<any>(`${this.apiUrl}/batch`, userIds).pipe(
      map(response => {
        const usersMap = new Map<string, { firstName: string, lastName: string, username: string }>();
        // La respuesta es un objeto JSON { "id1": { firstName: "...", ... }, ... }
        if (response) {
          Object.keys(response).forEach(key => {
            const user = response[key];
            usersMap.set(key, {
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              username: user.username || 'Usuario'
            });
          });
        }
        return usersMap;
      }),
      catchError(error => {
        console.error('Error fetching users batch:', error);
        return of(new Map<string, { firstName: string, lastName: string, username: string }>());
      })
    );
  }
}