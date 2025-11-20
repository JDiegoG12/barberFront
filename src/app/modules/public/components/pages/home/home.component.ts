import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Importamos la plantilla y los organismos
import { PublicTemplateComponent } from '../../templates/public-template/public-template.component';
import { ServicesListComponent } from '../../../../../shared/components/organisms/services-list/services-list.component';
import { BarbersListComponent } from '../../../../../shared/components/organisms/barbers-list/barbers-list.component';
import { InfoSectionComponent } from '../../../../../shared/components/organisms/info-section/info-section.component';
import { BusinessSummaryCardComponent } from '../../../../../shared/components/organisms/business-summary-card/business-summary-card.component';
import { ModalAlertComponent } from '../../../../../shared/components/molecules/modal-alert/modal-alert.component';
import { HeroSectionComponent } from '../../../../../shared/components/organisms/hero-section/hero-section.component';
// Modelos
import { Service } from '../../../../../core/models/views/service.view.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    PublicTemplateComponent,
    ServicesListComponent,
    BarbersListComponent,
    InfoSectionComponent,
    BusinessSummaryCardComponent,
    ModalAlertComponent,
    HeroSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Estado del servicio seleccionado
  public selectedService: Service | null = null;
  
  // Estado del modal de invitado
  public showGuestModal: boolean = false;

  constructor(private router: Router) {}

  toggleService(service: Service): void {
    if (this.selectedService?.id === service.id) {
      this.selectedService = null;
    } else {
      this.selectedService = service;
    }
  }

  /**
   * Se ejecuta al dar click en "Reservar".
   * Lógica Actual: Simula comportamiento de Invitado -> Muestra Modal.
   * Lógica Futura: Verificará Auth y decidirá si mostrar modal o ir a pagar.
   */
  handleReservationAttempt(): void {
    this.showGuestModal = true;
  }

  /**
   * Acción al confirmar en el modal
   */
  redirectToLogin(): void {
    this.showGuestModal = false;
    console.log('Redirigiendo al login...');
    // this.router.navigate(['/login']); // Descomentar cuando exista la ruta
  }
}