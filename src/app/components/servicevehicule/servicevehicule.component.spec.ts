import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicevehiculeComponent } from './servicevehicule.component';

describe('ServicevehiculeComponent', () => {
  let component: ServicevehiculeComponent;
  let fixture: ComponentFixture<ServicevehiculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicevehiculeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicevehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
