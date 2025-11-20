import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent {
  @Input() icon: string = '+'; // Por defecto un más
  @Input() selected: boolean = false; // Estado seleccionado
  @Output() onClick = new EventEmitter<void>();

  handleClick(event: Event): void {
    event.stopPropagation(); // Evitamos que el click se propague al contenedor padre
    this.onClick.emit();
  }
}