import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

import { AvatarSelectionCardComponent } from '../../molecules/avatar-selection-card/avatar-selection-card.component';
import { BarberService } from '../../../../core/services/api/barber.service';
import { Barber } from '../../../../core/models/views/barber.view.model';

/**
 * Componente organismo encargado de la selección del profesional (Barbero).
 * Filtra la lista de empleados basándose en el servicio seleccionado previamente
 * y muestra solo aquellos que están habilitados y capacitados para realizarlo.
 */
@Component({
  selector: 'app-select-barber',
  standalone: true,
  imports: [CommonModule, AvatarSelectionCardComponent], 
  templateUrl: './select-barber.component.html',
  styleUrl: './select-barber.component.scss'
})
export class SelectBarberComponent implements OnInit {
  /** Servicio para obtener el listado de barberos. */
  private barberService = inject(BarberService);

  /**
   * ID del servicio seleccionado por el cliente.
   * Se utiliza para filtrar qué barberos pueden realizar este trabajo específico.
   */
  @Input({ required: true }) serviceId!: number;
  
  /**
   * ID del barbero previamente seleccionado (si existe).
   * Útil para mantener el estado visual de selección si el usuario navega atrás en el Wizard.
   */
  @Input() preSelectedBarberId: number | null = null;

  /**
   * Evento que se emite cuando el usuario elige a un barbero de la lista.
   * El componente padre captura este evento para actualizar el estado de la reserva.
   */
  @Output() onBarberSelect = new EventEmitter<Barber>();

  /** Flujo de datos observable con la lista filtrada de barberos elegibles. */
  public availableBarbers$!: Observable<Barber[]>;

  /**
   * Inicializa el componente configurando el filtro de barberos.
   * Aplica dos condiciones:
   * 1. El barbero debe tener el `serviceId` en su lista de habilidades.
   * 2. El estado del barbero debe ser 'Disponible'.
   */
  ngOnInit(): void {
    this.availableBarbers$ = this.barberService.getBarbers().pipe(
      map(barbers => barbers.filter(barber => 
        // 1. Que realice el servicio seleccionado
        barber.serviceIds.includes(this.serviceId) && 
        // 2. Que esté marcado como Disponible en el sistema
        barber.availabilityStatus === 'Disponible'
      ))
    );
  }

  /**
   * Maneja la interacción de clic en una tarjeta de barbero.
   * Emite la selección al componente padre.
   * 
   * @param barber - El objeto del barbero seleccionado.
   */
  selectBarber(barber: Barber): void {
    // Solo emitimos la selección. El componente padre decidirá cuándo avanzar (con el botón Continuar).
    this.onBarberSelect.emit(barber);
  }
}