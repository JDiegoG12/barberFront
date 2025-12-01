import { 
  Component, 
  OnInit, 
  inject, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChildren, 
  QueryList, 
  ElementRef, 
  AfterViewInit 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map, tap } from 'rxjs';

// Componentes
import { ServiceCardComponent } from '../../molecules/service-card/service-card.component';
import { SectionTitleComponent } from '../../atoms/section-title/section-title.component';

// Servicios y Modelos
import { ServiceService } from '../../../../core/services/api/service.service';
import { Service } from '../../../../core/models/views/service.view.model';
import { Category } from '../../../../core/models/views/category.view.model';

interface CategoryGroup {
  category: Category;
  services: Service[];
}

/**
 * Estado de las flechas de navegación para una categoría específica.
 */
interface ArrowState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, SectionTitleComponent],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit, AfterViewInit {
  private serviceService = inject(ServiceService);

  public groupedServices$!: Observable<CategoryGroup[]>;

  @Input() selectedService: Service | null = null;
  @Output() onServiceSelect = new EventEmitter<Service>();

  public showAll: boolean = false;
  public readonly INITIAL_LIMIT: number = 3;

  /**
   * Referencia a TODOS los carruseles renderizados en el DOM.
   * Angular los agrupará en una lista iterable.
   */
  @ViewChildren('carouselRef') carousels!: QueryList<ElementRef>;

  /**
   * Diccionario para controlar la visibilidad de flechas por categoría.
   * Clave: Category ID (number) -> Valor: ArrowState
   */
  public arrowState: { [key: number]: ArrowState | undefined } = {};

  ngOnInit(): void {
    this.groupedServices$ = combineLatest([
      this.serviceService.getCategories(),
      this.serviceService.getServices() 
    ]).pipe(
      map(([categories, services]) => {
        return categories.map(category => {
          const categoryServices = services.filter(s => s.categoryId === category.id);
          
          categoryServices.sort((a, b) => {
            const aAvailable = a.availabilityStatus === 'Disponible';
            const bAvailable = b.availabilityStatus === 'Disponible';
            if (aAvailable === bAvailable) return 0;
            return aAvailable ? -1 : 1;
          });

          // Inicializamos el estado de las flechas para esta categoría
          // Por defecto: Izquierda oculta, Derecha visible (se corregirá en el checkScroll)
          this.arrowState[category.id] = { canScrollLeft: false, canScrollRight: true };

          return {
            category: category,
            services: categoryServices
          };
        }).filter(group => group.services.length > 0);
      }),
      // Una vez cargados los datos, esperamos un ciclo para verificar flechas
      tap(() => setTimeout(() => this.checkAllScrolls(), 200))
    );
  }

  ngAfterViewInit(): void {
    // Nos suscribimos a cambios en la lista de carruseles (por si se expande el "Ver más")
    this.carousels.changes.subscribe(() => {
      this.checkAllScrolls();
    });
  }

  handleSelection(service: Service): void {
    this.onServiceSelect.emit(service);
  }

  toggleViewMore(): void {
    this.showAll = !this.showAll;
    // Al expandir, damos tiempo a la animación CSS antes de calcular
    setTimeout(() => this.checkAllScrolls(), 600); 
  }

  // ==========================================
  // LÓGICA DE CARROUSEL INTELIGENTE
  // ==========================================

  /**
   * Mueve el scroll de una categoría específica.
   * @param categoryId ID de la categoría (para buscar el elemento).
   * @param direction -1 para izquierda, 1 para derecha.
   */
  scroll(categoryId: number, direction: number): void {
    // Buscamos el elemento nativo del carrusel correspondiente
    // Nota: Usamos dataset.id en el HTML para vincularlo
    const carouselEl = this.getCarouselElementById(categoryId);
    
    if (carouselEl) {
      const scrollAmount = 300; // Ancho aproximado de una tarjeta + gap
      carouselEl.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
      // El evento (scroll) del HTML actualizará el estado
    }
  }

  /**
   * Verifica el estado del scroll para UNA categoría específica.
   * Se llama desde el evento (scroll) en el HTML.
   */
  checkScroll(categoryId: number, element: HTMLElement): void {
    const tolerance = 10;
    const canLeft = element.scrollLeft > tolerance;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const canRight = element.scrollLeft < (maxScroll - tolerance);

    // Actualizamos el objeto de estado para esa categoría
    // Usamos spread operator para forzar detección de cambios si fuera necesario
    this.arrowState[categoryId] = {
      canScrollLeft: canLeft,
      canScrollRight: canRight
    };
  }

  /**
   * Itera sobre todos los carruseles visibles y actualiza sus flechas.
   */
  private checkAllScrolls(): void {
    this.carousels.forEach(item => {
      const el = item.nativeElement as HTMLElement;
      // Obtenemos el ID de categoría que guardaremos en un atributo data-id
      const catId = Number(el.getAttribute('data-id'));
      if (catId) {
        this.checkScroll(catId, el);
      }
    });
  }

  /**
   * Helper para encontrar el elemento DOM de un carrusel dado un ID de categoría.
   */
  private getCarouselElementById(categoryId: number): HTMLElement | undefined {
    return this.carousels.find(item => {
      const el = item.nativeElement as HTMLElement;
      return Number(el.getAttribute('data-id')) === categoryId;
    })?.nativeElement;
  }
}