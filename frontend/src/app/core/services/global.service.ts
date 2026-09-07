import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

public GLOBAL_API_URL: any = 'https://real-estate-crm-mbso.onrender.com/';
}
