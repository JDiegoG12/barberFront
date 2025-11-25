import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modelos
import { Service } from '../../../../core/models/views/service.view.model';
import { Barber } from '../../../../core/models/views/barber.view.model';
import { TimeSlot } from '../../../../core/services/domain/availability.service';

// Átomos y Pipes
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';

/**
 * Componente organismo que muestra la vista final de confirmación de la reserva.
 * Actúa como un "recibo" previo, mostrando todos los detalles seleccionados (Servicio, Profesional, Fecha, Hora)
 * y calculando el rango de tiempo final. Permite al usuario ejecutar la acción definitiva de agendar.
 */
@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent],
  providers: [DurationPipe], //Proveedor para poder inyectarlo en la clase y usarlo programáticamente
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.scss'
})
export class BookingConfirmationComponent {
  /**
   * Inyección del Pipe de duración para utilizar su lógica de transformación
   * directamente en el código TypeScript (getters) en lugar de solo en la plantilla.
   */
  private durationPipe = inject(DurationPipe);

  /** Información del servicio a reservar (Nombre, Precio, Duración). */
  @Input({ required: true }) service!: Service;

  /** Información del profesional seleccionado. */
  @Input({ required: true }) barber!: Barber;

  /** Fecha seleccionada para la cita. */
  @Input({ required: true }) date!: Date;

  /** Bloque de tiempo seleccionado (Inicio y Fin). */
  @Input({ required: true }) timeSlot!: TimeSlot;
  
  /**
   * Estado de carga del proceso de confirmación.
   * Si es true, el botón se deshabilita y muestra un texto de "Procesando...".
   */
  @Input() loading: boolean = false;

  /**
   * Evento que se emite cuando el usuario confirma explícitamente la reserva.
   * El componente padre debe suscribirse a esto para realizar la llamada al backend.
   */
  @Output() onConfirm = new EventEmitter<void>();

  /**
   * Ejecuta la acción de confirmación emitiendo el evento al padre.
   */
  confirm(): void {
    this.onConfirm.emit();
  }

  /**
   * Genera una cadena de fecha legible y amigable en español.
   * Ejemplo: "lunes, 24 de noviembre de 2025".
   */
  get formattedDate(): string {
    return this.date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Genera una cadena compuesta con el rango horario y la duración total.
   * Utiliza el `DurationPipe` inyectado para formatear los minutos a "Xh Ymin".
   * Ejemplo: "10:00 - 10:30 (30 min)".
   */
  get formattedTimeRange(): string {
    if (!this.timeSlot) return '';
    
    const start = this.formatTime(this.timeSlot.start);
    const end = this.formatTime(this.timeSlot.end);
    
    const durationString = this.durationPipe.transform(this.service.duration);
    
    return `${start} - ${end} (${durationString})`;
  }

  /**
   * Helper interno para formatear la hora a "HH:mm".
   */
  private formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}