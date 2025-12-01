import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservationService } from '../../../../../core/services/api/reservation.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Reservation, ReservationStatus } from '../../../../../core/models/views/reservation.view.model';
import { HorizontalDateSelectorComponent } from '../../../../../shared/components/molecules/horizontal-date-selector/horizontal-date-selector.component';
import { SectionTitleComponent } from '../../../../../shared/components/atoms/section-title/section-title.component';
import { ModalAlertComponent } from '../../../../../shared/components/molecules/modal-alert/modal-alert.component';
import { DurationPipe } from '../../../../../shared/pipes/duration.pipe';
import { Barber } from '../../../../../core/models/views/barber.view.model';
import { MOCK_BARBERS, MOCK_CLIENT_USER } from '../../../../../core/mocks/mock-data';

// Interfaz local
interface ReservationView extends Reservation {
  durationMinutes: number;
  clientName: string;
  serviceName: string;
}

@Component({
  selector: 'app-barber-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HorizontalDateSelectorComponent,
    SectionTitleComponent,
    ModalAlertComponent,
    DurationPipe
  ],
  templateUrl: './barber-schedule.component.html',
  styleUrls: ['./barber-schedule.component.scss']
})
export class BarberScheduleComponent implements OnInit {
  
  private reservationService = inject(ReservationService);
  public authService = inject(AuthService);

  // Estado
  selectedDate: Date = new Date();
  reservations: ReservationView[] = []; 
  loading = false;
  barber: Barber | null = null;

  // --- GESTIÓN DE CONFIRMACIÓN ---
  showConfirmModal = false;
  selectedReservation: ReservationView | null = null;
  pendingStatus: ReservationStatus | null = null;

  async ngOnInit() {
    const user = await this.authService.getUserProfile();
    
    if (user && user.role === 'BARBER') {
      const barberFromMock = MOCK_BARBERS.find(b => b.id === user.id);
      
      if (barberFromMock) {
        this.barber = barberFromMock;
      } else {
        this.barber = {
          id: user.id,
          name: user.firstName,
          lastName: user.lastName,
          photoUrl: '',
          bio: '',
          serviceIds: [],
          availabilityStatus: 'Disponible',
          systemStatus: 'Activo',
          schedule: []
        };
      }
      this.loadReservations(this.selectedDate);
    }
  }

  handleDateClick(date: Date) {
    this.selectedDate = date;
    this.loadReservations(date);
  }

  loadReservations(date: Date) {
    if (!this.barber) return;

    this.loading = true;
    this.reservationService.getReservationsByDate(this.barber.id, date).subscribe({
      next: (data) => {
        this.reservations = data.map(r => ({
          ...r,
          start: new Date(r.start),
          end: new Date(r.end),
          durationMinutes: Math.round((new Date(r.end).getTime() - new Date(r.start).getTime()) / 60000),
          clientName: `${MOCK_CLIENT_USER.firstName} ${MOCK_CLIENT_USER.lastName}`,
          serviceName: r.service?.name || 'Servicio'
        })).sort((a, b) => a.start.getTime() - b.start.getTime());
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En espera': return 'status-waiting';
      case 'En proceso': return 'status-process';
      case 'Finalizada': return 'status-finished';
      case 'Cancelada': return 'status-cancelled';
      case 'Inasistencia': return 'status-noshow';
      default: return '';
    }
  }

  // --- LÓGICA DE CAMBIO DE ESTADO ---

  // Usuario hace click en un botón de estado -> Pedir confirmación
  initiateStatusChange(reservation: ReservationView, newStatus: ReservationStatus) {
    // Si el estado es el mismo, no hacemos nada
    if (reservation.status === newStatus) return;

    this.selectedReservation = reservation;
    this.pendingStatus = newStatus;
    this.showConfirmModal = true;
  }

  // Usuario confirma en el ModalAlert
  confirmStatusChange() {
    if (this.selectedReservation && this.pendingStatus) {
      const index = this.reservations.findIndex(r => r.id === this.selectedReservation!.id);
      if (index !== -1) {
        this.reservations[index].status = this.pendingStatus;
      }
      
      // TODO: Llamar al servicio para persistir
      // this.reservationService.updateStatus(this.selectedReservation.id, this.pendingStatus).subscribe(...)
      console.log(`✅ Estado actualizado a: ${this.pendingStatus}`);
    }
    this.closeModal();
  }

  // Cancelar o cerrar
  closeModal() {
    this.showConfirmModal = false;
    this.selectedReservation = null;
    this.pendingStatus = null;
  }
}