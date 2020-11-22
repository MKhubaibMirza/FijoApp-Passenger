import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViaPhonePage } from './via-phone.page';

describe('ViaPhonePage', () => {
  let component: ViaPhonePage;
  let fixture: ComponentFixture<ViaPhonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViaPhonePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViaPhonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
