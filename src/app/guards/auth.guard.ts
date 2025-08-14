import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        // Redirect to login page if not authenticated
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.user$.pipe(
    take(1),
    map(user => {
      if (!user) {
        return true;
      } else {
        // Redirect to home if already authenticated
        router.navigate(['/']);
        return false;
      }
    })
  );
};