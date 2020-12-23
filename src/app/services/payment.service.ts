import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  ApiUrl = environment.baseUrl;

  constructor(
    private stripe: Stripe,
    public http: HttpClient
  ) {
    stripe.setPublishableKey('pk_live_51Hr1KtD5x1bCwFCiq2Bp4ilqKIFUKHOgS09M0FBVrIT1LgMB58L5zYRiM6KqSwUM2VSFDtWpRUstvjTe2yArwM8H00MnBKNKYE');
  }
  checkCard(cardData) {
    return this.stripe.createCardToken(cardData);
  }
  addPaymentMethodOfPassenger(data) {
    let id = JSON.parse(localStorage.getItem('user')).id;
    return this.http.post(this.ApiUrl + 'passenger-payment/create/' + id, data);
  }
  GetPaymentMethodOfPassenger() {
    let id = JSON.parse(localStorage.getItem('user')).id;
    return this.http.get(this.ApiUrl + 'passenger-payment/getall-by-passenger/' + id);
  }
  deletePaymentMethod(id) {
    return this.http.post(this.ApiUrl + 'passenger-payment/delete/' + id, {});
  }
  charge(data) {
    return this.http.post(this.ApiUrl + 'charge', data);
  }
}
