import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation, ReservationStatus } from '../../../../core/models/views/reservation.view.model';

/**
 * Componente molecular que representa una tarjeta individual de reserva.
 * Muestra los detalles clave de la cita (servicio, barbero, fecha, precio) y su estado.
 * Gestiona la visibilidad y disponibilidad de las acciones (Cancelar, Reprogramar, Reservar de nuevo)
 * basándose en reglas de negocio temporales y de estado.
 */
@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.scss'
})
export class ReservationCardComponent {
  /**
   * Objeto de datos de la reserva a visualizar.
   * Es obligatorio para renderizar la tarjeta.
   */
  @Input({ required: true }) reservation!: Reservation;
  
  // Eventos de acción
  
  /**
   * Evento emitido cuando el usuario solicita cancelar una reserva activa.
   */
  @Output() onCancel = new EventEmitter<Reservation>();

  /**
   * Evento emitido cuando el usuario solicita cambiar la fecha/hora de una reserva activa.
   */
  @Output() onReschedule = new EventEmitter<Reservation>(); 

  /**
   * Evento emitido cuando el usuario desea volver a agendar un servicio del historial.
   */
  @Output() onRebook = new EventEmitter<Reservation>(); 

  // --- LÓGICA DE NEGOCIO ---

  /**
   * Determina si la reserva puede ser modificada (cancelada o reprogramada) por el usuario.
   * Regla de Negocio: Solo se permite si el estado es 'En espera' Y falta más de 1 hora
   * para el inicio de la cita.
   *
   * @returns `true` si la modificación está permitida.
   */
  get canModify(): boolean {
    if (this.reservation.status !== 'En espera') return false;

    const now = new Date();
    const reservationDate = new Date(this.reservation.start);
    
    // Diferencia en milisegundos
    const diff = reservationDate.getTime() - now.getTime();
    
    // 3600000 ms = 1 hora
    return diff > 3600000;
  }

  /**
   * Identifica si la reserva se considera "activa" o "futura".
   * Utilizado para separar visualmente las reservas próximas del historial.
   *
   * @returns `true` si el estado es 'En espera' o 'En proceso'.
   */
  get isUpcoming(): boolean {
    return ['En espera', 'En proceso'].includes(this.reservation.status);
  }

  // --- HELPERS VISUALES ---

  /**
   * Mapea el estado de la reserva a una clase CSS específica.
   * Permite mostrar etiquetas de colores distintivos (ej. Amarillo para espera, Rojo para cancelada).
   */
  get statusClass(): string {
    switch (this.reservation.status) {
      case 'En espera': return 'status-waiting';
      case 'En proceso': return 'status-process';
      case 'Finalizada': return 'status-finished';
      case 'Cancelada': return 'status-cancelled';
      case 'Inasistencia': return 'status-noshow';
      default: return '';
    }
  }

  /**
   * Formatea la fecha de inicio para mostrarla de forma amigable (ej. "lun, 24 nov").
   */
  get formattedDate(): string {
    return this.reservation.start.toLocaleDateString('es-ES', { 
      weekday: 'short', day: 'numeric', month: 'short' 
    });
  }

  /**
   * Genera un string con el rango de horas de la cita (ej. "10:00 - 10:30").
   */
  get formattedTime(): string {
    const start = this.formatTime(this.reservation.start);
    const end = this.formatTime(this.reservation.end);
    return `${start} - ${end}`;
  }

  /**
   * Helper interno para formatear objetos Date a hora militar/24h (HH:mm).
   * Asegura que la entrada sea tratada como objeto Date.
   */
  private formatTime(date: Date): string {
    // Aseguramos que sea objeto Date por si viene string del mock
    const d = new Date(date); 
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}