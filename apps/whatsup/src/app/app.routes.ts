import { Route } from '@angular/router';
import { authenticationGuard } from './shared/guards/authentication-guard';


export const appRoutes: Route[] = [
  {path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login)},
  {path: '', loadComponent: () => import('./components/main-layout/main-layout').then(m => m.MainLayout), canActivate: [authenticationGuard]},
  {path: '**', redirectTo: ''}
];
