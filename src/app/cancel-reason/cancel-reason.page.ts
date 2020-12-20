import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment.prod';
import { DriverService } from '../services/driver.service';
import { PassengerService } from '../services/passenger.service';
@Component({
  selector: 'app-cancel-reason',
  templateUrl: './cancel-reason.page.html',
  styleUrls: ['./cancel-reason.page.scss'],
})
export class CancelReasonPage implements OnInit {
  socket = io(environment.baseUrl);

  constructor(
    public m: ModalController,
    public alertController: AlertController,
    public driverService: DriverService,
    public passengerService: PassengerService,
    public r: Router
  ) { }

  ngOnInit() {
  }
  close() {
    this.m.dismiss();
  }
  cancel(val) {
    let data = {
      reason: '',
      receiverId: JSON.parse(localStorage.getItem('tracking')).driverObj.id
    }
    if (val == 1) {
      data.reason = "It's taking too long"
    } else if (val == 2) {
      data.reason = "I changed my mind"
    } else if (val == 3) {
      data.reason = "The driver requested me to cancel"
    } else if (val == 4) {
      data.reason = "Mistake in my journey details"
    }
    this.socket.emit('cancelRide', data);
    this.m.dismiss();
    // Make status true for both driver and passenger
    // driver availableity false 
    let driverId = JSON.parse(localStorage.getItem('tracking')).driverObj.id;
    let driverData = {
      isAvailable: true
    };
    this.driverService.driverAvailablity(driverId, driverData).subscribe((resp: any) => {
      console.log(resp)
    });

    // passenger availbality false
    let passengerId = JSON.parse(localStorage.getItem('user')).id;
    let passengerData = {
      isAvailable: true
    };
    this.passengerService.passengerAvailablity(passengerId, passengerData).subscribe((resp: any) => {
      console.log(resp)
    });
    this.presentAlert(data.reason);
    this.r.navigate(['/home']);
  }
  async presentAlert(reason) {
    let user = JSON.parse(localStorage.getItem('user'));
    let name = user.firstName + ' ' + user.lastName;
    localStorage.removeItem('findDriverObj');
    localStorage.removeItem('tracking');
    const alert = await this.alertController.create({
      header: 'Ride Cancelled',
      message: 'Dear ' + name + ' your ride is cancelled due to <br>"' + reason + '"',
      buttons: [{
        text: 'Okay',
        handler: () => {
        }
      }]
    });
    await alert.present();
  }
}
