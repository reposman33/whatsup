import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentContact() ? true : router.createUrlTree(['/login'])
};
