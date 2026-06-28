import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

import { ThemeToggleComponent } from '../../atoms/theme-toggle/theme-toggle.component';
import { User } from '../../../../core/models/views/user.view.model';

/**
 * Componente organismo que representa la barra de navegación principal (Navbar) de la aplicación.
 * Es un componente responsivo que adapta su contenido y opciones de menú basándose en el estado
 * de autenticación del usuario (Invitado vs Usuario Logueado).
 */
@Component({
    selector: 'app-navbar',
    imports: [
    RouterLink,
    RouterLinkActive,
    ThemeToggleComponent
],
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  /**
   * Objeto del usuario actualmente autenticado.
   * - Si es `null`, el componente renderiza la vista de invitado (Botón "Iniciar Sesión", enlaces públicos).
   * - Si tiene valor, renderiza la vista de usuario (Saludo, Botón "Cerrar Sesión", enlaces privados).
   */
  @Input() user: User | null = null;

  /**
   * Sección de la landing actualmente visible (scroll-spy).
   * `null` significa que estamos en la parte superior → el enlace "Inicio" queda activo.
   */
  readonly activeSection = signal<string | null>(null);

  /**
   * Indica si la página se ha desplazado más allá del umbral inicial.
   * Cuando es `true`, el navbar flotante se compacta y refuerza su fondo/sombra.
   */
  readonly scrolled = signal<boolean>(false);

  /** Ids de las secciones de la landing que participan en el resaltado por scroll. */
  private readonly sectionIds = ['seccion-servicios', 'seccion-barberos', 'seccion-contacto'];

  /** Referencia al listener de scroll para poder removerlo al destruir el componente. */
  private readonly onScroll = () => {
    this.updateActiveSection();
    this.updateScrolled();
  };

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
  
  /** Respaldo del estado del menú móvil. */
  private _isMenuOpen = false;

  /**
   * Estado que controla la visibilidad del menú desplegable en dispositivos móviles.
   * `true` indica que el menú está expandido.
   *
   * Al cambiar, además bloquea/restaura el scroll del documento para que el fondo
   * no se desplace mientras el overlay a pantalla completa está abierto.
   */
  get isMenuOpen(): boolean {
    return this._isMenuOpen;
  }
  set isMenuOpen(open: boolean) {
    this._isMenuOpen = open;
    this.lockBodyScroll(open);
  }

  /** Bloquea (o restaura) el scroll del documento mientras el menú móvil está abierto. */
  private lockBodyScroll(lock: boolean): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = lock ? 'hidden' : '';
    }
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    // Cálculo inicial (por si la página carga ya desplazada).
    this.updateActiveSection();
    this.updateScrolled();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    // Evita dejar el scroll bloqueado si el componente se destruye con el menú abierto.
    this.lockBodyScroll(false);
  }

  /**
   * Recalcula qué sección de la landing está visible según la posición de scroll.
   * Marca como activa la última sección cuyo borde superior ha pasado el navbar.
   * Si ninguna ha pasado (estamos arriba), deja `null` → "Inicio" activo.
   */
  private updateActiveSection(): void {
    const offset = 140; // altura aproximada del navbar + margen
    let current: string | null = null;

    for (const id of this.sectionIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= offset) {
        current = id;
      }
    }

    if (current !== this.activeSection()) {
      this.activeSection.set(current);
    }
  }

  /** Actualiza el estado `scrolled` según la posición vertical de la página. */
  private updateScrolled(): void {
    const isScrolled = window.scrollY > 16;
    if (isScrolled !== this.scrolled()) {
      this.scrolled.set(isScrolled);
    }
  }

  /**
   * Determina si el enlace "Inicio" debe resaltarse.
   * Solo cuando estamos en la ruta de inicio (`/` o `/client`) y en la parte
   * superior de la página (sin ninguna sección activa por scroll).
   */
  isInicioActive(): boolean {
    const path = this.router.url.split('#')[0].split('?')[0];
    const homePath = this.user ? '/client' : '/';
    return path === homePath && this.activeSection() === null;
  }

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