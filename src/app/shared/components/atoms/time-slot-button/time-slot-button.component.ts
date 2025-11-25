import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente atómico que representa un botón individual para un bloque de horario.
 * Se utiliza dentro de la grilla de selección de horas para mostrar una opción específica (ej. "10:00")
 * y gestionar su estado de selección visual.
 */
@Component({
  selector: 'app-time-slot-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-slot-button.component.html',
  styleUrl: './time-slot-button.component.scss'
})
export class TimeSlotButtonComponent {
  /**
   * Etiqueta de texto que muestra la hora del bloque.
   * Es obligatoria y generalmente sigue el formato "HH:mm" (ej: "09:30").
   */
  @Input({ required: true }) timeLabel!: string; 

  /**
   * Indica si este bloque de tiempo ha sido seleccionado por el usuario.
   * Si es `true`, el botón cambia su apariencia (color de fondo, borde) para indicar el estado activo.
   */
  @Input() selected: boolean = false;
  
  /**
   * Evento que se emite cuando el usuario hace clic en el botón del horario.
   * Permite al componente padre (la grilla) saber qué hora específica se eligió.
   */
  @Output() onClick = new EventEmitter<void>();

  /**
   * Maneja la interacción de clic del usuario y propaga el evento al componente padre.
   */
  handleClick(): void {
    this.onClick.emit();
  }
}