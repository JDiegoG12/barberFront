import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// 1. Importamos todo lo que necesitamos
import { Service } from '../../../../core/models/views/service.view.model';
import { ServiceService } from '../../../../core/services/api/service.service';
import { SectionTitleComponent } from '../../atoms/section-title/section-title.component';
import { ServiceCardComponent } from '../../molecules/service-card/service-card.component';

@Component({
  selector: 'app-services-list',
  standalone: true,
  // 2. Añadimos los componentes que usará este organismo
  imports: [CommonModule, SectionTitleComponent, ServiceCardComponent],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  // 3. Inyectamos el servicio para obtener los datos
  private serviceService = inject(ServiceService);

  // 4. Creamos una propiedad para almacenar los servicios
  public services$!: Observable<Service[]>;

  ngOnInit(): void {
    // 5. Al iniciar el componente, llamamos al servicio
    this.services$ = this.serviceService.getServices();
  }
}