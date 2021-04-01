import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailNotificationSettingComponent } from './email-notification-setting.component';

describe('EmailNotificationSettingComponent', () => {
  let component: EmailNotificationSettingComponent;
  let fixture: ComponentFixture<EmailNotificationSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailNotificationSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailNotificationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
