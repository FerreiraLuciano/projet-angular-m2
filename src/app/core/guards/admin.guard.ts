import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.currentUser() && authService.currentUser()?.role === 'admin') {
    return true;
  } else {
    router.navigate(['/movies']);
    return false; // Accès refusé
  }
};
