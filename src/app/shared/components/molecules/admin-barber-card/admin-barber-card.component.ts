import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa el modelo de vista Barber que definimos anteriormente
import { Barber, BarberAvailabilityStatus, BarberSystemStatus } from '../../../../core/models/views/barber.view.model'; 

@Component({
  selector: 'app-admin-barber-card',
  standalone: true,
  imports: [CommonModule],
  // Nota: Deberías crear un archivo CSS o SCSS específico para este componente
  templateUrl: './admin-barber-card.component.html',
  styleUrl: './admin-barber-card.component.scss' // Asumiendo que usarás SCSS
})
export class AdminBarberCardComponent {
  
  /** Datos del barbero a renderizar */
  @Input({ required: true }) barber!: Barber;

  /** Evento: Click en Editar */
  @Output() onEdit = new EventEmitter<Barber>();

  /** Evento: Click en Asignar Servicios */
  @Output() onAssign = new EventEmitter<Barber>();

  /** Evento: Click en Eliminar (Baja lógica) */
  @Output() onDelete = new EventEmitter<Barber>();

  // Helper para asignar la clase de disponibilidad
  public getAvailabilityClass(status: BarberAvailabilityStatus): string {
    if (status === 'Disponible') return 'status-available';
    return 'status-unavailable';
  }
}