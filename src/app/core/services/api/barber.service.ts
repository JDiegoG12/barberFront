import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators'; 
import { Barber } from '../../models/views/barber.view.model';
import { MOCK_BARBERS } from '../../mocks/mock-data'; // <-- Importamos los datos desde nuestro archivo mock

/**
 * Servicio encargado de gestionar la recuperación de información de los barberos.
 * Actúa como una capa de abstracción sobre los datos, simulando peticiones asíncronas
 * que en el futuro conectarán con el backend.
 */
@Injectable({
  providedIn: 'root'
})
export class BarberService {

  constructor() { }

  /**
   * Obtiene el listado completo de barberos que se encuentran activos en el sistema.
   * Aplica un filtrado para excluir aquellos que han sido dados de baja lógica (estado 'Inactivo').
   *
   * @returns Un Observable que emite un array de objetos `Barber`.
   */
  getBarbers(): Observable<Barber[]> {
    // Simulamos la llamada a la API usando nuestros datos mock.
    // El 'pipe' y 'map' simulan que el backend ya nos devuelve solo los activos.
    return of(MOCK_BARBERS).pipe(
      map(barbers => barbers.filter(b => b.systemStatus === 'Activo'))
    );
  }

  /**
   * Busca y recupera la información detallada de un barbero específico basado en su identificador único.
   *
   * @param id - El identificador numérico del barbero a buscar.
   * @returns Un Observable que emite el objeto `Barber` si es encontrado, o `undefined` si no existe.
   */
  getBarberById(id: number): Observable<Barber | undefined> {
    return of(MOCK_BARBERS).pipe(
      map(barbers => barbers.find(b => b.id === id))
    );
  }
}