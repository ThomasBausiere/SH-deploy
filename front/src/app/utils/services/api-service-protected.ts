import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserType } from '../types/user-type';
import { ToonCreateRequest, ToonRenameRequest, ToonType } from '../types/toon-type';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceProtected {
  private baseUrl = "http://localhost:8080/api/private";
  private baseUrlPublic = "http://localhost:8080/api/public";
  private baseUrlAdmin ="http://localhost:8080/api/admin"

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

  updateUser(id: number, payload: { email: string; pseudo: string }) {
  return this.http.post(`/api/private/user/${id}`, payload);
}

updatePassword(id: number, payload: { password: string }) {
  return this.http.post(`/api/private/user/${id}/updatepass`, payload);
}

listUsers() {
  return this.http.get<any[]>(this.baseUrlAdmin + '/users');
}
listBosses() {
  return this.http.get<any[]>(this.baseUrlPublic + '/bosses'); 
}
listAllToons() {
  return this.http.get<any[]>(this.baseUrlAdmin + '/toons');  
}
me() {
  return this.http.get<{ id:number; email:string; pseudo:string; role:'USER'|'ADMIN' }>(
    this.baseUrl + '/me'
  );
}

createSkill(body: { name: string }) {
    return this.http.post<any>(`${this.baseUrlPublic}/skills`, body);
  }

  updateSkill(id: number, body: { name: string }) {
    return this.http.put<any>(`${this.baseUrlPublic}/skills/${id}`, { id, ...body });
  }

  // ===== Boss (public controller côté back) =====
  createBoss(body: { name: string }) {
    return this.http.post<any>(`${this.baseUrlPublic}/bosses`, body);
  }

  updateBoss(id: number, body: { name: string }) {
    return this.http.put<any>(`${this.baseUrlPublic}/bosses/${id}`, { id, ...body });
  }


changeMyPassword(userId: number, newPassword: string) {
  return this.http.patch(`${this.baseUrl}/user/${userId}/password`, { newPassword });
}

deleteMyAccount(userId: number) {
  return this.http.delete(`${this.baseUrl}/user/${userId}`);
}
  
}
