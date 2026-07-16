import { TestBed } from '@angular/core/testing';

import { FirestoreService } from '../../../shared/services/api/firestore/firestore.service';

describe('FireBase', () => {
  let service: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
