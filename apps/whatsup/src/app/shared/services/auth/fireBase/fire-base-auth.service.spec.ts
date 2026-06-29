import { TestBed } from '@angular/core/testing';

import { FireBaseAuthService } from '../fire-base-auth.service';

describe('FireBaseAuth', () => {
  let service: FireBaseAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireBaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
