import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators'; // Importamos el operador map
import { Barber } from '../../models/views/barber.view.model';
import { MOCK_BARBERS } from '../../mocks/mock-data'; // <-- Importamos los datos desde nuestro archivo mock

@Injectable({
  providedIn: 'root'
})
export class BarberService {

  constructor() { }

  /**
   * Obtiene todos los barberos 'Activos' del sistema.
   * En el futuro, aquí se hará la llamada HTTP GET a /api/barbers
   * @returns Un Observable con la lista de barberos activos.
   */
  getBarbers(): Observable<Barber[]> {
    // Simulamos la llamada a la API usando nuestros datos mock.
    // El 'pipe' y 'map' simulan que el backend ya nos devuelve solo los activos.
    return of(MOCK_BARBERS).pipe(
      map(barbers => barbers.filter(b => b.systemStatus === 'Activo'))
    );
  }

  /**
   * Obtiene un barbero específico por su ID.
   * En el futuro, aquí se hará la llamada HTTP GET a /api/barbers/{id}
   * @param id El ID del barbero a buscar.
   * @returns Un Observable con el barbero encontrado o undefined.
   */
  getBarberById(id: number): Observable<Barber | undefined> {
    return of(MOCK_BARBERS).pipe(
      map(barbers => barbers.find(b => b.id === id))
    );
  }
}