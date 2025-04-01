import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailservicevehiculeComponent } from './detailservicevehicule.component';

describe('DetailservicevehiculeComponent', () => {
  let component: DetailservicevehiculeComponent;
  let fixture: ComponentFixture<DetailservicevehiculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailservicevehiculeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailservicevehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
