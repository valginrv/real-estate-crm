import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl =
    'https://real-estate-crm-mbso.onrender.com/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/stats`
    );
  }
}