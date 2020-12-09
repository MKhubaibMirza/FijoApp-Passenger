import { TestBed } from '@angular/core/testing';

import { ForwardGuard } from './forward.guard';

describe('ForwardGuard', () => {
  let guard: ForwardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ForwardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
