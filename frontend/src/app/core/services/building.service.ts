import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl = 'https://real-estate-crm-mbso.onrender.com/api/buildings';

  constructor(private http: HttpClient) {}

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