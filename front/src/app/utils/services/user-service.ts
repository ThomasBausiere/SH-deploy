import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserType } from '../types/user-type';
import { API_BASE_URL } from '../../api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = `${API_BASE_URL}/public/auth`;
  constructor(private http: HttpClient) {}

  createUser(post:UserType):Observable<UserType>{
     return this.http.post<UserType>(this.userUrl+'/register', post);
  }
    login(data: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.userUrl}/login`, data);
  }
    getUser(id: string): Observable<any> {
    return this.http.get(`${this.userUrl}/${id}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.userUrl);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.userUrl}/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.userUrl}/${id}`);
  }

  
  test():Observable<any>{
    return this.http.get<any>('http://localhost:8080/api/test')
  }
}
