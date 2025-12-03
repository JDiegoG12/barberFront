import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// Componentes
import { AvatarSelectionCardComponent } from '../../molecules/avatar-selection-card/avatar-selection-card.component'; // Se usará para los servicios (se necesita adaptar o usar otra cosa)
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

// Servicios y Modelos
import { ServiceService } from '../../../../core/services/api/service.service';
import { BarberService } from '../../../../core/services/api/barber.service';
import { Service } from '../../../../core/models/views/service.view.model';
import { Barber } from '../../../../core/models/views/barber.view.model';
import { AssignServicesToBarberRequestDTO } from '../../../../core/models/dto/barber-request.dto'; // DTO para la petición de asignación

@Component({
  selector: 'app-barber-service-assignment',
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent, AvatarSelectionCardComponent], // AvatarSelectionCard solo si se adapta para mostrar Servicios
  templateUrl: './barber-service-assignment.component.html',
  styleUrl: './barber-service-assignment.component.scss'
})
export class BarberServiceAssignmentComponent implements OnInit {
  private serviceService = inject(ServiceService);
  private barberService = inject(BarberService);

  /** ID del barbero al que vamos a asignar servicios */
  @Input({ required: true }) barberId!: string;

  /** Lista actual de IDs de servicios que el barbero ya tiene asignados */
  @Input() currentServiceIds: number[] = [];

  /** Emite cuando se guardan los cambios exitosamente (devuelve la lista de servicios asignados) */
  @Output() onSave = new EventEmitter<Service[]>();
  
  /** Emite para cancelar y cerrar el modal */
  @Output() onCancel = new EventEmitter<void>();

  public allServices: Service[] = [];
  public isLoading: boolean = true;
  public isSubmitting: boolean = false;
  
  // Set para manejar el estado de selección de forma eficiente
  public selectedServiceIds: Set<number> = new Set();

  ngOnInit(): void {
    this.loadData();
    // Inicializar el Set con los servicios que ya tiene
    this.selectedServiceIds = new Set(this.currentServiceIds);
  }

  loadData(): void {
    this.isLoading = true;

    // 1. Obtener TODOS los servicios (solo activos, si es posible)
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.allServices = services.filter(s => s.systemStatus === 'Activo'); // Filtrar solo servicios activos
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando servicios:', err);
        this.isLoading = false;
        // Manejo de errores adicional si es necesario
      }
    });
  }

  /**
   * Maneja el clic en una tarjeta: selecciona o deselecciona un servicio
   */
  toggleSelection(serviceId: number): void {
    if (this.selectedServiceIds.has(serviceId)) {
      this.selectedServiceIds.delete(serviceId);
    } else {
      this.selectedServiceIds.add(serviceId);
    }
  }

  /**
   * Envía la lista de IDs de servicios seleccionados al backend.
   */
  saveAssignment(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    
    // Convertir el Set de vuelta a un array para el DTO
    const requestDto: AssignServicesToBarberRequestDTO = {
      serviceIds: Array.from(this.selectedServiceIds)
    };

    // Llamada al servicio para asignar/reemplazar la lista de servicios
    // ASUMO que BarberService tiene un método 'assignServices'
    this.barberService.assignServicesBulk(this.barberId, requestDto).subscribe({
      next: (updatedServices) => {
        this.isSubmitting = false;
        // Emitimos la lista de servicios actualizada que resulta de la operación
        this.onSave.emit(updatedServices);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        console.error('Error al guardar la asignación de servicios:', err);
        alert(`Error al guardar: ${err.error?.message || err.message}`);
      }
    });
  }
}