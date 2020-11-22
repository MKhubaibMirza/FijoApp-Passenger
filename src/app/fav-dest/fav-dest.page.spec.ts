import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavDestPage } from './fav-dest.page';

describe('FavDestPage', () => {
  let component: FavDestPage;
  let fixture: ComponentFixture<FavDestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavDestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavDestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
