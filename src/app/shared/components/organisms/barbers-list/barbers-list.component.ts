import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// 1. Importamos todo lo que necesitamos
import { Barber } from '../../../../core/models/views/barber.view.model';
import { BarberService } from '../../../../core/services/api/barber.service';
import { SectionTitleComponent } from '../../atoms/section-title/section-title.component';
import { BarberCardComponent } from '../../molecules/barber-card/barber-card.component';

@Component({
  selector: 'app-barbers-list',
  standalone: true,
  // 2. Añadimos los componentes que usará este organismo
  imports: [CommonModule, SectionTitleComponent, BarberCardComponent],
  templateUrl: './barbers-list.component.html',
  styleUrl: './barbers-list.component.scss'
})
export class BarbersListComponent implements OnInit {
  // 3. Inyectamos el servicio
  private barberService = inject(BarberService);

  // 4. Creamos la propiedad para el observable
  public barbers$!: Observable<Barber[]>;

  ngOnInit(): void {
    // 5. Obtenemos los datos al iniciar
    this.barbers$ = this.barberService.getBarbers();
  }
}