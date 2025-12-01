import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://localhost:8081/reportes/admin';
  private barberUrl = 'http://localhost:8081/reportes/barbero';

  constructor(private http: HttpClient) { }

  getServicesReport(month: number, year: number): Observable<ServiceReportItem[]> {
    const params = new HttpParams()
      .set('mes', month.toString())
      .set('anio', year.toString());
    return this.http.get<ServiceReportItem[]>(`${this.baseUrl}/servicios`, { params });
  }

  getCancellationsReport(): Observable<CancellationReportItem[]> {
    return this.http.get<CancellationReportItem[]>(`${this.baseUrl}/cancelaciones`);
  }

  getPerformanceReport(): Observable<PerformanceReportItem[]> {
    return this.http.get<PerformanceReportItem[]>(`${this.baseUrl}/rendimiento`);
  }

  getBarberKpis(barberId: number): Observable<BarberKpiReport> {
    return this.http.get<BarberKpiReport>(`${this.barberUrl}/${barberId}/kpis`);
  }

  getBarberWeeklyServices(barberId: number): Observable<BarberWeeklyServicesReport[]> {
    return this.http.get<BarberWeeklyServicesReport[]>(`${this.barberUrl}/${barberId}/servicios-semanales`);
  }

  getBarberTimeVsReal(barberId: number): Observable<BarberTimeVsRealReport[]> {
    return this.http.get<BarberTimeVsRealReport[]>(`${this.barberUrl}/${barberId}/tiempo-estimado-vs-real`);
  }
}
