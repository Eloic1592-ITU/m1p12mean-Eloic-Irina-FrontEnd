import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendrdvComponent } from './prendrdv.component';

describe('PrendrdvComponent', () => {
  let component: PrendrdvComponent;
  let fixture: ComponentFixture<PrendrdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrendrdvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrendrdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
