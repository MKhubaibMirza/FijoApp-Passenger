import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { DriverService } from '../services/driver.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {

  constructor(
    public m: ModalController,
    public r: Router,
    public driverService: DriverService
  ) { }
  url = environment.baseUrl;
  ngOnInit() {
    this.price = JSON.parse(localStorage.getItem('findDriverObj')).exactPriceForPassenger;
    this.paymentVia = JSON.parse(localStorage.getItem('findDriverObj')).paymentVia;
    this.driverImg = JSON.parse(localStorage.getItem('tracking')).driverObj.driverPhoto;
    this.driverId = JSON.parse(localStorage.getItem('tracking')).driverObj.id;
    this.driverName = JSON.parse(localStorage.getItem('tracking')).driverObj.firstName + ' ' + JSON.parse(localStorage.getItem('tracking')).driverObj.lastName;
  }
  price = 0;
  driverImg = '';
  driverName = '';
  paymentVia = '';
  driverId = '';
  data = {
    rating: 0
  }

  condi1 = false;
  condi2 = false;
  condi3 = false;
  condi4 = false;
  condi5 = false;
  func(val) {
    this.data.rating = val
    if (val == 1) {
      this.condi1 = true;
      this.condi2 = false;
      this.condi3 = false;
      this.condi4 = false;
      this.condi5 = false;
    }
    else if (val == 2) {
      this.condi1 = true;
      this.condi2 = true;
      this.condi3 = false;
      this.condi4 = false;
      this.condi5 = false;
    }
    else if (val == 3) {
      this.condi1 = true;
      this.condi2 = true;
      this.condi3 = true;
      this.condi4 = false;
      this.condi5 = false;
    }
    else if (val == 4) {
      this.condi1 = true;
      this.condi2 = true;
      this.condi3 = true;
      this.condi4 = true;
      this.condi5 = false;
    }
    else if (val == 5) {
      this.condi1 = true;
      this.condi2 = true;
      this.condi3 = true;
      this.condi4 = true;
      this.condi5 = true;
    }
  }
  favrouiteDriver = true;
  onSubmitClick() {
    console.log("rating = ", this.data.rating);
    this.driverService.rateDriver(this.driverId, this.data).subscribe((resp: any) => {
      console.log(resp);
      if (this.favrouiteDriver) {
        let favrouiteDriverData = {
          driverId: this.driverId,
          passengerId: JSON.parse(localStorage.getItem('user')).id
        }
        this.driverService.addtoFavourites(favrouiteDriverData).subscribe((innerResp: any) => {
          console.log(innerResp);
        })
        localStorage.removeItem('findDriverObj');
        localStorage.removeItem('tracking');
        localStorage.removeItem('tripEnded');
        localStorage.removeItem('tripStarted');
        this.m.dismiss();
        this.r.navigate(['/home']);
      } else {
        localStorage.removeItem('findDriverObj');
        localStorage.removeItem('tracking');
        localStorage.removeItem('tripEnded');
        localStorage.removeItem('tripStarted');
        this.m.dismiss();
        this.r.navigate(['/home']);
      }
    })
  }
}
