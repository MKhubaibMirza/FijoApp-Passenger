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
}