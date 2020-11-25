import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CancelReasonPage } from './cancel-reason.page';

describe('CancelReasonPage', () => {
  let component: CancelReasonPage;
  let fixture: ComponentFixture<CancelReasonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelReasonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelReasonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
