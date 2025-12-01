import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberReportsComponent } from './barber-reports.component';

describe('BarberReportsComponent', () => {
  let component: BarberReportsComponent;
  let fixture: ComponentFixture<BarberReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarberReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
