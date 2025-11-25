import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modelos
import { Service } from '../../../../core/models/views/service.view.model';
import { Barber } from '../../../../core/models/views/barber.view.model';
import { TimeSlot } from '../../../../core/services/domain/availability.service';

// Átomos
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

import { DurationPipe } from '../../../../shared/pipes/duration.pipe'; // IMPORTAR PIPE

/**
 * Componente organismo que muestra un resumen persistente del estado de la reserva.
 * Actúa como panel de control del Wizard, visualizando las selecciones acumuladas (Servicio, Barbero, Fecha)
 * y conteniendo el botón de acción principal ("Continuar" o "Confirmar").
 * Se adapta visualmente como tarjeta lateral en escritorio o barra inferior en móviles.
 */
@Component({
  selector: 'app-booking-summary-card',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent, DurationPipe],
  templateUrl: './booking-summary-card.component.html',
  styleUrl: './booking-summary-card.component.scss'
})
export class BookingSummaryCardComponent {
  // Entradas de datos
  
  /**
   * Información del servicio seleccionado.
   * Es el dato fundamental que inicia el flujo y calcula el precio base.
   */
  @Input() service: Service | null = null;

  /**
   * Información del barbero seleccionado (opcional hasta que se complete el paso 1).
   */
  @Input() barber: Barber | null = null;

  /**
   * Fecha seleccionada para la cita (opcional hasta que se complete el paso 2).
   */
  @Input() date: Date | null = null;

  /**
   * Bloque de tiempo seleccionado (opcional hasta que se complete el paso 2).
   */
  @Input() timeSlot: TimeSlot | null = null;

  // Control del botón

  /**
   * Texto a mostrar en el botón de acción principal.
   * Permite cambiar el contexto según el paso (ej. "Continuar" vs "Confirmar Reserva").
   * @default 'Continuar'
   */
  @Input() buttonLabel: string = 'Continuar';

  /**
   * Controla si el botón de acción está deshabilitado.
   * Generalmente se vincula a la validación del paso actual en el componente padre.
   */
  @Input() isDisabled: boolean = true;

  /**
   * Indica si se está procesando una acción (ej. guardando reserva).
   * Muestra un estado de carga visual en el botón y bloquea interacciones.
   */
  @Input() loading: boolean = false;

  // Salida

  /**
   * Evento que se emite cuando el usuario hace clic en el botón de acción.
   * El componente padre decide qué hacer (avanzar paso, enviar formulario, etc.).
   */
  @Output() onAction = new EventEmitter<void>();

  /**
   * Maneja el clic del usuario, validando que el botón no esté deshabilitado
   * ni en estado de carga antes de emitir el evento.
   */
  handleClick(): void {
    if (!this.isDisabled && !this.loading) {
      this.onAction.emit();
    }
  }

  /**
   * Helper para formatear la fecha seleccionada en un formato corto y amigable.
   * Ejemplo de salida: "Lun, 23 Nov".
   * Utiliza la configuración regional 'es-ES'.
   */
  get formattedDate(): string {
    if (!this.date) return '';
    return this.date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  }
}