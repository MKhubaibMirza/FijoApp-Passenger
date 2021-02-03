import { AgmMap, MapsAPILoader } from '@agm/core';
import { Component, HostListener, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController, MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { CancelConfirmationPage } from '../cancel-confirmation/cancel-confirmation.page';
import { RatingPage } from '../rating/rating.page';
import { DriverService } from '../services/driver.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PaymentService } from '../services/payment.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../services/translate-config.service';
import { SmartAudioService } from '../services/smart-audio.service';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { PassengerService } from '../services/passenger.service';

const CountdownTimeUnits: Array<[string, number]> = [
  ['Y', 1000 * 60 * 60 * 24 * 365], // years
  ['M', 1000 * 60 * 60 * 24 * 30], // months
  ['D', 1000 * 60 * 60 * 24], // days
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage {
  @ViewChild(AgmMap) private agmMap: AgmMap;
  socket = io(environment.baseUrl);
  DriverDetail = {
    driverObj: {
      firstName: '',
      lastName: '',
      driverPhoto: '',
      currentLat: 0,
      currentLng: 0
    },
    vehicleObj: {
      brand: "",
      vehicleNoPlate: ""
    }
  };
  latitude = 56;
  longitude = 10;
  DriverRating() {
    if (localStorage.getItem('tracking')) {
      return JSON.parse(localStorage.getItem('tracking')).driverObj.rating.toFixed(1);
    }
  }
  zoom = 18;
  address: string;
  isEn: Boolean;
  isSp: Boolean;
  Route_To_Passenger = false;
  Route_To_Destination = false;
  DriverFound = false;
  isSearching = false;
  isTripStarted = false;
  totaltime = '';
  endTripCounter = false;
  startTripCounter = false;
  url = environment.baseUrl;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    public modalController: ModalController,
    private localNotifications: LocalNotifications,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public driverService: DriverService,
    public paymentService: PaymentService,
    private callNumber: CallNumber,
    public router: Router,
    public toastController: ToastController,
    public geolocation: Geolocation,
    public menuControl: MenuController,
    public r: Router,
    public t: TranslateService,
    public translate: TranslateConfigService,
    public platform: Platform,
    public passengerservice: PassengerService,
    private audioService: SmartAudioService,
  ) {
    this.endTripCounter = false;
    this.startTripCounter = false;
    this.Route_To_Passenger = false;
    this.Route_To_Destination = false;
    this.waitToGetRoute = false;
    t.get("trackingPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
    let selectedLang = this.translate.selectedLanguage();
    if (selectedLang == 'en') {
      this.isEn = true;
    } else {
      this.isSp = true;
    }
  }
  getName() {
    return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  async presentAlertForPreBooking(head, message, buttonText) {
    const alert = await this.alertController.create({
      header: head,
      message: message,
      buttons: [{
        text: buttonText,
        handler: () => {
          this.r.navigate(['/reserved-bookings']);
        }
      }]
    });

    await alert.present();
  }
  receivedriverCounter = 0;
  ionViewWillEnter() {
    this.receivedriverCounter = 0;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
    });
    this.setCurrentLocation();

    this.socket.on('getLatLngOfDriver' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      this.toOrigin.origin.lat = object.driverLat;
      this.toOrigin.origin.lng = object.driverLng;
      this.driverLat = object.driverLat;
      this.driverLng = object.driverLng;
      this.latitude = object.driverLat;
      this.longitude = object.driverLng;

      if (localStorage.getItem('tripStarted')) {
        this.zoom = 18
        this.isTripStarted = true;
        this.Route_To_Passenger = false;
        this.Route_To_Destination = true;
      } else {
        this.Route_To_Passenger = true;
        this.Route_To_Destination = false;
      }
    });
    let senderId = JSON.parse(localStorage.getItem('user')).id;
    this.socket.on('listenchat' + senderId, (data) => {
      this.audioService.preload('chat')
      this.audioService.play('chat')
      this.newMesssage = true;
    });

    this.socket.on('isCancel' + JSON.parse(localStorage.getItem('user')).id, (data) => {
      this.audioService.preload('cancelReq')
      this.audioService.play('cancelReq')
      if (this.isEn) {
        let header = "Ride Cancelled";
        let message = " Passenger cancel this ride due to"
        this.presentCancelRidePopUp(data.reason, header, "Dear", message, "Ok")
      } else if (this.isSp) {
        let header = "Viaje cancelado";
        let message = " El pasajero cancela este viaje debido a"
        this.presentCancelRidePopUp(data.reason, header, "Querido", message, "Okay")
      }
    });
    if (localStorage.getItem('tracking')) {
      this.DriverDetail = JSON.parse(localStorage.getItem('tracking'));
      this.DriverFound = true;
      if (localStorage.getItem('tripStarted')) {
        this.Route_To_Passenger = false;
        this.Route_To_Destination = true;
      } else {
        this.Route_To_Passenger = true;
        this.Route_To_Destination = false;
      }
    } else {
      setTimeout(() => {
        this.isSearching = true;
        this.Route_To_Destination = true;
        this.Route_To_Passenger = false;
        let findDriverObj = JSON.parse(localStorage.getItem('findDriverObj'));
        this.driverService.findDrivers(findDriverObj).subscribe((resp: any) => {
          if (resp.length !== 0) {
            this.socket.emit('send-data-to-drivers', resp);
            this.driverNotFundInRegion = false;
          }
        }, er => {
          this.DispatcherCode();
        })
      }, 2100);
    }
    this.menuControl.enable(false);
    this.socket.on('receive-driver' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      if (this.receivedriverCounter == 0) {
        this.receivedriverCounter = this.receivedriverCounter + 1;
        if (JSON.parse(localStorage.getItem('findDriverObj')).isReserved) {
          let reserveBookingObject = {
            passengerId: JSON.parse(localStorage.getItem('user')).id,
            driverId: object.driverObj.id,
            passengerEmail: JSON.parse(localStorage.getItem('user')).email,
            driverEmail: object.driverObj.email,
            reserveCode: JSON.parse(localStorage.getItem('findDriverObj')).randomString
          }
          Object.assign(reserveBookingObject, JSON.parse(localStorage.getItem('findDriverObj')));
          this.passengerservice.createReserveBooking(reserveBookingObject).subscribe((bookingresp: any) => {
            let availabilityData = {
              isAvailable: true
            }
            let id = JSON.parse(localStorage.getItem('user')).id;
            this.passengerservice.passengerAvailablity(id, availabilityData).subscribe((resp: any) => {
            })
            this.r.navigate(['/home']);
            localStorage.removeItem('findDriverObj');
            if (this.translate.selectedLanguage() == 'en') {
              this.presentAlertForPreBooking('🙂 Dear ' + this.getName(), 'Your booking is reserved successfully.', 'View Details');
            } else {
              this.presentAlertForPreBooking('🙂 Querido ' + this.getName(), 'Su reserva está reservada con éxito.', 'Ver detalles');
            }
          })
        } else {
          this.DriverFound = true;
          this.DriverDetail = object;
          localStorage.setItem('tracking', JSON.stringify(object));
        }
      }
    });
    this.socket.on('isStarted' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      this.zoom = 18
      this.audioService.preload('startRide');
      this.audioService.play('startRide');
      this.isTripStarted = true;
      this.Route_To_Destination = true;
      this.Route_To_Passenger = false;
      if (this.startTripCounter == false) {
        this.startTripCounter = true;
        if (this.r.url !== '/tracking') {
          this.r.navigate(['/tracking']);
        }
        if (this.isEn) {
          let message = `
      Your trip is started.Please read <b> COVID - 19 </b> SOPs carefully. <br>
        <p>
      ⦿ Keep your distance from other people when you travel, where possible. <br>
      ⦿ Avoid making unnecessary stops during your journey. <br>
      ⦿ Wear a mask on your face. <br>
      ⦿ Plan ahead, check for disruption before you leave, and avoid the busiest routes, as well as busy times. <br>
      ⦿ Wash or sanitise your hands regularly.
      </p>`
          this.tripStart_Or_PaymentRepeater_Or_AlertShower(message);
        } else if (this.isSp) {
          let message = `
          Tu viaje ha comenzado. Lee <b> COVID - 19 </b>SOP con cuidado. <br>
            <p>
          ⦿ Mantenga su distancia de otras personas cuando viaje, siempre que sea posible. <br>
          ⦿ Evite hacer paradas innecesarias durante su viaje. <br>
          ⦿ Use una máscara en su cara. <br>
          ⦿ Planifique con anticipación, verifique si hay interrupciones antes de partir y evite las rutas más concurridas, así como las horas punta. <br>
          ⦿ Lávese o desinfecte sus manos con regularidad.
          </p>`
          this.tripStart_Or_PaymentRepeater_Or_AlertShower(message);
        }
      }
    });
    this.socket.on('isEnded' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      this.audioService.preload('endRide')
      this.audioService.play('endRide')
      localStorage.setItem('tripEnded', 'true');
      if (this.endTripCounter == false) {
        this.endTripCounter = true;
        this.RatingModal();
      }
    });
    this.socket.on('isDriverReachedOnMyLocation' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      let localNotificationData =
      {
        id: 1,
        title: 'Dear ' + this.getName(),
        text: this.translate.selectedLanguage() == 'en' ? 'Driver Reached your location' : 'El conductor llegó a su ubicación',
        trigger: { in: 1, unit: ELocalNotificationTriggerUnit.SECOND }
      }

      this.localNotifications.schedule(localNotificationData)
    });
    setTimeout(() => {
      if (!localStorage.getItem('tracking')) {
        if (this.DriverFound == false) {
          if (this.router.url == '/tracking') {
            if (this.driverNotFundInRegion == false) {
              // send data to admin panel and wait for 1 minute
              this.DispatcherCode();
            }
          }
        }
      }
    }, 30000);
    if (localStorage.getItem('tripStarted')) {
      this.zoom = 18
      this.isTripStarted = true;
      this.afterTripStart();
    } else {
      this.isTripStarted = false;
    }
    if (localStorage.getItem('tripEnded')) {
      this.RatingModal();
    }
  }
  async presentCancelRidePopUp(reason, header, dear, message, button) {
    let user = JSON.parse(localStorage.getItem('user'));
    let name = user.firstName + ' ' + user.lastName;
    const alert = await this.alertController.create({
      header: header,
      message: dear + ' ' + name + ',' + message + ' <br>"' + reason + '"',
      buttons: [{
        text: button,
        handler: () => {
        }
      }]
    });
    localStorage.removeItem('findDriverObj');
    localStorage.removeItem('tracking');
    localStorage.removeItem('tripEnded');
    localStorage.removeItem('tripStarted');
    localStorage.removeItem('paymentMethods');
    localStorage.removeItem('paid');
    this.r.navigate(['/home'])
    await alert.present();
  }
  newMesssage = false;
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
      });
    setTimeout(() => {
      document.getElementById('map-parent').style.width = "100%";
    }, 100);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait',
      duration: 7000,
      spinner: 'dots',
    });
    await loading.present();
  }

  respFromLanguage: any;
  afterTripStart() {
    if (!localStorage.getItem('paid')) {
      let PayVia = JSON.parse(localStorage.getItem('findDriverObj')).paymentVia;
      if (PayVia == 'card') {
        // choose Payment methode and show all paymentMethods
        let paymentMethods = JSON.parse(localStorage.getItem('paymentMethods'));
        let inputArray = [];
        paymentMethods.forEach((element, i) => {
          inputArray.push({
            name: 'radio' + i,
            type: 'radio',
            label: '**** **** **** ' + element.number.toString().substr(12, 16),
            value: element,
            checked: i == 0 ? true : false
          })
        });
        this.presentAlertRadio(inputArray);
      }
    }
  }
  async presentAlertRadio(inputsArray) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      header: this.respFromLanguage.pleaseconfirmyourpayment,
      inputs: inputsArray,
      buttons: [
        {
          text: this.respFromLanguage.continueViaCash,
          handler: (val) => {
            // Socket emit to change payment Via
            this.paymentMethodChange();
            let driverId = JSON.parse(localStorage.getItem('tracking')).driverObj.id;
            let obj = {
              receiverId: driverId
            }
            this.socket.emit('changePaymentMethod', obj);
          }
        },
        {
          text: this.respFromLanguage.continueViaCard,
          handler: (val) => {
            this.presentLoading();
            this.paymentService.checkCard(val).then((resp: any) => {
              let data = {
                token: resp.id,
                amount: JSON.parse(localStorage.getItem('findDriverObj')).exactPriceForPassenger
              }
              this.paymentService.charge(data).subscribe((resp: any) => {
                if (resp.data !== null) {
                  localStorage.setItem('paid', 'true');
                  let price = JSON.parse(localStorage.getItem('FindDriverObj')).exactPriceForPassenger;
                  this.tripStart_Or_PaymentRepeater_Or_AlertShower(price + '&euro; ' + this.respFromLanguage.successfullycharged);
                } else {
                  // repeat payment procedure ------------
                  this.tripStart_Or_PaymentRepeater_Or_AlertShower(this.respFromLanguage.somethingWrong);
                }
                this.loadingController.dismiss();
              })
            }).catch(err => {
              this.tripStart_Or_PaymentRepeater_Or_AlertShower(err + ' ' + this.respFromLanguage.useDiffCard);
              return false;
            });
          }
        }
      ]
    });

    await alert.present();
  }
  async paymentMethodChange() {
    const alert = await this.alertController.create({
      header: this.respFromLanguage.payChanged,
      message: this.respFromLanguage.changedSubtitle,
      buttons: [{
        text: this.respFromLanguage.Continue,
        handler: () => {
          let localObjectOf_findDriverObj = JSON.parse(localStorage.getItem('findDriverObj'));
          localObjectOf_findDriverObj.paymentVia = 'cash';
          localStorage.setItem('findDriverObj', JSON.stringify(localObjectOf_findDriverObj));
        }
      }],
      backdropDismiss: false,
    });

    await alert.present();
  }
  async RatingModal() {
    const modal = await this.modalController.create({
      component: RatingPage,
      backdropDismiss: false,
      cssClass: 'ratingModal'
    });
    return await modal.present();
  }
  driverLat = 0;
  driverLng = 0;
  private geoCoder;
  public origin = JSON.parse(localStorage.getItem('findDriverObj')).origin;
  public destination = JSON.parse(localStorage.getItem('findDriverObj')).destination;
  public renderOptions = {
    suppressMarkers: true,
    polylineOptions: { strokeColor: '#4ebe38', strokeWeight: 5 }
  }
  toOrigin = {
    origin: { lat: this.DriverDetail.driverObj.currentLat, lng: this.DriverDetail.driverObj.currentLng },
    destination: this.origin,
    renderOptions: { suppressMarkers: true, polylineOptions: { strokeColor: '#4ebe38', strokeWeight: 5 } },
  }
  toDestination = {
    origin: this.origin,
    destination: this.destination,
    renderOptions: { suppressMarkers: true, polylineOptions: { strokeColor: '#4ebe38', strokeWeight: 5 } },
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
  public driverMarker = {
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
      infoWindow: 'My Location',
      draggable: false,
    },
    travelMode: "DRIVING",
  }

  public toOriginMarker = {
    // origin: {
    //   icon: {
    //     url: 'assets/driver.png',
    //     scaledSize: {
    //       width: 35,
    //       height: 50
    //     }
    //   },
    //   infoWindow: 'Driver Location',
    //   draggable: false,
    // },
    destination: {
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
    travelMode: "DRIVING",
  }

  public toDestinationMarker = {
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
      // infoWindow: 'My Destination',
      draggable: false,
    },
    travelMode: "DRIVING",
  }
  driverNotFundInRegion = false;
  DispatcherCode() {
    // send data to admin panel and wait for 1 minute
    this.driverNotFundInRegion = true;
    let findDriverObj = JSON.parse(localStorage.getItem('findDriverObj'));
    this.socket.emit('reqNotFoundSendRequestToAdminPanel', findDriverObj);
    setTimeout(() => {
      if (!this.DriverFound) {
        this.presentAlert();
      }
    }, 30000);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: this.respFromLanguage.Nodriver,
      message: this.respFromLanguage.sorryText,
      buttons: [{
        text: this.respFromLanguage.okay,
        handler: () => {
          if (localStorage.getItem('tracking')) {
            return true;
          } else {
            localStorage.removeItem('findDriverObj');
            this.router.navigate(['/home']);
          }
        }
      }]
    });
    await alert.present();
  }
  async tripStart_Or_PaymentRepeater_Or_AlertShower(mes) {
    let user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('tripStarted', 'true');
    let name = user.firstName + ' ' + user.lastName;
    const alert = await this.alertController.create({
      backdropDismiss: false,
      cssClass: 'tripStarted',
      header: this.respFromLanguage.Dear + ' ' + name,
      message: mes,
      buttons: [{
        text: this.respFromLanguage.Continue,
        handler: () => {
          this.afterTripStart();
        }
      }]
    });
    await alert.present();
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      mode: 'ios',
      color: 'medium',
      duration: 2000
    });
    toast.present();
  }
  timer = 100;
  waitToGetRoute = false;
  public onResponse(event: any) {
    this.waitToGetRoute = false;
    this.totaltime = event.routes[0]?.legs[0].duration.text;
    if (event.routes[0]?.legs[0].duration.value !== undefined) {
      this.timer = event.routes[0]?.legs[0].duration.value;
      this.getConfig.leftTime = this.timer;
      setTimeout(() => {
        this.waitToGetRoute = true;
      }, 900);
    }
  }
  async cancelConfirmModal() {
    const modal = await this.modalController.create({
      component: CancelConfirmationPage,
      cssClass: 'cancelconfirm'
    });
    return await modal.present();
  }
  openChat() {
    this.newMesssage = false;
    let driver = JSON.parse(localStorage.getItem('tracking')).driverObj;
    let name = driver.firstName + ' ' + driver.lastName;
    this.router.navigate(['/chat/' + name + '/' + driver.id]);
  }
  call() {
    let driver = JSON.parse(localStorage.getItem('tracking')).driverObj;
    let Phone = driver.phoneNumber.toString();
    let name = driver.firstName + ' ' + driver.lastName;
    if (Phone) {
      this.callNumber.callNumber(Phone, true)
        .then(res => { })
        .catch(err => {
          this.presentToast(this.respFromLanguage.opps);
        });
    } else {
      this.presentToast(this.respFromLanguage.sorry + ' ' + name + ' ' + this.respFromLanguage.noPhone);
    }
  }
  ionViewWillLeave() {
    this.DriverFound = false;
    this.isSearching = false;
    this.isTripStarted = false;
    this.totaltime = '';
    this.receivedriverCounter = 0;
    this.endTripCounter = false;
    this.startTripCounter = false;
    this.menuControl.enable(true);
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
  getConfig = {
    leftTime: this.timer,
    format: 'HH:mm:ss',
    formatDate: ({ date, formatStr }) => {
      let duration = Number(date || 0);

      return CountdownTimeUnits.reduce((current, [name, unit]) => {
        if (current.indexOf(name) !== -1) {
          const v = Math.floor(duration / unit);
          duration -= v * unit;
          return current.replace(new RegExp(`${name}+`, 'g'), (match: string) => {
            return v.toString().padStart(match.length, '0');
          });
        }
        return current;
      }, formatStr);
    },
    prettyText: (text) => {
      let h = text.substr(0, 2) + 'h ';
      let m = text.substring(3, 5) + 'm ';
      let s = text.substr(6, 8) + 's ';
      let z = '';
      if (this.translate.selectedLanguage() == 'sp') {
        z = m + '' + s + "Restante";
      } else {
        z = m + '' + s + "Remaining";
      }
      // let z = h + '' + m + '' + s + '';
      return z;
    },
  };
}
