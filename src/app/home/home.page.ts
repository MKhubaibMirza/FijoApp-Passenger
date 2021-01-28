import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import {
  AgmMap,
  MapsAPILoader,
} from "@agm/core";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController, MenuController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { AskPaymentWayPage } from '../ask-payment-way/ask-payment-way.page';
import { WelcomeUserPage } from '../welcome-user/welcome-user.page';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmBookingPage } from '../confirm-booking/confirm-booking.page';
import { LocationService } from '../services/location.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TranslateConfigService } from '../services/translate-config.service';
import { PassengerService } from '../services/passenger.service';
import { ReserveBookingConfirmationPage } from '../reserve-booking-confirmation/reserve-booking-confirmation.page';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  socket = io(environment.baseUrl);

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
    public locationservice: LocationService,
    public t: TranslateService,
    public alertCtrl: AlertController,
    public translateconfig: TranslateConfigService,
    public r: Router,
    public passengerService: PassengerService
  ) {
    this.getLangData();
  }
  async showAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons:
        [
          {
            text: 'OK',
            handler: () => {
            }
          }
        ]
    })
    alert.present();
  }
  logingHoppingReturner() {
    if (localStorage.getItem('logedInDeviceId'))
      return 'notify-old-device' + localStorage.getItem('logedInDeviceId');
    else
      return false;
  }
  getLangData() {
    this.t.get("homePage").subscribe((resp: any) => {
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
  currentLongitude = 0;
  currentLatitude = 0;
  currntLAT = 750;
  currntLONG = 700;
  zoom = 18;
  address: string;
  SavedLocations = [];
  private geoCoder;
  public origin = '';
  public destination = '';
  public renderOptions = {
    suppressMarkers: true,
    polylineOptions: { strokeColor: '#4ebe38', strokeWeight: 5 }
  }
  currentMarkerAnimation = 'DROP';
  // animation: 'BOUNCE' | 'DROP';
  public currentMarker = {
    url: 'assets/currentMarkerGif.gif',
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
      draggable: true,
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
    searchInKM: 15,
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
  selectedCar = { approxOrMaxValue: 0 };
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
  async AskPayWay(isReserved, date, time) {
    if (this.selectedCar.approxOrMaxValue == 0) {
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
            FindDriverObj: this.FindDriverObj,
            isReserved: isReserved,
            ReserveDate: date,
            ReserveTime: time
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
        // localStorage.setItem('tempFindDriverObj', JSON.stringify(this.FindDriverObj));
        // this.r.navigate(['/confirm-booking']);
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
      mode:'ios',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  ionViewWillEnter() {
    if (localStorage.getItem('user')) {
      let data = {
        isAvailable: true
      }
      let id = JSON.parse(localStorage.getItem('user')).id;
      this.passengerService.passengerAvailablity(id, data).subscribe((resp: any) => {
      })
    }
    this.locationservice.updateLocationInstantly();
    this.zoom = 18;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.setCurrentLocation();
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.setComponentRestrictions({
        country: ["ES", "PK", "UA"],
      });
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
    this.socket.on(this.logingHoppingReturner(), (data) => {
      if (this.translateconfig.selectedLanguage() == 'en') {
        this.showAlert('Session Expire', 'Your account is logged in from a different device.');
      } else {
        this.showAlert('Sesión Expirada', 'Su cuenta está conectada desde un dispositivo diferente.');
      }
      localStorage.clear();
      this.r.navigate(['/login']);
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
    this.map.zoom = 18;
    this.zoom = 18;
    setTimeout(() => {
      this.map.setCenter({ lat: this.latitude, lng: this.longitude });
      this.map.zoom = 18;
      this.zoom = 18;
    }, 300);
  }
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
        this.currentLatitude = parseFloat(position.coords.latitude);
        this.currentLongitude = parseFloat(position.coords.longitude);
        this.getAddress(this.latitude, this.longitude);
      });
    let watchPositionTrigger = 0;
    this.geolocation.watchPosition().subscribe((coords: any) => {
      watchPositionTrigger = watchPositionTrigger + 1;
      this.latitude = parseFloat(coords.coords.latitude);
      this.longitude = parseFloat(coords.coords.longitude);
      this.FindDriverObj.currentLat = this.latitude;
      this.FindDriverObj.currentLng = this.longitude;
      if (watchPositionTrigger == 7) {
        if (!this.directionCondition) {
          this.map.setCenter({ lat: this.latitude, lng: this.longitude });
        }
        this.currentLatitude = this.latitude;
        this.currentLongitude = this.longitude;
        this.getAddress(this.currentLatitude, this.currentLongitude);
        watchPositionTrigger = 0;
      }
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
        this.totalPriceForLite = resp.totalPrice;
        this.basePriceForLite = resp.basePrice;
        this.carsTypes.push({
          title: 'Lite',
          desc: 'Fixed Price',
          approxOrMaxValue: this.totalPriceForLite,
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
        this.For4SeaterPrice = resp.totalPrice;
        this.BasePrice4Seater = resp.basePrice;
        let carTypesArray = [
          { title: 'Taxi XL', desc: 'General Purpose', description: this.respFromLanguage.sedanN, img: 'assets/Fijo_Sedan_XL_v1.png', approxOrMaxValue: 0 },
          { title: 'Sedan Accesivilidad', desc: 'For Handicaps', description: this.respFromLanguage.sedanH, img: 'assets/Fijo_Sedan_Handicap_v_2.png', approxOrMaxValue: 0 }
        ];
        getExactPriceObject.seatingCapacity = 5;
        this.dataservice.getExactPrice(getExactPriceObject).subscribe((resp: any) => {
          this.For5SeaterPrice = resp.totalPrice;
          this.BasePrice5Seater = resp.basePrice;
          let approxPrice = this.For4SeaterPrice + this.BasePrice5Seater / 2;
          carTypesArray.forEach(element => {
            if (resp.length == 0) {
              this.carsTypes.push({
                title: element.title,
                desc: element.desc,
                description: element.description,
                condition: false,
                approxOrMaxValue: this.For4SeaterPrice,
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
                approxOrMaxValue: approxPrice,
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
  markerDragEndDestination(event: any) {
    let coords = JSON.stringify(event);
    let coords3 = JSON.parse(coords);
    this.geoCoder.geocode({ 'location': { lat: coords3.lat, lng: coords3.lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 18;
          this.destination = results[0].formatted_address;
          this.FindDriverObj.destination = results[0].formatted_address;
        } else {
        }
      }
    });
  }
  markerDragEndOrigin(event: any) {
    let coords = JSON.stringify(event);
    let coords3 = JSON.parse(coords);
    this.geoCoder.geocode({ 'location': { lat: coords3.lat, lng: coords3.lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 18;
          this.origin = results[0].formatted_address;
          this.FindDriverObj.origin = results[0].formatted_address;
        } else {
        }
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
        new google.maps.event.trigger(this.agmMap, 'resize');
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
        }
      }
    });
  }
  directionCondition = false;
  CancelClick() {
    this.directionCondition = false;
    this.ShowDestinationCondition = false;
    this.destination = '';
    this.carsTypes = [];
    this.locationClick();
    this.selectedCar = { approxOrMaxValue: 0 }
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
  async presentConfirmBookingPage() {
    const modal = await this.modalController.create({
      component: ConfirmBookingPage,
      componentProps: {
        FindDriverObj: this.FindDriverObj,
        approxOrMaxValue: this.selectedCar.approxOrMaxValue
      }
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
      searchInKM: 15,
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
  DarkStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ];
  LightStyle = [];
  async ReserveBooking() {
    if (this.selectedCar.approxOrMaxValue == 0) {
      this.presentToast(this.respFromLanguage.selectRide);
    } else if (this.FindDriverObj.noOfSeating == 0 && this.FindDriverObj.vehicleType !== 'lite') {
      this.presentToast(this.respFromLanguage.selectSeats);
    } else {
      const modal = await this.modalController.create({
        component: ReserveBookingConfirmationPage,
      });
      await modal.present();
      modal.onDidDismiss().then(value => {
        if (value.data) {
          this.AskPayWay(true, value.data.date, value.data.time);
        }
      })
    }
  }
}
