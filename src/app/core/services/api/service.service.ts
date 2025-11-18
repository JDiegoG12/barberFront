import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from '../../models/views/service.view.model';
import { MOCK_SERVICES } from '../../mocks/mock-data'; // <-- Importamos los datos de servicios

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor() { }

  /**
   * Obtiene todos los servicios 'Activos' del sistema.
   * En el futuro, aquí se hará la llamada HTTP GET a /api/services
   * @returns Un Observable con la lista de servicios activos.
   */
  getServices(): Observable<Service[]> {
    // Simulamos la llamada a la API usando nuestros datos mock
    return of(MOCK_SERVICES).pipe(
      map(services => services.filter(s => s.systemStatus === 'Activo'))
    );
  }

  /**
   * Obtiene un servicio específico por su ID.
   * En el futuro, aquí se hará la llamada HTTP GET a /api/services/{id}
   * @param id El ID del servicio a buscar.
   * @returns Un Observable con el servicio encontrado o undefined.
   */
  getServiceById(id: number): Observable<Service | undefined> {
    return of(MOCK_SERVICES).pipe(
      map(services => services.find(s => s.id === id))
    );
  }
}