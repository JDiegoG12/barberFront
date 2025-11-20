import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

@Component({
  selector: 'app-modal-alert',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent],
  templateUrl: './modal-alert.component.html',
  styleUrl: './modal-alert.component.scss'
})
export class ModalAlertComponent {
  @Input() title: string = 'Atención';
  @Input() message: string = '';
  @Input() confirmLabel: string = 'Aceptar';
  @Input() cancelLabel: string = 'Cancelar';
  
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  // Prevenir que el click en la tarjeta cierre el modal
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}