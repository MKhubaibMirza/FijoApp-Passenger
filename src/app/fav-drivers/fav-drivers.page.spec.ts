import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavDriversPage } from './fav-drivers.page';

describe('FavDriversPage', () => {
  let component: FavDriversPage;
  let fixture: ComponentFixture<FavDriversPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavDriversPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavDriversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
