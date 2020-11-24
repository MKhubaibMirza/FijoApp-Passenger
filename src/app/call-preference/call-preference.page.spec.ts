import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CallPreferencePage } from './call-preference.page';

describe('CallPreferencePage', () => {
  let component: CallPreferencePage;
  let fixture: ComponentFixture<CallPreferencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPreferencePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CallPreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
