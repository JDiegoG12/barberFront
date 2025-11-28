import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// UI Components
import { ModalAlertComponent } from '../../../../../shared/components/molecules/modal-alert/modal-alert.component';
import { SelectBarberComponent } from '../../../../../shared/components/organisms/select-barber/select-barber.component';
import { HorizontalDateSelectorComponent } from '../../../../../shared/components/molecules/horizontal-date-selector/horizontal-date-selector.component';
import { TimeSlotGridComponent } from '../../../../../shared/components/organisms/time-slot-grid/time-slot-grid.component';
import { BookingSummaryCardComponent } from '../../../../../shared/components/organisms/booking-summary-card/booking-summary-card.component';
import { BookingConfirmationComponent } from '../../../../../shared/components/organisms/booking-confirmation/booking-confirmation.component';

// Services
import { ServiceService } from '../../../../../core/services/api/service.service';
import { ReservationService } from '../../../../../core/services/api/reservation.service';
import { BarberService } from '../../../../../core/services/api/barber.service'; 

// Models
import { Barber } from '../../../../../core/models/views/barber.view.model';
import { Service } from '../../../../../core/models/views/service.view.model';
import { Reservation } from '../../../../../core/models/views/reservation.view.model';
import { TimeSlot } from '../../../../../core/services/domain/availability.service';
import { MOCK_CLIENT_USER } from '../../../../../core/mocks/mock-data';

/**
 * Componente principal del Wizard de Reserva.
 * Orquesta el flujo de 3 pasos: Selección de Barbero, Selección de Fecha/Hora y Confirmación.
 * Gestiona el estado global de la reserva en construcción y coordina la comunicación entre los pasos.
 */
@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    CommonModule, 
    ModalAlertComponent, 
    SelectBarberComponent, 
    HorizontalDateSelectorComponent,
    TimeSlotGridComponent,
    BookingSummaryCardComponent,
    BookingConfirmationComponent
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  private serviceService = inject(ServiceService);
  private reservationService = inject(ReservationService);
  private barberService = inject(BarberService);

  /** Paso actual del Wizard (1, 2 o 3). */
  public currentStep: number = 1;
  
  /** Número total de pasos del flujo. */
  public totalSteps: number = 3;
  
  /** Indica si se está procesando la reserva final para mostrar el estado de carga. */
  public loading: boolean = false;
  
  /** 
   * Bandera que indica si el usuario está en modo reprogramación.
   * Si es true, bloquea el regreso al paso 1 (Barbero) ya que solo se permite cambiar fecha/hora.
   */
  public isRescheduling: boolean = false; 

  // Estado de la Reserva
  public selectedServiceId: number | null = null;
  public selectedService: Service | null = null; 

  public selectedBarberId: string | null = null;
  public selectedBarber: Barber | null = null;
  
  /** Reservas existentes del barbero seleccionado, necesarias para calcular disponibilidad. */
  public barberReservations: Reservation[] = [];

  public selectedDate: Date | null = null;
  public selectedTimeSlot: TimeSlot | null = null;
  
  // Control de Modales
  public showCancelModal: boolean = false;
  public showSuccessModal: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const serviceId = Number(params['serviceId']);
      const barberId = (params['barberId']); // Leemos barberId opcional para reprogramación

      if (serviceId) {
        this.selectedServiceId = serviceId;
        this.loadServiceDetails(serviceId);

        // LÓGICA DE REPROGRAMACIÓN
        if (barberId) {
          this.isRescheduling = true;
          this.selectedBarberId = barberId;
          this.currentStep = 2; // Saltamos directamente al paso de fecha
          this.loadBarberDetails(barberId); // Cargamos datos del barbero
        }
      } else {
        // Si no hay servicio, no se puede iniciar el flujo
        this.router.navigate(['/client']);
      }
    });
  }

  /**
   * Carga los detalles completos del servicio desde la API.
   * Necesario para obtener precio y duración.
   */
  private loadServiceDetails(id: number): void {
    this.serviceService.getServiceById(id).subscribe(service => {
      if (service) this.selectedService = service;
    });
  }

  /**
   * Carga los detalles completos del barbero desde la API.
   * Necesario para obtener su horario laboral (schedule).
   */
  private loadBarberDetails(id: string): void {
    this.barberService.getBarberById(id).subscribe(barber => {
      if (barber) {
        this.selectedBarber = barber;
        // Una vez tenemos el barbero, cargamos sus reservas para la disponibilidad
        this.loadBarberReservations(barber.id);
      }
    });
  }

  /**
   * Carga las reservas existentes del barbero seleccionado.
   * Se utiliza para filtrar los huecos ocupados en el selector de horas.
   */
  private loadBarberReservations(barberId: string): void {
    this.reservationService.getReservationsByBarberId(barberId).subscribe(reservations => {
      this.barberReservations = reservations;
    });
  }

  /**
   * Determina si el botón "Continuar" de la tarjeta de resumen debe estar deshabilitado.
   * Depende de si se ha completado la selección requerida para el paso actual.
   */
  get isNextButtonDisabled(): boolean {
    switch (this.currentStep) {
      case 1: return !this.selectedBarberId;
      case 2: return !this.selectedTimeSlot;
      default: return true;
    }
  }

  /** Etiqueta dinámica para el botón de acción principal. */
  get actionButtonLabel(): string {
    return 'Continuar';
  }

  // --- LÓGICA DE RESERVA ---

  /**
   * Envía la solicitud final de reserva al servicio.
   * Construye el objeto Reservation, maneja el estado de carga y muestra el modal de éxito.
   */
  saveReservation(): void {
    if (!this.selectedService || !this.selectedBarber || !this.selectedTimeSlot) return;

    this.loading = true;

    const newReservation: Partial<Reservation> = {
      clientId: MOCK_CLIENT_USER.id,
      barberId: this.selectedBarber.id,
      serviceId: this.selectedService.id,
      start: this.selectedTimeSlot.start,
      end: this.selectedTimeSlot.end,
      price: this.selectedService.price,
    };

    this.reservationService.createReservation(newReservation).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.loading = false;
          this.showSuccessModal = true; 
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Hubo un error al crear la reserva.');
      }
    });
  }

  /**
   * Finaliza el flujo redirigiendo al usuario a su lista de reservas.
   * Se ejecuta al cerrar el modal de éxito.
   */
  finishBooking(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/client/reservations']);
  }

  /**
   * Maneja el clic en el botón principal de la tarjeta de resumen lateral.
   */
  handleSummaryAction(): void {
    if (this.currentStep < this.totalSteps) {
      this.nextStep();
    }
  }

  // Selección manual en Paso 1
  handleBarberSelection(barber: Barber): void {
    this.selectedBarberId = barber.id;
    this.selectedBarber = barber;
    this.loadBarberReservations(barber.id);
  }

  handleDateSelection(date: Date): void {
    this.selectedDate = date;
    this.selectedTimeSlot = null;
  }

  handleTimeSlotSelection(slot: TimeSlot): void {
    this.selectedTimeSlot = slot;
  }

  /** Avanza al siguiente paso y hace scroll al inicio. */
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  /** 
   * Retrocede al paso anterior.
   * Si está en modo reprogramación y trata de volver desde el paso de fecha, inicia la cancelación.
   */
  prevStep(): void {
    if (this.currentStep > 1) {
      // REGLA DE NEGOCIO: Si estamos reprogramando y estamos en el paso 2 (Fecha),
      // no permitimos volver al paso 1 (Barbero). Actúa como cancelar.
      if (this.isRescheduling && this.currentStep === 2) {
        this.initiateCancel();
        return;
      }
      
      this.currentStep--;
    } else {
      this.initiateCancel();
    }
  }

  initiateCancel(): void {
    this.showCancelModal = true;
  }

  confirmCancel(): void {
    this.showCancelModal = false;
    this.router.navigate(['/client']);
  }
}