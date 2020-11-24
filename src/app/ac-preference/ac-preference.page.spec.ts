import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcPreferencePage } from './ac-preference.page';

describe('AcPreferencePage', () => {
  let component: AcPreferencePage;
  let fixture: ComponentFixture<AcPreferencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcPreferencePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcPreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
