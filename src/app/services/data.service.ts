import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  ApiUrl = environment.baseUrl

  constructor(
    public http: HttpClient
  ) { }


  show_flag(code) {
    return this.http.get('https://restcountries.eu/rest/v2/callingcode/' + code);
  }
  getExactPrice(data) {
    return this.http.post(this.ApiUrl + "booking/calculate-estimated-price", data);
  }
}
