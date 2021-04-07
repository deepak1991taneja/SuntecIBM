import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrTabletConfigComponent } from './fr-tablet-config.component';

describe('FrTabletConfigComponent', () => {
  let component: FrTabletConfigComponent;
  let fixture: ComponentFixture<FrTabletConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrTabletConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrTabletConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
