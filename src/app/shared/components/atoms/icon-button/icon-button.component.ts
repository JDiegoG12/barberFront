import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente atómico que representa un botón circular con ícono.
 * Se utiliza principalmente para acciones de selección/deselección (toggle) dentro de tarjetas u otros contenedores.
 * Maneja estados visuales de "seleccionado" y previene la propagación de eventos de clic para no interferir con el contenedor padre.
 */
@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent {
  /**
   * Símbolo o texto por defecto a mostrar (ej. '+').
   * Nota: La plantilla HTML puede priorizar íconos SVG sobre este texto según el estado.
   * @default '+'
   */
  @Input() icon: string = '+'; 

  /**
   * Define el estado activo/seleccionado del botón.
   * - `true`: Muestra visualmente un estado de confirmación (ej. check, fondo oscuro).
   * - `false`: Muestra el estado por defecto (ej. signo más, fondo transparente).
   */
  @Input() selected: boolean = false; 

  /**
   * Evento que se dispara cuando el usuario hace clic en el botón.
   */
  @Output() onClick = new EventEmitter<void>();

  /**
   * Gestiona la interacción de clic del usuario.
   * Utiliza `stopPropagation()` para aislar el evento y evitar que se disparen
   * acciones en elementos contenedores (como abrir un detalle al hacer clic en la tarjeta contenedora).
   *
   * @param event - El evento nativo del DOM.
   */
  handleClick(event: Event): void {
    event.stopPropagation(); // Evitamos que el click se propague al contenedor padre
    this.onClick.emit();
  }
}