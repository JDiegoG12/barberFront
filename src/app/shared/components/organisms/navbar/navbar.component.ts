import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // 1. Asegúrate de que esto esté importado
import { ThemeToggleComponent } from '../../atoms/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink, // 2. Y que esté aquí
    ThemeToggleComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}