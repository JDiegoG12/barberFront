import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from '../../models/views/service.view.model';
import { Category } from '../../models/views/category.view.model';
import { MOCK_SERVICES, MOCK_CATEGORIES } from '../../mocks/mock-data'; // <-- Importamos los datos de servicios

/**
 * Servicio encargado de la gestión del catálogo de servicios y sus categorías.
 * Actúa como proveedor de datos para las vistas de selección de servicios y reservas,
 * simulando respuestas asíncronas de una API.
 */
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor() { }

  /**
   * Obtiene el listado completo de categorías definidas en el sistema.
   * Se utiliza para agrupar visualmente los servicios (ej. en carruseles o secciones).
   *
   * @returns Un Observable que emite un array de objetos `Category`.
   */
  getCategories(): Observable<Category[]> {
    return of(MOCK_CATEGORIES);
  }

  /**
   * Obtiene el catálogo general de servicios registrados.
   * Aplica un filtro de negocio para retornar únicamente los servicios con estado 'Activo',
   * ocultando aquellos que han sido deshabilitados administrativamente.
   *
   * @returns Un Observable con la lista filtrada de servicios activos.
   */
  getServices(): Observable<Service[]> {
    return of(MOCK_SERVICES).pipe(
      map(services => services.filter(s => s.systemStatus === 'Activo'))
    );
  }

  /**
   * Busca y recupera la información detallada de un servicio específico.
   * Útil para obtener detalles completos (precio, duración) cuando solo se dispone del ID
   * (por ejemplo, desde parámetros de ruta o referencias cruzadas).
   *
   * @param id - El identificador numérico del servicio a buscar.
   * @returns Un Observable que emite el objeto `Service` si es encontrado, o `undefined`.
   */
  getServiceById(id: number): Observable<Service | undefined> {
    return of(MOCK_SERVICES).pipe(
      map(services => services.find(s => s.id === id))
    );
  }
}