import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Componentes Reutilizados (Ajusta las rutas de importación si es necesario)
import { PrimaryButtonComponent } from '../../../../../shared/components/atoms/primary-button/primary-button.component';
import { SectionTitleComponent } from '../../../../../shared/components/atoms/section-title/section-title.component';
import { ModalComponent } from '../../../../../shared/components/molecules/modal/modal.component';
import { ModalAlertComponent, AlertType } from '../../../../../shared/components/molecules/modal-alert/modal-alert.component';
// Componentes específicos (Asumo que ya tienes o crearás)
import { BarberFormComponent } from '../../../../../shared/components/organisms/barber-form/barber-form.component'; // Formulario de registro/edición
import { BarberServiceAssignmentComponent } from '../../../../../shared/components/organisms/barber-service-assignment/barber-service-assignment.component'; // Formulario de asignación de servicios
import { AdminBarberCardComponent } from '../../../../../shared/components/molecules/admin-barber-card/admin-barber-card.component'; // Card de vista previa
import { BarberScheduleAssignmentComponent } from '../../../../../shared/components/organisms/barber-schedule-assignment/barber-schedule-assignment.component';
// Servicios y Modelos
import { BarberService } from '../../../../../core/services/api/barber.service'; // Servicio de Barberos
import { Barber, BarberAvailabilityStatus, BarberSystemStatus } from '../../../../../core/models/views/barber.view.model'; // Modelo de vista del Barbero
import { CreateBarberRequestDTO, UpdateBarberRequestDTO, WorkShiftRequestDTO  } from '../../../../../core/models/dto/barber-request.dto'; // DTOs de petición
import { BackendError } from '../../../../../core/models/backend-error.model';

@Component({
  selector: 'app-barbers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrimaryButtonComponent,
    SectionTitleComponent,
    ModalComponent,
    ModalAlertComponent,
    BarberFormComponent,
    BarberServiceAssignmentComponent,
    AdminBarberCardComponent,
    BarberScheduleAssignmentComponent
  ],
  templateUrl: './barbers.component.html',
  styleUrl: './barbers.component.scss'
})
export class BarbersComponent implements OnInit {
  private barberService = inject(BarberService);

  public barbers: Barber[] = [];
  public filteredBarbers: Barber[] = [];
  public isLoading: boolean = true;

  // Filtros
  public searchTerm: string = '';
  public selectedAvailability: string = 'all';
  public selectedSystemStatus: string = 'all'; // Para 'Activo'/'Inactivo'

  // --- MODALES DE GESTIÓN ---
  public isCreateModalOpen: boolean = false;
  
  public isEditModalOpen: boolean = false;
  public barberToEdit: Barber | null = null;

  public isAssignModalOpen: boolean = false;
  public barberToAssign: Barber | null = null;

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

  private pendingAction: 'delete' | 'cancelCreate' | 'cancelEdit' | null = null;
  private tempBarberIdToDelete: string | null = null;

// NUEVAS PROPIEDADES DE ESTADO
  isScheduleModalOpen: boolean = false;
  newlyCreatedBarber: Barber | null = null; // Para almacenar el Barbero recién creado

  ngOnInit(): void {
    this.loadBarbers();
  }

  // ==========================================
  // CARGA Y FILTROS
  // ==========================================

  loadBarbers(): void {
    this.isLoading = true;
    // getBarbers() llama a la API para obtener la lista de barberos
    this.barberService.getBarbers().subscribe({
      next: (data) => {
        this.barbers = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al cargar barberos:', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredBarbers = this.barbers.filter(barber => {
      const matchesSearch = barber.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            barber.lastName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesAvailability = this.selectedAvailability === 'all' || 
                                  barber.availabilityStatus === (this.selectedAvailability as BarberAvailabilityStatus);
      
      const matchesSystemStatus = this.selectedSystemStatus === 'all' ||
                                  barber.systemStatus === (this.selectedSystemStatus as BarberSystemStatus);
                                  
      return matchesSearch && matchesAvailability && matchesSystemStatus;
    });
  }

  // ==========================================
  // LÓGICA DE ALERTAS (Reutilizada de ServicesComponent)
  // ==========================================
  
  private showAlert(title: string, message: string, type: AlertType, isConfirmation: boolean = false): void {
    this.alertConfig = {
      isOpen: true, title, message, type, isConfirmation,
      confirmLabel: isConfirmation ? 'Sí, continuar' : 'Aceptar',
      cancelLabel: 'Cancelar'
    };
  }

  handleAlertConfirm(): void {
    if (this.pendingAction === 'delete' && this.tempBarberIdToDelete) {
      this.executeDelete(this.tempBarberIdToDelete);
    }
    if (this.pendingAction === 'cancelCreate') {
      this.isCreateModalOpen = false;
    }
    if (this.pendingAction === 'cancelEdit') {
      this.isEditModalOpen = false;
      this.barberToEdit = null;
    }
    this.closeAlert();
  }

  closeAlert(): void {
    this.alertConfig.isOpen = false;
    this.pendingAction = null;
    this.tempBarberIdToDelete = null;
  }

  // ==========================================
  // CREACIÓN
  // ==========================================

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  // --- 1. Manejar la Creación del Barbero ---
  handleCreateBarber(request: CreateBarberRequestDTO | FormData): void {
    // Si recibimos FormData, lo casteamos al DTO esperado para satisfacer la firma del servicio.
    // Nota: asegúrate en el backend/servicio de aceptar FormData si realmente lo envías; este cast solo resuelve el error de compilación.
    const payload = (request instanceof FormData) ? (request as unknown as CreateBarberRequestDTO) : request;

    this.barberService.createBarber(payload).subscribe({
      next: (newBarber) => {
        // Éxito: Cerrar modal de creación, almacenar el ID y abrir modal de horario.
        this.newlyCreatedBarber = newBarber;
        this.isCreateModalOpen = false;
        this.isScheduleModalOpen = true; // <--- Abrir modal de horario
        
        // Refrescar lista
        if (newBarber.systemStatus === 'Activo') {
          this.barbers.push(newBarber);
          this.applyFilters();
        }

        this.showAlert(
          'Registro Exitoso', 
          'Barbero creado. ¡Ahora define su horario laboral!', 
          'info'
        );
      },
      error: (err: HttpErrorResponse) => this.handleBackendError(err, 'Error al crear barbero')
    });
  }

  // --- 2. Manejar el Guardado del Horario ---
  handleSaveSchedule(shifts: WorkShiftRequestDTO[]): void {
    // Aquí no se necesita el ID del barbero, ya viene incluido en cada WorkShiftRequestDTO
    this.barberService.saveBarberSchedule(shifts).subscribe({
      next: () => {
        // Éxito: Cerrar el modal de horario y limpiar el estado.
        this.isScheduleModalOpen = false;
        this.newlyCreatedBarber = null;

        this.showAlert(
          'Horario Guardado', 
          'El horario laboral del barbero ha sido configurado.', 
          'success'
        );
        // Opcional: Recargar o actualizar el barbero en la lista si fuera necesario.
      },
      error: (err: HttpErrorResponse) => this.handleBackendError(err, 'Error al guardar horario')
    });
  }

  // --- 3. Helper para cerrar el modal de horario ---
  closeScheduleModal(): void {
    this.isScheduleModalOpen = false;
    this.newlyCreatedBarber = null; // Limpiamos el estado al terminar
  }

  requestCancelCreate(): void {
    this.pendingAction = 'cancelCreate';
    this.showAlert('¿Cancelar registro?', 'Se perderán los datos ingresados.', 'warning', true);
  }

  // ==========================================
  // EDICIÓN
  // ==========================================

  handleEdit(barber: Barber): void {
    // Pasamos el barbero al modal de edición
    this.barberToEdit = { ...barber }; 
    this.isEditModalOpen = true;
  }

  handleUpdateBarber(updatedBarber: Barber): void {
    // El formulario ya hizo la llamada al servicio, solo actualizamos la vista
    const index = this.barbers.findIndex(b => b.id === updatedBarber.id);
    if (index !== -1) {
      this.barbers[index] = updatedBarber;
    }
    
    this.applyFilters();
    this.isEditModalOpen = false;
    this.barberToEdit = null;

    this.showAlert('Actualización Exitosa', 'El barbero ha sido modificado correctamente.', 'success');
  }

  requestCancelEdit(): void {
    this.pendingAction = 'cancelEdit';
    this.showAlert('¿Descartar cambios?', 'Se perderán las modificaciones realizadas.', 'warning', true);
  }

  // ==========================================
  // ASIGNACIÓN DE SERVICIOS
  // ==========================================

  handleAssignServices(barber: Barber): void {
    this.barberToAssign = barber;
    this.isAssignModalOpen = true;
  }

  handleSaveAssignment(updatedBarber: Barber): void {
    // El componente de asignación actualiza los serviceIds en el backend, 
    // y devuelve la entidad actualizada.

    // 1. Actualizar la lista local
    const index = this.barbers.findIndex(b => b.id === updatedBarber.id);
    if (index !== -1) {
      this.barbers[index] = updatedBarber;
    }
    this.applyFilters();

    // 2. Cerrar modal y notificar
    this.isAssignModalOpen = false;
    this.barberToAssign = null;
    this.showAlert('Asignación de Servicios Exitosa', 'La lista de servicios del barbero ha sido actualizada.', 'success');
  }

  // ==========================================
  // ELIMINACIÓN (Inactivación lógica)
  // ==========================================

  handleDelete(barber: Barber): void {
    this.pendingAction = 'delete';
    this.tempBarberIdToDelete = barber.id;
    this.showAlert('¿Eliminar Barbero?', `Estás a punto de eliminar lógicamente a "${barber.name} ${barber.lastName}".`, 'error', true);
  }

  private executeDelete(id: string): void {
    // Implementa aquí la llamada a barberService.deleteBarber(id). 
    // Asumo que el servicio tiene un método para eliminar barberos.

    // Ejemplo simulado (reemplaza con la llamada real al servicio)
    // this.barberService.deleteBarber(id).subscribe({ ... });

    // Para simular la eliminación local (asumiendo éxito)
    this.barbers = this.barbers.filter(b => b.id !== id);
    this.applyFilters();
    setTimeout(() => this.showAlert('Eliminado', 'Barbero eliminado lógicamente y actualizado.', 'success'), 300);
    
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