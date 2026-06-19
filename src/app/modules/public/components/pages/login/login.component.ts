import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';
import { UserRole } from '../../../../../core/models/views/user.view.model';

/**
 * Página de inicio de sesión SIMULADO (sin Keycloak).
 *
 * Permite elegir con qué rol entrar a la aplicación (Admin / Barbero / Cliente).
 * Al seleccionar un rol se crea una sesión local y se redirige al panel
 * correspondiente. Pensada únicamente para desarrollo del frontend.
 */
@Component({
    selector: 'app-login',
    imports: [CommonModule],
    template: `
    <div class="login">
      <div class="login__card">
        <h1 class="login__title">Iniciar sesión</h1>
        <p class="login__subtitle">Modo desarrollo — elige un rol para entrar</p>

        <div class="login__options">
          <button
            *ngFor="let opt of roles"
            type="button"
            class="login__btn"
            (click)="enter(opt.role)">
            <span class="login__btn-role">{{ opt.label }}</span>
            <span class="login__btn-desc">{{ opt.description }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: #111;
    }
    .login__card {
      width: 100%;
      max-width: 420px;
      background: #1c1c1c;
      border: 1px solid #2e2e2e;
      border-radius: 16px;
      padding: 2rem;
      color: #f5f5f5;
    }
    .login__title {
      margin: 0 0 0.25rem;
      font-size: 1.6rem;
      text-align: center;
    }
    .login__subtitle {
      margin: 0 0 1.5rem;
      text-align: center;
      color: #9a9a9a;
      font-size: 0.9rem;
    }
    .login__options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .login__btn {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      text-align: left;
      padding: 0.9rem 1rem;
      border: 1px solid #3a3a3a;
      border-radius: 10px;
      background: #242424;
      color: inherit;
      cursor: pointer;
      transition: border-color .15s, transform .05s;
    }
    .login__btn:hover { border-color: #c9a14a; }
    .login__btn:active { transform: scale(0.99); }
    .login__btn-role { font-weight: 600; font-size: 1rem; }
    .login__btn-desc { font-size: 0.8rem; color: #9a9a9a; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);

  readonly roles: { role: UserRole; label: string; description: string }[] = [
    { role: 'CLIENT', label: 'Cliente', description: 'Reservar citas y ver mis reservas' },
    { role: 'BARBER', label: 'Barbero', description: 'Gestionar agenda y reportes' },
    { role: 'ADMIN', label: 'Administrador', description: 'Gestión completa del negocio' }
  ];

  enter(role: UserRole): void {
    this.authService.loginAs(role);
  }
}
