import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmecanicienComponent } from './editmecanicien.component';

describe('EditmecanicienComponent', () => {
  let component: EditmecanicienComponent;
  let fixture: ComponentFixture<EditmecanicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmecanicienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmecanicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
