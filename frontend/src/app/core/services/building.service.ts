import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

export interface Building {
  _id: string;
  name: string;
  projectId: {
    _id: string;
    name: string;
    location: string;
  };
}

interface BuildingResponse {
  count: number;
  buildings: Building[];
}

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  private apiUrl: string;

  constructor(private http: HttpClient, public globalService: GlobalService) {
    this.apiUrl = `${this.globalService.GLOBAL_API_URL}api/buildings`;
  }

  getBuildings(projectId: string): Observable<BuildingResponse> {
    return this.http.get<BuildingResponse>(
      `${this.apiUrl}?projectId=${projectId}`
    );
  }

  createBuilding(data: {
    projectId: string;
    name: string;
  }) {
    return this.http.post(
      this.apiUrl,
      data
    );
  }
}