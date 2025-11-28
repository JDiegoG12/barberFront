import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../../shared/components/organisms/navbar/navbar.component';
import { FooterComponent } from '../../../../../shared/components/organisms/footer/footer.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { User } from '../../../../../core/models/views/user.view.model';

/**
 * Componente de plantilla (Layout) para la sección pública de la aplicación.
 * Define la estructura base que envuelve a todas las vistas accesibles sin autenticación (invitados),
 * garantizando la presencia constante de la Barra de Navegación y el Pie de página.
 */
@Component({
  selector: 'app-public-template',
  standalone: true,
  // Importación de organismos estructurales reutilizables
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './public-template.component.html',
  styleUrl: './public-template.component.scss'
})
export class PublicTemplateComponent implements OnInit {
  private authService = inject(AuthService);
  public currentUser: User | null = null;

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.authService.getUserProfile();
    if (this.currentUser) {
      this.authService.navigateToDashboard(this.currentUser.role);
    }
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
  }
}