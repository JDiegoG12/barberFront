import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberTemplateComponent } from './barber-template.component';

describe('BarberTemplateComponent', () => {
  let component: BarberTemplateComponent;
  let fixture: ComponentFixture<BarberTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarberTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
