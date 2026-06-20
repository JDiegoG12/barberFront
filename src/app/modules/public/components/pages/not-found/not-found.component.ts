import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PublicTemplateComponent } from '../../templates/public-template/public-template.component';
import { PrimaryButtonComponent } from '../../../../../shared/components/atoms/primary-button/primary-button.component';

/**
 * Página de error 404 mostrada cuando la URL no coincide con ninguna ruta.
 * Mantiene la identidad de marca (navbar/footer públicos) y ofrece un camino
 * claro de regreso al inicio.
 */
@Component({
  selector: 'app-not-found',
  imports: [PublicTemplateComponent, PrimaryButtonComponent],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(['/']);
  }
}
