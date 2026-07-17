import { Route } from '@angular/router';
import { authenticationGuard } from './core/guards/authentication.guard';


export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)},
    {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'newgroup',
        loadComponent: () => import('./features/group/create-new-group/create-new-group').then(m => m.CreateNewGroupComponent)
      }
    ],
    canActivate: [authenticationGuard]
  },
  { path: '**', redirectTo: '' }
];
