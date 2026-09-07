import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

export interface SalesUser {
  _id: string;
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

  private apiUrl: string;

  constructor(private http: HttpClient, public globalService: GlobalService) {
    this.apiUrl = `${this.globalService.GLOBAL_API_URL}api/users`;
  }

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