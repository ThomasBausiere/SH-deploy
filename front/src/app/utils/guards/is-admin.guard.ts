import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiServicePublic } from '../services/api-service-public';
import { ApiServiceProtected } from '../services/api-service-protected';
import { catchError, map, of } from 'rxjs';

export const isAdminGuard: CanActivateFn = () => {
  const api = inject(ApiServiceProtected);
  const router = inject(Router);

  return api.me().pipe(
    map(user => {
      const ok = !!user && user.role === 'ADMIN';
      if (!ok) router.navigate(['/']);
      return ok;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};

