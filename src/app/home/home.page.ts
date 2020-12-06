import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  GoogleMapsAPIWrapper,
  AgmMap,
  MapsAPILoader,
} from "@agm/core";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AskPaymentWayPage } from '../ask-payment-way/ask-payment-way.page';
import { WelcomeUserPage } from '../welcome-user/welcome-user.page';
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private menuControl: MenuController,
    public platform: Platform,
    public toastController: ToastController,
    private ngZone: NgZone,
    public modalController: ModalController,
    private geolocation: Geolocation
  ) {
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  openMenu() {
    this.menuControl.enable(true);
    this.menuControl.open();
  }
  latitude: number;
  longitude: number;
  currntLAT = 750;
  currntLONG = 700;
  zoom = 17;
  address: string;
  private geoCoder;
  public origin = ''
  public destination = ''
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
      draggable: true,
    },
    travelMode: "DRIVING",
  }
  @ViewChild('search')
  public searchElementRef: ElementRef;
  @ViewChild(AgmMap) agmMap: AgmMap;
  carsTypes = [
    {
      title: 'Lite',
      seats: '4',
      price: '15',
      condition: false,
      image: 'assets/taxidemo.jpg'
    },
    {
      title: 'Sedan',
      seats: '5',
      price: '17',
      condition: false,
      image: 'assets/taxidemo.jpg'
    },
    {
      title: 'Wagon',
      seats: '6',
      price: '17',
      condition: false,
      image: 'assets/taxidemo.jpg'
    }
  ];
  selectedCar;
  selectCar(item, i) {
    this.selectedCar = item;
    this.carsTypes.forEach((element, index) => {
      console.log(i, index);
      if (index == i) {
        this.carsTypes[index].condition = true;
      } else {
        this.carsTypes[index].condition = false;
      }
    });
  }
  async AskPayWay() {
    if (this.selectedCar == undefined) {
      this.presentToast('Please select your ride');
    } else {
      let data = {
        origin: this.origin,
        destination: this.destination
      }
      localStorage.setItem('trackingRoute', JSON.stringify(data))
      const modal = await this.modalController.create({
        component: AskPaymentWayPage,
        cssClass: 'askpayway'
      });
      await modal.present();
    }
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      color: 'primary',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  ionViewWillEnter() {
    this.presentUser();
    // uncomment below when using real device
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.setCurrentLocation();
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          // this.latitude = place.geometry.location.lat();
          // this.longitude = place.geometry.location.lng();
          // this.zoom = 18;
          this.destination = place.formatted_address;
          this.getDirection();
        });
      });
    });
  }

  locationClick() {
    this.setCurrentLocation();
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
  totaltime = '';
  totaldistance = '';
  public onResponse(event: any) {
    if (event.status == "NOT_FOUND") {
      this.directionCondition = false;
      this.presentToast('Invalid Route. Try Again!');
    } else {
      this.totaldistance = event.routes[0]?.legs[0].distance.text;
      this.totaltime = event.routes[0]?.legs[0].duration.text;
    }
  }
  markerDragEnd(event: any) {
    let coords = JSON.stringify(event);
    let coords3 = JSON.parse(coords);
    this.geoCoder.geocode({ 'location': { lat: coords3.lat, lng: coords3.lng } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.destination = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  getDirection() {
    console.log(this.destination, ' <== Destination')
    console.log(this.origin, ' <== origin')
    if ((this.destination !== '') && (this.origin !== '')) {
      this.directionCondition = true;
    } else {
      this.presentToast('Please enter your destination')
    }
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
  directionCondition = false;
  CancelClick() {
    this.directionCondition = false;
  }
  heightOfCard = '';
  toUp = ''
  consoleer(val) {
    if (val == 'focus') {
      this.toUp = 'animate__animated animate__slideInUp'
      let h = this.platform.height() / 2;
      this.heightOfCard = h.toString() + 'px';
    } else {
      this.heightOfCard = ''
    }
    console.log(val, this.heightOfCard)
  }

  async presentUser() {
    const modal = await this.modalController.create({
      component: WelcomeUserPage,
      cssClass: 'welcomeUser'
    });
    return await modal.present();
  }
}
