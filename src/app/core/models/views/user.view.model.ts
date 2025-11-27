/**
 * Define los roles posibles que un usuario puede tener en el sistema.
 * - 'ADMIN': Administrador con acceso total a la gestión del negocio.
 * - 'BARBER': Profesional que presta los servicios y gestiona su agenda.
 * - 'CLIENT': Cliente final que realiza reservas y consultas.
 */
export type UserRole = 'ADMIN' | 'BARBER' | 'CLIENT';

/**
 * Modelo de vista que representa a un usuario registrado en la aplicación.
 * Contiene la información básica de identidad y contacto, independientemente de su rol.
 */
export interface User {
  /** Identificador único del usuario en la base de datos. */
  id: string;

  /** Primer nombre del usuario. */
  firstName: string;

  /** Apellidos del usuario. */
  lastName: string;

  /** Correo electrónico, utilizado también como identificador de inicio de sesión. */
  email: string;

  /**
   * Número de teléfono de contacto (Opcional).
   * Es útil para comunicaciones relacionadas con las reservas (confirmaciones, cambios).
   */
  phone?: string;

  /** Rol asignado al usuario, determina los permisos y vistas accesibles. */
  role: UserRole;
}