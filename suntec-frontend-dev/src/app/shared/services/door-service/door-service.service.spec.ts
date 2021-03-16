import { TestBed } from '@angular/core/testing';

import { DoorServiceService } from './door-service.service';

describe('DoorServiceService', () => {
  let service: DoorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
