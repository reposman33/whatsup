import { Route } from '@angular/router';
import { authenticationGuard } from './shared/guards/authentication-guard';


export const appRoutes: Route[] = [
  {path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login)},
  {path: 'whatsUp', loadComponent: () => import('./components/whats-up/whats-up').then(m => m.WhatsUp), canActivate: [authenticationGuard]},
  {path: '*', redirectTo: 'whatsUp'}
];
