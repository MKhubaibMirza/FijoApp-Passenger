import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyJourneysPage } from './my-journeys.page';

describe('MyJourneysPage', () => {
  let component: MyJourneysPage;
  let fixture: ComponentFixture<MyJourneysPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyJourneysPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyJourneysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
