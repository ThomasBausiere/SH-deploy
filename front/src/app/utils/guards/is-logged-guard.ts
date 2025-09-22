import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiServicePublic } from '../services/api-service-public';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const api = inject(ApiServicePublic);
  const router = inject(Router);
  const token = api.getToken();

  if (!token) {
    return router.createUrlTree(['/login'], { queryParams: { redirectUrl: state.url } });
  }
  return true;
};
