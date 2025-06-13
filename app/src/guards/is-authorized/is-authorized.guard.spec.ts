import { Reflector } from '@nestjs/core';
import { IsAuthorizedGuard } from './is-authorized.guard';

describe('IsAuthorizedGuard', () => {
  let guard: IsAuthorizedGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new IsAuthorizedGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
