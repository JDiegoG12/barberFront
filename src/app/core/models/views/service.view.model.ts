// Estado calculado para la UI. Determina si un servicio puede ser seleccionado para una reserva.
export type ServiceAvailabilityStatus = 'Disponible' | 'No Disponible';

// Estado persistente en la base de datos. Determina si el servicio aparece en las listas (soft delete).
export type ServiceSystemStatus = 'Activo' | 'Inactivo';

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number; // Duración en minutos
  category: string;
  barberIds: number[];
  availabilityStatus: ServiceAvailabilityStatus; // Estado calculado (ej. ¿tiene barberos?)
  systemStatus: ServiceSystemStatus;           // Estado en la DB (Activo/Inactivo)
}