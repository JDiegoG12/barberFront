import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../../shared/components/organisms/navbar/navbar.component';
import { FooterComponent } from '../../../../../shared/components/organisms/footer/footer.component';

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
export class PublicTemplateComponent {
  // Este componente actúa principalmente como un contenedor visual (Wrapper).
  // No requiere lógica de negocio compleja por el momento.
}