import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

interface LoginRequest {
  loginId: string;
  password: string;
}

interface JwtResponse {
  accessToken: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}

interface SignUpRequest {
  loginId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: number;
  roles: string[];
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1.0/moviebooking';

  constructor(private http: HttpClient, private router: Router) {}

  resetPassword(loginId: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/${loginId}/forgot`;
    const body = { loginId, password };
    return this.http.put(url, body);
  }
  login(credentials: { loginId: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(signUpRequest: SignUpRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, signUpRequest);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    const userRoles = this.getUserRoles(); 
    return userRoles.includes('ROLE_ADMIN'); 
  }

  getUserRoles(): string[] {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.roles || [];
  }

 
}
