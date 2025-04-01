import { TestBed } from '@angular/core/testing';

import { ServicevehiculeService } from './servicevehicule.service';

describe('ServicevehiculeService', () => {
  let service: ServicevehiculeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicevehiculeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
