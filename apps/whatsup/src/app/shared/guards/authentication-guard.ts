import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated()) {
    return true
  }

  authService.requestedUrl = state.url;
  return router.createUrlTree(['login']);
};
