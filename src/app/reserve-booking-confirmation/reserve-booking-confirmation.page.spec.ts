import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReserveBookingConfirmationPage } from './reserve-booking-confirmation.page';

describe('ReserveBookingConfirmationPage', () => {
  let component: ReserveBookingConfirmationPage;
  let fixture: ComponentFixture<ReserveBookingConfirmationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveBookingConfirmationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReserveBookingConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
