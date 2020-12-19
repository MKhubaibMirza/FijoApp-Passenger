import { AgmMap, MapsAPILoader } from '@agm/core';
import { Component, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { CancelConfirmationPage } from '../cancel-confirmation/cancel-confirmation.page';
import { RatingPage } from '../rating/rating.page';
import { DriverService } from '../services/driver.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage {
  socket = io(environment.baseUrl);
  DriverDetail = {}
  constructor(
    private mapsAPILoader: MapsAPILoader,
    public modalController: ModalController,
    public alertController: AlertController,
    public driverService: DriverService,
    public router: Router,
    public geolocation: Geolocation
  ) {
    this.socket.on('receive-driver' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      this.DriverFound = true;
      this.DriverDetail = object;
      localStorage.setItem('tracking', JSON.stringify(object));
    });
    setTimeout(() => {
      if (!localStorage.getItem('tracking')) {
        if (this.DriverFound == false) {
          this.presentAlert();
        }
      }
    }, 60000);
  }
  async RatingModal() {
    const modal = await this.modalController.create({
      component: RatingPage,
      cssClass: 'ratingModal'
    });
    return await modal.present();
  }
  latitude: number;
  longitude: number;
  zoom = 17;
  address: string;
  @ViewChild(AgmMap) agmMap: AgmMap;
  private geoCoder;
  public origin = JSON.parse(localStorage.getItem('findDriverObj')).origin;
  public destination = JSON.parse(localStorage.getItem('findDriverObj')).destination;
  public renderOptions = {
    suppressMarkers: true,
    polylineOptions: { strokeColor: '#006600', strokeWeight: 5 }
  }
  currentMarkerAnimation = 'DROP';
  // animation: 'BOUNCE' | 'DROP';
  public currentMarker = {
    url: 'assets/man.png',
    scaledSize: {
      width: 70,
      height: 70
    }
  }
  public markerOptions = {
    origin: {
      icon: {
        url: 'assets/man.png',
        scaledSize: {
          width: 50,
          height: 50
        }
      },
      infoWindow: 'My Location',
      draggable: false,
    },
    destination: {
      icon: {
        url: 'assets/destination.png',
        scaledSize: {
          width: 70,
          height: 50
        }
      },
      infoWindow: 'My Destination',
      draggable: false,
    },
    travelMode: "DRIVING",
  }

  ionViewWillEnter() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.setCurrentLocation();
    });
    if (localStorage.getItem('tracking')) {
      this.DriverDetail = JSON.parse(localStorage.getItem('tracking'));
      this.DriverFound = true;
    } else {
      setTimeout(() => {
        this.isSearching = true;
      }, 2100);
      let findDriverObj = JSON.parse(localStorage.getItem('findDriverObj'));
      this.driverService.findDrivers(findDriverObj).subscribe((resp: any) => {
        if (resp.length !== 0) {
          console.log(resp);
          this.socket.emit('send-data-to-drivers', resp);
        }
      }, er => {
        this.presentAlert();
      })
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Opps! Not Found',
      message: 'Sorry we did not found any driver under 7KM. Try Later',
      buttons: [{
        text: 'Okay',
        handler: () => {
          localStorage.removeItem('findDriverObj');
          this.router.navigate(['/home']);
        }
      }]
    });

    await alert.present();
  }
  // Get Current Location Coordinates
  setCurrentLocation() {
    let options = {
      maximumAge: 3000,
      enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(options).then
      ((position: any) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // this.zoom = 18;
      }, err => {
      });
  }
  DriverFound = false;
  isSearching = false;
  totaltime = '';
  public onResponse(event: any) {
    this.totaltime = event.routes[0]?.legs[0].duration.text;
  }
  async cancelConfirmModal() {
    const modal = await this.modalController.create({
      component: CancelConfirmationPage,
      cssClass: 'cancelconfirm'
    });
    return await modal.present();
  }
  openChat() {
    let driver = JSON.parse(localStorage.getItem('tracking')).driverObj;
    let name = driver.firstName + ' ' + driver.lastName;
    this.router.navigate(['/chat/' + name + '/' + driver.id]);
  }
}
