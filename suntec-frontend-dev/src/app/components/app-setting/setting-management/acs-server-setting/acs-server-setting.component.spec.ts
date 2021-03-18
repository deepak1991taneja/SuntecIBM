import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcsServerSettingComponent } from './acs-server-setting.component';

describe('AcsServerSettingComponent', () => {
  let component: AcsServerSettingComponent;
  let fixture: ComponentFixture<AcsServerSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcsServerSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcsServerSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
