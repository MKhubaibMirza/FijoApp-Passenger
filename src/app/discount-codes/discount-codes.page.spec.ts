import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiscountCodesPage } from './discount-codes.page';

describe('DiscountCodesPage', () => {
  let component: DiscountCodesPage;
  let fixture: ComponentFixture<DiscountCodesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountCodesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscountCodesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
