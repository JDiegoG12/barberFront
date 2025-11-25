import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente molecular que representa una tarjeta de selección simplificada con avatar y nombre.
 * Se utiliza en flujos donde la identificación visual rápida (ej. foto del barbero) es prioritaria
 * sobre los detalles textuales. Diseñado principalmente para grillas de selección en el Wizard.
 */
@Component({
  selector: 'app-avatar-selection-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-selection-card.component.html',
  styleUrl: './avatar-selection-card.component.scss'
})
export class AvatarSelectionCardComponent {
  /**
   * Nombre principal que se mostrará debajo de la imagen (ej. Nombre del barbero).
   * Es obligatorio para garantizar la identificación del ítem.
   */
  @Input({ required: true }) name!: string;

  /**
   * URL de la fuente de la imagen para el avatar.
   * Debe ser una ruta válida para asegurar que se renderice la foto circular.
   */
  @Input({ required: true }) photoUrl!: string;

  /**
   * Estado de selección del componente.
   * Si es `true`, se aplican estilos visuales (bordes destacados, overlay de check)
   * para indicar que este ítem es la elección actual del usuario.
   * @default false
   */
  @Input() selected: boolean = false;
  
  /**
   * Evento que se dispara cuando el usuario interactúa con la tarjeta (clic).
   * Permite al componente padre manejar la lógica de selección única o múltiple.
   */
  @Output() onClick = new EventEmitter<void>();

  /**
   * Manejador interno del evento de clic nativo.
   * Propaga la acción al componente padre a través del EventEmitter.
   */
  handleClick(): void {
    this.onClick.emit();
  }
}