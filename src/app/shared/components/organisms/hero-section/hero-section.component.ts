import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {

  scrollToServices() {
    const servicesSection = document.getElementById('seccion-servicios');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}