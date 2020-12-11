import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  ApiUrl = environment.baseUrl

  constructor(
    public http: HttpClient
  ) { }


  login(data) {
    return this.http.post(this.ApiUrl + 'passenger/signin', data)
  }

  sigup(data) {
    return this.http.post(this.ApiUrl + 'passenger/signup', data)
  }

  checkByPhone(data) {
    return this.http.post(this.ApiUrl + 'passenger/find-passenger-by-phn-no', data)
  }

  checkByEmail(data) {
    return this.http.post(this.ApiUrl + 'passenger/find-passenger-by-email', data)
  }

  forgotPassword(data) {
    return this.http.post(this.ApiUrl + 'passenger/forgot-password', data)
  }
  changepass(data, id) {
    return this.http.post(this.ApiUrl + "passenger/updatepassword/" + id, data);
  }
  forgot(data) {
    return this.http.post(this.ApiUrl + "passenger/forgot", data);
  }
}
