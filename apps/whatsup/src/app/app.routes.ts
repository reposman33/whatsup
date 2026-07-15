import { Route } from '@angular/router';
import { authenticationGuard } from './shared/guards/authentication-guard';


export const appRoutes: Route[] = [
  {path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)},
  {path: '', loadComponent: () => import('./components/main-layout/main-layout').then(m => m.MainLayoutComponent), canActivate: [authenticationGuard]},
  {path: '**', redirectTo: ''}
];
