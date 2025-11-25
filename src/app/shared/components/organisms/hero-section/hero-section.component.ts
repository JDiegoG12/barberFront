import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

/**
 * Componente organismo que representa la sección "Hero" o banner principal de la página.
 * Es el primer elemento visual que ve el usuario, diseñado para captar la atención con imágenes
 * de alto impacto y un llamado a la acción (CTA) claro.
 */
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {

  /**
   * Maneja la acción del botón principal ("Reservar Cita" o similar).
   * Realiza un desplazamiento suave (smooth scroll) hacia la sección de lista de servicios
   * identificada por el ID 'seccion-servicios', facilitando el inicio del flujo de compra.
   */
  scrollToServices() {
    const servicesSection = document.getElementById('seccion-servicios');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}