import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  followUps: number;
  totalBookings: number;
  availableUnits: number;
  bookedUnits: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl: string;

  constructor(private http: HttpClient, public globalService: GlobalService) {
    this.apiUrl = `${this.globalService.GLOBAL_API_URL}api/dashboard`;
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/stats`
    );
  }
}