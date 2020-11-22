import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViaEmailPage } from './via-email.page';

describe('ViaEmailPage', () => {
  let component: ViaEmailPage;
  let fixture: ComponentFixture<ViaEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViaEmailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViaEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
