import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationrendezvousComponent } from './validationrendezvous.component';

describe('ValidationrendezvousComponent', () => {
  let component: ValidationrendezvousComponent;
  let fixture: ComponentFixture<ValidationrendezvousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationrendezvousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationrendezvousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
