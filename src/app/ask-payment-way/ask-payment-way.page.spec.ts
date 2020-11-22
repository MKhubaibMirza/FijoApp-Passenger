import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AskPaymentWayPage } from './ask-payment-way.page';

describe('AskPaymentWayPage', () => {
  let component: AskPaymentWayPage;
  let fixture: ComponentFixture<AskPaymentWayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskPaymentWayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AskPaymentWayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
