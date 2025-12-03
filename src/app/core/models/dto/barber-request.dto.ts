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
 * DTO para la actualización de un barbero existente.
 * (Usado en PUT /admin/barbers/{id})
 * Utilizamos Partial<> porque todos los campos son opcionales en el controlador de Spring
 * (excepto los que se envían por RequestPart).
 */
export interface UpdateBarberRequestDTO extends Partial<CreateBarberRequestDTO> {
  // Aquí puedes añadir campos específicos de actualización si difieren.
}

/**
 * DTO para la asignación masiva de servicios a un barbero.
 * (Usado en POST /admin/barbers/{barberId}/servicios)
 */
export interface AssignServicesToBarberRequestDTO {
  /** Lista de IDs numéricos de los servicios a asignar. */
  serviceIds: number[];
}