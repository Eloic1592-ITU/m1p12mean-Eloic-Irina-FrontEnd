import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    this.isLoggedInSubject.next(!!token);
    this.userRoleSubject.next(role);
  }

  login(credentials: {email: string, motdepasse: string}, role: 'admin' | 'mecanicien' | 'client'): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { ...credentials, role }).pipe(
      tap((response: any) => {
        alert
        if (response.token) {
          this.handleLoginSuccess(response.token, response.role, response.user);
        }
      }),
      catchError(this.handleError)
    );
  }
  
  private handleLoginSuccess(token: string, role: string, userData: any): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_id', userData.id); // Stockage de l'ID utilisateur
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    this.isLoggedInSubject.next(true);
    this.userRoleSubject.next(role);
  
    // Redirection basée sur le rôle
    const redirectPath = this.getRedirectPath(role);
    this.router.navigate([redirectPath]);
  }
  
  private getRedirectPath(role: string): string {
    switch(role) {
      case 'admin': return '/validationrendezvous';
      case 'mecanicien': return '/rendezvousmecanicien';
      case 'client': return '/rendezvous';
      default: return '/';
    }
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      complete: () => this.clearAuth(),
      error: () => this.clearAuth()
    });
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_data');
    
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
    
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentRole(): string | null {
    return localStorage.getItem('user_role');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
  redirectToUnauthorized(): UrlTree {
    this.clearAuth();
    return this.router.parseUrl('/unauthorized');
  }
    // Ajoutez cette méthode à votre AuthService
  isAuthenticated(): boolean {
  return !!this.getToken();
}
}