import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente atómico que representa el botón de acción principal de la interfaz.
 * Encapsula los estilos de marca (color primario, bordes redondeados) y comportamientos estándar
 * como estados de deshabilitado y ancho completo.
 */
@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss'
})
export class PrimaryButtonComponent {
  /**
   * Texto que se mostrará en el interior del botón.
   * @default 'Button'
   */
  @Input() label: string = 'Button';

  /**
   * Controla el estado de interactividad del botón.
   * Si es `true`, el botón cambia su apariencia visual para indicar que no está disponible
   * y bloquea la emisión del evento de clic.
   */
  @Input() disabled: boolean = false;

  /**
   * Define el comportamiento de diseño del botón.
   * Si es `true`, el botón se expandirá para ocupar el 100% del ancho disponible en su contenedor padre.
   * Útil para diseños móviles o formularios.
   */
  @Input() fullWidth: boolean = false;

  /**
   * Evento que se emite cuando el usuario hace clic en el botón.
   * Este evento solo se dispara si el botón no está deshabilitado.
   */
  @Output() onClick = new EventEmitter<void>();

  /**
   * Manejador interno del evento de clic.
   * Actúa como una capa de validación para asegurar que no se procesen clics
   * cuando la propiedad `disabled` es verdadera.
   */
  handleClick(): void {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
}