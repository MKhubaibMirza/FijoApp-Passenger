import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewSignupPage } from './new-signup.page';

describe('NewSignupPage', () => {
  let component: NewSignupPage;
  let fixture: ComponentFixture<NewSignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSignupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
