import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Componentes UI
import { ReservationCardComponent } from '../../../../../shared/components/molecules/reservation-card/reservation-card.component';
import { ModalAlertComponent } from '../../../../../shared/components/molecules/modal-alert/modal-alert.component';
import { PrimaryButtonComponent } from '../../../../../shared/components/atoms/primary-button/primary-button.component';

// Servicios y Modelos
import { ReservationService } from '../../../../../core/services/api/reservation.service';
import { Reservation } from '../../../../../core/models/views/reservation.view.model';
import { MOCK_CLIENT_USER } from '../../../../../core/mocks/mock-data';

/**
 * Componente de página principal para la gestión de reservas del cliente.
 * Permite visualizar el listado de citas dividiéndolo en dos categorías: "Próximas" e "Historial".
 * Ofrece funcionalidades para cancelar reservas activas, reprogramar citas pendientes
 * o volver a reservar servicios pasados.
 */
@Component({
  selector: 'app-client-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, ReservationCardComponent, ModalAlertComponent, PrimaryButtonComponent],
  templateUrl: './client-reservations.component.html',
  styleUrl: './client-reservations.component.scss'
})
export class ClientReservationsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private router = inject(Router);

  /** Controla la pestaña activa en la vista ('upcoming' para próximas, 'history' para pasadas). */
  public activeTab: 'upcoming' | 'history' = 'upcoming';
  
  /** Lista de reservas con estado 'En espera' o 'En proceso'. */
  public upcomingReservations: Reservation[] = [];
  
  /** Lista de reservas con estado 'Finalizada', 'Cancelada' o 'Inasistencia'. */
  public historyReservations: Reservation[] = [];
  
  /** Indicador de estado de carga de datos. */
  public loading: boolean = true;

  // Control de cancelación
  /** Controla la visibilidad del modal de confirmación de cancelación. */
  public showCancelModal: boolean = false;
  /** Almacena temporalmente la reserva que se intenta cancelar. */
  public reservationToCancel: Reservation | null = null;

  ngOnInit(): void {
    this.loadReservations();
  }

  /**
   * Obtiene las reservas del cliente logueado desde el servicio.
   * Filtra y clasifica los datos recibidos en las listas `upcomingReservations` y `historyReservations`
   * basándose en el estado de cada reserva.
   */
  loadReservations(): void {
    this.loading = true;
    this.reservationService.getReservationsByClientId(MOCK_CLIENT_USER.id).subscribe({
      next: (data) => {
        this.upcomingReservations = data.filter(r => ['En espera', 'En proceso'].includes(r.status));
        this.historyReservations = data.filter(r => !['En espera', 'En proceso'].includes(r.status));
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  /**
   * Cambia la pestaña visible en la interfaz.
   * @param tab - Identificador de la pestaña a mostrar.
   */
  setTab(tab: 'upcoming' | 'history'): void {
    this.activeTab = tab;
  }

  // --- MANEJO DE ACCIONES ---

  /**
   * Inicia el proceso de cancelación de una reserva.
   * Abre el modal de confirmación y guarda la referencia de la reserva seleccionada.
   * @param reservation - La reserva que el usuario desea cancelar.
   */
  initiateCancel(reservation: Reservation): void {
    this.reservationToCancel = reservation;
    this.showCancelModal = true;
  }

  /**
   * Ejecuta la cancelación definitiva de la reserva seleccionada.
   * Actualiza el estado de la reserva a 'Cancelada' y mueve el ítem de la lista
   * de próximas a la lista de historial localmente (simulación de actualización en tiempo real).
   */
  confirmCancel(): void {
    if (this.reservationToCancel) {
      console.log('Cancelando reserva:', this.reservationToCancel.id);
      this.reservationToCancel.status = 'Cancelada'; // Simulación local
      
      this.upcomingReservations = this.upcomingReservations.filter(r => r.id !== this.reservationToCancel!.id);
      this.historyReservations.unshift(this.reservationToCancel);
      
      this.showCancelModal = false;
      this.reservationToCancel = null;
    }
  }

  /**
   * Redirige al flujo de reprogramación de citas.
   * Navega al Wizard enviando el `serviceId` y el `barberId`, lo cual bloquea
   * la selección de barbero y lleva al usuario directamente a elegir una nueva fecha/hora.
   *
   * @param reservation - La reserva que se desea reprogramar.
   */
  handleReschedule(reservation: Reservation): void {
    // CORRECCIÓN: Enviamos también el barberId para bloquear el cambio de profesional
    this.router.navigate(['/client/book'], { 
      queryParams: { 
        serviceId: reservation.serviceId,
        barberId: reservation.barberId 
      } 
    });
  }

  /**
   * Redirige al flujo para volver a reservar un servicio del historial.
   * Navega al inicio del Wizard preseleccionando el servicio, pero permitiendo
   * cambiar el barbero si se desea.
   *
   * @param reservation - La reserva histórica que se desea repetir.
   */
  handleRebook(reservation: Reservation): void {
    // Para volver a reservar (historial), permitimos flujo normal desde el principio
    // o también podrías querer saltar pasos. Por ahora lo dejamos normal.
    this.router.navigate(['/client/book'], { 
      queryParams: { serviceId: reservation.serviceId } 
    });
  }
}