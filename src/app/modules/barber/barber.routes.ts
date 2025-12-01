import { Routes } from '@angular/router';
import { BarberTemplateComponent } from './components/templates/barber-template/barber-template.component';

export const barberRoutes: Routes = [
  {
    path: '',
    component: BarberTemplateComponent, //Ruta principal gestion de agenda
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/pages/barber-schedule/barber-schedule.component'
          ).then((c) => c.BarberScheduleComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import(
            './components/pages/barber-reports/barber-reports.component'
          ).then((c) => c.BarberReportsComponent),
      },
    ],
  },
];
