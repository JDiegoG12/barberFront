import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../../core/models/views/service.view.model';
import { IconButtonComponent } from '../../atoms/icon-button/icon-button.component';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input({ required: true }) service!: Service;
  @Input() isSelected: boolean = false;
  @Output() toggleSelection = new EventEmitter<void>();

  /**
   * Emite el evento al padre cuando se hace clic en la tarjeta o en el botón.
   */
  onToggle(): void {
    this.toggleSelection.emit();
  }
}