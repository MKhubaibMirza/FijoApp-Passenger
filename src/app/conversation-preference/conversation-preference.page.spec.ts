import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConversationPreferencePage } from './conversation-preference.page';

describe('ConversationPreferencePage', () => {
  let component: ConversationPreferencePage;
  let fixture: ComponentFixture<ConversationPreferencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationPreferencePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationPreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
