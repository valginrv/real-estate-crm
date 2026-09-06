import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Unit {
  _id: string;
  unitNumber: string;
  type: '1BHK' | '2BHK' | '3BHK' | '4BHK';
  price: number;
  status: 'Available' | 'Booked';

  buildingId: {
    _id: string;
    name: string;
  };
}

interface UnitResponse {
  count: number;
  units: Unit[];
}

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private apiUrl =
    'https://real-estate-crm-mbso.onrender.com/api/units';

  constructor(private http: HttpClient) {}

 getUnits(
  buildingId: string = '',
  status: string = ''
): Observable<UnitResponse> {

  const params: string[] = [];

  if (buildingId) {
    params.push(
      `buildingId=${encodeURIComponent(buildingId)}`
    );
  }

  if (status) {
    params.push(
      `status=${encodeURIComponent(status)}`
    );
  }

  let url = this.apiUrl;

  if (params.length) {
    url += '?' + params.join('&');
  }

  return this.http.get<UnitResponse>(url);
}
  createUnit(data: {
    buildingId: string;
    unitNumber: string;
    type: string;
    price: number;
  }) {

    return this.http.post(
      this.apiUrl,
      data
    );
  }
}