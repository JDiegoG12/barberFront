// Definimos tipos específicos para los estados para evitar errores de tipeo.
// Esto es mucho más seguro que usar 'string'.
export type BarberAvailabilityStatus = 'Disponible' | 'No Disponible';
export type BarberSystemStatus = 'Activo' | 'Inactivo';

export interface Barber {
  id: number;
  name: string;
  lastName: string;
  specialties: string[];
  photoUrl: string;
  bio: string;
  serviceIds: number[];
  availabilityStatus: BarberAvailabilityStatus; // Estado de disponibilidad para reservas
  systemStatus: BarberSystemStatus;           // Estado en la base de datos (soft delete)
}