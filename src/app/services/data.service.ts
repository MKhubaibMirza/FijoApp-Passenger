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
    return this.http.get('https://restcountries.eu/rest/v2/callingcode/' + code + '?fields=flag');
  }
  getContryCodeAndFlag(contryName) {
    return this.http.get('https://restcountries.eu/rest/v2/name/' + contryName + '?fields=callingCodes;flag');
  }
  getExactPrice(data) {
    return this.http.post(this.ApiUrl + "booking/calculate-estimated-price", data);
  }
  saved_location_create(data) {
    return this.http.post(this.ApiUrl + 'saved-location/create', data);
  }
  saved_location_get() {
    return this.http.get(this.ApiUrl + 'passenger/getall-saved-locations/' + JSON.parse(localStorage.getItem('user')).id);
  }
  saved_location_delete(id) {
    return this.http.post(this.ApiUrl + 'saved-location/delete/' + id, {});
  }
  createContactUs(data) {
    return this.http.post(this.ApiUrl + 'contact-us/create', data);
  }
}
