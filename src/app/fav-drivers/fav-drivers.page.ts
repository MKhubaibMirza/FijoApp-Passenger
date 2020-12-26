import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { DriverService } from '../services/driver.service';

@Component({
  selector: 'app-fav-drivers',
  templateUrl: './fav-drivers.page.html',
  styleUrls: ['./fav-drivers.page.scss'],
})
export class FavDriversPage {

  constructor(
    public driverService: DriverService,
    private callNumber: CallNumber,
  ) { }

  ionViewWillEnter() {
    this.driverService.getAllFavouriteDrivers().subscribe((resp: any) => {
      this.drivers = resp;
    })
  }
  drivers = [];
  call(phoneNumber) {
    if (phoneNumber) {
      this.callNumber.callNumber(phoneNumber, true)
        .then(res =>{})
        .catch(err => {
        });
    }
  }
}
