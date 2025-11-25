import { Barber } from "./barber.view.model";
import { Service } from "./service.view.model";

/**
 * Define los posibles estados del ciclo de vida de una reserva en el negocio.
 * - 'En espera': La cita está confirmada y pendiente de realizarse (futura).
 * - 'Inasistencia': El cliente no se presentó a la cita (No-show).
 * - 'En proceso': El servicio se está ejecutando actualmente.
 * - 'Finalizada': El servicio concluyó exitosamente.
 * - 'Cancelada': La cita fue anulada por el cliente o el administrador antes de realizarse.
 */
export type ReservationStatus = 'En espera' | 'Inasistencia' | 'En proceso' | 'Finalizada' | 'Cancelada';

/**
 * Modelo de vista que representa una transacción de reserva en el sistema.
 * Actúa como entidad central que vincula al Cliente, el Barbero y el Servicio
 * en un bloque de tiempo específico.
 */
export interface Reservation {
  /** Identificador único de la reserva. */
  id: number;

  /** ID del usuario (cliente) que realizó la reserva. */
  clientId: number;

  /** ID del barbero seleccionado para prestar el servicio. */
  barberId: number;

  /** ID del servicio contratado. */
  serviceId: number;

  /** Fecha y hora exacta de inicio de la cita. */
  start: Date;

  /** Fecha y hora exacta de finalización (calculada: inicio + duración del servicio). */
  end: Date;

  /**
   * Precio del servicio congelado al momento de la reserva.
   * Se guarda independientemente del precio actual del servicio para mantener integridad histórica.
   */
  price: number;

  /** Estado actual de la reserva. */
  status: ReservationStatus;

  /**
   * Objeto Barbero completo (Opcional).
   * Se utiliza para "hidratar" la vista (UI) y mostrar detalles (nombre, foto)
   * sin necesidad de realizar peticiones adicionales al backend.
   */
  barber?: Barber;

  /**
   * Objeto Servicio completo (Opcional).
   * Se utiliza para mostrar detalles (nombre, descripción) en tarjetas de resumen o historial.
   */
  service?: Service;
}