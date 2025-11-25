import { Component, OnInit, inject } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SectionTitleComponent } from '../../atoms/section-title/section-title.component';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';
/**
 * Componente organismo que presenta la información de contacto y ubicación del negocio.
 * Integra un mapa interactivo (Google Maps) y detalles estáticos como dirección,
 * teléfono y horarios de atención.
 */
@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [SectionTitleComponent],
  providers: [SafeUrlPipe],
  templateUrl: './info-section.component.html',
  styleUrl: './info-section.component.scss'
})
export class InfoSectionComponent implements OnInit {
  
  private safeUrlPipe = inject(SafeUrlPipe);

  public safeMapUrl!: SafeResourceUrl;
  /**
   * Inicializa el componente configurando la URL del mapa.
   * Aplica el bypass de seguridad a la URL de Google Maps para permitir su renderizado.
   */
  ngOnInit(): void {
    // URL de inserción (embed) de Google Maps
    const unsafeMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6358.625450669779!2d-76.59534241508325!3d2.4451004245200214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30030bfff35faf%3A0x4ea498e8bb6912ea!2sUnicauca%20-%20Campus%20Universitario%20de%20Tulc%C3%A1n!5e0!3m2!1ses!2sco!4v1763438344184!5m2!1ses!2sco';

    // Sanitización de la URL para indicar a Angular que es confiable
    this.safeMapUrl = this.safeUrlPipe.transform(unsafeMapUrl);
  }
}