import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Reservation } from '../../models/views/reservation.view.model';
import { environment } from '../../../../environments/environment';
import { BarberService } from './barber.service';
import { ServiceService } from './service.service';

/**
 * Servicio encargado de la gestión de reservas (citas) en el sistema.
 * Proporciona métodos para consultar el historial de reservas de clientes y barberos,
 * así como para registrar nuevas citas.
 */
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private barberService = inject(BarberService);
  private serviceService = inject(ServiceService);
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor() { }

  /**
   * Recupera el historial completo de reservas asociadas a un cliente específico.
   * Los resultados se filtran por el ID del cliente y se ordenan cronológicamente
   * de forma descendente (las citas más futuras o recientes aparecen primero).
   *
   * @param clientId - El identificador único del cliente.
   * @returns Un Observable que emite un array de objetos `Reservation`.
   */
  getReservationsByClientId(clientId: string): Observable<Reservation[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/reservations/cliente/${clientId}/active`).pipe(
      map(reservations => reservations.map(r => this.mapBackendToReservation(r))),
      switchMap(reservations => this.hydrateReservations(reservations))
    );
  }

  /**
   * Recupera todas las reservas asignadas a un barbero específico.
   * Este método es fundamental para construir la vista de agenda o calendario del barbero,
   * permitiendo calcular su disponibilidad real.
   *
   * @param barberId - El identificador único del barbero.
   * @returns Un Observable que emite un array de objetos `Reservation`.
   */
  getReservationsByBarberId(barberId: string): Observable<Reservation[]> {
    return this.http.get<any[]>(`${this.apiUrl}/barbero/reservations/barbero/${barberId}`).pipe(
      map(reservations => reservations.map(r => this.mapBackendToReservation(r))),
      switchMap(reservations => this.hydrateReservations(reservations))
    );
  }

  /**
   * Recupera las reservas de un barbero para una fecha específica.
   * Filtra las reservas que ocurren en el día seleccionado.
   *
   * @param barberId - El identificador único del barbero.
   * @param date - La fecha para filtrar las reservas.
   * @returns Un Observable que emite un array de objetos `Reservation`.
   */
  getReservationsByDate(barberId: string, date: Date): Observable<Reservation[]> {
    const formattedDate = this.formatDateTimeForBackend(date);
    return this.http.get<any[]>(`${this.apiUrl}/barbero/reservations/barbero/${barberId}/day?day=${formattedDate}`).pipe(
      map(reservations => reservations.map(r => this.mapBackendToReservation(r))),
      switchMap(reservations => this.hydrateReservations(reservations))
    );
  }

  /**
   * Crea una nueva reserva en el backend.
   * Envía una petición POST al endpoint del API Gateway con los datos de la reserva.
   *
   * @param reservation - Objeto con los datos parciales de la reserva (sin ID ni estado).
   * @returns Un Observable que emite la `Reservation` completa y creada exitosamente.
   */
  createReservation(reservation: Partial<Reservation>): Observable<Reservation> {
    // DTO que espera el backend
    const requestDto = {
      clientId: reservation.clientId!,
      barberId: reservation.barberId!,
      serviceId: reservation.serviceId!,
      startTime: this.formatDateTimeForBackend(reservation.start!),
      price: reservation.price!
    };

    return this.http.post<any>(`${this.apiUrl}`, requestDto).pipe(
      map(response => this.mapBackendToReservation(response)),
      switchMap(newReservation => this.hydrateReservations([newReservation])),
      map(reservations => reservations[0])
    );
  }

  /**
   * Enriquece las reservas con la información completa del Barbero y el Servicio.
   * Realiza peticiones en paralelo para obtener los detalles.
   */
  private hydrateReservations(reservations: Reservation[]): Observable<Reservation[]> {
    if (reservations.length === 0) return of([]);

    const tasks$ = reservations.map(reservation => 
      forkJoin({
        barber: this.barberService.getBarberById(reservation.barberId).pipe(catchError(() => of(undefined))),
        service: this.serviceService.getServiceById(reservation.serviceId).pipe(catchError(() => of(undefined)))
      }).pipe(
        map(({ barber, service }) => {
          reservation.barber = barber;
          reservation.service = service;
          return reservation;
        })
      )
    );

    return forkJoin(tasks$);
  }

  /**
   * Convierte un objeto Date de JavaScript al formato ISO 8601 esperado por el backend.
   * Formato: "2025-12-05T10:00:00"
   */
  private formatDateTimeForBackend(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  /**
   * Mapea la respuesta del backend al modelo de vista del frontend.
   * Convierte strings ISO 8601 a objetos Date y traduce el estado.
   */
  private mapBackendToReservation(backendResponse: any): Reservation {
    return {
      id: backendResponse.id,
      clientId: backendResponse.clientId,
      barberId: backendResponse.barberId,
      serviceId: backendResponse.serviceId,
      start: new Date(backendResponse.startTime),
      end: new Date(backendResponse.endTime),
      price: backendResponse.price,
      status: this.mapBackendStatus(backendResponse.status)
    };
  }

  /**
   * Traduce el estado del backend al formato esperado por el frontend.
   */
  private mapBackendStatus(backendStatus: string): 'En espera' | 'Inasistencia' | 'En proceso' | 'Finalizada' | 'Cancelada' {
    const statusMap: { [key: string]: any } = {
      'EN_ESPERA': 'En espera',
      'INASISTENCIA': 'Inasistencia',
      'EN_PROCESO': 'En proceso',
      'FINALIZADA': 'Finalizada',
      'CANCELADA': 'Cancelada'
    };
    return statusMap[backendStatus] || 'En espera';
  }

  /**
   * Traduce el estado del frontend al formato esperado por el backend.
   */
  private mapFrontendStatusToBackend(frontendStatus: 'En espera' | 'Inasistencia' | 'En proceso' | 'Finalizada' | 'Cancelada'): string {
    const statusMap: { [key: string]: string } = {
      'En espera': 'EN_ESPERA',
      'Inasistencia': 'INASISTENCIA',
      'En proceso': 'EN_PROCESO',
      'Finalizada': 'FINALIZADA',
      'Cancelada': 'CANCELADA'
    };
    return statusMap[frontendStatus] || 'EN_ESPERA';
  }

  /**
   * Actualiza el estado de una reserva.
   * Este método es utilizado por los barberos para cambiar el estado de las reservas.
   * 
   * @param reservationId - ID de la reserva a actualizar
   * @param newStatus - Nuevo estado de la reserva
   * @returns Observable que emite la reserva actualizada
   */
  updateStatus(reservationId: number, newStatus: 'En espera' | 'Inasistencia' | 'En proceso' | 'Finalizada' | 'Cancelada'): Observable<Reservation> {
    const backendStatus = this.mapFrontendStatusToBackend(newStatus);
    return this.http.put<any>(`${this.apiUrl}/barbero/reservations/${reservationId}/estado?newStatus=${backendStatus}`, null).pipe(
      map(response => this.mapBackendToReservation(response))
    );
  }

  /**
   * Cancela una reserva.
   * Este método es utilizado por los clientes para cancelar sus reservas.
   * 
   * @param reservationId - ID de la reserva a cancelar
   * @param clientId - ID del cliente que cancela
   * @returns Observable que emite la reserva cancelada
   */
  cancelReservation(reservationId: number, clientId: string): Observable<Reservation> {
    return this.http.put<any>(`${this.apiUrl}/cliente/reservations/${reservationId}/cancelar?clientId=${clientId}`, null).pipe(
      map(response => this.mapBackendToReservation(response))
    );
  }

  /**
   * Obtiene el historial de reservas (pasadas) de un cliente.
   * 
   * @param clientId - El identificador único del cliente
   * @returns Observable que emite un array de reservas históricas
   */
  getReservationHistory(clientId: string): Observable<Reservation[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/reservations/cliente/${clientId}/history`).pipe(
      map(reservations => reservations.map(r => this.mapBackendToReservation(r)))
    );
  }

  /**
   * Reprograma una reserva.
   * 
   * @param reservationId - ID de la reserva a reprogramar
   * @param clientId - ID del cliente
   * @param newStartTime - Nueva fecha y hora de inicio
   * @returns Observable que emite la reserva reprogramada
   */
  rescheduleReservation(reservationId: number, clientId: string, newStartTime: Date): Observable<Reservation> {
    const requestDto = {
      startTime: this.formatDateTimeForBackend(newStartTime)
    };
    return this.http.put<any>(`${this.apiUrl}/cliente/reservations/${reservationId}/reprogramar?clientId=${clientId}`, requestDto).pipe(
      map(response => this.mapBackendToReservation(response))
    );
  }
}