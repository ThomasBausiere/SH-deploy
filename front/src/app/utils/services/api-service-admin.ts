import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserType } from '../types/user-type';
import { Observable } from 'rxjs';
import { ToonCreateRequest, ToonRenameRequest, ToonType } from '../types/toon-type';
import { API_BASE_URL } from '../../api.config';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceAdmin {

    private baseUrl = `${API_BASE_URL}/admin`;

  constructor(private http: HttpClient){}

  getToken(): string | null{
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUser(id : bigint): Observable<UserType>{
    return this.http.get<UserType>(this.baseUrl + '/user/' + id)
  }

  // ====== TOON (scope admin) ======
  listAllToons(): Observable<ToonType[]> {
    return this.http.get<ToonType[]>(`${this.baseUrl}/toons`);
  }

  listToonsByUser(userId: number): Observable<ToonType[]> {
    return this.http.get<ToonType[]>(`${this.baseUrl}/toons/user/${userId}`);
  }

  createToonForUser(userId: number, body: ToonCreateRequest): Observable<ToonType> {
    return this.http.post<ToonType>(`${this.baseUrl}/toons/user/${userId}`, body);
  }

  getToon(id: number): Observable<ToonType> {
    return this.http.get<ToonType>(`${this.baseUrl}/toons/${id}`);
  }

  renameToon(id: number, body: ToonRenameRequest): Observable<ToonType> {
    return this.http.patch<ToonType>(`${this.baseUrl}/toons/${id}/name`, body);
  }

  deleteToon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/toons/${id}`);
  }

  addSkillToon(id: number, skillId: number): Observable<ToonType> {
    return this.http.post<ToonType>(`${this.baseUrl}/toons/${id}/skills/${skillId}`, {});
  }

  removeSkillToon(id: number, skillId: number): Observable<ToonType> {
    return this.http.delete<ToonType>(`${this.baseUrl}/toons/${id}/skills/${skillId}`);
  }
  
}
