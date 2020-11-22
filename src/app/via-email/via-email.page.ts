import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-via-email',
  templateUrl: './via-email.page.html',
  styleUrls: ['./via-email.page.scss'],
})
export class ViaEmailPage implements OnInit {

  constructor(public r: Router) { }

  ngOnInit() {
  }
  next() {
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
  gplog() {
    let data = {
      pessenger: {
        name: 'Dummy Name',
        email: 'DummyEmail@fijo.com',
      }
    }
    localStorage.setItem('user', JSON.stringify(data))
    this.r.navigate(['/home'])
  }
  fblog() {
    let data = {
      pessenger: {
        name: 'Dummy Name',
        email: 'DummyEmail@fijo.com',
      }
    }
    localStorage.setItem('user', JSON.stringify(data))
    this.r.navigate(['/home'])
  }
}
