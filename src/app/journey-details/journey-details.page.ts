import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-journey-details',
  templateUrl: './journey-details.page.html',
  styleUrls: ['./journey-details.page.scss'],
})
export class JourneyDetailsPage implements OnInit {
  url = environment.baseUrl;
  constructor(public nav: NavController) { }

  ngOnInit() {
    this.journeyObject = JSON.parse(localStorage.getItem('myJourneyObject'));
    setTimeout(() => {
      document.getElementById('map-parent').style.width = "90%";
    }, 100);
  }
  journeyObject = {
    amount: null,
    cancellReason: null,
    createdAt: "",
    destination: "",
    driverId: 0,
    exactPriceForDriver: 0,
    exactPriceForPassenger: 0,
    id: 0,
    passengerId: 0,
    paymentVia: "",
    pickup: "",
    screenShot: "",
    status: "",
    totalCost: "",
    updatedAt: "",
    driver: {
      email: "",
      firstName: "",
      driverPhoto: "",
      lastName: ""
    }
  }
  back() {
    this.nav.back();
  }
  ionViewWillLeave() {
    localStorage.removeItem('myJourneyObject');
  }
}
