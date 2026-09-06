import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  stage: string;
  notes?: string;
  followUpDate?: string;
  assignedTo?: {
  _id: string;
  name: string;
  email: string;
};
}


interface LeadResponse {
  count: number;
  leads: Lead[];
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private apiUrl = 'https://real-estate-crm-mbso.onrender.com/api/api/leads';

  constructor(private http: HttpClient) {}

  getLeads(
    search: string = '',
    stage: string = ''
  ): Observable<LeadResponse> {

    let url = this.apiUrl;

    const params: string[] = [];

    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    if (stage) {
      params.push(`stage=${encodeURIComponent(stage)}`);
    }

    if (params.length) {
      url += '?' + params.join('&');
    }

    return this.http.get<LeadResponse>(url);
  }

  createLead(data: {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  stage?: string;
  assignedTo?: string;
  notes?: string;
  followUpDate?: string;
}) {
  return this.http.post(
    this.apiUrl,
    data
  );
}

updateLead(id: string, data: any) {
  return this.http.put(
    `${this.apiUrl}/${id}`,
    data
  );
}
getLeadById(id: string) {
  return this.http.get<Lead>(
    `${this.apiUrl}/${id}`
  );
}
}