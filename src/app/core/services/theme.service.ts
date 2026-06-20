import { Injectable, signal } from '@angular/core';

/**
 * Define los tipos de tema permitidos en la aplicación.
 * Restringe los valores posibles a 'light' (claro) o 'dark' (oscuro).
 */
type Theme = 'light' | 'dark';

/**
 * Servicio encargado de la gestión global del tema visual de la aplicación.
 * Maneja la detección de preferencias del sistema, la persistencia de la elección del usuario
 * en el almacenamiento local y la aplicación de clases CSS al documento.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  /**
   * Señal reactiva de Angular que mantiene el estado actual del tema.
   * Permite a los componentes suscribirse o reaccionar eficientemente a los cambios de tema.
   * @default 'dark'
   */
  public theme = signal<Theme>('dark');

  constructor() {
    this.initializeTheme();
  }

  /**
   * Inicializa la configuración del tema al arrancar el servicio.
   * Determina el tema inicial siguiendo una jerarquía de prioridades:
   * 1. Preferencia guardada manualmente por el usuario (localStorage).
   * 2. Tema oscuro por defecto (identidad premium de la marca).
   *
   * El tema oscuro es la identidad principal de BarberIA, por lo que se usa como
   * valor por defecto en lugar de seguir la preferencia del sistema operativo.
   */
  private initializeTheme(): void {
    // 1. Verificamos si existe una preferencia guardada previamente
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      this.setTheme(storedTheme);
      return;
    }

    // 2. Si no, aplicamos el tema oscuro de marca por defecto
    this.setTheme('dark');
  }

  /**
   * Alterna el tema actual entre 'light' y 'dark'.
   * Además de actualizar el estado visual, persiste la nueva elección en el localStorage
   * para recordar la preferencia del usuario en futuras visitas.
   */
  public toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    // Persistencia de la elección
    localStorage.setItem('theme', newTheme);
  }

  /**
   * Aplica el tema especificado al estado de la aplicación y al DOM.
   * Actualiza la señal `theme` y añade o remueve la clase CSS `theme-light` en el body.
   * El tema oscuro es el valor por defecto (definido en `:root`), por lo que solo se
   * añade la clase `theme-light` cuando el usuario elige el tema claro.
   *
   * @param theme - El tema a aplicar ('light' o 'dark').
   */
  private setTheme(theme: Theme): void {
    this.theme.set(theme);
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }
}