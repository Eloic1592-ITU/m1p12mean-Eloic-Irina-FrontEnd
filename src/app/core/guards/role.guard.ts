import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = next.data['roles'] as Array<'admin' | 'mecanicien' | 'client' >;
    const userRole = this.authService.getCurrentRole();

    if (!this.authService.isAuthenticated()) {
      // Si non authentifié, redirige vers la page de login
      return this.router.createUrlTree(['/login'+userRole], {
        queryParams: { returnUrl: state.url }
      });
    }

    if (!userRole || !requiredRoles || !requiredRoles.includes(userRole as any)) {
      // Si non autorisé, redirige vers la page unauthorized
      return this.authService.redirectToUnauthorized();
    }

    return true;
  }
}