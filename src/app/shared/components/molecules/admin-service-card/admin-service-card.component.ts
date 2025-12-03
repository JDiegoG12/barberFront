import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../../core/models/views/service.view.model';
import { DurationPipe } from '../../../pipes/duration.pipe'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-admin-service-card',
  standalone: true,
  imports: [CommonModule, DurationPipe],
  templateUrl: './admin-service-card.component.html',
  styleUrl: './admin-service-card.component.scss'
})
export class AdminServiceCardComponent {
  
  /** Datos del servicio a renderizar */
  @Input({ required: true }) service!: Service;

  /** Evento: Click en Editar */
  @Output() onEdit = new EventEmitter<Service>();

  /** Evento: Click en Asignar Barberos */
  @Output() onAssign = new EventEmitter<Service>();

  /** Evento: Click en Eliminar */
  @Output() onDelete = new EventEmitter<Service>();
}