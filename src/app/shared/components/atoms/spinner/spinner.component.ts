import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Componente atómico que muestra un indicador de carga giratorio.
 * Se usa para señalar operaciones asíncronas en curso. Es accesible por defecto
 * mediante `role="status"` y una etiqueta para lectores de pantalla.
 */
@Component({
  selector: 'app-spinner',
  imports: [],
  template: `
    <span class="spinner" role="status" [attr.aria-label]="label" [style.width.px]="size" [style.height.px]="size"></span>
    <span class="sr-only">{{ label }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  /** Diámetro del spinner en píxeles. */
  @Input() size: number = 40;

  /** Etiqueta accesible anunciada por lectores de pantalla. */
  @Input() label: string = 'Cargando…';
}
