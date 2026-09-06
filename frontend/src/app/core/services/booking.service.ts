import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  _id: string;

  leadId: {
    _id: string;
    name: string;
    phone: string;
  };

  unitId: {
    _id: string;
    unitNumber: string;
    type: string;
    price: number;
    status: string;
  };

  bookedBy: {
    _id: string;
    name: string;
    email: string;
  };

  bookingAmount: number;
  status: string;
  bookingDate: string;
}

interface BookingResponse {
  count: number;
  bookings: Booking[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl =
    'https://real-estate-crm-mbso.onrender.com/api/bookings';

  constructor(
    private http: HttpClient
  ) {}

  getBookings(): Observable<BookingResponse> {

    return this.http.get<BookingResponse>(
      this.apiUrl
    );
  }

  createBooking(data: {
    leadId: string;
    unitId: string;
    bookingAmount: number;
  }) {

    return this.http.post(
      this.apiUrl,
      data
    );
  }
}