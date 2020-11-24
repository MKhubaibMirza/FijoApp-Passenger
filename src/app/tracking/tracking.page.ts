import { AgmMap, MapsAPILoader } from '@agm/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { CancelConfirmationPage } from '../cancel-confirmation/cancel-confirmation.page';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage {
  constructor(
    private mapsAPILoader: MapsAPILoader,
    public modalController: ModalController,
    public geolocation: Geolocation
  ) { 
  }
  latitude: number;
  longitude: number;
  zoom = 17;
  address: string;
  @ViewChild(AgmMap) agmMap: AgmMap;
  private geoCoder;
  public origin = JSON.parse(localStorage.getItem('trackingRoute')).origin;
  public destination = JSON.parse(localStorage.getItem('trackingRoute')).destination;
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
    setTimeout(() => {
      this.isSearching = true;
    }, 3300);
    setTimeout(() => {
      this.DriverFound = true;
    }, 7000);
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 17;
          this.origin = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  // Get Current Location Coordinates
  setCurrentLocation() {
    let options = {
      maximumAge: 3000,
      enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(options).then
      ((position: any) => {
        console.log(position)
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // this.zoom = 18;
        this.getAddress(this.latitude, this.longitude);
      }, err => {
        console.log(err)
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
}
