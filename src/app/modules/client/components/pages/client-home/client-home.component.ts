import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 1. Importamos Router

// Reutilizamos los organismos existentes
import { HeroSectionComponent } from '../../../../../shared/components/organisms/hero-section/hero-section.component';
import { ServicesListComponent } from '../../../../../shared/components/organisms/services-list/services-list.component';
import { BarbersListComponent } from '../../../../../shared/components/organisms/barbers-list/barbers-list.component';
import { InfoSectionComponent } from '../../../../../shared/components/organisms/info-section/info-section.component';
import { BusinessSummaryCardComponent } from '../../../../../shared/components/organisms/business-summary-card/business-summary-card.component';

import { Service } from '../../../../../core/models/views/service.view.model';

/**
 * Componente de página principal para el módulo de Cliente.
 * Representa la vista de inicio (Landing) personalizada para un usuario autenticado.
 * Integra múltiples organismos (Hero, Listas de Servicios/Barberos, Info) y gestiona
 * la selección inicial de servicios antes de proceder al flujo de reserva.
 */
@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    ServicesListComponent,
    BarbersListComponent,
    InfoSectionComponent,
    BusinessSummaryCardComponent
  ],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.scss'
})
export class ClientHomeComponent {
  /**
   * Almacena la referencia al servicio que el usuario ha seleccionado de la lista.
   * Si es `null`, significa que no hay ningún servicio seleccionado actualmente.
   */
  public selectedService: Service | null = null;

  /**
   * Inicializa el componente e inyecta las dependencias necesarias.
   * @param router - Servicio de enrutamiento de Angular utilizado para navegar hacia el Wizard de reserva.
   */
  constructor(private router: Router) {}

  /**
   * Gestiona la lógica de selección única de servicios.
   * Si el usuario hace clic en un servicio que ya estaba seleccionado, lo deselecciona (toggle).
   * Si selecciona uno nuevo, actualiza el estado.
   *
   * @param service - El objeto de servicio sobre el cual se realizó la acción.
   */
  toggleService(service: Service): void {
    if (this.selectedService?.id === service.id) {
      this.selectedService = null;
    } else {
      this.selectedService = service;
    }
  }

  /**
   * Inicia el flujo de reserva (Wizard) navegando a la ruta correspondiente.
   * Se ejecuta cuando el usuario confirma la intención de reservar desde la tarjeta de resumen.
   * Pasa el ID del servicio seleccionado como parámetro de consulta (query param) para pre-cargar el contexto.
   */
  handleReservationFlow(): void {
    if (this.selectedService) {
      // 3. Navegamos a la ruta configurada pasando el parámetro query
      this.router.navigate(['/client/book'], { 
        queryParams: { serviceId: this.selectedService.id } 
      });
    }
  }
}