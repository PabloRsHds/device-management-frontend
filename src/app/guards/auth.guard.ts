import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      return true;
    }
  }

  router.navigate(['']);
  return false;
};
