import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface SalesEmployee {
  _id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string;

  constructor(private http: HttpClient, public globalService: GlobalService) {
     this.apiUrl = `${this.globalService.GLOBAL_API_URL}api/auth`;
  }

  login(data: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    );
  }

  getSalesEmployees() {
  return this.http.get<SalesEmployee[]>(
    `${this.apiUrl}/sales-employees`
  );
}
}