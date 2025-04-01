import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendezvousmecanicienComponent } from './rendezvousmecanicien.component';

describe('RendezvousmecanicienComponent', () => {
  let component: RendezvousmecanicienComponent;
  let fixture: ComponentFixture<RendezvousmecanicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendezvousmecanicienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendezvousmecanicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
