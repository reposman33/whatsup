import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/AuthService/AuthService';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authenticated$.pipe(
    map(isAuthenticated => 
      isAuthenticated ?
      true :
      router.createUrlTree(['login']))
  )
};
