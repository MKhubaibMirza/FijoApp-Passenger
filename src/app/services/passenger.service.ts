import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  ApiUrl = environment.baseUrl;
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
    return this.http.post(this.ApiUrl + "passenger/update-password/" + id, data);
  }
  forgot(data) {
    return this.http.post(this.ApiUrl + "passenger/forgot-password", data);
  }
  updatePassengerLocation(data, id) {
    return this.http.post(this.ApiUrl + "passenger/update-current-location/" + id, data);
  }
  changePasswrod(id, data) {
    return this.http.post(this.ApiUrl + 'passenger/resetpassword/' + id, data)
  }
  // Passenger Preferences
  update_opendoor(data) {
    return this.http.post(this.ApiUrl + "passenger-prefrence/update-passengerpreference-opendoor/" + JSON.parse(localStorage.getItem('user')).id, data);
  }
  update_aircondition(data) {
    return this.http.post(this.ApiUrl + "passenger-prefrence/update-passengerpreference-aircondition/" + JSON.parse(localStorage.getItem('user')).id, data);
  }
  update_conversation(data) {
    return this.http.post(this.ApiUrl + "passenger-prefrence/update-passengerpreference-conversation/" + JSON.parse(localStorage.getItem('user')).id, data);
  }
  update_passenger_preference_call(data) {
    return this.http.post(this.ApiUrl + "passenger-prefrence/update-passengerpreference-call/" + JSON.parse(localStorage.getItem('user')).id, data);
  }
  getMyPreferences() {
    return this.http.get(this.ApiUrl + 'passenger-prefrence/get-by-passenger/' + JSON.parse(localStorage.getItem('user')).id);
  }
  // ----------------
  getAvailabilityStatus() {
    return this.http.get(this.ApiUrl + 'passenger/get-availability-status/' + JSON.parse(localStorage.getItem('user')).id)
  }
  passengerAvailablity(id, data) {
    return this.http.post(this.ApiUrl + 'passenger/change-passenger-availabiliy-status/' + id, data)
  }
  // ----------------
  getAllBookings() {
    return this.http.get(this.ApiUrl + 'booking/getall-customer-bookings/' + JSON.parse(localStorage.getItem('user')).id);
  }
  // ----------------
  updateInfo(data) {
    return this.http.post(this.ApiUrl + 'passenger/update/' + JSON.parse(localStorage.getItem('user')).id, data);
  }
  logoutDriver(id) {
    return this.http.post(this.ApiUrl + 'passenger/logout/' + id, {})
  }
}
