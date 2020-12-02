import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  ApirUrl = environment.baseUrl

  constructor(
    public http: HttpClient
  ) { }


  login(data) {
    return this.http.post(this.ApirUrl + 'passenger/signin', data)
  }

  sigup(data) {
    return this.http.post(this.ApirUrl + 'passenger/signup', data)
  }

  checkByPhone(data) {
    return this.http.post(this.ApirUrl + 'passenger/find-passenger-by-phn-no', data)
  }

  checkByEmail(data) {
    return this.http.post(this.ApirUrl + 'passenger/find-passenger-by-email', data)
  }

  forgotPassword(data) {
    return this.http.post(this.ApirUrl + 'passenger/forgot-password', data)
  }

}
