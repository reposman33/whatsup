import { CanActivateFn, Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticateService);
  const router = inject(Router);

  if(authService.isAuthenticated()) {
    return true
  }

  authService.requestedUrl = state.url;
  return router.createUrlTree(['login']);
};
