import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarDayButtonComponent } from '../../atoms/calendar-day-button/calendar-day-button.component';
import { AvailabilityService } from '../../../../core/services/domain/availability.service';
import { Barber } from '../../../../core/models/views/barber.view.model';

/**
 * Componente molecular que renderiza una lista horizontal desplazable de fechas.
 * Genera los días próximos disponibles, valida la disponibilidad del barbero para cada día
 * y gestiona la navegación por desplazamiento (scroll) con controles visuales (flechas).
 */
@Component({
  selector: 'app-horizontal-date-selector',
  standalone: true,
  imports: [CommonModule, CalendarDayButtonComponent],
  templateUrl: './horizontal-date-selector.component.html',
  styleUrl: './horizontal-date-selector.component.scss'
})
export class HorizontalDateSelectorComponent implements OnInit, OnChanges, AfterViewInit {
  private availabilityService = inject(AvailabilityService);

  /**
   * Objeto del barbero seleccionado.
   * Es requerido para consultar su horario laboral y determinar qué días habilitar en el calendario.
   */
  @Input({ required: true }) barber!: Barber;

  /**
   * La fecha actualmente seleccionada por el usuario.
   * Se utiliza para marcar visualmente el botón activo.
   */
  @Input() selectedDate: Date | null = null;

  /**
   * Evento que se emite cuando el usuario selecciona una fecha válida.
   */
  @Output() onDateSelect = new EventEmitter<Date>();

  /**
   * Referencia al elemento contenedor del DOM para manipular el desplazamiento (scroll) programáticamente.
   */
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  /** Lista de objetos Date que se renderizarán en el selector (los próximos 15 días). */
  public days: Date[] = [];
  
  // Variables de estado para la visibilidad de las flechas de navegación
  public canScrollLeft: boolean = false;
  public canScrollRight: boolean = true;

  ngOnInit(): void {
    this.generateDays();
  }

  /**
   * Detecta cambios en los inputs.
   * Si cambia el barbero, se deben regenerar los días (para re-evaluar disponibilidad)
   * y verificar el estado del scroll.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['barber']) {
      this.generateDays();
      // Pequeño timeout para esperar a que el DOM se renderice y calcular correctamente el scrollWidth
      setTimeout(() => this.checkScroll(), 100);
    }
  }

  ngAfterViewInit(): void {
    this.checkScroll();
  }

  /**
   * Escucha cambios en el tamaño de la ventana para recalcular la visibilidad de las flechas,
   * ya que el ancho del contenedor puede haber cambiado.
   */
  @HostListener('window:resize')
  onResize() {
    this.checkScroll();
  }

  /**
   * Genera un array con las fechas de los próximos 15 días a partir de hoy.
   */
  private generateDays(): void {
    const today = new Date();
    const daysArray: Date[] = [];
    // Generamos 15 días
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      daysArray.push(date);
    }
    this.days = daysArray;
  }

  /**
   * Consulta al servicio de disponibilidad si el barbero trabaja en la fecha dada.
   * @param date - Fecha a verificar.
   * @returns `true` si el día está habilitado en el horario del barbero.
   */
  isDayEnabled(date: Date): boolean {
    return this.availabilityService.isWorkingDay(this.barber, date);
  }

  /**
   * Verifica si una fecha corresponde a la seleccionada actualmente (comparando strings de fecha).
   */
  isSelected(date: Date): boolean {
    if (!this.selectedDate) return false;
    return date.toDateString() === this.selectedDate.toDateString();
  }

  /**
   * Maneja la selección del usuario.
   * Realiza una doble verificación de disponibilidad antes de emitir el evento.
   */
  selectDate(date: Date): void {
    if (this.isDayEnabled(date)) {
      this.onDateSelect.emit(date);
    }
  }

  // --- LÓGICA DE SCROLL ---

  /** Desplaza el contenedor hacia la izquierda. */
  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  /** Desplaza el contenedor hacia la derecha. */
  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }

  /**
   * Calcula si es posible hacer scroll a la izquierda o derecha basándose en la posición actual.
   * Actualiza las banderas `canScrollLeft` y `canScrollRight`.
   * Se ejecuta en el evento (scroll) del template.
   */
  checkScroll(): void {
    const el = this.scrollContainer.nativeElement;
    // Margen de error de 1px para cálculos de coma flotante en navegadores
    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
  }
}