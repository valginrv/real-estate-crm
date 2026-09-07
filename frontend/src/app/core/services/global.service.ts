import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() {}

  public LOCAL: boolean = false;

  public GLOBAL_API_URL: string = this.LOCAL
    ? 'http://localhost:5000/'
    : 'https://real-estate-crm-mbso.onrender.com/';
}