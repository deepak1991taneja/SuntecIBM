import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrTabletComponent } from './fr-tablet.component';

describe('FrTabletComponent', () => {
  let component: FrTabletComponent;
  let fixture: ComponentFixture<FrTabletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrTabletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
