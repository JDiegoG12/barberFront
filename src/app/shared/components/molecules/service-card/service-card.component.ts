import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../../core/models/views/service.view.model';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';
import { DurationPipe } from '../../../pipes/duration.pipe'; 

/**
 * Componente molecular que representa la tarjeta de un servicio individual.
 * Muestra la información detallada (nombre, descripción, precio, duración) y gestiona
 * la interacción de selección. Integra el botón de acción y utiliza pipes para el formateo de datos.
 */
@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, DurationPipe], 
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  /**
   * Objeto con los datos del servicio a renderizar.
   * Es obligatorio para el correcto funcionamiento de la tarjeta.
   */
  @Input({ required: true }) service!: Service;

  /**
   * Estado de selección actual de la tarjeta.
   * Si es `true`, la tarjeta cambia su estilo visual (bordes, fondo) para indicar que está activa.
   * @default false
   */
  @Input() isSelected: boolean = false;

  /**
   * Evento que se emite cuando el usuario intenta seleccionar o deseleccionar el servicio.
   * Este evento solo se dispara si el servicio está disponible.
   */
  @Output() toggleSelection = new EventEmitter<void>();

  /**
   * Propiedad computada que verifica si el servicio está habilitado para reservas.
   * Se basa en la propiedad `availabilityStatus` del modelo.
   * Utilizada para aplicar estilos de "deshabilitado" y bloquear interacciones.
   */
  get isAvailable(): boolean {
    return this.service.availabilityStatus === 'Disponible';
  }

  /**
   * Manejador del evento de clic en la tarjeta o en el botón de acción.
   * Valida la disponibilidad antes de propagar la intención de selección al componente padre.
   */
  onToggle(): void {
    if (this.isAvailable) {
      this.toggleSelection.emit();
    }
  }
}