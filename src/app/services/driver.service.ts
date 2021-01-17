import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class DriverService {
    ApiUrl = environment.baseUrl
    constructor(
        public http: HttpClient
    ) { }
    findDrivers(data) {
        return this.http.post(this.ApiUrl + 'booking/find-nearby-drivers', data)
    }
    driverAvailablity(id, data) {
        return this.http.post(this.ApiUrl + 'driver/change-driver-availabiliy-status/' + id, data);
    }
    rateDriver(id, data) {
        return this.http.post(this.ApiUrl + 'driver/rating/' + id, data);
    }
    addtoFavourites(data) {
        return this.http.post(this.ApiUrl + 'favorite-driver/create/', data);
    }
    getAllFavouriteDrivers() {
        return this.http.get(this.ApiUrl + 'favorite-driver/getall/' + JSON.parse(localStorage.getItem('user')).id);
    }
    Check_Is_Login() {
        return this.http.get(this.ApiUrl + 'passenger/is_Driver_Login/' + JSON.parse(localStorage.getItem('user')).id)
    }
}