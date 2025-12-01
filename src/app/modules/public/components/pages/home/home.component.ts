import { Component, OnInit, inject } from '@angular/core';
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
import { AuthService } from '../../../../../core/services/auth.service';

/**
 * Componente de página principal (Landing Page) para la vista pública de la aplicación.
 * Actúa como el controlador de la experiencia del usuario invitado (no autenticado),
 * integrando las secciones de Hero, Servicios, Barberos e Información de contacto.
 * Gestiona la interacción inicial de selección de servicios y restringe el acceso
 * al flujo de reserva mediante un modal de inicio de sesión.
 */
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
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);

  /**
   * Almacena el servicio que el usuario ha seleccionado de la lista pública.
   * Utilizado para mostrar el resumen en la tarjeta lateral y validar la intención de reserva.
   */
  public selectedService: Service | null = null;
  
  /**
   * Bandera que controla la visibilidad del modal de "Inicio de Sesión Requerido".
   * Se activa cuando un invitado intenta proceder con una reserva.
   */
  public showGuestModal: boolean = false;

  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    const user = await this.authService.getUserProfile();
    if (user) {
      this.authService.navigateToDashboard(user.role);
    }
  }

  /**
   * Gestiona la lógica de selección y deselección de servicios.
   * Si el usuario hace clic en el servicio que ya estaba activo, lo deselecciona.
   * De lo contrario, actualiza el estado con el nuevo servicio.
   *
   * @param service - El objeto de servicio interactuado.
   */
  toggleService(service: Service): void {
    if (this.selectedService?.id === service.id) {
      this.selectedService = null;
    } else {
      this.selectedService = service;
    }
  }

  /**
   * Maneja el evento de clic en el botón "Reservar" de la tarjeta de resumen.
   * En el contexto de usuario invitado, este método intercepta el flujo para
   * mostrar el modal que solicita autenticación antes de continuar.
   */
  handleReservationAttempt(): void {
    this.showGuestModal = true;
  }

  /**
   * Ejecuta la redirección hacia la página de inicio de sesión.
   * Se invoca cuando el usuario confirma en el modal que desea autenticarse
   * para proceder con la reserva.
   */
  redirectToLogin(): void {
    this.showGuestModal = false;
    this.authService.login();
  }
}