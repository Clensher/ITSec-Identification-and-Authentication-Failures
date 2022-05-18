import { TestBed } from '@angular/core/testing';

import { LoginTrysCounterService } from './login-trys-counter.service';

describe('LoginTrysCounterService', () => {
  let service: LoginTrysCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginTrysCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
