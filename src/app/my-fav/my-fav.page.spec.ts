import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyFavPage } from './my-fav.page';

describe('MyFavPage', () => {
  let component: MyFavPage;
  let fixture: ComponentFixture<MyFavPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFavPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyFavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
