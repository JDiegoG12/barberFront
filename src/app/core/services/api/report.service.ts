import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MockStore } from '../../mocks/mock-store.service';

export interface ServiceReportItem {
  servicio: string;
  cantidad: number;
}

export interface CancellationReportItem {
  dia: number;
  cantidad: number;
}

export interface PerformanceReportItem {
  barberoId: number;
  nombre: string;
  ocupacionPorcentaje: number;
}

export interface BarberKpiReport {
  citasTotales: number;
  citasTotalesVariacion: number;
  tiempoPromedio: number;
  productividad: number;
}

export interface BarberWeeklyServicesReport {
  dia: string;
  cantidad: number;
}

export interface BarberTimeVsRealReport {
  servicio: string;
  tiempoEstimado: number;
  tiempoReal: number;
}

export interface BarberMetrics {
  barberoId: string;
  mes: number;
  ocupacion: number;
  serviciosCompletados: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = `${environment.apiUrl}/reportes/admin`;
  private barberUrl = `${environment.apiUrl}/reportes/barbero`;

  private mock = inject(MockStore);

  constructor(private http: HttpClient) { }

  getBarberMetrics(barberId: string, month?: number, year?: number): Observable<BarberMetrics> {
    if (environment.useMock) {
      const completed = this.mock.getReservationsByBarber(barberId).filter(r => r.status === 'Finalizada').length;
      return of({
        barberoId: barberId,
        mes: month ?? new Date().getMonth() + 1,
        ocupacion: Math.min(95, 40 + completed * 10),
        serviciosCompletados: completed
      });
    }
    let params = new HttpParams();
    if (month) params = params.set('mes', month);
    if (year) params = params.set('anio', year);

    return this.http.get<BarberMetrics>(`${this.barberUrl}/${barberId}`, { params });
  }

  getServicesReport(month: number, year: number): Observable<ServiceReportItem[]> {
    if (environment.useMock) {
      const counts = new Map<string, number>();
      this.mock.getAllReservations().forEach(r => {
        const name = r.service?.name ?? 'Servicio';
        counts.set(name, (counts.get(name) ?? 0) + 1);
      });
      const items = Array.from(counts.entries()).map(([servicio, cantidad]) => ({ servicio, cantidad }));
      return of(items.sort((a, b) => b.cantidad - a.cantidad));
    }
    const params = new HttpParams()
      .set('mes', month.toString())
      .set('anio', year.toString());
    return this.http.get<ServiceReportItem[]>(`${this.baseUrl}/servicios`, { params });
  }

  getCancellationsReport(): Observable<CancellationReportItem[]> {
    if (environment.useMock) {
      // Cancelaciones por día de la semana (0=Dom..6=Sáb)
      const counts = [0, 0, 0, 0, 0, 0, 0];
      this.mock.getAllReservations()
        .filter(r => r.status === 'Cancelada')
        .forEach(r => counts[r.start.getDay()]++);
      return of(counts.map((cantidad, dia) => ({ dia, cantidad })));
    }
    return this.http.get<CancellationReportItem[]>(`${this.baseUrl}/cancelaciones`);
  }

  getPerformanceReport(): Observable<PerformanceReportItem[]> {
    if (environment.useMock) {
      const items = this.mock.getActiveBarbers().map((b, i) => {
        const total = this.mock.getReservationsByBarber(b.id).length;
        return {
          barberoId: i + 1,
          nombre: `${b.name} ${b.lastName}`.trim(),
          ocupacionPorcentaje: Math.min(100, 30 + total * 12)
        };
      });
      return of(items);
    }
    return this.http.get<PerformanceReportItem[]>(`${this.baseUrl}/rendimiento`);
  }

  getBarberKpis(barberId: number): Observable<BarberKpiReport> {
    if (environment.useMock) {
      const total = this.mock.getReservationsByBarber(String(barberId)).length;
      return of({
        citasTotales: total,
        citasTotalesVariacion: 12,
        tiempoPromedio: 35,
        productividad: Math.min(100, 50 + total * 8)
      });
    }
    return this.http.get<BarberKpiReport>(`${this.barberUrl}/${barberId}/kpis`);
  }

  getBarberWeeklyServices(barberId: number): Observable<BarberWeeklyServicesReport[]> {
    if (environment.useMock) {
      const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const counts = [0, 0, 0, 0, 0, 0, 0];
      this.mock.getReservationsByBarber(String(barberId)).forEach(r => counts[r.start.getDay()]++);
      return of(dias.map((dia, i) => ({ dia, cantidad: counts[i] })));
    }
    return this.http.get<BarberWeeklyServicesReport[]>(`${this.barberUrl}/${barberId}/servicios-semanales`);
  }

  getBarberTimeVsReal(barberId: number): Observable<BarberTimeVsRealReport[]> {
    if (environment.useMock) {
      const seen = new Map<string, number>();
      this.mock.getReservationsByBarber(String(barberId)).forEach(r => {
        if (r.service && !seen.has(r.service.name)) {
          seen.set(r.service.name, r.service.duration);
        }
      });
      const items = Array.from(seen.entries()).map(([servicio, tiempoEstimado]) => ({
        servicio,
        tiempoEstimado,
        tiempoReal: Math.round(tiempoEstimado * 1.1)
      }));
      return of(items);
    }
    return this.http.get<BarberTimeVsRealReport[]>(`${this.barberUrl}/${barberId}/tiempo-estimado-vs-real`);
  }
}
