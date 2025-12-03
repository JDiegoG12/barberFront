import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Componentes
import { AdminServiceCardComponent } from '../../../../../shared/components/molecules/admin-service-card/admin-service-card.component';
import { PrimaryButtonComponent } from '../../../../../shared/components/atoms/primary-button/primary-button.component';
import { SectionTitleComponent } from '../../../../../shared/components/atoms/section-title/section-title.component';
import { ModalComponent } from '../../../../../shared/components/molecules/modal/modal.component';
import { ServiceFormComponent } from '../../../../../shared/components/organisms/service-form/service-form.component';
import { ModalAlertComponent, AlertType } from '../../../../../shared/components/molecules/modal-alert/modal-alert.component';
import { BarberAssignmentComponent } from '../../../../../shared/components/organisms/barber-assignment/barber-assignment.component';

// Servicios y Modelos
import { ServiceService } from '../../../../../core/services/api/service.service';
import { Service } from '../../../../../core/models/views/service.view.model';
import { Category } from '../../../../../core/models/views/category.view.model';
import { CreateServiceRequestDTO, UpdateServiceRequestDTO, AssignBarbersRequestDTO } from '../../../../../core/models/dto/service-request.dto';
import { BackendError } from '../../../../../core/models/backend-error.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminServiceCardComponent,
    PrimaryButtonComponent,
    SectionTitleComponent,
    ModalComponent,
    ServiceFormComponent,
    ModalAlertComponent,
    BarberAssignmentComponent
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  private serviceService = inject(ServiceService);

  public services: Service[] = [];
  public filteredServices: Service[] = [];
  public categories: Category[] = [];
  public isLoading: boolean = true;

  // Filtros
  public searchTerm: string = '';
  public selectedCategoryId: number | 'all' = 'all';
  public selectedAvailability: string = 'all';

  // --- MODALES DE GESTIÓN ---
  public isCreateModalOpen: boolean = false;
  
  // Nuevas variables para Edición
  public isEditModalOpen: boolean = false;
  public serviceToEdit: Service | null = null;

  // NUEVO: Modal de Asignación
  public isAssignModalOpen: boolean = false;
  
  // Referencia al servicio que se está editando o asignando
  public serviceToAssign: Service | null = null; // Variable específica para asignación

  // --- GESTIÓN DE ALERTAS ---
  public alertConfig = {
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as AlertType,
    isConfirmation: false,
    confirmLabel: 'Aceptar',
    cancelLabel: 'Cancelar'
  };

  private pendingAction: 'delete' | 'cancelCreate' | 'cancelEdit' | null = null; // Agregamos cancelEdit
  private tempServiceIdToDelete: number | null = null;

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.serviceService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.serviceService.getServices(false).subscribe({
          next: (data) => {
            this.services = data;
            this.applyFilters();
            this.isLoading = false;
          },
          error: () => this.isLoading = false
        });
      }
    });
  }

  applyFilters(): void {
    this.filteredServices = this.services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategoryId === 'all' || service.categoryId == this.selectedCategoryId;
      const matchesAvailability = this.selectedAvailability === 'all' || service.availabilityStatus === this.selectedAvailability;
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }

  // ==========================================
  // LÓGICA DE ALERTAS
  // ==========================================

  private showAlert(title: string, message: string, type: AlertType, isConfirmation: boolean = false): void {
    this.alertConfig = {
      isOpen: true, title, message, type, isConfirmation,
      confirmLabel: isConfirmation ? 'Sí, continuar' : 'Aceptar',
      cancelLabel: 'Cancelar'
    };
  }

  handleAlertConfirm(): void {
    if (this.pendingAction === 'delete' && this.tempServiceIdToDelete) {
      this.executeDelete(this.tempServiceIdToDelete);
    }
    if (this.pendingAction === 'cancelCreate') {
      this.isCreateModalOpen = false;
    }
    // Confirmar cancelación de edición
    if (this.pendingAction === 'cancelEdit') {
      this.isEditModalOpen = false;
      this.serviceToEdit = null;
    }
    this.closeAlert();
  }

  closeAlert(): void {
    this.alertConfig.isOpen = false;
    this.pendingAction = null;
    this.tempServiceIdToDelete = null;
  }

  // ==========================================
  // CREACIÓN
  // ==========================================

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  handleCreateService(dto: CreateServiceRequestDTO | UpdateServiceRequestDTO): void {
    // TypeScript guard: asegurar que es CreateDTO (aunque por contexto lo sabemos)
    const createDto = dto as CreateServiceRequestDTO;

    this.serviceService.createService(createDto).subscribe({
      next: (newService) => {
        this.services.push(newService);
        this.applyFilters();
        this.isCreateModalOpen = false;
        this.showAlert('¡Servicio Creado!', 'El servicio se ha registrado correctamente.', 'success');
      },
      error: (err: HttpErrorResponse) => this.handleBackendError(err, 'Error al Crear')
    });
  }

  requestCancelCreate(): void {
    this.pendingAction = 'cancelCreate';
    this.showAlert('¿Cancelar registro?', 'Se perderán los datos ingresados.', 'warning', true);
  }

  // ==========================================
  // EDICIÓN (NUEVO)
  // ==========================================

  handleEdit(service: Service): void {
    // Clonamos el servicio para no modificar la referencia en la lista mientras editamos
    this.serviceToEdit = { ...service };
    this.isEditModalOpen = true;
  }

  handleUpdateService(dto: CreateServiceRequestDTO | UpdateServiceRequestDTO): void {
    if (!this.serviceToEdit) return;

    const updateDto = dto as UpdateServiceRequestDTO;

    this.serviceService.updateService(this.serviceToEdit.id, updateDto).subscribe({
      next: (updatedService) => {
        // Actualizamos el servicio en la lista local
        const index = this.services.findIndex(s => s.id === updatedService.id);
        if (index !== -1) {
          this.services[index] = updatedService;
        }
        
        this.applyFilters();
        this.isEditModalOpen = false;
        this.serviceToEdit = null;

        this.showAlert('Actualización Exitosa', 'El servicio ha sido modificado correctamente.', 'success');
      },
      error: (err: HttpErrorResponse) => this.handleBackendError(err, 'No se pudo actualizar')
    });
  }

  requestCancelEdit(): void {
    this.pendingAction = 'cancelEdit';
    this.showAlert('¿Descartar cambios?', 'Se perderán las modificaciones realizadas.', 'warning', true);
  }

  // ==========================================
  // ELIMINACIÓN Y ASIGNACIÓN
  // ==========================================

  // ==========================================
  // ASIGNACIÓN DE BARBEROS (IMPLEMENTADO)
  // ==========================================

  handleAssign(service: Service): void {
    this.serviceToAssign = service;
    this.isAssignModalOpen = true;
  }

  handleSaveAssignment(dto: AssignBarbersRequestDTO): void {
    if (!this.serviceToAssign) return;

    this.serviceService.assignBarbers(this.serviceToAssign.id, dto).subscribe({
      next: (updatedService) => {
        // Actualizamos la lista local (Esto actualizará el estado "Disponible/No Disponible" visualmente)
        const index = this.services.findIndex(s => s.id === updatedService.id);
        if (index !== -1) {
          this.services[index] = updatedService;
        }
        this.applyFilters();

        // Cerramos modal y mostramos éxito
        this.isAssignModalOpen = false;
        this.serviceToAssign = null;
        
        this.showAlert(
          'Asignación Exitosa', 
          'Se han actualizado los barberos del servicio.', 
          'success'
        );
      },
      error: (err: HttpErrorResponse) => this.handleBackendError(err, 'Error al asignar')
    });
  }

  handleDelete(service: Service): void {
    this.pendingAction = 'delete';
    this.tempServiceIdToDelete = service.id;
    this.showAlert('¿Eliminar Servicio?', `Estás a punto de eliminar "${service.name}".`, 'error', true);
  }

  private executeDelete(id: number): void {
    this.serviceService.deleteService(id).subscribe({
      next: () => {
        this.services = this.services.filter(s => s.id !== id);
        this.applyFilters();
        setTimeout(() => this.showAlert('Eliminado', 'Servicio eliminado correctamente.', 'success'), 300);
      },
      error: (err: HttpErrorResponse) => {
        setTimeout(() => this.handleBackendError(err, 'No se pudo eliminar'), 300);
      }
    });
  }

  // --- Helper para errores ---
  private handleBackendError(err: HttpErrorResponse, title: string): void {
    console.error('Backend Error:', err);
    let msg = 'Ocurrió un error inesperado. Intenta nuevamente.';
    
    if (err.error && (err.error as BackendError).mensaje) {
      msg = (err.error as BackendError).mensaje;
    }
    
    this.showAlert(title, msg, 'error');
  }
}