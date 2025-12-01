import {Routes} from '@angular/router';
import {AdminTemplateComponent} from './components/templates/admin-template/admin-template.component';

/**
 * Configuración de enrutamiento para el módulo de Admin.
 * Define la estructura de navegación, asignando componentes a rutas específicas y utilizando
 * carga perezosa (Lazy Loading) para optimizar el rendimiento.
 */
export const adminRoutes: Routes = [
  {
    // Ruta base para el módulo admin que utiliza el layout estándar
    path: '',
    component: AdminTemplateComponent,
    children: [
        {
            path: '',
            loadComponent: () => import('./components/pages/barbers/barbers.component').then(c => c.BarbersComponent)
        }, 
        {
        path: 'barbers',
        loadComponent: () => import('./components/pages/barbers/barbers.component').then(c => c.BarbersComponent)
        },
        {
        path: 'services',
        loadComponent: () => import('./components/pages/services/services.component').then(c => c.ServicesComponent)
        },
        {
        path: 'reports',
        loadComponent: () => import('./components/pages/reports/reports.component').then(c => c.ReportsComponent)
        }
    ]
  }
];