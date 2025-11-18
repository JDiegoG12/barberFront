import { Injectable, signal } from '@angular/core';

// Definimos un tipo para asegurar que solo usamos 'light' o 'dark'.
type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Usamos una señal de Angular para mantener el estado del tema actual.
  // Es moderno, reactivo y eficiente.
  public theme = signal<Theme>('light');

  constructor() {
    this.initializeTheme();
  }

  /**
   * Inicializa el tema al cargar la aplicación.
   * Prioridad:
   * 1. Preferencia manual guardada en localStorage.
   * 2. Preferencia del sistema operativo del usuario.
   * 3. Tema claro como último recurso.
   */
  private initializeTheme(): void {
    // 1. Buscamos si el usuario ya eligió un tema manualmente.
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      this.setTheme(storedTheme);
      return;
    }

    // 2. Si no hay preferencia manual, detectamos la del sistema.
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setTheme(prefersDark.matches ? 'dark' : 'light');

    // Escuchamos cambios en la preferencia del sistema en tiempo real.
    prefersDark.addEventListener('change', (e) => {
      // Solo cambiamos el tema si el usuario NO ha elegido uno manualmente.
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Cambia el tema actual y lo guarda como preferencia manual.
   */
  public toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    // Guardamos la elección del usuario para que persista.
    localStorage.setItem('theme', newTheme);
  }

  /**
   * Aplica el tema al documento y actualiza la señal.
   * @param theme El tema a aplicar ('light' o 'dark').
   */
  private setTheme(theme: Theme): void {
    this.theme.set(theme);
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }
}