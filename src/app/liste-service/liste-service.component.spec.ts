import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeServiceComponent } from './liste-service.component';

describe('ListeServiceComponent', () => {
  let component: ListeServiceComponent;
  let fixture: ComponentFixture<ListeServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
