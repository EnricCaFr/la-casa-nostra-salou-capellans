import { Routes } from '@angular/router';
import { adminAuthGuard, adminLoginGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  { path: 'carta', loadComponent: () => import('./features/menu/menu').then((m) => m.Menu) },
  { path: 'carta/plato/:slug', loadComponent: () => import('./features/dish-detail/dish-detail').then((m) => m.DishDetail) },
  { path: 'contacto', loadComponent: () => import('./features/contact/contact').then((m) => m.Contact) },
  { path: 'admin/login', canActivate: [adminLoginGuard], loadComponent: () => import('./features/admin-login/admin-login').then((m) => m.AdminLogin) },
  { path: 'admin', canActivate: [adminAuthGuard], loadComponent: () => import('./features/admin/admin').then((m) => m.Admin) },
  { path: '**', redirectTo: '' },
];
