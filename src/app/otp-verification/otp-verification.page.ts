import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
})
export class OtpVerificationPage implements OnInit {

  constructor(public r: Router) { }

  ngOnInit() {
  }
  continue() {
    let data = {
      pessenger: {
        firstName: 'Dummy',
        lastName: 'User',
        email: 'DummyEmail@fijo.com',
      }
    }
    localStorage.setItem('user', JSON.stringify(data))
    this.r.navigate(['/home'])
  }
}
