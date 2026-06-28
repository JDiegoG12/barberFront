import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';


/**
 * Componente atómico que proporciona un interruptor (toggle) para cambiar el tema visual de la aplicación.
 * Interactúa directamente con el `ThemeService` para alternar entre los modos Claro y Oscuro
 * y reacciona a los cambios de estado globales.
 */
@Component({
    selector: 'app-theme-toggle',
    imports: [],
    templateUrl: './theme-toggle.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  /**
   * Servicio inyectado encargado de la lógica de negocio del tema.
   */
  public themeService = inject(ThemeService);

  /**
   * Señal reactiva que expone el estado actual del tema ('light' o 'dark').
   * Permite que la plantilla se actualice automáticamente (ej. cambiando el ícono)
   * cuando el valor cambia en el servicio.
   */
  public currentTheme = this.themeService.theme;

  /**
   * Id único para la máscara SVG del morph sol↔luna.
   * Necesario porque hay varias instancias del toggle en la página (navbar de
   * escritorio y menú móvil); ids duplicados harían que `url(#...)` colisione.
   */
  readonly maskId = `theme-moon-mask-${Math.random().toString(36).slice(2, 9)}`;

  /**
   * Ejecuta la acción de cambio de tema invocando al servicio.
   * Usualmente vinculado al evento de clic del botón en la plantilla.
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}