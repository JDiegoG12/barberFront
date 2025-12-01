import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../../../shared/components/organisms/navbar/navbar.component';
import { FooterComponent } from '../../../../../shared/components/organisms/footer/footer.component';
import { User } from '../../../../../core/models/views/user.view.model';
import { AuthService } from '../../../../../core/services/auth.service';

/**
 * Componente de plantilla (Layout) para la sección privada del barbero.
 * Define la estructura base que envuelve a todas las vistas del barbero autenticado,
 * proporcionando elementos comunes como la Barra de Navegación (configurada para usuario) y el Pie de página.
 */
@Component({
  selector: 'app-barber-template',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './barber-template.component.html',
  styleUrl: './barber-template.component.scss'
})
export class BarberTemplateComponent {
  private authService = inject(AuthService);

  /**
   * Usuario actualmente autenticado en el sistema.
   * Se obtiene del servicio de autenticación para mostrar la información correcta en el navbar.
   */
  public currentUser: User | null = null;

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.authService.getUserProfile();
  }

  /**
   * Maneja el evento de cierre de sesión disparado desde el Navbar.
   * Se encarga de limpiar el estado de la sesión y redirigir al usuario
   * a la página de inicio pública.
   */
  handleLogout(): void {
    this.authService.logout();
  } 
}
