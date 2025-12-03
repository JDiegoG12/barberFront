/**
 * Define la estructura del objeto Barbero devuelto por la API REST
 * (Corresponde al BarberDTO de Spring Boot).
 */
export interface BarberResponseDTO {
  /** Identificador único del barbero (String UUID). */
  id: string; 

  /** Nombre de pila. */
  name: string;
  
  /** Apellidos. */
  lastName: string;

  /** Correo electrónico. */
  email: string;

  /** Número de teléfono (Opcional). */
  phone?: string; 

  /** Estado de disponibilidad operativa (true = Disponible, false = No Disponible). */
  availability: boolean; 

  /** Estado del contrato/registro (true = Activo, false = Inactivo/Baja Lógica). */
  contract: boolean;     

  /** Breve descripción profesional o biografía (Opcional). */
  description?: string; 

  /** Ruta o URL de la imagen de perfil (Mapea a 'photoUrl' en el View Model). */
  image: string;         

  /** ID de usuario en el sistema Keycloak (Opcional). */
  keycloakId?: string;

  /** Contraseña (Aunque no debería ser enviada en la respuesta, la incluimos por consistencia con tu DTO de Spring). */
  password: string; 
}