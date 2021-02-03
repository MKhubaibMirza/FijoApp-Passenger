import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PassengerService } from '../services/passenger.service';

@Component({
  selector: 'app-reserved-bookings',
  templateUrl: './reserved-bookings.page.html',
  styleUrls: ['./reserved-bookings.page.scss'],
})
export class ReservedBookingsPage implements OnInit {
  url = environment.baseUrl;
  constructor(public passengerService: PassengerService) { }
  MyReservedBookings = [];
  public getMapInstance(map: any): void {
    map.setOptions({ draggable: false });
  };
  ngOnInit() {
    this.passengerService.getAllReservedBookings().subscribe((resp: any) => {
      this.MyReservedBookings = resp.reverse();
      setTimeout(() => {
        document.getElementById('map-parent').style.width = "100%";
      }, 900);
      console.log(this.MyReservedBookings)
    })
  }
  getModifiedDateTime(date) {
    return new Date(date);
  }
}
