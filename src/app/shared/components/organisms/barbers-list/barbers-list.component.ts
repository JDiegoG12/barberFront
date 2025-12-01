import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, tap } from 'rxjs';

import { Barber } from '../../../../core/models/views/barber.view.model';
import { BarberService } from '../../../../core/services/api/barber.service';
import { SectionTitleComponent } from '../../atoms/section-title/section-title.component';
import { BarberCardComponent } from '../../molecules/barber-card/barber-card.component';

@Component({
  selector: 'app-barbers-list',
  standalone: true,
  imports: [CommonModule, SectionTitleComponent, BarberCardComponent],
  templateUrl: './barbers-list.component.html',
  styleUrl: './barbers-list.component.scss'
})
export class BarbersListComponent implements OnInit, AfterViewInit {
  private barberService = inject(BarberService);
  public barbers$!: Observable<Barber[]>;

  @ViewChild('carouselContainer') carousel!: ElementRef;

  // Variables de estado para las flechas
  public canScrollLeft: boolean = false;
  public canScrollRight: boolean = true; // Asumimos true al inicio hasta verificar

  ngOnInit(): void {
    this.barbers$ = this.barberService.getBarbers().pipe(
      map(barbers => {
        return [...barbers].sort((a, b) => {
          const aAvailable = a.availabilityStatus === 'Disponible';
          const bAvailable = b.availabilityStatus === 'Disponible';
          if (aAvailable === bAvailable) return 0;
          return aAvailable ? -1 : 1;
        });
      }),
      // TAP: Efecto secundario. Cuando lleguen los datos, esperamos un 'tick'
      // a que el HTML se renderice y entonces verificamos si hacen falta flechas.
      tap(() => {
        setTimeout(() => this.checkScroll(), 100);
      })
    );
  }

  ngAfterViewInit(): void {
    // Verificamos al iniciar el componente (por si acaso)
    this.checkScroll();
  }

  scrollLeft(): void {
    const container = this.carousel.nativeElement;
    container.scrollBy({ left: -360, behavior: 'smooth' });
    // No llamamos a checkScroll aquí inmediatamente porque el scroll es suave (tarda tiempo).
    // El evento (scroll) del HTML se encargará de actualizar las flechas mientras se mueve.
  }

  scrollRight(): void {
    const container = this.carousel.nativeElement;
    container.scrollBy({ left: 360, behavior: 'smooth' });
  }

  /**
   * Método cerebro: Calcula si las flechas deben verse
   * Se ejecuta cada vez que el usuario hace scroll o cambia el tamaño de ventana
   */
  checkScroll(): void {
    if (!this.carousel) return; // Seguridad por si el ViewChild no está listo

    const el = this.carousel.nativeElement;

    // 1. Margen de tolerancia (1px) para evitar errores de redondeo en navegadores
    const tolerance = 1;

    // 2. ¿Podemos ir a la izquierda?
    this.canScrollLeft = el.scrollLeft > 10;

    // 3. ¿Podemos ir a la derecha?
    // Si lo que he scrolleado + lo que veo es menor al tamaño total, aun queda camino.
    this.canScrollRight = (el.scrollLeft + el.clientWidth) < (el.scrollWidth - tolerance);
  }
}