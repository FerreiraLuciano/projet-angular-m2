import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.currentUser()) {
    return true;
  } else {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false; // Accès refusé
  }
};
