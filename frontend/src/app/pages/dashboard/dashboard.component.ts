import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  DashboardService,
  DashboardStats
} from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  stats: DashboardStats | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    this.dashboardService.getStats().subscribe({
      next: (response) => {
        this.stats = response;
        this.loading = false;
      },

      error: (error) => {
        console.error(error);

        this.errorMessage =
          error.error?.message ||
          'Failed to load dashboard';

        this.loading = false;
      }
    });
  }
}