import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  /**
   * Título que aparecerá en la cabecera del modal.
   */
  @Input() title: string = '';

  /**
   * Controla si el modal es visible o no.
   * Se usa para aplicar clases de animación CSS.
   */
  @Input() isVisible: boolean = false;

  /**
   * Evento que se emite cuando el usuario intenta cerrar el modal
   * (ya sea clic en la X o en el fondo oscuro).
   */
  @Output() onClose = new EventEmitter<void>();

  /**
   * Método interno para emitir el cierre.
   */
  close(): void {
    this.onClose.emit();
  }
}