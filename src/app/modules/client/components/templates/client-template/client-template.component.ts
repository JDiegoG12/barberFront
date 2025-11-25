import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../../../shared/components/organisms/navbar/navbar.component';
import { FooterComponent } from '../../../../../shared/components/organisms/footer/footer.component';
// Importamos el mock para simular sesión iniciada
import { MOCK_CLIENT_USER } from '../../../../../core/mocks/mock-data';
import { User } from '../../../../../core/models/views/user.view.model';

/**
 * Componente de plantilla (Layout) para la sección privada del cliente.
 * Define la estructura base que envuelve a todas las vistas del cliente autenticado,
 * proporcionando elementos comunes como la Barra de Navegación (configurada para usuario) y el Pie de página.
 */
@Component({
  selector: 'app-client-template',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './client-template.component.html',
  styleUrl: './client-template.component.scss'
})
export class ClientTemplateComponent {
  /**
   * Usuario actualmente autenticado en el sistema.
   * Se inicializa con datos simulados (Mock) para propósitos de desarrollo y visualización
   * de la interfaz de usuario logueado. En producción, esto vendría de un AuthService.
   */
  public currentUser: User = MOCK_CLIENT_USER;

  /**
   * Maneja el evento de cierre de sesión disparado desde el Navbar.
   * Se encarga de limpiar el estado de la sesión (simulado) y redirigir al usuario
   * a la página de inicio pública.
   */
  handleLogout(): void {
    console.log('Cerrando sesión...');
    // Aquí iría la lógica de borrar token y redirigir a home
    window.location.href = '/'; 
  }
}