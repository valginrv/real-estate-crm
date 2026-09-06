import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Chart,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import {
  DashboardService,
  DashboardStats
} from '../../core/services/dashboard.service';

Chart.register(
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent
  implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('crmChart')
  crmChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('unitsChart')
  unitsChart!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats | null = null;

  loading = false;
  errorMessage = '';

  private crmChartInstance: Chart | null = null;
  private unitsChartInstance: Chart | null = null;

  private viewReady = false;
  private dataReady = false;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryCreateCharts();
  }

  loadStats(): void {

    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getStats().subscribe({

      next: (response: DashboardStats) => {

        console.log('Dashboard response:', response);

        this.stats = response;
        this.loading = false;
        this.dataReady = true;

        /*
         * stats + loading changes inside subscribe.
         * detectChanges() makes canvas available in DOM.
         */
        this.cdr.detectChanges();

        setTimeout(() => {
          this.tryCreateCharts();
        }, 0);
      },

      error: (error) => {

        console.error('Dashboard API Error:', error);

        this.errorMessage =
          error?.error?.message ||
          'Failed to load dashboard';

        this.loading = false;
      }
    });
  }

  private tryCreateCharts(): void {

    if (!this.viewReady) {
      console.log('View not ready');
      return;
    }

    if (!this.dataReady) {
      console.log('Data not ready');
      return;
    }

    if (!this.stats) {
      console.log('Stats not available');
      return;
    }

    if (!this.crmChart) {
      console.log('CRM canvas not available');
      return;
    }

    if (!this.unitsChart) {
      console.log('Units canvas not available');
      return;
    }

    this.createCRMChart();
    this.createUnitsChart();
  }

  private createCRMChart(): void {

    if (this.crmChartInstance) {
      this.crmChartInstance.destroy();
    }

    const totalLeads = this.stats?.totalLeads ?? 0;
    const newLeads = this.stats?.newLeads ?? 0;
    const followUps = this.stats?.followUps ?? 0;
    const bookings = this.stats?.totalBookings ?? 0;

    this.crmChartInstance = new Chart(
      this.crmChart.nativeElement,
      {
        type: 'bar',

        data: {
          labels: [
            'Total Leads',
            'New Leads',
            'Follow-ups',
            'Bookings'
          ],

          datasets: [
            {
              label: 'CRM Count',

              data: [
                totalLeads,
                newLeads,
                followUps,
                bookings
              ],

              borderWidth: 1
            }
          ]
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            },

            tooltip: {
              enabled: true
            }
          },

          scales: {

            y: {
              beginAtZero: true,

              ticks: {
                precision: 0
              }
            }
          }
        }
      }
    );
  }

  private createUnitsChart(): void {

    if (this.unitsChartInstance) {
      this.unitsChartInstance.destroy();
    }

    const availableUnits =
      this.stats?.availableUnits ?? 0;

    const bookedUnits =
      this.stats?.bookedUnits ?? 0;

    this.unitsChartInstance = new Chart(
      this.unitsChart.nativeElement,
      {
        type: 'doughnut',

        data: {

          labels: [
            'Available Units',
            'Booked Units'
          ],

          datasets: [
            {
              data: [
                availableUnits,
                bookedUnits
              ],

              borderWidth: 1
            }
          ]
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          cutout: '65%',

          plugins: {

            legend: {
              position: 'bottom'
            },

            tooltip: {
              enabled: true
            }
          }
        }
      }
    );
  }

  ngOnDestroy(): void {

    if (this.crmChartInstance) {
      this.crmChartInstance.destroy();
    }

    if (this.unitsChartInstance) {
      this.unitsChartInstance.destroy();
    }
  }
}