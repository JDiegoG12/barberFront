import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ReservationService } from '../../../../../core/services/api/reservation.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { BarberService } from '../../../../../core/services/api/barber.service';
import { Reservation, ReservationStatus } from '../../../../../core/models/views/reservation.view.model';
import { HorizontalDateSelectorComponent } from '../../../../../shared/components/molecules/horizontal-date-selector/horizontal-date-selector.component';
import { SectionTitleComponent } from '../../../../../shared/components/atoms/section-title/section-title.component';
import { ModalAlertComponent } from '../../../../../shared/components/molecules/modal-alert/modal-alert.component';
import { DurationPipe } from '../../../../../shared/pipes/duration.pipe';
import { Barber } from '../../../../../core/models/views/barber.view.model';

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
  private barberService = inject(BarberService);
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
      // Obtener la información del barbero desde el backend
      this.barberService.getBarberById(user.id).subscribe({
        next: (barber) => {
          if (barber) {
            this.barber = barber;
            this.loadReservations(this.selectedDate);
          } else {
            console.error('No se encontró información del barbero en el backend');
          }
        },
        error: (error) => {
          console.error('Error al cargar información del barbero:', error);
        }
      });
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
        // Obtener IDs únicos de clientes
        const clientIds = [...new Set(data.map(r => r.clientId))];
        
        // Obtener información de todos los clientes
        this.authService.getUsersByIds(clientIds).subscribe({
          next: (usersMap) => {
            this.reservations = data.map(r => {
              const client = usersMap.get(r.clientId);
              return {
                ...r,
                start: new Date(r.start),
                end: new Date(r.end),
                durationMinutes: Math.round((new Date(r.end).getTime() - new Date(r.start).getTime()) / 60000),
                clientName: client 
                  ? `${client.firstName} ${client.lastName}`.trim() || client.username
                  : `Cliente ${r.clientId.substring(0, 8)}...`,
                serviceName: r.service?.name || 'Servicio'
              };
            }).sort((a, b) => a.start.getTime() - b.start.getTime());
            this.loading = false;
          },
          error: () => {
            // Si falla la obtención de usuarios, mostrar con IDs
            this.reservations = data.map(r => ({
              ...r,
              start: new Date(r.start),
              end: new Date(r.end),
              durationMinutes: Math.round((new Date(r.end).getTime() - new Date(r.start).getTime()) / 60000),
              clientName: `Cliente ${r.clientId.substring(0, 8)}...`,
              serviceName: r.service?.name || 'Servicio'
            })).sort((a, b) => a.start.getTime() - b.start.getTime());
            this.loading = false;
          }
        });
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
      this.reservationService.updateStatus(this.selectedReservation.id, this.pendingStatus).subscribe({
        next: () => {
          console.log(`✅ Estado actualizado a: ${this.pendingStatus}`);
        },
        error: (error) => {
          console.error('Error al actualizar el estado de la reserva:', error);
        }
      });
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