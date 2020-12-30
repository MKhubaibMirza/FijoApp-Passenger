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
import { TranslateService } from '@ngx-translate/core';

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
    public t: TranslateService,
    public r: Router,
  ) {
    this.getLangData();
  }
  getLangData() {
    this.t.get("homePage").subscribe((resp: any) => {
      console.log(resp);
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
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
      message: this.respFromLanguage.loading,
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
      this.FindDriverObj.noOfSeating = 0;
    } else if (item.desc == "General Purpose") {
      this.FindDriverObj.vehicleType = 'sedanN';
    } else if (item.desc == "For Handicaps") {
      this.FindDriverObj.vehicleType = 'sedanH';
    }
  }
  async AskPayWay() {
    if (this.selectedCar == undefined) {
      this.presentToast(this.respFromLanguage.selectRide);
    } else if (this.FindDriverObj.noOfSeating == 0 && this.FindDriverObj.vehicleType !== 'lite') {
      this.presentToast(this.respFromLanguage.selectSeats);
    } else {
      this.FindDriverObj.origin = this.origin;
      this.FindDriverObj.destination = this.destination;
      if (this.FindDriverObj.vehicleType == 'lite') {
        this.FindDriverObj.exactPriceForDriver = this.totalPriceForLite - this.basePriceForLite;
        this.FindDriverObj.exactPriceForPassenger = this.totalPriceForLite;
        const modal = await this.modalController.create({
          component: AskPaymentWayPage,
          componentProps: {
            FindDriverObj: this.FindDriverObj
          },
          cssClass: 'askpayway'
        });
        await modal.present();
      } else {
        if (this.FindDriverObj.noOfSeating == 4) {
          this.FindDriverObj.exactPriceForDriver = this.For4SeaterPrice - this.BasePrice4Seater;
          this.FindDriverObj.exactPriceForPassenger = this.For4SeaterPrice;
        } else {
          this.FindDriverObj.exactPriceForDriver = this.For5SeaterPrice - this.BasePrice5Seater;
          this.FindDriverObj.exactPriceForPassenger = this.For5SeaterPrice;
        }
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
        this.latitude = parseFloat(position.coords.latitude);
        this.longitude = parseFloat(position.coords.longitude);
        this.FindDriverObj.currentLat = this.latitude;
        this.FindDriverObj.currentLng = this.longitude;
        this.getAddress(this.latitude, this.longitude);
      }, err => {
      });
  }
  totaltime = '';
  totaldistance = '';
  iAmCalled = 0;
  iAmCalledForLite = 0;
  For4SeaterPrice = 0;
  For5SeaterPrice = 0;
  BasePrice4Seater = 0;
  BasePrice5Seater = 0;
  x = 0;
  public onResponse(event: any) {
    if (event.status == "NOT_FOUND") {
      this.directionCondition = false;
      this.loadingController.dismiss();
      this.presentToast(this.respFromLanguage.invalidRoute);
    } else if (event.status == "ZERO_RESULTS") {
      this.directionCondition = false;
      this.loadingController.dismiss();
      this.presentToast(this.respFromLanguage.invalidRoute);
    }
    else {
      this.totaldistance = event.routes[0]?.legs[0].distance.text;
      this.totaltime = event.routes[0]?.legs[0].duration.text;
      let totalKm = event.routes[0]?.legs[0].distance.value;
      this.FindDriverObj.totalKM = totalKm / 1000;
      this.FindDriverObj.estTime = this.totaltime;
      this.getLitePriceThenSedan();
    }
  }
  basePriceForLite = 0;
  totalPriceForLite = 0;
  getLitePriceThenSedan() {
    this.carsTypes = [];
    this.iAmCalledForLite = this.iAmCalledForLite + 1;
    let getExactPriceObjectFor_Lite = {
      km: this.FindDriverObj.totalKM,
      isMorning: false,
      isWeekend: false,
      isAirport: false,
      isLite: true,
      seatingCapacity: 4
    }
    if (this.inRange(new Date().getHours(), 7, 21)) {
      getExactPriceObjectFor_Lite.isMorning = true;
    } else {
      getExactPriceObjectFor_Lite.isMorning = false;
    }
    if ((new Date().getDay() == 6) || new Date().getDay() == 7) {
      getExactPriceObjectFor_Lite.isWeekend = true;
    } else {
      getExactPriceObjectFor_Lite.isWeekend = false;
    }
    if ((this.destination.includes('airport')) || this.destination.includes('Airport')) {
      getExactPriceObjectFor_Lite.isAirport = true;
    } else {
      getExactPriceObjectFor_Lite.isAirport = false;
    }
    if (this.iAmCalledForLite == 1) {
      this.dataservice.getExactPrice(getExactPriceObjectFor_Lite).subscribe((resp: any) => {
        console.log(resp);
        this.totalPriceForLite = resp.totalPrice;
        this.basePriceForLite = resp.basePrice;
        this.carsTypes.push({
          title: 'Lite',
          desc: 'Fixed Price',
          condition: false,
          description: this.respFromLanguage.fixed,
          seats: [
            {
              numbers: 0,
              price: this.totalPriceForLite,
              checked: false
            }
          ],
          image: 'assets/Fijo_Lite_Cab_v1.png'
        })
        this.getSedanPrice();
      })
      setTimeout(() => {
        this.iAmCalledForLite = 0;
      }, 3000);
    }
  }
  getSedanPrice() {
    this.iAmCalled = this.iAmCalled + 1;
    let getExactPriceObject = {
      km: this.FindDriverObj.totalKM,
      isMorning: false,
      isWeekend: false,
      isAirport: false,
      isLite: false,
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
      this.dataservice.getExactPrice(getExactPriceObject).subscribe((resp: any) => {
        console.log(resp, getExactPriceObject, '----- 4 -----');
        this.For4SeaterPrice = resp.totalPrice;
        this.BasePrice4Seater = resp.basePrice;
        let carTypesArray = [
          { title: 'Sedan', desc: 'General Purpose', description: this.respFromLanguage.sedanN, img: 'assets/Fijo_Sedan_XL_v1.png' },
          { title: 'Sedan', desc: 'For Handicaps', description: this.respFromLanguage.sedanH, img: 'assets/Fijo_Sedan_Handicap_v_2.png' }
        ];
        getExactPriceObject.seatingCapacity = 5;
        this.dataservice.getExactPrice(getExactPriceObject).subscribe((resp: any) => {
          console.log(resp, getExactPriceObject, '----- 5 -----');
          this.For5SeaterPrice = resp.totalPrice;
          this.BasePrice5Seater = resp.basePrice;
          carTypesArray.forEach(element => {
            if (resp.length == 0) {
              this.carsTypes.push({
                title: element.title,
                desc: element.desc,
                description: element.description,
                condition: false,
                seats: [
                  {
                    numbers: 4,
                    price: this.For4SeaterPrice,
                    checked: false
                  }
                ],
                image: element.img
              });
            } else {
              this.carsTypes.push({
                title: element.title,
                desc: element.desc,
                description: element.description,
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
                image: element.img
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
  carsTypes = [];
  markerDragEnd(event: any) {
    let coords = JSON.stringify(event);
    let coords3 = JSON.parse(coords);
    this.geoCoder.geocode({ 'location': { lat: coords3.lat, lng: coords3.lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.destination = results[0].formatted_address;
        } else {
        }
      } else {
      }

    });
  }
  isAirport = false;
  getDirection() {
    this.getLangData();
    if ((this.destination !== '') && (this.origin !== '')) {
      setTimeout(() => {
        this.presentLoading();
        this.directionCondition = true;
      }, 900);
    } else {
      this.presentToast(this.respFromLanguage.enterDestinationPlz);
    }
  }
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 18;
          this.origin = results[0].formatted_address;
        } else {
        }
      } else {
      }

    });
  }
  directionCondition = false;
  CancelClick() {
    this.directionCondition = false;
    this.ShowDestinationCondition = false;
    this.destination = '';
    this.carsTypes = [];
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
    this.carsTypes = [];
  }
}
