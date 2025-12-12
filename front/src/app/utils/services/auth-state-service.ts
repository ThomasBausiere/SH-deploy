import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiServicePublic } from './api-service-public';
import { ApiServiceProtected } from './api-service-protected';

export type AuthState = { isLogged: boolean; isAdmin: boolean };

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly _state$ = new BehaviorSubject<AuthState>({ isLogged: false, isAdmin: false });
  readonly state$ = this._state$.asObservable();

  constructor(private apiPublic: ApiServicePublic, private api: ApiServiceProtected) {
    this.refresh();
  }

  refresh() {
    const isLogged = this.apiPublic.isAuthenticated();
    if (!isLogged) {
      this._state$.next({ isLogged: false, isAdmin: false });
      return;
    }

    this.api.me().pipe(
      catchError(() => {
        this._state$.next({ isLogged: true, isAdmin: false });
        return of(null);
      })
    ).subscribe(me => {
      this._state$.next({ isLogged: true, isAdmin: !!me && me.role === 'ADMIN' });
    });
  }

  logout() {
    this.apiPublic.logout();
    this._state$.next({ isLogged: false, isAdmin: false });
  }
}
