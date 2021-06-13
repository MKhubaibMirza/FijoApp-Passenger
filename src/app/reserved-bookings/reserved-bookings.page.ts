import { SocketsService } from './../services/sockets.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataService } from '../services/data.service';
import { PassengerService } from '../services/passenger.service';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-reserved-bookings',
  templateUrl: './reserved-bookings.page.html',
  styleUrls: ['./reserved-bookings.page.scss'],
})
export class ReservedBookingsPage implements OnInit {
  url = environment.baseUrl; 
  constructor(
    public socketsService: SocketsService,
    public passengerService: PassengerService,
    public dataservice: DataService
  ) { }
  socket = this.socketsService.socket;
  MyReservedBookings = [];
  public getMapInstance(map: any): void {
    map.setOptions({ draggable: false });
  };
  ngOnInit() {
    this.passengerService.getAllReservedBookings().subscribe((resp: any) => {
      this.MyReservedBookings = resp.reverse();
    })
  }
  getModifiedDateTime(date) {
    return new Date(new Date(date).toLocaleString());
  }
  getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 60000);
  }
  getStatusForButton(time) {
    let startDate = new Date();
    let endDate;
    if (
      new Date(time).toLocaleString() == 'Invalid Date'
    ) {
      var dateString = time;
      var dateMomentObject = moment(dateString, 'DD/MM/YYYY , hh:mm A');
      endDate = dateMomentObject.toDate();
    } else {
      var dateString = time;
      endDate = new Date(new Date(dateString).toLocaleString());
    }
    let a = this.getMinutesBetweenDates(startDate, endDate).toString();
    let timeDate = a;
    if (a.substr(0, 1) == '-') {
      timeDate = 'Time Up';
    } else {
      var num = JSON.parse(a);
      var hours = (num / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      if (rhours == 0) {
        timeDate = rminutes + " minute(s).";
      } else {
        timeDate = rhours + " hour(s) and " + rminutes + " minute(s).";
      }
    }
    return timeDate;
  }
  cancelJourney(reserveId, driverId) {
    this.dataservice.deleteReserveBooking(reserveId).subscribe((resp: any) => {
      this.ngOnInit();
      let data = {
        receiverId: driverId
      }
      this.socket.emit('is-cancel-reserved', data)
    })
  }
}
