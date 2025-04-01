import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesvehiculesComponent } from './servicesvehicules.component';

describe('ServicesvehiculesComponent', () => {
  let component: ServicesvehiculesComponent;
  let fixture: ComponentFixture<ServicesvehiculesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesvehiculesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesvehiculesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
