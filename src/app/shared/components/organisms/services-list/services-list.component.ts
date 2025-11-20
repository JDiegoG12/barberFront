import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent } from '../../molecules/service-card/service-card.component';
import { ServiceService } from '../../../../core/services/api/service.service';
import { SectionTitleComponent } from '../../atoms/section-title/section-title.component';
import { Observable } from 'rxjs';
import { Service } from '../../../../core/models/views/service.view.model';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent, SectionTitleComponent],
  templateUrl: './services-list.component.html',
  styleUrl: './services-list.component.scss'
})
export class ServicesListComponent implements OnInit {
  private serviceService = inject(ServiceService);
  public services$!: Observable<Service[]>;

  // Recibimos del Home cuál es el servicio seleccionado actualmente
  @Input() selectedService: Service | null = null;

  // Avisamos al Home que el usuario quiere seleccionar/deseleccionar este servicio
  @Output() onServiceSelect = new EventEmitter<Service>();

  ngOnInit(): void {
    this.services$ = this.serviceService.getServices();
  }

  handleSelection(service: Service): void {
    this.onServiceSelect.emit(service);
  }
}