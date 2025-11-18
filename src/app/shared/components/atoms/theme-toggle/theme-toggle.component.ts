import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  // Inyectamos nuestro servicio de temas
  public themeService = inject(ThemeService);

  // Exponemos la señal del tema como una propiedad pública
  public currentTheme = this.themeService.theme;

  // Método para llamar al toggle del servicio
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}