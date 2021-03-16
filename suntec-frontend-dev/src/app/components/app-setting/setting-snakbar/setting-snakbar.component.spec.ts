import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSnakbarComponent } from './setting-snakbar.component';

describe('SettingSnakbarComponent', () => {
  let component: SettingSnakbarComponent;
  let fixture: ComponentFixture<SettingSnakbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingSnakbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSnakbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
