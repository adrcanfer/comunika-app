import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { platformLayoutGuard } from './platform-layout.guard';

describe('platformLayoutGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => platformLayoutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
