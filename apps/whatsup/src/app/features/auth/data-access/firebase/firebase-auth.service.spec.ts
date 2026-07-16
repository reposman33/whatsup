import { TestBed } from '@angular/core/testing';

import { FireBaseAuthService } from '../firebase/firebase-auth.service';

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
