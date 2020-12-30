import { AgmMap, MapsAPILoader } from '@agm/core';
import { Component, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { CancelConfirmationPage } from '../cancel-confirmation/cancel-confirmation.page';
import { RatingPage } from '../rating/rating.page';
import { DriverService } from '../services/driver.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PaymentService } from '../services/payment.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage {
  socket = io(environment.baseUrl);
  DriverDetail = {
    driverObj: {
      firstName: '',
      lastName: '',
      driverPhoto: ''
    },
    vehicleObj: {
      brand: "",
      vehicleNoPlate: ""
    }
  };
  latitude: number;
  longitude: number;
  zoom = 17;
  address: string;
  @ViewChild(AgmMap) agmMap: AgmMap;
  DriverFound = false;
  isSearching = false;
  isTripStarted = false;
  totaltime = '';
  endTripCounter = false;
  startTripCounter = false;
  url = environment.baseUrl;
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait',
      duration: 7000,
      spinner: 'dots',
    });
    await loading.present();
  }
  constructor(
    private mapsAPILoader: MapsAPILoader,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public driverService: DriverService,
    public paymentService: PaymentService,
    private callNumber: CallNumber,
    public router: Router,
    public toastController: ToastController,
    public geolocation: Geolocation,
    public menuControl: MenuController,
    public t: TranslateService
  ) {
    t.get("trackingPage").subscribe((resp: any) => {
      console.log(resp);
      this.respFromLanguage = resp;
    });
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
  public driverMarker = {
    url: 'assets/driver.png',
    scaledSize: {
      width: 45,
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
        let findDriverObj = JSON.parse(localStorage.getItem('findDriverObj'));
        this.driverService.findDrivers(findDriverObj).subscribe((resp: any) => {
          if (resp.length !== 0) {
            this.socket.emit('send-data-to-drivers', resp);
          }
        }, er => {
          this.presentAlert();
        })
      }, 2100);
    }
    this.menuControl.enable(false);
    this.socket.on('getLatLngOfDriver' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      this.driverLat = object.driverLat;
      this.driverLng = object.driverLng;
      if (localStorage.getItem('tripStarted')) {
        this.isTripStarted = true;
      }
    });
    this.socket.on('receive-driver' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      this.DriverFound = true;
      this.DriverDetail = object;
      localStorage.setItem('tracking', JSON.stringify(object));
    });
    this.socket.on('isStarted' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      this.isTripStarted = true;
      if (this.startTripCounter == false) {
        this.startTripCounter = true;
        this.tripStart_Or_PaymentRepeater_Or_AlertShower(
          `Your trip is started. Please read <b>COVID-19</b> SOPs carefully. <br> 
    <p> 
    ⦿ Keep your distance from other people when you travel, where possible. <br>
    ⦿ Avoid making unnecessary stops during your journey. <br>
    ⦿ Plan ahead, check for disruption before you leave, and avoid the busiest routes, as well as busy times. <br>
    ⦿ Wash or sanitise your hands regularly.
    </p>`);
      }
    });
    this.socket.on('isEnded' + JSON.parse(localStorage.getItem('user')).id, (object) => {
      localStorage.setItem('tripEnded', 'true');
      if (this.endTripCounter == false) {
        this.endTripCounter = true;
        this.RatingModal();
      }
    });
    setTimeout(() => {
      if (!localStorage.getItem('tracking')) {
        if (this.DriverFound == false) {
          if (this.router.url == '/tracking') {
            this.presentAlert();
          }
        }
      }
    }, 60000);
    if (localStorage.getItem('tripStarted')) {
      this.isTripStarted = true;
      this.afterTripStart();
    } else {
      this.isTripStarted = false;
    }
    if (localStorage.getItem('tripEnded')) {
      this.RatingModal();
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: this.respFromLanguage.Nodriver,
      message: this.respFromLanguage.sorryText,
      buttons: [{
        text: this.respFromLanguage.okay,
        handler: () => {
          localStorage.removeItem('findDriverObj');
          this.router.navigate(['/home']);
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
      color: 'medium',
      duration: 2000
    });
    toast.present();
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
    this.endTripCounter = false;
    this.startTripCounter = false;
    this.menuControl.enable(true);
  }
}
