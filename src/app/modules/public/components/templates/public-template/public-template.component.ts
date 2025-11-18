import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../../shared/components/organisms/navbar/navbar.component';
import { FooterComponent } from '../../../../../shared/components/organisms/footer/footer.component';

@Component({
  selector: 'app-public-template',
  standalone: true,
  // 1. Importamos los organismos que componen nuestra plantilla
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './public-template.component.html',
  styleUrl: './public-template.component.scss'
})
export class PublicTemplateComponent {

}