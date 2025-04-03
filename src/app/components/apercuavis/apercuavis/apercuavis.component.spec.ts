import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApercuavisComponent } from './apercuavis.component';

describe('ApercuavisComponent', () => {
  let component: ApercuavisComponent;
  let fixture: ComponentFixture<ApercuavisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApercuavisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApercuavisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
