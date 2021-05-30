import { ReserveBookingConfirmationPage } from './../reserve-booking-confirmation/reserve-booking-confirmation.page';
import { ConfirmBookingPage } from './../confirm-booking/confirm-booking.page';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taxi-selection',
  templateUrl: './taxi-selection.page.html',
  styleUrls: ['./taxi-selection.page.scss'],
})
export class TaxiSelectionPage implements OnInit {
  carsTypes = [];
  iAmCalled = 0;
  iAmCalledForLite = 0;
  dataFromHomePage;
  respFromLanguage: any;
  totaldistance;
  totaltime;
  getLangData() {
    this.t.get("homePage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  // return these 
  basePriceForLite = 0;
  totalPriceForLite = 0;
  For4SeaterPrice = 0;
  For5SeaterPrice = 0;
  BasePrice4Seater = 0;
  BasePrice5Seater = 0;
  noOfSeating; // return it in findriverobject
  selectedCar = { approxOrMaxValue: 0 };

  inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
  }
  constructor(
    public t: TranslateService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public modalCONTROLLERINTaxiSelection: ModalController,
    public dataservice: DataService
  ) { }

  ngOnInit() {
    this.getLangData();
    this.presentLoading();
    this.getLitePriceThenSedan();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.respFromLanguage.loading,
      duration: 7000,
      spinner: 'dots',
    });
    await loading.present();
  }
  getLitePriceThenSedan() {
    this.carsTypes = [];
    this.iAmCalledForLite = this.iAmCalledForLite + 1;
    let getExactPriceObjectFor_Lite = {
      km: this.dataFromHomePage.totalKM,
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
    if ((this.dataFromHomePage.destination.includes('airport')) || this.dataFromHomePage.destination.includes('Airport')) {
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
      km: this.dataFromHomePage.totalKM,
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
    if ((this.dataFromHomePage.destination.includes('airport')) || this.dataFromHomePage.destination.includes('Airport')) {
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
      this.dataFromHomePage.vehicleType = 'lite';
      this.dataFromHomePage.noOfSeating = 0;
    } else if (item.desc == "General Purpose") {
      this.dataFromHomePage.vehicleType = 'sedanN';
    } else if (item.desc == "For Handicaps") {
      this.dataFromHomePage.vehicleType = 'sedanH';
    }
  }
  CancelClick() {
    this.modalCONTROLLERINTaxiSelection.dismiss(false);
  }
  async presentConfirmBookingPage() {
    const modal = await this.modalCONTROLLERINTaxiSelection.create({
      component: ConfirmBookingPage,
      componentProps: {
        FindDriverObj: this.dataFromHomePage,
        approxOrMaxValue: this.selectedCar.approxOrMaxValue
      }
    });
    return await modal.present();
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
  async ReserveBooking() {
    if (this.selectedCar.approxOrMaxValue == 0) {
      this.presentToast(this.respFromLanguage.selectRide);
    } else if (this.noOfSeating == 0 && this.dataFromHomePage.vehicleType !== 'lite') {
      this.presentToast(this.respFromLanguage.selectSeats);
    } else {
      let closeData = {
        basePriceForLite: this.basePriceForLite,
        totalPriceForLite: this.totalPriceForLite,
        For4SeaterPrice: this.For4SeaterPrice,
        For5SeaterPrice: this.For5SeaterPrice,
        BasePrice4Seater: this.BasePrice4Seater,
        BasePrice5Seater: this.BasePrice5Seater,
        noOfSeating: this.noOfSeating,
        isReserved: true,
        selectedCar: this.selectedCar
      }
      this.modalCONTROLLERINTaxiSelection.dismiss(closeData)
    }
  }
  AskPayWay(isReserved, date, time, isAmOrPm) {
    if (this.selectedCar.approxOrMaxValue == 0) {
      this.presentToast(this.respFromLanguage.selectRide);
    } else if (this.noOfSeating == 0 && this.dataFromHomePage.vehicleType !== 'lite') {
      this.presentToast(this.respFromLanguage.selectSeats);
    } else {
      console.log('close it');
      let closeData = {
        askpaywaydata: {
          date: date,
          time: time,
          isAmOrPm: isAmOrPm,
        },
        basePriceForLite: this.basePriceForLite,
        totalPriceForLite: this.totalPriceForLite,
        For4SeaterPrice: this.For4SeaterPrice,
        For5SeaterPrice: this.For5SeaterPrice,
        BasePrice4Seater: this.BasePrice4Seater,
        BasePrice5Seater: this.BasePrice5Seater,
        noOfSeating: this.noOfSeating,
        isReserved: false,
        selectedCar: this.selectedCar
      }
      this.modalCONTROLLERINTaxiSelection.dismiss(closeData)
    }
  }
}
