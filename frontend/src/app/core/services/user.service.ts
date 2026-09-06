import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SalesUserResponse {
  count: number;
  users: SalesUser[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl =
    'https://real-estate-crm-mbso.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  getSalesUsers(): Observable<SalesUserResponse> {

    return this.http.get<SalesUserResponse>(
      `${this.apiUrl}/sales`
    );
  }

  createSalesUser(data: {
    name: string;
    email: string;
    password: string;
  }) {

    return this.http.post(
      `${this.apiUrl}/sales`,
      data
    );
  }
}