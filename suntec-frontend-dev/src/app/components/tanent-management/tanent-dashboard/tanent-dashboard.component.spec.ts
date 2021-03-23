import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TanentDashboardComponent } from './tanent-dashboard.component';

describe('TanentDashboardComponent', () => {
  let component: TanentDashboardComponent;
  let fixture: ComponentFixture<TanentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TanentDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TanentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
