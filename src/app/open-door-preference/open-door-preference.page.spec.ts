import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpenDoorPreferencePage } from './open-door-preference.page';

describe('OpenDoorPreferencePage', () => {
  let component: OpenDoorPreferencePage;
  let fixture: ComponentFixture<OpenDoorPreferencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenDoorPreferencePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenDoorPreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
