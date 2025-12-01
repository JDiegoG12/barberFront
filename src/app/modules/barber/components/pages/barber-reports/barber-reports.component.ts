import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration, ChartOptions } from 'chart.js';
import { ReportService, BarberKpiReport, BarberWeeklyServicesReport, BarberTimeVsRealReport } from '../../../../../core/services/api/report.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { User } from '../../../../../core/models/views/user.view.model';

Chart.register(...registerables);

@Component({
  selector: 'app-barber-reports',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './barber-reports.component.html',
  styleUrl: './barber-reports.component.scss'
})
export class BarberReportsComponent implements OnInit {
  private reportService = inject(ReportService);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  loading = true;

  // KPIs
  kpis: BarberKpiReport = {
    citasTotales: 0,
    citasTotalesVariacion: 0,
    tiempoPromedio: 0,
    productividad: 0
  };

  // Services Chart (Line - Weekly)
  public servicesChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Servicios',
      borderColor: '#eab308', // Yellow/Gold
      backgroundColor: 'rgba(234, 179, 8, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#eab308'
    }]
  };
  public servicesChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#aaa' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#aaa', stepSize: 1 }
      }
    }
  };

  // Time vs Real Chart (Horizontal Bar)
  public timeVsRealChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Tiempo Estimado', 
        backgroundColor: '#4b5563', // Gray
        barThickness: 12
      },
      { 
        data: [], 
        label: 'Tiempo Real', 
        backgroundColor: '#8d6e63', // Brownish
        barThickness: 12
      }
    ]
  };
  public timeVsRealChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#aaa' } },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#aaa' }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#aaa' }
      }
    }
  };

  async ngOnInit() {
    this.currentUser = await this.authService.getUserProfile();
    if (this.currentUser) {
      // Assuming ID is numeric or can be parsed. If it's a UUID, the backend needs to handle it.
      // For now, we'll try to parse it, or pass 1 as fallback for mock data if parsing fails (NaN).
      let barberId = parseInt(this.currentUser.id);
      if (isNaN(barberId)) {
        // Fallback for UUIDs in mock environment if needed, or just pass 1 for demo
        barberId = 1; 
      }
      
      this.loadReports(barberId);
    }
  }

  loadReports(barberId: number) {
    this.loading = true;
    
    // Load KPIs
    this.reportService.getBarberKpis(barberId).subscribe({
      next: (data) => this.kpis = data,
      error: (err) => console.error('Error loading KPIs', err)
    });

    // Load Weekly Services
    this.reportService.getBarberWeeklyServices(barberId).subscribe({
      next: (data) => {
        this.servicesChartData.labels = data.map(d => d.dia);
        this.servicesChartData.datasets[0].data = data.map(d => d.cantidad);
        // Force update chart
        this.servicesChartData = { ...this.servicesChartData };
      },
      error: (err) => console.error('Error loading weekly services', err)
    });

    // Load Time vs Real
    this.reportService.getBarberTimeVsReal(barberId).subscribe({
      next: (data) => {
        this.timeVsRealChartData.labels = data.map(d => d.servicio);
        this.timeVsRealChartData.datasets[0].data = data.map(d => d.tiempoEstimado);
        this.timeVsRealChartData.datasets[1].data = data.map(d => d.tiempoReal);
        // Force update chart
        this.timeVsRealChartData = { ...this.timeVsRealChartData };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading time vs real', err);
        this.loading = false;
      }
    });
  }
}
