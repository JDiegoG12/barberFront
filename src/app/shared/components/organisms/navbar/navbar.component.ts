import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../../atoms/theme-toggle/theme-toggle.component';
import { User } from '../../../../core/models/views/user.view.model';

/**
 * Componente organismo que representa la barra de navegación principal (Navbar) de la aplicación.
 * Es un componente responsivo que adapta su contenido y opciones de menú basándose en el estado
 * de autenticación del usuario (Invitado vs Usuario Logueado).
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ThemeToggleComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  /**
   * Objeto del usuario actualmente autenticado.
   * - Si es `null`, el componente renderiza la vista de invitado (Botón "Iniciar Sesión", enlaces públicos).
   * - Si tiene valor, renderiza la vista de usuario (Saludo, Botón "Cerrar Sesión", enlaces privados).
   */
  @Input() user: User | null = null; 

  /**
   * Evento que se emite cuando el usuario hace clic en la acción de "Iniciar Sesión".
   * El componente padre "app.component" debe manejar la lógica de redirección al flujo de login.
   */
  @Output() onLogin = new EventEmitter<void>();
  /**
   * Evento que se emite cuando el usuario hace clic en la acción de "Cerrar Sesión".
   * El componente padre debe manejar la lógica de limpieza de sesión y redirección.
   */
  @Output() onLogout = new EventEmitter<void>();
  
  /**
   * Estado que controla la visibilidad del menú desplegable en dispositivos móviles.
   * `true` indica que el menú está expandido.
   */
  public isMenuOpen = false;

  /**
   * Alterna el estado de visibilidad del menú móvil (abrir/cerrar).
   * Vinculado al botón de "hamburguesa".
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Ejecuta el flujo de cierre de sesión.
   * Emite el evento `onLogout` y asegura que el menú móvil se cierre para restablecer la UI.
   */
  handleLogout(): void {
    this.onLogout.emit();
    this.isMenuOpen = false;
  }
  /**
   * Ejecuta el flujo de inicio de sesión.
   * Emite el evento `onLogin` y asegura que el menú móvil se cierre para restablecer la UI.
   */
  handleLogin(): void {
    this.onLogin.emit();
    this.isMenuOpen = false;
  }
}