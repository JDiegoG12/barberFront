import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserRole } from '../models/views/user.view.model';
import { environment } from '../../../environments/environment';
import { MockStore } from '../mocks/mock-store.service';

/**
 * Clave bajo la que se persiste el usuario simulado en localStorage.
 */
const STORAGE_KEY = 'barber_current_user';

/**
 * Usuarios simulados que se usan al iniciar sesión con un rol concreto.
 * Reemplazan a la autenticación real de Keycloak mientras se desarrolla el front.
 * El `id` debe ser estable porque se usa como clientId/barberId en las peticiones.
 */
const MOCK_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: 'admin-1',
    firstName: 'Admin',
    lastName: 'Barbería',
    email: 'admin@barberia.local',
    role: 'ADMIN'
  },
  BARBER: {
    id: 'barber-1',
    firstName: 'Barbero',
    lastName: 'Demo',
    email: 'barbero@barberia.local',
    role: 'BARBER'
  },
  CLIENT: {
    id: 'client-1',
    firstName: 'Cliente',
    lastName: 'Demo',
    email: 'cliente@barberia.local',
    role: 'CLIENT'
  }
};

/**
 * Servicio de autenticación simulado (sin Keycloak).
 *
 * Mantiene la misma API pública que la versión basada en Keycloak para no
 * obligar a cambiar los componentes que ya lo consumen. La "sesión" se guarda
 * en localStorage, de modo que sobrevive a recargas de página.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private mock = inject(MockStore);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // ==========================================
  // ESTADO DE SESIÓN (LOCAL)
  // ==========================================

  /**
   * Lee el usuario actual desde localStorage. Devuelve null si no hay sesión.
   */
  private getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  /**
   * Inicia sesión como un rol concreto usando un usuario simulado y
   * redirige al panel correspondiente.
   */
  loginAs(role: UserRole): void {
    const user = MOCK_USERS[role];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.navigateToDashboard(user.role);
  }

  /**
   * Indica si el usuario actual tiene el rol indicado. Lo usan los guards.
   */
  hasRole(role: UserRole): boolean {
    return this.getStoredUser()?.role === role;
  }

  // ==========================================
  // API PÚBLICA (compatible con la versión anterior)
  // ==========================================

  /**
   * Obtiene el perfil del usuario logueado (o null si no hay sesión).
   * Se mantiene como Promise para no romper a los componentes que usan `await`.
   */
  async getUserProfile(): Promise<User | null> {
    return this.getStoredUser();
  }

  /**
   * Obtiene el ID del usuario actual. Retorna null si no hay sesión.
   */
  getUserId(): string | null {
    return this.getStoredUser()?.id ?? null;
  }

  /**
   * Redirige a la página de selección de rol (login simulado).
   */
  login(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Cierra la sesión y vuelve a la página pública.
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/']);
  }

  /**
   * Verifica si hay una sesión activa (útil para Guards).
   */
  async isLoggedIn(): Promise<boolean> {
    return this.getStoredUser() !== null;
  }

  /**
   * Redirige al usuario a su panel correspondiente según su rol.
   * - ADMIN -> /admin
   * - BARBER -> /barber
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
   * Sigue consultando al backend (si está disponible); si falla, degrada a un Map vacío.
   *
   * @param userIds Lista de IDs de usuarios
   * @returns Observable con un Map donde la clave es el ID y el valor es un objeto con firstName y lastName
   */
  getUsersByIds(userIds: string[]): Observable<Map<string, { firstName: string, lastName: string, username: string }>> {
    if (!userIds || userIds.length === 0) {
      return of(new Map<string, { firstName: string, lastName: string, username: string }>());
    }

    if (environment.useMock) {
      return of(this.mock.getUserNames(userIds));
    }

    return this.http.post<any>(`${this.apiUrl}/batch`, userIds).pipe(
      map(response => {
        const usersMap = new Map<string, { firstName: string, lastName: string, username: string }>();
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
