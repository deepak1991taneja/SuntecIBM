import { TestBed } from '@angular/core/testing';

import { UsersLoginService } from './users-login.service';

describe('UsersLoginService', () => {
  let service: UsersLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
