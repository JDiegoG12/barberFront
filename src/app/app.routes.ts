import { Routes } from '@angular/router';

export const routes: Routes = [
  // --- RUTA DEL PANEL DE ADMINISTRADOR ---
  // Cuando un usuario navegue a '/admin', se cargará perezosamente el AdminLayoutComponent.
  // Este layout contendrá un <router-outlet> para las páginas internas del administrador.
 /*
    --- RUTAS FUTURAS ---
    Cuando construyamos las secciones de admin, barbero y cliente,
    descomentaremos y configuraremos estas rutas. Por ahora, las
    dejamos aquí como referencia para no causar errores.

    {
      path: 'admin',
      loadComponent: () => import('./modules/admin/components/pages/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
    },
    {
      path: 'barbero',
      loadComponent: () => import('./modules/barber/components/pages/barber-agenda/barber-agenda.component').then(c => c.BarberAgendaComponent),
    },
    {
      path: 'cliente',
      loadComponent: () => import('./modules/client/components/pages/client-reservations/client-reservations.component').then(c => c.ClientReservationsComponent),
    },
  */

  // --- RUTA PÚBLICA (PÁGINA DE INICIO) ---
  // Esta es la ruta por defecto (ej. http://localhost:4200/).
  // Carga directamente nuestro HomeComponent. Como el HomeComponent ya utiliza
  // el PublicTemplateComponent (que tiene el Navbar y el Footer), actúa como la página completa.
  {
    path: '',
    loadComponent: () => import('./modules/public/components/pages/home/home.component').then(c => c.HomeComponent),
  },

  // --- RUTA COMODÍN (WILDCARD) ---
  // Si el usuario introduce una URL que no coincide con ninguna de las anteriores (ej. /pagina-inexistente),
  // será redirigido a la ruta raíz (nuestra página de inicio).
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];