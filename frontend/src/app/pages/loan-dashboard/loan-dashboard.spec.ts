import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDashboard } from './loan-dashboard';

describe('LoanDashboard', () => {
  let component: LoanDashboard;
  let fixture: ComponentFixture<LoanDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
