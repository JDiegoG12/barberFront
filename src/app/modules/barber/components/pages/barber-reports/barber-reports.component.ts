import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';

import { ReportService, BarberMetrics } from '../../../../../core/services/api/report.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { User } from '../../../../../core/models/views/user.view.model';

@Component({
    selector: 'app-barber-reports',
    imports: [],
    templateUrl: './barber-reports.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './barber-reports.component.scss'
})
export class BarberReportsComponent implements OnInit {
  private reportService = inject(ReportService);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  loading = true;
  metrics: BarberMetrics | null = null;

  async ngOnInit() {
    this.currentUser = await this.authService.getUserProfile();
    if (this.currentUser) {
      this.loadReports(this.currentUser.id);
    }
  }

  loadReports(barberId: string) {
    this.loading = true;
    
    this.reportService.getBarberMetrics(barberId).subscribe({
      next: (data) => {
        this.metrics = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading metrics', err);
        this.loading = false;
      }
    });
  }
}
