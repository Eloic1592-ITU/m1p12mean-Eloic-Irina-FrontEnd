import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginmecanicienComponent } from './loginmecanicien.component';

describe('LoginmecanicienComponent', () => {
  let component: LoginmecanicienComponent;
  let fixture: ComponentFixture<LoginmecanicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginmecanicienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginmecanicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
