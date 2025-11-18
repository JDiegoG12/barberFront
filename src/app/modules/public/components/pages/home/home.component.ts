import { Component } from '@angular/core';

// 1. Importamos la plantilla y los organismos que la componen
import { PublicTemplateComponent } from '../../templates/public-template/public-template.component';
import { ServicesListComponent } from '../../../../../shared/components/organisms/services-list/services-list.component';
import { BarbersListComponent } from '../../../../../shared/components/organisms/barbers-list/barbers-list.component';
import { InfoSectionComponent } from '../../../../../shared/components/organisms/info-section/info-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  // 2. Añadimos todo a los imports del componente
  imports: [
    PublicTemplateComponent,
    ServicesListComponent,
    BarbersListComponent,
    InfoSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}