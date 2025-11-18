import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SectionTitleComponent } from '../../atoms/section-title/section-title.component';

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [SectionTitleComponent],
  templateUrl: './info-section.component.html',
  styleUrl: './info-section.component.scss'
})
export class InfoSectionComponent implements OnInit {
  // 1. Inyectamos el 'DomSanitizer'
  private sanitizer = inject(DomSanitizer);

  // 2. Creamos una propiedad para guardar la URL segura del mapa
  public safeMapUrl!: SafeResourceUrl;

  ngOnInit(): void {
    // 3. La URL que nos proporcionaste
    const unsafeMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6358.625450669779!2d-76.59534241508325!3d2.4451004245200214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30030bfff35faf%3A0x4ea498e8bb6912ea!2sUnicauca%20-%20Campus%20Universitario%20de%20Tulc%C3%A1n!5e0!3m2!1ses!2sco!4v1763438344184!5m2!1ses!2sco';

    // 4. Usamos el sanitizer para crear una URL en la que Angular confíe
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeMapUrl);
  }
}