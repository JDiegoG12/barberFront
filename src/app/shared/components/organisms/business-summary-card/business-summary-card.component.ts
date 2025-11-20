import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../../core/models/views/service.view.model';
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

@Component({
  selector: 'app-business-summary-card',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent],
  templateUrl: './business-summary-card.component.html',
  styleUrl: './business-summary-card.component.scss'
})
export class BusinessSummaryCardComponent {
  @Input() selectedService: Service | null = null;
  
  // Este evento le avisará al padre (Home) que pulsaron "Reservar"
  // El padre decidirá si abre el modal (invitado) o va al checkout (cliente)
  @Output() onReserveClick = new EventEmitter<void>();

  handleReserve(): void {
    this.onReserveClick.emit();
  }
}