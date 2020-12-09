import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SureToCancelPaymentMethodPage } from './sure-to-cancel-payment-method.page';

describe('SureToCancelPaymentMethodPage', () => {
  let component: SureToCancelPaymentMethodPage;
  let fixture: ComponentFixture<SureToCancelPaymentMethodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SureToCancelPaymentMethodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SureToCancelPaymentMethodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
