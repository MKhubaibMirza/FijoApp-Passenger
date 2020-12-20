import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {

  constructor() { }
  url = environment.baseUrl;
  ngOnInit() {
    this.price = JSON.parse(localStorage.getItem('findDriverObj')).exactPriceForPassenger;
    this.paymentVia = JSON.parse(localStorage.getItem('findDriverObj')).paymentVia;
    this.driverImg = JSON.parse(localStorage.getItem('tracking')).driverObj.driverPhoto;
    this.driverName = JSON.parse(localStorage.getItem('tracking')).driverObj.firstName + ' ' + JSON.parse(localStorage.getItem('tracking')).driverObj.lastName;
  }
  price = 0;
  driverImg = '';
  driverName = '';
  paymentVia = '';
}
