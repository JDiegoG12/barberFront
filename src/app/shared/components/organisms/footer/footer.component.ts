import { Component } from '@angular/core';

/**
 * Componente organismo que representa el pie de página global de la aplicación.
 * Contiene información estática de cierre, como derechos de autor, enlaces a redes sociales
 * y accesos directos a secciones importantes. Se visualiza en todas las vistas principales.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  // Este componente es actualmente estático y no requiere lógica de negocio.
}