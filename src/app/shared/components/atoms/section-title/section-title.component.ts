import { Component, Input } from '@angular/core';

/**
 * Componente atómico encargado de renderizar los títulos de las secciones de la aplicación.
 * Garantiza una tipografía, alineación y espaciado consistentes en todas las páginas
 * (ej. "Nuestros Servicios", "Visítanos", "Nuestro Equipo").
 */
@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss'
})
export class SectionTitleComponent {
  /**
   * El texto del título que se mostrará en el encabezado de la sección.
   * Es una propiedad marcada como `required`, lo que obliga al componente padre
   * a proporcionar un valor, evitando títulos vacíos.
   */
  @Input({ required: true }) title: string = '';
}