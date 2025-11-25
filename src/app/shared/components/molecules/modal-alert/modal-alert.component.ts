import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

/**
 * Componente molecular que representa una ventana modal de alerta o confirmación.
 * Se utiliza para interrumpir el flujo del usuario y solicitar una decisión explícita (Confirmar/Cancelar)
 * o mostrar información crítica. Se superpone al contenido actual.
 */
@Component({
  selector: 'app-modal-alert',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent],
  templateUrl: './modal-alert.component.html',
  styleUrl: './modal-alert.component.scss'
})
export class ModalAlertComponent {
  /**
   * Título principal del modal.
   * @default 'Atención'
   */
  @Input() title: string = 'Atención';

  /**
   * Cuerpo del mensaje que explica la acción o alerta al usuario.
   */
  @Input() message: string = '';

  /**
   * Texto para el botón de acción principal (positivo/confirmación).
   * @default 'Aceptar'
   */
  @Input() confirmLabel: string = 'Aceptar';

  /**
   * Texto para el botón de acción secundaria (negativo/cancelación).
   * @default 'Cancelar'
   */
  @Input() cancelLabel: string = 'Cancelar';
  
  /**
   * Evento que se emite cuando el usuario hace clic en el botón de confirmación.
   */
  @Output() onConfirm = new EventEmitter<void>();

  /**
   * Evento que se emite cuando el usuario hace clic en cancelar o en el fondo oscuro (backdrop).
   */
  @Output() onCancel = new EventEmitter<void>();

  /**
   * Detiene la propagación del evento de clic.
   * Se utiliza en el contenedor de la tarjeta del modal para evitar que los clics dentro del contenido
   * se propaguen hacia el fondo (backdrop) y cierren el modal accidentalmente.
   *
   * @param event - El evento nativo del DOM.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}