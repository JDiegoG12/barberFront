import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeSlotButtonComponent } from '../../atoms/time-slot-button/time-slot-button.component';
import { AvailabilityService, TimeSlot } from '../../../../core/services/domain/availability.service';
import { Barber } from '../../../../core/models/views/barber.view.model';
import { Reservation } from '../../../../core/models/views/reservation.view.model';

/**
 * Define los tipos de filtros de tiempo disponibles para la visualización.
 * - 'morning': Horarios antes de las 12:00 PM.
 * - 'afternoon': Horarios desde las 12:00 PM en adelante.
 */
type TimeFilter = 'morning' | 'afternoon';

/**
 * Componente organismo que renderiza la cuadrícula de horarios disponibles.
 *
 * Responsabilidades:
 * 1. Orquestar el cálculo de disponibilidad llamando al `AvailabilityService`.
 * 2. Filtrar los resultados visualmente por jornada (Mañana/Tarde) para no saturar al usuario.
 * 3. Gestionar la interacción de selección de un bloque de tiempo específico.
 */
@Component({
  selector: 'app-time-slot-grid',
  standalone: true,
  imports: [CommonModule, TimeSlotButtonComponent],
  templateUrl: './time-slot-grid.component.html',
  styleUrl: './time-slot-grid.component.scss'
})
export class TimeSlotGridComponent implements OnChanges {
  /** Servicio de dominio para cálculos de tiempo y colisiones. */
  private availabilityService = inject(AvailabilityService);

  /** Barbero seleccionado (contexto necesario para obtener el horario laboral). */
  @Input({ required: true }) barber!: Barber;

  /** Fecha seleccionada para consultar disponibilidad. */
  @Input({ required: true }) date!: Date | null;

  /** Duración del servicio en minutos (necesario para calcular el tamaño de los bloques). */
  @Input({ required: true }) serviceDuration!: number;

  /** Lista de reservas existentes para calcular conflictos de horario. */
  @Input() existingReservations: Reservation[] = [];

  /** Bloque de tiempo actualmente seleccionado (para resaltado visual). */
  @Input() selectedSlot: TimeSlot | null = null;

  /** Evento emitido cuando el usuario selecciona un bloque de tiempo disponible. */
  @Output() onSlotSelect = new EventEmitter<TimeSlot>();

  /** Lista completa de slots disponibles calculados para el día. */
  public availableSlots: TimeSlot[] = [];
  
  /** Estado actual del filtro de visualización ('morning' o 'afternoon'). */
  public currentFilter: TimeFilter = 'morning';

  /**
   * Detecta cambios en los inputs para recalcular la disponibilidad.
   * Optimización: Solo recalcula si cambian los datos estructurales (Barbero, Fecha, Duración, Reservas).
   * Si solo cambia `selectedSlot` (interacción visual), se omite el recálculo para evitar parpadeos
   * o reinicios indeseados del filtro.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = changes['barber'] || changes['date'] || changes['serviceDuration'] || changes['existingReservations'];

    if (dataChanged) {
      if (this.barber && this.date && this.serviceDuration) {
        this.calculateSlots();
      } else {
        this.availableSlots = [];
      }
    }
  }

  /**
   * Ejecuta la lógica de negocio para obtener los horarios libres.
   * Además, aplica una lógica de "UX Inteligente": si no hay cupos en la mañana
   * pero sí en la tarde, cambia automáticamente el filtro a 'afternoon' para mostrar opciones al usuario.
   */
  private calculateSlots(): void {
    if (!this.date) return;

    this.availableSlots = this.availabilityService.getTimeSlots(
      this.barber,
      this.date,
      this.serviceDuration,
      this.existingReservations
    );

    // Lógica inteligente de filtro inicial
    if (this.morningSlots.length === 0 && this.afternoonSlots.length > 0) {
      this.currentFilter = 'afternoon';
    } else {
      this.currentFilter = 'morning';
    }
  }

  // --- LOGICA DE FILTRADO ---

  /**
   * Establece manualmente el filtro de tiempo (pestañas de la UI).
   */
  setFilter(filter: TimeFilter): void {
    this.currentFilter = filter;
  }

  /** Obtiene los slots cuya hora de inicio es anterior a las 12:00. */
  get morningSlots(): TimeSlot[] {
    return this.availableSlots.filter(slot => slot.start.getHours() < 12);
  }

  /** Obtiene los slots cuya hora de inicio es igual o posterior a las 12:00. */
  get afternoonSlots(): TimeSlot[] {
    return this.availableSlots.filter(slot => slot.start.getHours() >= 12);
  }

  /** Retorna la lista de slots a mostrar según el filtro activo actual. */
  get filteredSlots(): TimeSlot[] {
    return this.currentFilter === 'morning' ? this.morningSlots : this.afternoonSlots;
  }

  /**
   * Maneja la selección de un slot y emite el evento al padre.
   */
  selectSlot(slot: TimeSlot): void {
    this.onSlotSelect.emit(slot);
  }

  /**
   * Verifica si un slot específico es el seleccionado actualmente.
   * Compara por marca de tiempo (timestamp) para asegurar igualdad por valor.
   */
  isSelected(slot: TimeSlot): boolean {
    if (!this.selectedSlot) return false;
    return slot.start.getTime() === this.selectedSlot.start.getTime();
  }
}