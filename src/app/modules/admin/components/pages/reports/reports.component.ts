import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration, ChartOptions } from 'chart.js';
import { ReportService, ServiceReportItem, CancellationReportItem, PerformanceReportItem } from '../../../../../core/services/api/report.service';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  currentMonthYear: string = '';

  // Performance Chart (Horizontal Bar)
  public performanceChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: '% Ocupación', backgroundColor: [], barThickness: 20 }]
  };
  public performanceChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#aaa' }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#aaa' }
      }
    }
  };

  // Cancellations Chart (Line)
  public cancellationsChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Cancelaciones',
      borderColor: '#ff4d4d',
      backgroundColor: 'rgba(255, 77, 77, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#ff4d4d'
    }]
  };
  public cancellationsChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#aaa' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#aaa', stepSize: 1 }
      }
    }
  };

  // Services Chart (Vertical Bar)
  public servicesChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Cantidad',
      backgroundColor: '#8d6e63',
      hoverBackgroundColor: '#a1887f'
    }]
  };
  public servicesChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#aaa' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#aaa' }
      }
    }
  };

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    const now = new Date();
    const monthName = now.toLocaleString('es-ES', { month: 'long' });
    this.currentMonthYear = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${now.getFullYear()}`;

    // Fetch Performance
    this.reportService.getPerformanceReport().subscribe({
      next: (data) => this.updatePerformanceChart(data),
      error: (err) => console.error('Error fetching performance report', err)
    });

    // Fetch Cancellations
    this.reportService.getCancellationsReport().subscribe({
      next: (data) => this.updateCancellationsChart(data),
      error: (err) => console.error('Error fetching cancellations report', err)
    });

    // Fetch Services
    // Using current month and year
    this.reportService.getServicesReport(now.getMonth() + 1, now.getFullYear()).subscribe({
      next: (data) => this.updateServicesChart(data),
      error: (err) => console.error('Error fetching services report', err)
    });
  }

  private updatePerformanceChart(data: PerformanceReportItem[]): void {
    const labels = data.map(item => item.nombre);
    const values = data.map(item => item.ocupacionPorcentaje);
    // Assign colors based on value or index if needed, for now using a gold/beige color like in the image
    // The image has one green bar (maybe the user?) and others beige.
    // I'll just use beige for all for simplicity, or random.
    // Image: Carlos (Beige), Miguel (Beige), Andrés (Green), Santiago (Beige).
    // I'll use a function to set color.
    const colors = values.map(v => v > 50 ? '#00c853' : '#d7ccc8'); // Example logic

    this.performanceChartData = {
      labels: labels,
      datasets: [{
        data: values,
        label: '% Ocupación',
        backgroundColor: colors,
        barThickness: 20,
        borderRadius: 4
      }]
    };
  }

  private updateCancellationsChart(data: CancellationReportItem[]): void {
    // Assuming data is sorted by day
    const labels = data.map(item => `Dia ${item.dia}`);
    const values = data.map(item => item.cantidad);

    this.cancellationsChartData = {
      labels: labels,
      datasets: [{
        data: values,
        label: 'Cancelaciones',
        borderColor: '#ff5252',
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ff5252',
        pointRadius: 3
      }]
    };
  }

  private updateServicesChart(data: ServiceReportItem[]): void {
    const labels = data.map(item => item.servicio);
    const values = data.map(item => item.cantidad);

    this.servicesChartData = {
      labels: labels,
      datasets: [{
        data: values,
        label: 'Solicitudes',
        backgroundColor: '#8d6e63',
        hoverBackgroundColor: '#a1887f',
        borderRadius: 4
      }]
    };
  }
}
