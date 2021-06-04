import { TaxiSelectionPage } from './../taxi-selection/taxi-selection.page';
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
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { SearchPagePage } from '../search-page/search-page.page';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  socket = io(environment.baseUrl);
  delay = 1000;
  lastExecution = 0;
  passengerObj = {
    firstName: JSON.parse(localStorage.getItem('user')).firstName,
    lastName: JSON.parse(localStorage.getItem('user')).lastName,
    phoneNumber: JSON.parse(localStorage.getItem('user')).phoneNumber,
    id: JSON.parse(localStorage.getItem('user')).id,
    email: JSON.parse(localStorage.getItem('user')).email,
    profilePhoto: JSON.parse(localStorage.getItem('user')).profilePhoto
  }
  constructor(
    public loadingController: LoadingController,
    private mapsAPILoader: MapsAPILoader,
    public nativeGeocoder: NativeGeocoder,
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
      return localStorage.getItem('logedInDeviceId');
  }
  sameApplicationReturner() {
    if (localStorage.getItem('sameApplication'))
      return localStorage.getItem('sameApplication');
  }

  reserveBookingReturner() {
    if (localStorage.getItem('user'))
      return 'informpassenger-reservedstatuschanged' + JSON.parse(localStorage.getItem('user')).id;
    else
      return false;
  }
  cancelRideReturner() {
    if (localStorage.getItem('user'))
      return 'canceled-reserved' + JSON.parse(localStorage.getItem('user')).id;
    else
      return false;
  }
  getLangData() {
    this.t.get("homePage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;

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
      width: 50,
      height: 50
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
    city: JSON.parse(localStorage.getItem('user'))?.city,
    currentLat: 0,
    currentLng: 0,
    searchInKM: 15,
    paymentVia: '',
    passengerObj: JSON.stringify(this.passengerObj),
    origin: '',
    destination: '',
    estTime: '',
    exactPriceForDriver: 0,
    exactPriceForPassenger: 0,
    isReserved: false,
    totalKM: 0
  }
  @ViewChild('search')
  public searchElementRef: ElementRef;
  @ViewChild(AgmMap) agmMap: AgmMap;
  selectedCar = { approxOrMaxValue: 0 };
  async AskPayWay(isReserved, date, time, isAmOrPm) {
    console.log(isReserved, 'is reserved from askpayway')
    this.FindDriverObj.isReserved = isReserved;
    if (this.selectedCar.approxOrMaxValue == 0) {
      this.presentToast(this.respFromLanguage.selectRide);
    } else if (this.FindDriverObj.noOfSeating == 0 && this.FindDriverObj.vehicleType !== 'lite') {
      this.presentToast(this.respFromLanguage.selectSeats);
    } else {
      if (this.FindDriverObj.vehicleType == 'lite') {
        this.FindDriverObj.exactPriceForDriver = this.totalPriceForLite - this.basePriceForLite;
        this.FindDriverObj.exactPriceForPassenger = this.totalPriceForLite;
        const modal = await this.modalController.create({
          component: AskPaymentWayPage,
          componentProps: {
            FindDriverObj: this.FindDriverObj,
            isReserved: isReserved,
            ReserveDate: date,
            ReserveTime: time,
            isAmOrPm: isAmOrPm
          },
          cssClass: 'askpayway'
        });
        await modal.present();
        await modal.onDidDismiss().then(() => {
          this.CancelClick();
        })
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
            isReserved: isReserved,
            FindDriverObj: this.FindDriverObj
          },
          cssClass: 'askpayway'
        });
        await modal.present();
        await modal.onDidDismiss().then(() => {
          this.CancelClick();
        })
      }
    }
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      color: 'medium',
      mode: 'ios',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  async openSearchModal() {
    const modal = await this.modalController.create({
      component: SearchPagePage
    });
    await modal.present();
    await modal.onDidDismiss().then(resp => {
      if (resp.data) {
        console.log(resp.data);
        this.destination = resp.data.destination;
        this.origin = resp.data.origin;
        this.FindDriverObj.origin = this.origin;
        this.FindDriverObj.destination = this.destination;
        this.getDirection();
      }
    });
  }
  sessionClear() {
    if (this.translateconfig.selectedLanguage() == 'en') {
      this.showAlert('Session Expire', 'Your account is logged in from a different device.');
    } else {
      this.showAlert('Sesión Expirada', 'Su cuenta está conectada desde un dispositivo diferente.');
    }
    localStorage.clear();
    this.r.navigate(['/login']);
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
    });
    this.dataservice.saved_location_get().subscribe((resp: any) => {
      this.SavedLocations = resp;
    })
    this.socket.on('notify-old-device' + this.logingHoppingReturner(), (data) => {
      console.log(this.logingHoppingReturner(), 'from login hope');
      console.log(data, 'data');
      if ((this.lastExecution + this.delay) < Date.now()) {
        if (!this.sameApplicationReturner()) {
          this.sessionClear();
        } else {
          if (this.sameApplicationReturner() == data.numeric) {
            localStorage.removeItem('sameApplication')
          } else {
            this.sessionClear();
          }
        }
        this.lastExecution = Date.now();
      }
    })
    this.socket.on(this.reserveBookingReturner(), (data) => {
      if ((this.lastExecution + this.delay) < Date.now()) {
        console.log(data);
        localStorage.setItem('findDriverObj', JSON.stringify(data.findDriverObj));
        localStorage.setItem('tracking', JSON.stringify(data.tracking));
        this.r.navigate(['/tracking']);
        this.lastExecution = Date.now();
      }
    })
    this.socket.on(this.cancelRideReturner(), (data) => {
      if ((this.lastExecution + this.delay) < Date.now()) {
        this.rideCancelledAlert();
        this.totalBookingsAmountNumber();
        this.lastExecution = Date.now();
      }
    })
    this.totalBookingsAmountNumber();
  }
  async rideCancelledAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Reserve Booking Cancelled',
      message: 'Your reserve booking is cancelled.',
      buttons: ['OK']
    });

    await alert.present();
  }
  noOfReservedBookings = 0;
  totalBookingsAmountNumber() {
    this.passengerService.getAllReservedBookings().subscribe((resp: any) => {
      this.noOfReservedBookings = resp.length;
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
        // this.getAddress(this.latitude, this.longitude);
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
        // this.getAddress(this.currentLatitude, this.currentLongitude);
        watchPositionTrigger = 0;
      }
    });
  }
  totaltime = '';
  totaldistance = '';
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
      this.modalController.getTop().then(resp => {
        if (resp == undefined) {
          this.taxiSelection();
        }
      })
    }
  }
  async taxiSelection() {
    const modal = await this.modalController.create({
      component: TaxiSelectionPage,
      mode: "ios",
      cssClass: 'taxiselection',
      componentProps: {
        dataFromHomePage: this.FindDriverObj,
        totaltime: this.totaltime,
        totaldistance: this.totaldistance
      }
    });
    await modal.present();
    await modal.onDidDismiss().then((data: any) => {
      if (data.data) {
        this.basePriceForLite = data.data.basePriceForLite;
        this.totalPriceForLite = data.data.totalPriceForLite;
        this.For4SeaterPrice = data.data.For4SeaterPrice;
        this.For5SeaterPrice = data.data.For5SeaterPrice;
        this.BasePrice4Seater = data.data.BasePrice4Seater;
        this.BasePrice5Seater = data.data.BasePrice5Seater;
        this.FindDriverObj.noOfSeating = data.data.noOfSeating;
        this.selectedCar = data.data.selectedCar;
        this.FindDriverObj.isReserved = data.data.isReserved;
        if (data.data.isReserved) {
          this.ReserveBooking()
        } else {
          this.AskPayWay(
            data.data.isReserved,
            data.data.askpaywaydata.date,
            data.data.askpaywaydata.time,
            data.data.askpaywaydata.isAmOrPm
          )
        }
      } else {
        this.CancelClick()
      }
    })
  }
  async ReserveBooking() {
    const modal2 = await this.modalController.create({
      component: ReserveBookingConfirmationPage,
    });
    await modal2.present();
    await modal2.onDidDismiss().then(value => {
      console.log(value);
      console.log('--------------------')
      if (value.data.isReserved == true) {
        this.AskPayWay(true, value.data.date, value.data.time, value.data.isAmOrPm);
      } else if (value.data.isReserved == false) {
        this.AskPayWay(false, null, null, null);
      }
      if (!value.data) {
        this.CancelClick();
      }
    })
  }
  basePriceForLite = 0;
  totalPriceForLite = 0;

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
        this.directionCondition = true;
        new google.maps.event.trigger(this.agmMap, 'resize');
      }, 900);
    } else {
      this.presentToast(this.respFromLanguage.enterDestinationPlz);
    }
  }
  // getAddress(latitude, longitude) {
  //   this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 18;
  //         this.origin = results[0].formatted_address;
  //       }
  //     }
  //   });
  // }
  directionCondition = false;
  CancelClick() {
    this.directionCondition = false;
    this.ShowDestinationCondition = false;
    this.destination = '';
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
  ionViewWillLeave() {
    this.directionCondition = false;
    this.FindDriverObj = {
      noOfSeating: 0,
      vehicleType: '',
      city: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.city : null,
      currentLat: 0,
      currentLng: 0,
      searchInKM: 15,
      paymentVia: '',
      passengerObj: JSON.stringify(this.passengerObj),
      origin: '',
      destination: '',
      estTime: '',
      exactPriceForDriver: 0,
      exactPriceForPassenger: 0,
      isReserved: false,
      totalKM: 0
    }
    this.destination = '';
    this.ShowDestinationCondition = false;
    this.locationClick();
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

  lightMode = [
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]
}
