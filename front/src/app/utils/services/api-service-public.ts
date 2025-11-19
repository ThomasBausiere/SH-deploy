import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SkillType } from '../types/skill-type';
import { catchError, Observable, of, tap } from 'rxjs';
import { BossType } from '../types/boss-type';
import { UserPublic, UserRegister } from '../types/user-public';
import { isPlatformBrowser } from '@angular/common';
import { Token } from '@angular/compiler';
import { API_BASE_URL } from '../../api.config';

@Injectable({
  providedIn: 'root',
})
export class ApiServicePublic {
  private baseUrl = `${API_BASE_URL}/public`;

  constructor(private http: HttpClient) {}

  getSkills(): Observable<SkillType[]> {
    return this.http.get<SkillType[]>(this.baseUrl + '/skills');
  }
  getSkillsBy(key: string): Observable<SkillType[]> {
    return this.http.get<SkillType[]>(`${this.baseUrl}/skills/search`, {
      params: { q: key },
    });
  }

  getBosses(id: number): Observable<BossType[]> {
    return this.http.get<BossType[]>(
      this.baseUrl + '/bosses/by-skill' + `/${id}`
    );
  }

  register(user: UserRegister): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/register', user).pipe(
      catchError((err) => {
        console.error('Error:', err);
        return of('');
      })
    );
  }

  login(
    credentials: Pick<UserRegister, 'email' | 'password'>
  ): Observable<{ token: string; userId: number }> {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return this.http
      .post<{ token: string; userId: number }>(
        this.baseUrl + '/login',
        credentials
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId.toString());
        }),
        catchError((err) => {
          console.error(err.message);
          return of();
        })
      );
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUser(id: bigint): Observable<UserPublic> {
    return this.http.get<UserPublic>(this.baseUrl + '/user/' + id);
  }

  getUserId(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      
      localStorage.removeItem('userId');
      
    }
  }
}
