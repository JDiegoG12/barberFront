import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reservation } from '../../models/views/reservation.view.model';
import { MOCK_RESERVATIONS } from '../../mocks/mock-data';

/**
 * Servicio encargado de la gestión de reservas (citas) en el sistema.
 * Proporciona métodos para consultar el historial de reservas de clientes y barberos,
 * así como para registrar nuevas citas. Actualmente simula la persistencia de datos.
 */
@Injectable({
  providedIn: 'root'
})
export class ReservationService {

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
    return of(MOCK_RESERVATIONS).pipe(
      map(reservations => 
        reservations
          .filter(r => r.clientId === clientId)
          .sort((a, b) => b.start.getTime() - a.start.getTime())
      )
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
    return of(MOCK_RESERVATIONS).pipe(
      map(reservations => reservations.filter(r => r.barberId === barberId))
    );
  }

  /**
   * Simula el proceso de creación y persistencia de una nueva reserva.
   * En un entorno de producción, este método enviaría una petición POST al backend.
   * Aquí se encarga de generar un ID temporal, asignar el estado inicial y retornar
   * el objeto confirmado.
   *
   * @param reservation - Objeto con los datos parciales de la reserva (sin ID ni estado).
   * @returns Un Observable que emite la `Reservation` completa y creada exitosamente.
   */
  createReservation(reservation: Partial<Reservation>): Observable<Reservation> {
    // Generamos un ID aleatorio para simular la base de datos
    const newId = Math.floor(Math.random() * 10000);
    
    const newReservation: Reservation = {
      ...reservation,
      id: newId,
      status: 'En espera', // Estado inicial por defecto para una nueva reserva
      // Aseguramos que los campos obligatorios estén presentes (en una app real el backend lo hace/valida)
      clientId: reservation.clientId!,
      barberId: reservation.barberId!,
      serviceId: reservation.serviceId!,
      start: reservation.start!,
      end: reservation.end!,
      price: reservation.price!
    };

    // Nota: En este mock no hacemos push al array MOCK_RESERVATIONS para evitar efectos secundarios
    // inesperados durante la navegación simple (stateless), pero devolvemos el objeto creado como si fuera éxito.
    return of(newReservation);
  }
}