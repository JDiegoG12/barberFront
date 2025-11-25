/**
 * Define la disponibilidad del servicio para ser reservado por los clientes en la interfaz.
 * - 'Disponible': El servicio puede ser seleccionado y agendado.
 * - 'No Disponible': El servicio existe pero no se puede reservar temporalmente (ej. falta de insumos).
 */
export type ServiceAvailabilityStatus = 'Disponible' | 'No Disponible';

/**
 * Define el estado del ciclo de vida del servicio en el sistema.
 * - 'Activo': El servicio es visible en el catálogo y gestión.
 * - 'Inactivo': Representa un borrado lógico; el servicio se oculta para nuevas acciones pero se mantiene para el historial.
 */
export type ServiceSystemStatus = 'Activo' | 'Inactivo';

/**
 * Modelo de vista que representa un servicio ofrecido por la barbería.
 * Contiene los detalles comerciales, duración y configuración de disponibilidad.
 */
export interface Service {
  /** Identificador único del servicio. */
  id: number;

  /** Nombre comercial del servicio (ej. "Corte Clásico"). */
  name: string;

  /** Descripción detallada del servicio para informar al cliente. */
  description: string;

  /** Precio unitario del servicio. */
  price: number;

  /** Duración estimada del servicio en minutos. */
  duration: number;

  /**
   * Identificador de la categoría a la que pertenece este servicio.
   * Se utiliza para agrupar servicios visualmente (ej. en carruseles por categoría).
   */
  categoryId: number;

  /**
   * Lista de identificadores de los barberos calificados para realizar este servicio.
   * Se utiliza para filtrar qué profesionales mostrar al seleccionar este servicio.
   */
  barberIds: number[];

  /** Estado de disponibilidad actual para reservas desde la UI. */
  availabilityStatus: ServiceAvailabilityStatus;

  /** Estado administrativo del registro en el sistema. */
  systemStatus: ServiceSystemStatus;
}