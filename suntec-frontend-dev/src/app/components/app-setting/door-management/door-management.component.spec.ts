import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorManagementComponent } from './door-management.component';

describe('DoorManagementComponent', () => {
  let component: DoorManagementComponent;
  let fixture: ComponentFixture<DoorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoorManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
