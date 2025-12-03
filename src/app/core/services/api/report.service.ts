import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

  constructor(private http: HttpClient) { }

  getBarberMetrics(barberId: string, month?: number, year?: number): Observable<BarberMetrics> {
    let params = new HttpParams();
    if (month) params = params.set('mes', month);
    if (year) params = params.set('anio', year);
    
    return this.http.get<BarberMetrics>(`${this.barberUrl}/${barberId}`, { params });
  }

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
