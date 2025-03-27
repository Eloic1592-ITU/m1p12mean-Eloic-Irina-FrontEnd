import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConseilTechComponent } from './conseil-tech.component';

describe('ConseilTechComponent', () => {
  let component: ConseilTechComponent;
  let fixture: ComponentFixture<ConseilTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConseilTechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConseilTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
