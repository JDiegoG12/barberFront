import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { User } from '../../../../core/models/views/user.view.model';

/**
 * Componente organismo que representa el pie de página global de la aplicación.
 * Contiene información estática de cierre, como derechos de autor, enlaces a redes sociales
 * y accesos directos a secciones importantes. Se visualiza en todas las vistas principales.
 */
@Component({
    selector: 'app-footer',
    imports: [RouterLink],
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
  /** Año actual para la línea de copyright (siempre actualizado). */
  readonly currentYear = new Date().getFullYear();

  /**
   * Usuario autenticado (si lo hay). Determina la ruta base de los enlaces de
   * navegación del footer: los clientes tienen el landing con las secciones en
   * `/client`, mientras que los invitados lo tienen en `/`.
   */
  @Input() user: User | null = null;

  /** Ruta base del landing con las secciones ancladas según el tipo de usuario. */
  get landingBase(): string {
    return this.user?.role === 'CLIENT' ? '/client' : '/';
  }
}