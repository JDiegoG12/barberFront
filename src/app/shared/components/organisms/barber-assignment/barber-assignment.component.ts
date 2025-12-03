import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes
import { AvatarSelectionCardComponent } from '../../molecules/avatar-selection-card/avatar-selection-card.component';
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';

// Servicios y Modelos
import { BarberService } from '../../../../core/services/api/barber.service';
import { ServiceService } from '../../../../core/services/api/service.service';
import { Barber } from '../../../../core/models/views/barber.view.model';
import { AssignBarbersRequestDTO } from '../../../../core/models/dto/service-request.dto';

@Component({
  selector: 'app-barber-assignment',
  standalone: true,
  imports: [CommonModule, AvatarSelectionCardComponent, PrimaryButtonComponent],
  templateUrl: './barber-assignment.component.html',
  styleUrl: './barber-assignment.component.scss'
})
export class BarberAssignmentComponent implements OnInit {
  private barberService = inject(BarberService);
  private serviceService = inject(ServiceService);

  /** ID del servicio al que vamos a asignar barberos */
  @Input({ required: true }) serviceId!: number;

  /** Emite cuando se guardan los cambios exitosamente */
  @Output() onSave = new EventEmitter<AssignBarbersRequestDTO>();
  
  /** Emite para cancelar y cerrar el modal */
  @Output() onCancel = new EventEmitter<void>();

  public allBarbers: Barber[] = [];
  public isLoading: boolean = true;
  
  // Usamos un Set para manejo eficiente de IDs seleccionados
  public selectedBarberIds: Set<string> = new Set();

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // 1. Obtener TODOS los barberos (Mock)
    this.barberService.getBarbers().subscribe({
      next: (barbers) => {
        this.allBarbers = barbers;
        
        // 2. Obtener los YA ASIGNADOS a este servicio (API Real)
        this.serviceService.getBarbersByServiceId(this.serviceId).subscribe({
          next: (assignedIds) => {
            // Inicializamos el Set con los IDs que vienen del backend
            this.selectedBarberIds = new Set(assignedIds);
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error cargando asignaciones', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error cargando barberos', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Maneja el clic en una tarjeta: selecciona o deselecciona
   */
  toggleSelection(barberId: string): void {
    if (this.selectedBarberIds.has(barberId)) {
      this.selectedBarberIds.delete(barberId);
    } else {
      this.selectedBarberIds.add(barberId);
    }
  }

  submit(): void {
    // Convertimos el Set a Array para el DTO
    const dto: AssignBarbersRequestDTO = {
      barberIds: Array.from(this.selectedBarberIds)
    };
    
    this.onSave.emit(dto);
  }
}