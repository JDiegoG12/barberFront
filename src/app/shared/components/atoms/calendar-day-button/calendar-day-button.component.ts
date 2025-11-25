import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente atómico que representa un día individual en un selector de calendario.
 * Muestra la información de la fecha (día de la semana, número y mes) de forma compacta
 * y gestiona sus estados visuales (seleccionado, deshabilitado).
 */
@Component({
  selector: 'app-calendar-day-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-day-button.component.html',
  styleUrl: './calendar-day-button.component.scss'
})
export class CalendarDayButtonComponent {
  /**
   * La fecha específica que este botón representa.
   * Es la fuente de verdad para los cálculos de visualización (día, mes, número).
   */
  @Input({ required: true }) date!: Date;

  /**
   * Indica si este día está actualmente seleccionado por el usuario.
   * Altera el estilo visual para destacar el botón.
   */
  @Input() selected: boolean = false;

  /**
   * Indica si el día está deshabilitado (ej. el barbero no trabaja ese día).
   * Si es true, se aplica un estilo visual atenuado y se bloquean los eventos de clic.
   */
  @Input() disabled: boolean = false;
  
  /**
   * Evento que se emite cuando el usuario hace clic en el botón.
   * Solo se dispara si la propiedad `disabled` es falsa.
   */
  @Output() onClick = new EventEmitter<void>();

  /**
   * Gestiona la interacción de clic del usuario.
   * Actúa como un guardia que impide la emisión del evento si el componente está deshabilitado.
   */
  handleClick(): void {
    if (!this.disabled) {
      this.onClick.emit();
    }
  }

  /**
   * Obtiene el nombre abreviado del día de la semana en español (ej. "LUN", "MAR").
   * Utiliza `toLocaleDateString` con la configuración regional 'es-ES'.
   */
  get dayName(): string {
    return this.date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '').toUpperCase();
  }

  /**
   * Obtiene el número del día del mes (ej. "22").
   */
  get dayNumber(): string {
    return this.date.getDate().toString();
  }

  /**
   * Obtiene el nombre abreviado del mes en español (ej. "ENE", "FEB").
   * Utiliza `toLocaleDateString` con la configuración regional 'es-ES'.
   */
  get monthName(): string {
    return this.date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
  }
}