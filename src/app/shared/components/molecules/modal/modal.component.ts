import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';


@Component({
    selector: 'app-modal',
    imports: [A11yModule],
    templateUrl: './modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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
   * Cierra el modal al pulsar la tecla Escape (solo si está visible).
   */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isVisible) {
      this.close();
    }
  }

  /**
   * Método interno para emitir el cierre.
   */
  close(): void {
    this.onClose.emit();
  }
}