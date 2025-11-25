import { Injectable } from '@angular/core';
import { Barber } from '../../models/views/barber.view.model';
import { Reservation } from '../../models/views/reservation.view.model';

/**
 * Representa un bloque de tiempo calculado disponible para ser reservado.
 */
export interface TimeSlot {
  /** Fecha y hora exacta de inicio del bloque. */
  start: Date;
  /** Fecha y hora exacta de finalización del bloque (inicio + duración del servicio). */
  end: Date;
  /** Etiqueta legible para mostrar en la interfaz (ej: "08:00"). */
  label: string;
}

/**
 * Servicio de dominio encargado de la lógica compleja de cálculo de disponibilidad.
 * No realiza llamadas HTTP, sino que procesa datos (Barberos, Reservas, Fechas)
 * para determinar qué espacios de tiempo son válidos para una nueva cita.
 */
@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor() { }

  /**
   * Calcula y genera los bloques de tiempo (slots) disponibles para un servicio específico en una fecha dada.
   * Cruza el horario laboral del barbero con las reservas existentes para filtrar los espacios ocupados.
   *
   * @param barber - El barbero seleccionado (contiene su configuración de horario semanal).
   * @param date - La fecha específica en la que el cliente desea reservar.
   * @param serviceDuration - La duración del servicio seleccionado en minutos.
   * @param existingReservations - Lista de reservas ya agendadas para ese barbero en esa fecha.
   * @returns Un array de objetos `TimeSlot` con los horarios disponibles.
   */
  getTimeSlots(
    barber: Barber, 
    date: Date, 
    serviceDuration: number, 
    existingReservations: Reservation[]
  ): TimeSlot[] {
    
    const slots: TimeSlot[] = [];
    
    // 1. Determinar el día de la semana (0=Dom, 1=Lun...)
    const dayOfWeek = date.getDay();
    const daySchedule = barber.schedule.find(d => d.dayOfWeek === dayOfWeek);

    // Si el barbero no tiene configuración para este día o no tiene turnos, no hay disponibilidad.
    if (!daySchedule || !daySchedule.shifts || daySchedule.shifts.length === 0) {
      return [];
    }

    // 2. Iterar sobre cada turno laboral del día (ej. Mañana y Tarde)
    for (const shift of daySchedule.shifts) {
      const shiftStart = this.setTime(date, shift.start);
      const shiftEnd = this.setTime(date, shift.end);

      // Inicio del iterador de tiempo
      let currentSlotStart = new Date(shiftStart);

      // 3. Generar bloques iterativamente
      while (true) {
        // Calcular cuándo terminaría el servicio si empieza en 'currentSlotStart'
        const currentSlotEnd = new Date(currentSlotStart.getTime() + serviceDuration * 60000);

        // Condición de salida: Si el servicio termina después de que cierra el turno, paramos.
        if (currentSlotEnd > shiftEnd) {
          break;
        }

        // 4. Verificación de colisiones
        if (!this.isOverlapping(currentSlotStart, currentSlotEnd, existingReservations)) {
          // Si no hay conflicto, agregamos el slot a la lista de resultados
          slots.push({
            start: new Date(currentSlotStart),
            end: new Date(currentSlotEnd),
            label: this.formatTime(currentSlotStart)
          });
        }

        // REGLA DE NEGOCIO: Los intervalos de inicio de cita son cada 10 minutos.
        // Esto ofrece flexibilidad al cliente sin restringirlo a bloques rígidos de 30/60 min.
        currentSlotStart = new Date(currentSlotStart.getTime() + 10 * 60000);
      }
    }

    return slots;
  }

  /**
   * Verifica si un barbero tiene jornada laboral configurada para una fecha específica.
   * Útil para deshabilitar días en el calendario antes de calcular horas.
   *
   * @param barber - El barbero a consultar.
   * @param date - La fecha a verificar.
   * @returns `true` si el barbero trabaja ese día, `false` si es día libre.
   */
  isWorkingDay(barber: Barber, date: Date): boolean {
    const dayOfWeek = date.getDay();
    // Buscamos si existe configuración para ese día de la semana (0-6)
    const schedule = barber.schedule.find(s => s.dayOfWeek === dayOfWeek);
    
    // Retorna true solo si existe el horario Y tiene al menos un turno definido
    return !!schedule && schedule.shifts.length > 0;
  }

  // --- HELPERS PRIVADOS ---

  /**
   * Detecta si un rango de tiempo propuesto choca con alguna reserva existente.
   *
   * @param start - Inicio del rango propuesto.
   * @param end - Fin del rango propuesto.
   * @param reservations - Lista de reservas confirmadas.
   * @returns `true` si hay superposición (conflicto), `false` si está libre.
   */
  private isOverlapping(start: Date, end: Date, reservations: Reservation[]): boolean {
    return reservations.some(reservation => {
      // Lógica de colisión de rangos: (StartA < EndB) y (EndA > StartB)
      return start < reservation.end && end > reservation.start;
    });
  }

  /**
   * Combina un objeto Date (fecha) con un string de hora (HH:mm) para crear un nuevo Date preciso.
   *
   * @param baseDate - La fecha base (año, mes, día).
   * @param timeStr - La hora en formato string "HH:mm".
   * @returns Un nuevo objeto Date con la fecha y hora combinadas.
   */
  private setTime(baseDate: Date, timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  }

  /**
   * Formatea un objeto Date a una cadena de hora legible "HH:mm".
   *
   * @param date - La fecha a formatear.
   * @returns La hora en formato string de 24 horas.
   */
  private formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}