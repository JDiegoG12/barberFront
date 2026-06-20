import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

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
    imports: [],
    template: `
    <div class="login">
      <!-- Panel visual (imagen + marca) -->
      <aside class="login__aside" aria-hidden="true">
        <img class="login__image" src="assets/hero-barber.jpg" alt="" decoding="async" />
        <div class="login__aside-overlay"></div>
        <div class="login__aside-content">
          <span class="login__eyebrow">Estilo &amp; Tradición</span>
          <p class="login__quote">Tu mejor versión comienza aquí.</p>
        </div>
      </aside>

      <!-- Panel de acceso -->
      <div class="login__panel">
        <div class="login__card">
          <a class="login__brand" href="/" aria-label="Ir al inicio de BarberIA">
            <img src="assets/logo.png" alt="BarberIA" class="login__logo" />
          </a>
          <h1 class="login__title">Bienvenido</h1>
          <p class="login__subtitle">Elige cómo quieres entrar a la experiencia.</p>

          <div class="login__options">
            @for (opt of roles; track opt) {
              <button
                type="button"
                class="login__btn"
                (click)="enter(opt.role)">
                <span class="login__btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <span class="login__btn-text">
                  <span class="login__btn-role">{{ opt.label }}</span>
                  <span class="login__btn-desc">{{ opt.description }}</span>
                </span>
                <span class="login__btn-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </span>
              </button>
            }
          </div>

          <p class="login__note">Modo demostración — sin contraseña.</p>
        </div>
      </div>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: [`
    :host { display: block; }
    .login {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      background-color: var(--background-color);
    }
    .login__aside {
      position: relative;
      overflow: hidden;
    }
    .login__image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .login__aside-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to top, rgba(22,19,15,0.9), rgba(22,19,15,0.35)),
        radial-gradient(circle at 30% 100%, rgba(200,162,90,0.25), transparent 60%);
    }
    .login__aside-content {
      position: absolute;
      left: 0; right: 0; bottom: 0;
      padding: var(--space-7) var(--space-6);
      color: #F3ECE0;
    }
    .login__eyebrow {
      display: block;
      font-size: 0.8rem;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: var(--primary-color);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }
    .login__quote {
      font-family: var(--font-heading);
      font-size: clamp(1.6rem, 2.5vw, 2.4rem);
      line-height: 1.2;
      max-width: 16ch;
    }
    .login__panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
    }
    .login__card {
      width: 100%;
      max-width: 420px;
    }
    .login__brand { display: inline-block; margin-bottom: var(--space-5); }
    .login__logo { height: 48px; width: auto; }
    .login__title {
      font-size: 2rem;
      margin-bottom: var(--space-2);
      color: var(--text-color);
    }
    .login__subtitle {
      color: var(--text-muted-color);
      margin-bottom: var(--space-6);
    }
    .login__options {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .login__btn {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      text-align: left;
      padding: var(--space-4);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background-color: var(--surface-color);
      color: var(--text-color);
      cursor: pointer;
      transition: border-color var(--transition-fast), background-color var(--transition-fast),
        transform var(--transition-fast), box-shadow var(--transition-fast);
    }
    .login__btn:hover {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-sm);
      transform: translateY(-2px);
    }
    .login__btn:active { transform: translateY(0); }
    .login__btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      flex-shrink: 0;
      border-radius: var(--radius-full);
      background-color: color-mix(in srgb, var(--primary-color) 16%, transparent);
      color: var(--primary-color);
    }
    .login__btn-icon svg { width: 22px; height: 22px; }
    .login__btn-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .login__btn-role { font-weight: 600; font-size: 1rem; }
    .login__btn-desc { font-size: 0.82rem; color: var(--text-muted-color); }
    .login__btn-arrow { color: var(--text-muted-color); transition: transform var(--transition-fast), color var(--transition-fast); }
    .login__btn-arrow svg { width: 20px; height: 20px; display: block; }
    .login__btn:hover .login__btn-arrow { transform: translateX(4px); color: var(--primary-color); }
    .login__note {
      margin-top: var(--space-5);
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted-color);
    }
    @media (max-width: 900px) {
      .login { grid-template-columns: 1fr; }
      .login__aside { display: none; }
      .login__panel { min-height: 100vh; }
    }
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
