/**
 * Modelo de vista que representa una categoría de servicios.
 * Se utiliza para agrupar y organizar los servicios en el catálogo (ej. "Cortes", "Barba", "Tratamientos").
 */
export interface Category {
  /** Identificador único de la categoría en la base de datos. */
  id: number;

  /** Nombre visible de la categoría (ej. "Cortes de Cabello"). */
  name: string;
}