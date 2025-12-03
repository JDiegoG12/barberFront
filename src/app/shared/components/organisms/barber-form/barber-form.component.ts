import { Component, OnInit, Output, EventEmitter, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Componentes reutilizables (Ajusta las rutas)
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';
import { InputTextComponent } from '../../atoms/input-text/input-text.component';
import { InputTextareaComponent } from '../../atoms/input-textarea/input-textarea.component';
import { InputSelectComponent, SelectOption } from '../../atoms/input-select/input-select.component';

// Servicios y Modelos
import { BarberService } from '../../../../core/services/api/barber.service';
import { Barber } from '../../../../core/models/views/barber.view.model'; 
import { CreateBarberRequestDTO, UpdateBarberRequestDTO } from '../../../../core/models/dto/barber-request.dto'; 

@Component({
  selector: 'app-barber-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    PrimaryButtonComponent,
    InputTextComponent,
    InputTextareaComponent,
    InputSelectComponent
  ],
  templateUrl: './barber-form.component.html',
  styleUrls: ['./barber-form.component.scss'] // Asumiendo SCSS
})
export class BarberFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private barberService = inject(BarberService);
  
  // Propiedades de Input/Output
  @Input() barberToEdit: Barber | null = null; 
  @Output() onSave = new EventEmitter<FormData | CreateBarberRequestDTO>();
  @Output() onCancel = new EventEmitter<void>();

  // Estado
  form!: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  imageFile?: File; // undefined when no file selected
  
  // Opciones para el select de estado administrativo/disponibilidad si se requieren en el formulario
  // Si estos son solo manejados por el backend, se eliminan. Aquí los incluyo por si los necesitas.
  public systemStatusOptions: SelectOption[] = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo (Baja)' },
  ];

  public availabilityOptions: SelectOption[] = [
    { value: 'Disponible', label: 'Disponible' },
    { value: 'No Disponible', label: 'No Disponible' },
  ];

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si el barbero cambia o se inicializa, actualizamos el formulario.
    if (changes['barberToEdit'] && this.barberToEdit) {
      this.isEditMode = true;
      this.initForm();
    }
  }

  private initForm(): void {
    const isEditing = this.barberToEdit !== null;
    
  this.form = this.fb.group({
    name: [this.barberToEdit?.name || '', [Validators.required, Validators.minLength(2)]],
    lastName: [this.barberToEdit?.lastName || '', [Validators.required, Validators.minLength(2)]],
    email: [{ 
      value: (this.barberToEdit as any)?.email || '', 
      // Deshabilitamos el email en modo edición (mejor práctica, si es clave única)
      disabled: isEditing 
    }, [Validators.required, Validators.email]],
    // Contraseña solo es obligatoria en modo creación
    password: ['', isEditing ? [] : [Validators.required, Validators.minLength(6)]],
    // Campos adicionales usados en el submit
    phone: [(this.barberToEdit as any)?.phone || '', []],
    description: [(this.barberToEdit as any)?.description || '', []],
  });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageFile = input.files?.[0];
  }

  /**
   * Obtiene mensajes de error para un control dado.
   */
  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.errors || !control.touched) return null;

    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido.';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['email']) return 'Formato de email no válido.';
    
    return 'Valor inválido.';
  }

  submit(): void {
    if (this.form.valid) {
        // Usar getRawValue() para incluir controles deshabilitados (ej. email en edición)
        const formValue = this.form.getRawValue();

        if (this.isEditMode) {
            // Lógica de edición: Aquí podrías usar JSON o FormData dependiendo de si se cambió la imagen.
            // Para simplificar, asumiremos que si hay 'imageFile', siempre usamos FormData.
        }
        
        // --- LÓGICA DE CREACIÓN O SI HAY ARCHIVO ---
        if (this.imageFile) {
            // 1. Crear FormData
            const formData = new FormData();
            
            // 2. Agregar el archivo de imagen
            formData.append('file', this.imageFile, this.imageFile.name); // 'file' es típicamente el nombre del campo para el archivo

            // 3. Agregar los campos de texto requeridos como PARTES DE CADENA
            formData.append('name', formValue.name);
            formData.append('lastName', formValue.lastName);
            formData.append('email', formValue.email); // **ESTE ES EL CAMPO QUE ESTABA FALTANDO**
            formData.append('phone', formValue.phone || ''); 
            formData.append('password', formValue.password);
            formData.append('bio', formValue.description || ''); // Asumiendo que 'description' es 'bio'

            this.onSave.emit(formData); // Emitir FormData

        } else {
            // Si no hay archivo (asumiendo que el backend maneja este caso también)
            const createDto: CreateBarberRequestDTO = {
                // ... (Construir DTO JSON como antes)
                name: formValue.name,
                lastName: formValue.lastName,
                email: formValue.email,
                phone: formValue.phone || '',
                password: formValue.password,
                description: formValue.description || ''
            };
            this.onSave.emit(createDto); // Emitir DTO JSON

        }
    } else {
        this.form.markAllAsTouched();
    }
}
}