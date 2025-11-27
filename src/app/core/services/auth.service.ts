import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { User } from '../models/views/user.view.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private keycloakService: KeycloakService) { }

  // Obtener el perfil del usuario logueado
  async getUserProfile(): Promise<User | null> {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      
      if (isLoggedIn) {
        const userProfile = await this.keycloakService.loadUserProfile();
        const token = await this.keycloakService.getToken();
        // Mapeamos los datos de Keycloak a tu modelo User
        return {
          id: userProfile.id!,
          firstName: userProfile.firstName!,
          lastName: userProfile.lastName!,
          email: userProfile.email!,
          role: token.includes('ADMIN') ? 'ADMIN' : token.includes('BARBER') ? 'BARBER' : 'CLIENT',
        };
      }
    } catch (error) {
      console.error('Error getting user profile', error);
    }
    return null;
  }

  // Método para iniciar sesión (redirecciona a Keycloak)
  login(): void {
    this.keycloakService.login();
  }

  // Método para cerrar sesión
  logout(): void {
    this.keycloakService.logout('http://localhost:4200'); // Redirige al home tras salir
  }
  
  // Verificar si está logueado (útil para Guards)
  isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }
}