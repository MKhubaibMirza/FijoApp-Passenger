import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaxiSelectionPage } from './taxi-selection.page';

describe('TaxiSelectionPage', () => {
  let component: TaxiSelectionPage;
  let fixture: ComponentFixture<TaxiSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxiSelectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxiSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
