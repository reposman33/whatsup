import { Route } from '@angular/router';
import { authenticationGuard } from './core/guards/authentication.guard';


export const appRoutes: Route[] = [
  {path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)},
  {path: '', loadComponent: () => import('./core/layout/main-layout/main-layout').then(m => m.MainLayoutComponent), canActivate: [authenticationGuard]},
  {path: '**', redirectTo: ''}
];
