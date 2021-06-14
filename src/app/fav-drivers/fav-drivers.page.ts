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
      let pn = ""
      if (phoneNumber.substr(0, 2) == '34') {
        pn = "+" + phoneNumber;
      } else {
        pn = "+34" + phoneNumber;
      }
      this.callNumber.callNumber(pn, true)
        .then(res => { });
    }
  }
}
