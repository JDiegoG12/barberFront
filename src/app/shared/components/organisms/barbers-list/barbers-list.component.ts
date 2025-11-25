import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs'; // Importamos map

// 1. Importamos todo lo que necesitamos
import { Barber } from '../../../../core/models/views/barber.view.model';
import { BarberService } from '../../../../core/services/api/barber.service';
import { SectionTitleComponent } from '../../atoms/section-title/section-title.component';
import { BarberCardComponent } from '../../molecules/barber-card/barber-card.component';

/**
 * Componente organismo encargado de visualizar el listado del equipo de trabajo (Barberos).
 * Su responsabilidad principal es recuperar los datos del servicio, aplicar reglas de negocio
 * de visualización (como el ordenamiento por disponibilidad) y delegar el renderizado
 * a las moléculas de tarjetas.
 */
@Component({
  selector: 'app-barbers-list',
  standalone: true,
  // 2. Añadimos los componentes que usará este organismo
  imports: [CommonModule, SectionTitleComponent, BarberCardComponent],
  templateUrl: './barbers-list.component.html',
  styleUrl: './barbers-list.component.scss'
})
export class BarbersListComponent implements OnInit {
  // 3. Inyectamos el servicio
  /** Servicio de acceso a datos de barberos. */
  private barberService = inject(BarberService);

  // 4. Creamos la propiedad para el observable
  /**
   * Flujo de datos observable que contiene la lista de barberos procesada.
   * Se suscribe directamente en la plantilla mediante el pipe `async`.
   */
  public barbers$!: Observable<Barber[]>;

  /**
   * Inicializa el componente recuperando y ordenando la lista de barberos.
   * Aplica una lógica de ordenamiento en el cliente para priorizar a los barberos 'Disponibles',
   * colocándolos al principio de la lista/carrusel para mejorar la conversión.
   */
  ngOnInit(): void {
    // 5. Obtenemos los datos y los ordenamos
    this.barbers$ = this.barberService.getBarbers().pipe(
      map(barbers => {
        // Creamos una copia superficial para evitar mutar el array original si fuera necesario,
        // aunque sort muta in-place.
        return [...barbers].sort((a, b) => {
          const aAvailable = a.availabilityStatus === 'Disponible';
          const bAvailable = b.availabilityStatus === 'Disponible';

          // Si ambos tienen el mismo estado, mantenemos el orden original (o podrías ordenar por nombre)
          if (aAvailable === bAvailable) return 0;
          
          // Si A está disponible y B no, A va primero (-1)
          return aAvailable ? -1 : 1;
        });
      })
    );
  }
}