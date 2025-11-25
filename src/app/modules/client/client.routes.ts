import { Routes } from '@angular/router';
import { ClientTemplateComponent } from './components/templates/client-template/client-template.component';

/**
 * Configuración de enrutamiento para el módulo de Cliente.
 * Define la estructura de navegación, asignando componentes a rutas específicas y utilizando
 * carga perezosa (Lazy Loading) para optimizar el rendimiento.
 */
export const clientRoutes: Routes = [
  {
    // Ruta base para el módulo cliente que utiliza el layout estándar
    path: '',
    component: ClientTemplateComponent, // Layout con Navbar (con sesión iniciada) y Footer
    children: [
      {
        // Ruta por defecto (/client): Muestra la página de inicio del cliente
        path: '',
        loadComponent: () => import('./components/pages/client-home/client-home.component').then(m => m.ClientHomeComponent)
      },
      {
        // Ruta para la gestión de reservas (/client/reservations)
        // Muestra el historial y las citas próximas
        path: 'reservations',
        loadComponent: () => import('./components/pages/client-reservations/client-reservations.component').then(m => m.ClientReservationsComponent)
      }
    ]
  },
  {
    // Ruta para el Asistente de Reserva (/client/book)
    // Se define fuera del 'children' anterior para no heredar el ClientTemplateComponent.
    // Esto permite que el Wizard tenga su propio diseño limpio (sin Navbar estándar) para enfocar al usuario.
    path: 'book',
    loadComponent: () => import('./components/pages/booking-page/booking-page.component').then(m => m.BookingPageComponent)
  }
];