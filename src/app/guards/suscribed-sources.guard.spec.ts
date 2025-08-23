import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { suscribedSourcesGuard } from './suscribed-sources.guard';

describe('suscribedSourcesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => suscribedSourcesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
