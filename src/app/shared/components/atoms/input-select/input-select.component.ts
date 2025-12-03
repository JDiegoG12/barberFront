import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true
    }
  ]
})
export class InputSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Seleccione una opción';
  @Input() options: SelectOption[] = [];
  @Input() error: string | null = null;
  @Input() required: boolean = false;

  // Inicializamos en cadena vacía para que coincida con el placeholder
  public value: any = ''; 
  public isDisabled: boolean = false;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // 1. Al recibir valor del padre (FormGroup)
  writeValue(value: any): void {
    // Si viene null o undefined, lo convertimos a "" para que el HTML Select seleccione el placeholder
    this.value = (value === null || value === undefined) ? '' : value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // 2. Al cambiar en el HTML
  handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const val = target.value;
    
    // Si es cadena vacía, emitimos null al padre (para que falle el Validators.required)
    if (val === '') {
      this.onChange(null);
      return;
    }

    // Lógica para números
    const isNum = !isNaN(Number(val)) && val !== '';
    this.onChange(isNum ? Number(val) : val);
  }
}