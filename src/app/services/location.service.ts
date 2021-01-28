import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { PassengerService } from './passenger.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    public geolocation: Geolocation,
    public androidPermissions: AndroidPermissions,
    public locationAccuracy: LocationAccuracy,
    public passengerService: PassengerService,
    public nativeGeocoder: NativeGeocoder,
    public modal: ModalController,
    public r: Router
  ) {
  }
  //Check if application having GPS access permission  
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {

          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {

          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        this.modal.dismiss();
      }
    );
  }
  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              this.modal.dismiss();
            }
          );
      }
    });
  }
  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        setTimeout(() => {
          this.modal.dismiss();
        }, 1800);
        this.TrackPassengerLocation();
      }
    ).catch(err => {
      navigator['app'].exitApp();
    });
  }
  TrackingCounter = 0;
  TrackPassengerLocation() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data: any) => {
      this.TrackingCounter = this.TrackingCounter + 1;
      if (this.TrackingCounter == 23) {
        this.TrackingCounter = 0;
        let locObj = {
          currentLat: data.coords.latitude,
          currentLng: data.coords.longitude,
          city: '',
          address: '',
          postalCode: ''
        };
        let opt: NativeGeocoderOptions = {
          useLocale: false,
          maxResults: 1
        };
        this.nativeGeocoder.reverseGeocode(data.coords.latitude, data.coords.longitude, opt)
          .then((result: NativeGeocoderResult[]) => {
            locObj.city = result[0].locality;
            locObj.address = result[0].subLocality + ' ' + result[0].thoroughfare;
            locObj.postalCode = result[0].postalCode;
            if (localStorage.getItem('user')) {
              let id = JSON.parse(localStorage.getItem('user')).id;
              this.passengerService.updatePassengerLocation(locObj, id).subscribe((resp: any) => { })
            }
          })
      }
    });
  }
  updateLocationInstantly() {
    let geolocation = this.geolocation.getCurrentPosition();
    geolocation.then((data: any) => {
      let locObj = {
        currentLat: data.coords.latitude,
        currentLng: data.coords.longitude,
        city: '',
        address: '',
        postalCode: ''
      };
      let opt: NativeGeocoderOptions = {
        useLocale: false,
        maxResults: 1
      };
      this.nativeGeocoder.reverseGeocode(data.coords.latitude, data.coords.longitude, opt)
        .then((result: NativeGeocoderResult[]) => {
          locObj.city = result[0].locality;
          locObj.address = result[0].subLocality + ' ' + result[0].thoroughfare;
          locObj.postalCode = result[0].postalCode;
          if (localStorage.getItem('user')) {
            let id = JSON.parse(localStorage.getItem('user')).id;
            this.passengerService.updatePassengerLocation(locObj, id).subscribe((resp: any) => { })
          }
        })
    });
  }
}
