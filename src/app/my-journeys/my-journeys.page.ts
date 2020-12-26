import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PassengerService } from '../services/passenger.service';

@Component({
  selector: 'app-my-journeys',
  templateUrl: './my-journeys.page.html',
  styleUrls: ['./my-journeys.page.scss'],
})
export class MyJourneysPage implements OnInit {

  constructor(
    public passengerService: PassengerService,
    public r: Router
  ) { }

  ngOnInit() {
  }
  myJourneys = [];
  ionViewWillEnter() {
    this.passengerService.getAllBookings().subscribe((resp: any) => {
      this.myJourneys = resp.reverse();
    })
  }
  openJourney(item) {
    localStorage.setItem('myJourneyObject', JSON.stringify(item))
  }
}
