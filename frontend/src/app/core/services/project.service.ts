import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

export interface Project {
  _id: string;
  name: string;
  location: string;
  description?: string;
}

interface ProjectResponse {
  count: number;
  projects: Project[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl: string;

  constructor(private http: HttpClient, public globalService: GlobalService) {
    this.apiUrl = `${this.globalService.GLOBAL_API_URL}api/projects`;
  }

  getProjects(): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(this.apiUrl);
  }

  createProject(data: {
    name: string;
    location: string;
    description?: string;
  }) {
    return this.http.post(this.apiUrl, data);
  }

  updateProject(
  id: string,
  data: {
    name: string;
    location: string;
    description?: string;
  }
) {
  return this.http.put(
    `${this.apiUrl}/${id}`,
    data
  );
}

deleteProject(id: string) {
  return this.http.delete(
    `${this.apiUrl}/${id}`
  );
}
}