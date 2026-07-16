import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/data-access/auth.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentContact() ? true : router.createUrlTree(['/login'])
};
