/**
 * Define los estados de disponibilidad operativa de un barbero frente al cliente.
 * - 'Disponible': El barbero puede aceptar nuevas citas.
 * - 'No Disponible': El barbero no acepta citas temporalmente (vacaciones, descanso, etc.),
 *   aunque su horario laboral esté configurado.
 */
export type BarberAvailabilityStatus = 'Disponible' | 'No Disponible';

/**
 * Define el estado del registro del barbero en la base de datos.
 * - 'Activo': El registro es válido y visible en el sistema.
 * - 'Inactivo': Representa un borrado lógico (Soft Delete); el barbero no debe aparecer en listas.
 */
export type BarberSystemStatus = 'Activo' | 'Inactivo';

/**
 * Representa un bloque o turno de trabajo continuo dentro de un día.
 * Se utiliza para definir franjas horarias laborales (ej. turno mañana, turno tarde).
 */
export interface WorkShift {
  /** Hora de inicio del turno en formato 24h (ej: "08:00"). */
  start: string;
  /** Hora de finalización del turno en formato 24h (ej: "12:00"). */
  end: string;
}

/**
 * Representa la configuración de horario para un día específico de la semana.
 */
export interface DaySchedule {
  /**
   * Día de la semana representado numéricamente.
   * 0 = Domingo, 1 = Lunes, ..., 6 = Sábado.
   * Compatible con el método Date.getDay() de JavaScript.
   */
  dayOfWeek: number;

  /**
   * Lista de turnos laborales para este día.
   * Si el array está vacío, indica que el barbero no trabaja (Día libre).
   */
  shifts: WorkShift[];
}

/**
 * Modelo de vista que representa a un Barbero profesional en el sistema.
 * Contiene información personal, configuración de servicios y horarios.
 */
export interface Barber {
  /** Identificador único del barbero. */
  id: string;

  /** Nombre de pila. */
  name: string;

  /** Apellidos. */
  lastName: string;

  /** URL de la fotografía de perfil o avatar. */
  photoUrl: string;

  /** Breve biografía o descripción profesional. */
  bio: string;

  /**
   * Lista de IDs de los servicios que el barbero está capacitado para realizar.
   * Utilizado para filtrar profesionales según el servicio elegido por el cliente.
   */
  serviceIds: number[];

  /** Estado de disponibilidad actual para reservas. */
  availabilityStatus: BarberAvailabilityStatus;

  /** Estado administrativo del registro en el sistema. */
  systemStatus: BarberSystemStatus;

  /**
   * Agenda laboral semanal del barbero.
   * Propiedad obligatoria necesaria para el algoritmo de cálculo de disponibilidad de citas.
   */
  schedule: DaySchedule[];
}