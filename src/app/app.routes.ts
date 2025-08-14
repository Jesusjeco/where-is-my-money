import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ViewExpenses } from './pages/view-expenses/view-expenses';
import { LoginComponent } from './components/login/login.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'expenses',
    component: ViewExpenses,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
