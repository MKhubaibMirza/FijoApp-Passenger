import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.page.html',
  styleUrls: ['./add-payment-method.page.scss'],
})
export class AddPaymentMethodPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  card = {
    number: ''
  }
  backBtn() {

  }
}
