import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      // Vérifie si la route a des restrictions de rôle
      const requiredRoles = next.data['roles'] as Array<'admin' | 'mecanicien'| 'client' >;
      
      if (requiredRoles) {
        const userRole = this.authService.getCurrentRole();
        if (!userRole || !requiredRoles.includes(userRole as any)) {
          return this.authService.redirectToUnauthorized();
        }
      }
      
      return true;
    }

    // Redirige vers la page de login appropriée selon le contexte
    const targetRoute = state.url.includes('admin') ? '/loginadmin' : 
                       state.url.includes('mecanicien') ? '/loginmecanicien' : 
                       '/loginclient';
    
    return this.router.createUrlTree([targetRoute], {
      queryParams: { returnUrl: state.url }
    });
  }
}