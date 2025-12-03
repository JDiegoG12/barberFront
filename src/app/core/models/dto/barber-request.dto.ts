/**
 * DTO para la creación de un nuevo barbero.
 * (Usado en POST /admin/barbers)
 * Nota: Los campos se envían como multipart/form-data, pero la estructura
 * se define aquí para el tipado en TypeScript.
 */
export interface CreateBarberRequestDTO {
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  description?: string;
  /** Contraseña inicial para el nuevo barbero. */
  password: string; 
  // El archivo de la imagen se maneja por separado en el servicio con FormData.
}

/**
 * Estados de disponibilidad del barbero.
 * Definimos valores por defecto para tipado; ajusta los valores según tu dominio.
 */
export enum BarberAvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

/**
 * Estados del sistema para el barbero.
 * Definimos valores por defecto para tipado; ajusta los valores según tu dominio.
 */
export enum BarberSystemStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * DTO para la actualización de un barbero existente.
 * (Usado en PUT /admin/barbers/{id})
 * Utilizamos Partial<> porque todos los campos son opcionales en el controlador de Spring
 * (excepto los que se envían por RequestPart).
 */
export interface UpdateBarberRequestDTO extends Partial<CreateBarberRequestDTO> {
    // En actualización, el password podría ser opcional. 
    availabilityStatus?: BarberAvailabilityStatus;
    systemStatus?: BarberSystemStatus;
}

/**
 * DTO para la asignación masiva de servicios a un barbero.
 * (Usado en POST /admin/barbers/{barberId}/servicios)
 */
export interface AssignServicesToBarberRequestDTO {
  /** Lista de IDs numéricos de los servicios a asignar. */
  serviceIds: number[];
}

// --- DTO para Horario Laboral (WorkShift) ---
// Debe coincidir con el WorkShiftDTO de Java.
export type DayOfWeekString = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface WorkShiftRequestDTO {
    id?: number; // Opcional en creación
    dayOfWeek: DayOfWeekString;
    startTime: string; // Formato "HH:mm" (LocalTime)
    endTime: string; // Formato "HH:mm" (LocalTime)
    barberId: string; // El ID del barbero al que se asigna
}