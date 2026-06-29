import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service/auth.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentContact() ? true : router.createUrlTree(['login'])
};
