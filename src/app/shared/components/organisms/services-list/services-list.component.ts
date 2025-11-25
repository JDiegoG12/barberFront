import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';

// Componentes
import { ServiceCardComponent } from '../../molecules/service-card/service-card.component';
import { SectionTitleComponent } from '../../atoms/section-title/section-title.component';

// Servicios y Modelos
import { ServiceService } from '../../../../core/services/api/service.service';
import { Service } from '../../../../core/models/views/service.view.model';
import { Category } from '../../../../core/models/views/category.view.model';

/**
 * Interfaz auxiliar utilizada internamente para estructurar los datos en la vista.
 * Agrupa una categoría con su lista correspondiente de servicios filtrados.
 */
interface CategoryGroup {
  category: Category;
  services: Service[];
}

/**
 * Componente organismo encargado de mostrar el catálogo completo de servicios.
 *
 * Funcionalidades principales:
 * 1. Recupera categorías y servicios de forma simultánea.
 * 2. Agrupa los servicios por su categoría correspondiente.
 * 3. Ordena los servicios priorizando aquellos que están 'Disponibles'.
 * 4. Gestiona la visualización progresiva ("Ver más") para no saturar la pantalla inicial.
 */
@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, SectionTitleComponent],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  /** Servicio de acceso a datos de servicios y categorías. */
  private serviceService = inject(ServiceService);

  /**
   * Flujo de datos observable que contiene las categorías procesadas y sus servicios.
   * Se suscribe directamente en la plantilla mediante el pipe `async`.
   */
  public groupedServices$!: Observable<CategoryGroup[]>;

  /**
   * Servicio actualmente seleccionado por el usuario.
   * Se utiliza para marcar visualmente la tarjeta correspondiente como activa.
   */
  @Input() selectedService: Service | null = null;

  /**
   * Evento que se emite cuando el usuario selecciona un servicio de la lista.
   */
  @Output() onServiceSelect = new EventEmitter<Service>();

  // --- LÓGICA DE PAGINACIÓN SIMPLE ---
  
  /**
   * Estado que controla si se muestran todas las categorías o solo las iniciales.
   * - `false`: Muestra solo hasta `INITIAL_LIMIT`.
   * - `true`: Muestra todas las categorías disponibles.
   */
  public showAll: boolean = false;

  /**
   * Número de categorías a mostrar inicialmente antes de requerir la acción "Ver más".
   */
  public readonly INITIAL_LIMIT: number = 3;

  /**
   * Inicializa el componente combinando los flujos de Categorías y Servicios.
   * Realiza el filtrado, agrupación y ordenamiento en el cliente.
   */
  ngOnInit(): void {
    this.groupedServices$ = combineLatest([
      this.serviceService.getCategories(),
      this.serviceService.getServices() 
    ]).pipe(
      map(([categories, services]) => {
        return categories.map(category => {
          // 1. Filtrar servicios que pertenecen a esta categoría
          const categoryServices = services.filter(s => s.categoryId === category.id);
          
          // 2. Ordenar: Servicios 'Disponibles' aparecen primero para mejorar la UX/Conversión.
          // La función de comparación devuelve -1 si 'a' es disponible y 'b' no, colocándolo antes.
          categoryServices.sort((a, b) => {
            const aAvailable = a.availabilityStatus === 'Disponible';
            const bAvailable = b.availabilityStatus === 'Disponible';
            if (aAvailable === bAvailable) return 0;
            return aAvailable ? -1 : 1;
          });

          return {
            category: category,
            services: categoryServices
          };
        })
        // Filtramos categorías que no tengan servicios asociados para evitar secciones vacías
        .filter(group => group.services.length > 0);
      })
    );
  }

  /**
   * Maneja la selección de un servicio propagando el evento al componente padre.
   * @param service - El servicio seleccionado.
   */
  handleSelection(service: Service): void {
    this.onServiceSelect.emit(service);
  }

  /**
   * Alterna la visibilidad de las categorías adicionales (Acordeón "Ver más").
   */
  toggleViewMore(): void {
    this.showAll = !this.showAll;
  }
}