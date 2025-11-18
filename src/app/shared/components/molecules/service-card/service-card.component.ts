import { Component, Input } from '@angular/core';
import { Service } from '../../../../core/models/views/service.view.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  // 1. Recibimos el objeto de servicio completo.
  // Usamos el decorador 'required' para asegurar que siempre se pase.
  @Input({ required: true }) service!: Service;
}