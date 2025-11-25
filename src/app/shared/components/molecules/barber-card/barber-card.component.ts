import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Barber } from '../../../../core/models/views/barber.view.model';

/**
 * Componente molecular que representa la tarjeta de presentación de un Barbero.
 * Muestra la información esencial del profesional (foto, nombre, biografía) y su estado de disponibilidad.
 * Diseñado para ser utilizado en listas o carruseles de selección de equipo.
 */
@Component({
  selector: 'app-barber-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barber-card.component.html',
  styleUrl: './barber-card.component.scss'
})
export class BarberCardComponent {
  /**
   * Objeto con la información del barbero a visualizar.
   * Es un input obligatorio para garantizar que la tarjeta tenga contenido.
   */
  @Input({ required: true }) barber!: Barber;

  /**
   * Propiedad computada que determina si el barbero está disponible para reservas.
   * Se utiliza en la plantilla para aplicar clases CSS condicionales (ej. escala de grises)
   * y mostrar las etiquetas de estado correspondientes.
   *
   * @returns `true` si el estado de disponibilidad es exactamente 'Disponible'.
   */
  get isAvailable(): boolean {
    return this.barber.availabilityStatus === 'Disponible';
  }
}