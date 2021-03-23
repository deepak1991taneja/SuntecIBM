import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TanentManagementComponent } from './tanent-management.component';

describe('TanentManagementComponent', () => {
  let component: TanentManagementComponent;
  let fixture: ComponentFixture<TanentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TanentManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TanentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
