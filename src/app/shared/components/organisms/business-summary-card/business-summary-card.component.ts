import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../../core/models/views/service.view.model';
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';
import { DurationPipe } from '../../../pipes/duration.pipe'; //  PIPE

/**
 * Componente organismo que muestra el resumen del negocio y el estado de la selección actual.
 *
 * Este componente actúa como un panel lateral (Sticky en escritorio, Barra inferior en móvil) en la página de inicio.
 * Su función principal es mostrar la identidad del negocio y servir como punto de entrada
 * para iniciar el flujo de reserva cuando el usuario selecciona un servicio.
 */
@Component({
  selector: 'app-business-summary-card',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent, DurationPipe],
  templateUrl: './business-summary-card.component.html',
  styleUrl: './business-summary-card.component.scss'
})
export class BusinessSummaryCardComponent {
  /**
   * El servicio que el usuario ha seleccionado en la lista principal.
   * - Si es `null`, el componente muestra un estado de instrucción ("Elige un servicio").
   * - Si tiene valor, muestra los detalles del servicio y habilita el botón de reserva.
   */
  @Input() selectedService: Service | null = null;
  
  /**
   * Evento que se emite cuando el usuario hace clic en el botón "Reservar".
   * El componente padre (Home) captura este evento para decidir si abrir el modal de login (Invitado)
   * o navegar al Wizard de reserva (Cliente).
   */
  @Output() onReserveClick = new EventEmitter<void>();

  /**
   * Manejador del clic en el botón de acción principal.
   * Propaga la intención del usuario al componente padre.
   */
  handleReserve(): void {
    this.onReserveClick.emit();
  }

  /**
   * Ejecuta un desplazamiento suave (smooth scroll) hacia la sección de información de contacto.
   * Intercepta el comportamiento predeterminado del enlace para evitar cambios en la ruta de Angular,
   * garantizando que el usuario permanezca en la misma vista (Pública o Cliente).
   *
   * @param event - El evento nativo del DOM (clic).
   */
  scrollToContact(event: Event): void {
    event.preventDefault(); // Previene que el link cambie la URL
    const contactSection = document.getElementById('seccion-contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}