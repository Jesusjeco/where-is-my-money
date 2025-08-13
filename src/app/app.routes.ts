import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ViewExpenses } from './pages/view-expenses/view-expenses';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'expenses',
    component: ViewExpenses,
  },
];
