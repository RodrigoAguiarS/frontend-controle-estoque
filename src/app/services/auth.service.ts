import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Credenciais } from '../model/Credenciais';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private readonly http: HttpClient) {}

  authenticate(creds: Credenciais) {
    return this.http.post(`${API_CONFIG.baseUrl}/auth/login`, creds, {
      observe: 'response',
      responseType: 'text',
    });
  }

  getUserRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${API_CONFIG.baseUrl}/usuarios/papel`);
  }

  successfulLogin(token: string) {
    localStorage.setItem('token', token);
  }

  isAuthenticated() {
    let token = localStorage.getItem('token');
    if (token != null) {
      let isExpired = this.jwtService.isTokenExpired(token);
      return !isExpired;
    }
    return false;
  }

  logout() {
    localStorage.clear();
  }

  logarComoUsuario(email: string): Observable<string> {
    const tokenOriginal = localStorage.getItem('token');
    if (tokenOriginal) {
      localStorage.setItem('tokenOriginal', tokenOriginal);
    }

    return this.http
      .post(
        `${API_CONFIG.baseUrl}/impersonate/logarComo`,
        { email },
        { responseType: 'text' }
      )
      .pipe(
        tap((token: string) => {
          localStorage.setItem('impersonateToken', token);
          localStorage.setItem('token', token);
        })
      );
  }

  voltarAoUsuarioAnterior(): Observable<string> {
    return this.http
      .post(
        `${API_CONFIG.baseUrl}/impersonate/voltarAoUsuarioLogado`,
        {},
        { responseType: 'text' }
      )
      .pipe(
        tap(() => {
          const tokenOriginal = localStorage.getItem('tokenOriginal');
          if (tokenOriginal) {
            localStorage.setItem('token', tokenOriginal);
            localStorage.removeItem('tokenOriginal');
          }
          localStorage.removeItem('impersonateToken');
        })
      );
  }
}
