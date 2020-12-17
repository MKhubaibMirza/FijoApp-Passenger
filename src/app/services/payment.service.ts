import { Injectable } from '@angular/core';
import { Stripe } from '@ionic-native/stripe/ngx';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private stripe: Stripe) {
    stripe.setPublishableKey('my_publishable_key');
  }
  checkCard(cardData) {
    this.stripe.createCardToken(cardData)
      .then(token => { return token })
      .catch(error => { return error });
  }
}
