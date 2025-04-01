import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecanicienComponent } from './mecanicien.component';

describe('MecanicienComponent', () => {
  let component: MecanicienComponent;
  let fixture: ComponentFixture<MecanicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecanicienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecanicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
