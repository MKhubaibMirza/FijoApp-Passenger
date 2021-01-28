import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReservedBookingsPage } from './reserved-bookings.page';

describe('ReservedBookingsPage', () => {
  let component: ReservedBookingsPage;
  let fixture: ComponentFixture<ReservedBookingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservedBookingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservedBookingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
