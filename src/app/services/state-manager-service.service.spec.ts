import { TestBed } from '@angular/core/testing';

import { StateManagerServiceService } from './state-manager-service.service';

describe('StateManagerServiceService', () => {
  let service: StateManagerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateManagerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
