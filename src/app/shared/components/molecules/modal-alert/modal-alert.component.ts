import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-modal-alert',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent],
  templateUrl: './modal-alert.component.html',
  styleUrl: './modal-alert.component.scss'
})
export class ModalAlertComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  
  /** 
   * Define el estilo visual y el icono del modal.
   * - success: Operación exitosa (Verde)
   * - error: Algo salió mal (Rojo)
   * - warning: Advertencia o confirmación de riesgo (Amarillo)
   * - info: Información neutral (Color primario)
   */
  @Input() type: AlertType = 'info';

  /**
   * Si es true, muestra el botón de cancelar.
   * Si es false, solo muestra el botón de confirmar (estilo "Aceptar").
   */
  @Input() isConfirmation: boolean = false;

  @Input() confirmLabel: string = 'Aceptar';
  @Input() cancelLabel: string = 'Cancelar';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}