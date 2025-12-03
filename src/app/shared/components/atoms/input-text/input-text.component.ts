import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
})
export class InputTextComponent implements ControlValueAccessor {
  /** Etiqueta que se muestra encima del input */
  @Input() label: string = '';
  
  /** Placeholder del input */
  @Input() placeholder: string = '';
  
  /** Tipo de input: 'text', 'number', 'email', 'password', etc. */
  @Input() type: 'text' | 'number' | 'email' | 'password' = 'text';
  
  /** Mensaje de error a mostrar. Si existe, el input se pinta de rojo. */
  @Input() error: string | null = null;

  /** Si es true, muestra un asterisco rojo indicando obligatoriedad visual */
  @Input() required: boolean = false;

  // --- Lógica de ControlValueAccessor ---
  
  public value: string | number = '';
  public isDisabled: boolean = false;

  // Funciones placeholder que Angular reemplazará
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // 1. Escribe el valor desde el modelo (TS) a la vista (HTML)
  writeValue(value: any): void {
    this.value = value === undefined || value === null ? '' : value;
  }

  // 2. Registra la función que se llama cuando el valor cambia en la vista
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3. Registra la función que se llama cuando el input es "tocado" (blur)
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // 4. Maneja el estado deshabilitado
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Evento del input HTML
  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }
}