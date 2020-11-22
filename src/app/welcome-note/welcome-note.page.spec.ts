import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WelcomeNotePage } from './welcome-note.page';

describe('WelcomeNotePage', () => {
  let component: WelcomeNotePage;
  let fixture: ComponentFixture<WelcomeNotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeNotePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
