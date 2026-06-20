import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Componente atómico que representa un marcador de posición animado (skeleton)
 * mostrado mientras se cargan datos. Mejora la percepción de rendimiento y evita
 * saltos de contenido. Decorativo: se oculta a lectores de pantalla con `aria-hidden`.
 */
@Component({
  selector: 'app-skeleton',
  imports: [],
  template: ``,
  host: {
    'aria-hidden': 'true',
    '[style.width]': 'width',
    '[style.height]': 'height',
    '[style.borderRadius]': 'radius',
    '[class.is-circle]': 'circle'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  /** Ancho del bloque (cualquier valor CSS). */
  @Input() width: string = '100%';

  /** Alto del bloque (cualquier valor CSS). */
  @Input() height: string = '1rem';

  /** Radio del borde (cualquier valor CSS). */
  @Input() radius: string = 'var(--radius-sm)';

  /** Si es `true`, se renderiza como círculo (útil para avatares). */
  @Input() circle: boolean = false;
}
