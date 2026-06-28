import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal } from '@angular/core';

import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

/**
 * Componente organismo que representa la sección "Hero" o banner principal de la página.
 * Es el primer elemento visual que ve el usuario, diseñado para captar la atención con imágenes
 * de alto impacto y un llamado a la acción (CTA) claro.
 */
@Component({
    selector: 'app-hero-section',
    imports: [PrimaryButtonComponent],
    templateUrl: './hero-section.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements OnInit, OnDestroy {

  /**
   * Desplazamiento vertical (en px) aplicado a la imagen de fondo para crear el
   * efecto parallax sutil. Se actualiza en cada evento de scroll y se enlaza a una
   * variable CSS (`--parallax-y`) sobre la capa de fondo.
   */
  readonly parallaxOffset = signal<number>(0);

  /** Factor de parallax: la imagen se desplaza a una fracción de la velocidad del scroll. */
  private readonly parallaxFactor = 0.35;

  /** Si el usuario prefiere menos movimiento, desactivamos el parallax por completo. */
  private prefersReducedMotion = false;

  /** Listener de scroll (passive) para mover el fondo; se remueve al destruir el componente. */
  private readonly onScroll = () => {
    // Solo aplica parallax mientras el hero sigue (parcialmente) visible.
    const offset = Math.min(window.scrollY, window.innerHeight) * this.parallaxFactor;
    if (offset !== this.parallaxOffset()) {
      this.parallaxOffset.set(offset);
    }
  };

  ngOnInit(): void {
    this.prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.prefersReducedMotion) {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  /**
   * Maneja la acción del botón principal ("Reservar Cita") y del indicador de scroll.
   * Realiza un desplazamiento suave (smooth scroll) hacia la sección de servicios
   * identificada por el ID 'seccion-servicios', facilitando el inicio del flujo de compra.
   */
  scrollToServices() {
    const servicesSection = document.getElementById('seccion-servicios');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
