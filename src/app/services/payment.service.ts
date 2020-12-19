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
    stripe.setPublishableKey('pk_test_51Hr1KtD5x1bCwFCiM5tDWYGYbKnVNrO251H9ebFLzp5OPqedS6KlTybmjn19XaNZKp1jyaGqs44f8HvRQlxikKrs00euuw8AX5');
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
}
