import { TestBed } from '@angular/core/testing';

import { FrTabletServiceService } from './fr-tablet-service.service';

describe('FrTabletServiceService', () => {
  let service: FrTabletServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrTabletServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
