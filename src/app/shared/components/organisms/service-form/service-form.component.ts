import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// Componentes Atómicos
import { PrimaryButtonComponent } from '../../../../shared/components/atoms/primary-button/primary-button.component';
import { InputTextComponent } from '../../../../shared/components/atoms/input-text/input-text.component';
import { InputSelectComponent, SelectOption } from '../../../../shared/components/atoms/input-select/input-select.component';
import { InputTextareaComponent } from '../../../../shared/components/atoms/input-textarea/input-textarea.component';

// Modelos y DTOs
import { Category } from '../../../../core/models/views/category.view.model';
import { CreateServiceRequestDTO, UpdateServiceRequestDTO } from '../../../../core/models/dto/service-request.dto';
import { Service } from '../../../../core/models/views/service.view.model';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    PrimaryButtonComponent,
    InputTextComponent,
    InputSelectComponent,
    InputTextareaComponent
  ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input({ required: true }) categories: Category[] = [];
  @Input() serviceToEdit: Service | null = null;

  // Emitimos una Unión de Tipos (Puede ser Create o Update)
  @Output() onSave = new EventEmitter<CreateServiceRequestDTO | UpdateServiceRequestDTO>();
  @Output() onCancel = new EventEmitter<void>();

  public form!: FormGroup;
  
  public categoryOptions: SelectOption[] = [];
  
  // Opciones fijas para el estado
  public availabilityOptions: SelectOption[] = [
    { label: 'Disponible', value: 'Disponible' },
    { label: 'No Disponible', value: 'No Disponible' }
  ];

  ngOnInit(): void {
    this.initForm();
    
    if (this.serviceToEdit) {
      // MODO EDICIÓN: Cargamos datos y añadimos validación al estado
      this.form.patchValue({
        name: this.serviceToEdit.name,
        description: this.serviceToEdit.description,
        price: this.serviceToEdit.price,
        duration: this.serviceToEdit.duration,
        categoryId: this.serviceToEdit.categoryId,
        availabilityStatus: this.serviceToEdit.availabilityStatus // <--- Cargamos estado
      });

      // El estado es obligatorio al editar
      this.form.get('availabilityStatus')?.setValidators([Validators.required]);
      this.form.get('availabilityStatus')?.updateValueAndValidity();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] && this.categories) {
      this.mapCategoriesToOptions();
    }
  }

  private mapCategoriesToOptions(): void {
    this.categoryOptions = this.categories.map(cat => ({
      label: cat.name,
      value: cat.id
    }));
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/) 
      ]],
      description: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(200)
      ]],
      price: [null, [
        Validators.required, 
        Validators.min(1000), 
        Validators.max(500000)
      ]],
      duration: [null, [
        Validators.required, 
        Validators.min(10), 
        Validators.max(240),
        this.durationMultipleOfTen
      ]],
      categoryId: [null, [Validators.required]],
      // Campo de estado (inicialmente null, se activa solo en edición)
      availabilityStatus: [null] 
    });
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);
    
    if (control && control.touched && control.errors) {
      const errors = control.errors;
      if (errors['required']) return 'Este campo es obligatorio.';
      if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
      if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
      if (errors['pattern']) return 'Solo se permiten letras, números y espacios.';
      if (errors['min']) return `El valor mínimo es ${errors['min'].min}.`;
      if (errors['max']) return `El valor máximo es ${errors['max'].max}.`;
      if (errors['notMultipleOfTen']) return 'La duración debe ser múltiplo de 10.';
    }
    return null;
  }

  submit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Datos comunes
      const baseData = {
        name: formValue.name,
        description: formValue.description,
        price: Number(formValue.price),
        duration: Number(formValue.duration),
        categoryId: Number(formValue.categoryId)
      };

      if (this.serviceToEdit) {
        // --- MODO EDICIÓN (UpdateServiceRequestDTO) ---
        // Incluye availabilityStatus
        const updateDto: UpdateServiceRequestDTO = {
          ...baseData,
          availabilityStatus: formValue.availabilityStatus
        };
        this.onSave.emit(updateDto);

      } else {
        // --- MODO CREACIÓN (CreateServiceRequestDTO) ---
        // NO incluye availabilityStatus (el backend lo pone por defecto)
        const createDto: CreateServiceRequestDTO = baseData;
        this.onSave.emit(createDto);
      }

    } else {
      this.form.markAllAsTouched();
    }
  }

  private durationMultipleOfTen(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    if (value % 10 !== 0) return { notMultipleOfTen: true };
    return null;
  }
}