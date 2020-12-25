import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  AgmMap,
  MapsAPILoader,
} from "@agm/core";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, MenuController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { AskPaymentWayPage } from '../ask-payment-way/ask-payment-way.page';
import { WelcomeUserPage } from '../welcome-user/welcome-user.page';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    public loadingController: LoadingController,
    private mapsAPILoader: MapsAPILoader,
    private menuControl: MenuController,
    public platform: Platform,
    public toastController: ToastController,
    private ngZone: NgZone,
    public dataservice: DataService,
    public modalController: ModalController,
    private geolocation: Geolocation,
    public r: Router,
  ) {
  }
  inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  openMenu() {
    this.menuControl.enable(true);
    this.menuControl.open();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait',
      duration: 7000,
      spinner: 'dots',
    });
    await loading.present();
  }
  latitude: number;
  longitude: number;
  currntLAT = 750;
  currntLONG = 700;
  zoom = 18;
  address: string;
  SavedLocations = [];
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
  FindDriverObj = {
    noOfSeating: 0,
    vehicleType: '',
    city: JSON.parse(localStorage.getItem('user')).city,
    currentLat: 0,
    currentLng: 0,
    searchInKM: 7,
    paymentVia: '',
    passengerObj: localStorage.getItem('user'),
    origin: '',
    destination: '',
    estTime: '',
    exactPriceForDriver: 0,
    exactPriceForPassenger: 0,
    totalKM: 0
  }
  @ViewChild('search')
  public searchElementRef: ElementRef;
  @ViewChild(AgmMap) agmMap: AgmMap;
  selectedCar;
  selectCar(item, i) {
    this.selectedCar = item;
    this.carsTypes.forEach((element, index) => {
      if (index == i) {
        this.carsTypes[index].condition = true;
      } else {
        this.carsTypes[index].condition = false;
      }
    });
    if (item.desc == "Fixed Price") {
      this.FindDriverObj.vehicleType = 'lite';
    } else if (item.desc == "General Purpose") {
      this.FindDriverObj.vehicleType = 'sedanN';
    } else if (item.desc == "For Handicaps") {
      this.FindDriverObj.vehicleType = 'sedanH';
    }
  }
  async AskPayWay() {
    if (this.selectedCar == undefined) {
      this.presentToast('Please Select Your Ride');
    } else if (this.FindDriverObj.noOfSeating == 0) {
      this.presentToast('Please Select Seating Capacity');
    } else {
      this.FindDriverObj.origin = this.origin;
      this.FindDriverObj.destination = this.destination;
      console.log(this.BasePrice4Seater, this.For4SeaterPrice)
      console.log(this.BasePrice5Seater, this.For5SeaterPrice)
      if (this.FindDriverObj.noOfSeating == 4) {
        this.FindDriverObj.exactPriceForDriver = this.For4SeaterPrice - this.BasePrice4Seater;
        this.FindDriverObj.exactPriceForPassenger = this.For4SeaterPrice;
      } else {
        this.FindDriverObj.exactPriceForDriver = this.For5SeaterPrice - this.BasePrice5Seater;
        this.FindDriverObj.exactPriceForPassenger = this.For5SeaterPrice;
      }
      console.log(this.FindDriverObj);
      const modal = await this.modalController.create({
        component: AskPaymentWayPage,
        componentProps: {
          FindDriverObj: this.FindDriverObj
        },
        cssClass: 'askpayway'
      });
      await modal.present();
    }
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      color: 'medium',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  ionViewWillEnter() {
    // this.presentUser();
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.setCurrentLocation();
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.destination = place.formatted_address;
          this.getDirection();
        });
      });
    });
    this.dataservice.saved_location_get().subscribe((resp: any) => {
      console.log(resp);
      this.SavedLocations = resp;
    })
  }
  ShowDestinationCondition = false;
  ShowDestinationClick() {
    this.ShowDestinationCondition = true;
  }
  HideDestinationClick() {
    this.ShowDestinationCondition = false;
  }
  OnRouteItemClick(item) {
    console.log(item);
    this.destination = item.routePath;
    this.getDirection();
  }
  public getMapInstance(map: any): void { this.map = map; };
  map: any;
  locationClick() {
    this.map.setCenter({ lat: this.latitude, lng: this.longitude });
    this.zoom = 18;
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
        this.latitude = parseFloat(position.coords.latitude);
        this.longitude = parseFloat(position.coords.longitude);
        this.FindDriverObj.currentLat = this.latitude;
        this.FindDriverObj.currentLng = this.longitude;
        this.getAddress(this.latitude, this.longitude);
      }, err => {
        console.log(err)
      });
  }
  totaltime = '';
  totaldistance = '';
  iAmCalled = 0;
  For4SeaterPrice = 0;
  For5SeaterPrice = 0;
  BasePrice4Seater = 0;
  BasePrice5Seater = 0;
  x = 0;
  public onResponse(event: any) {
    this.carsTypes = [];
    this.iAmCalled = this.iAmCalled + 1;
    console.log(event)
    if (event.status == "NOT_FOUND") {
      this.directionCondition = false;
      this.loadingController.dismiss();
      this.presentToast('Invalid Route. Try Again!');
    } else if (event.status == "ZERO_RESULTS") {
      this.directionCondition = false;
      this.loadingController.dismiss();
      this.presentToast('Invalid Route. Try Again!');
    }
    else {
      this.totaldistance = event.routes[0]?.legs[0].distance.text;
      this.totaltime = event.routes[0]?.legs[0].duration.text;
      // let str = this.totaldistance.replace('km', '');
      // this.FindDriverObj.totalKM = parseFloat(str.trim());
      let totalKm = event.routes[0]?.legs[0].distance.value;
      this.FindDriverObj.totalKM = totalKm / 1000;
      this.FindDriverObj.estTime = this.totaltime;
      let getExactPriceObject = {
        km: totalKm / 1000,
        isMorning: false,
        isWeekend: false,
        isAirport: false,
        seatingCapacity: 4
      }
      if (this.inRange(new Date().getHours(), 7, 21)) {
        getExactPriceObject.isMorning = true;
      } else {
        getExactPriceObject.isMorning = false;
      }
      if ((new Date().getDay() == 6) || new Date().getDay() == 7) {
        getExactPriceObject.isWeekend = true;
      } else {
        getExactPriceObject.isWeekend = false;
      }
      if ((this.destination.includes('airport')) || this.destination.includes('Airport')) {
        getExactPriceObject.isAirport = true;
      } else {
        getExactPriceObject.isAirport = false;
      }
      if (this.iAmCalled == 1) {
        getExactPriceObject.seatingCapacity = 4;
        console.log(getExactPriceObject)
        this.dataservice.getExactPrice(getExactPriceObject).subscribe((resp: any) => {
          console.log(resp, ' 4 > seats')
          this.For4SeaterPrice = resp.totalPrice;
          this.BasePrice4Seater = resp.basePrice;
          let carTypesArray = [
            { title: 'Lite', desc: 'Fixed Price' },
            { title: 'Sedan', desc: 'General Purpose' },
            { title: 'Sedan', desc: 'For Handicaps' }
          ];
          getExactPriceObject.seatingCapacity = 5;
          this.dataservice.getExactPrice(getExactPriceObject).subscribe((resp: any) => {
            console.log(resp, ' 5 > seats')
            this.For5SeaterPrice = resp.totalPrice;
            this.BasePrice5Seater = resp.basePrice;
            carTypesArray.forEach(element => {
              if (resp.length == 0) {
                this.carsTypes.push({
                  title: element.title,
                  desc: element.desc,
                  condition: false,
                  seats: [
                    {
                      numbers: 4,
                      price: this.For4SeaterPrice,
                      checked: false
                    }
                  ],
                  image: 'assets/Fijo_Lite_Cab_v1.png'
                });
              } else {
                this.carsTypes.push({
                  title: element.title,
                  desc: element.desc,
                  condition: false,
                  seats: [
                    {
                      numbers: 4,
                      price: this.For4SeaterPrice,
                      checked: false
                    },
                    {
                      numbers: 5,
                      price: this.For5SeaterPrice,
                      checked: false
                    },
                    {
                      numbers: 6,
                      price: this.For5SeaterPrice,
                      checked: false
                    },
                  ],
                  image: 'assets/Fijo_Lite_Cab_v1.png'
                });
              }
            });
            this.loadingController.dismiss();
          })
        })
        setTimeout(() => {
          this.iAmCalled = 0;
        }, 3000);
      }
    }
  }
  carsTypes = [];
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
  isAirport = false;
  getDirection() {
    console.log(this.destination, ' <== Destination')
    console.log(this.origin, ' <== origin')
    if ((this.destination !== '') && (this.origin !== '')) {
      setTimeout(() => {
        this.presentLoading();
        this.directionCondition = true;
      }, 900);
    } else {
      this.presentToast('Please enter your destination');
    }
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 18;
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
    this.ShowDestinationCondition = false;
    this.destination = '';
    this.locationClick()
  }
  heightOfCard = '';
  toUp = ''
  consoleer(val) {
    if (val == 'focus') {
      this.toUp = 'animate__animated animate__slideInUp'
      let h = this.platform.height() / 2;
      this.heightOfCard = h.toString() + 'px';
    } else {
      this.heightOfCard = '';
      if (this.destination.length !== 0) {
        setTimeout(() => {
          this.getDirection();
        }, 900);
      }
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
  ionViewWillLeave() {
    this.directionCondition = false;
    this.FindDriverObj = {
      noOfSeating: 0,
      vehicleType: '',
      city: JSON.parse(localStorage.getItem('user')).city,
      currentLat: 0,
      currentLng: 0,
      searchInKM: 7,
      paymentVia: '',
      passengerObj: localStorage.getItem('user'),
      origin: '',
      destination: '',
      estTime: '',
      exactPriceForDriver: 0,
      exactPriceForPassenger: 0,
      totalKM: 0
    }
    this.destination = '';
    this.ShowDestinationCondition = false;
  }
}
