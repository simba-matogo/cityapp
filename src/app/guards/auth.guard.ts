import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Check if user has the required role for this route
          const requiredRole = route.data?.['role'];
          if (requiredRole) {
            const currentUser = this.authService.getCurrentUserData();
            if (currentUser && currentUser.role === requiredRole) {
              return true;
            } else {
              // Redirect to appropriate dashboard based on user role
              this.redirectBasedOnRole(currentUser?.role);
              return false;
            }
          }
          return true;
        } else {
          // Redirect to login if not authenticated
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }

  private redirectBasedOnRole(role?: string): void {
    switch (role?.toLowerCase()) {
      case 'generaluser':
        this.router.navigate(['/user-dashboard']);
        break;
      case 'departmentadmin':
        this.router.navigate(['/department-dashboard']);
        break;
      case 'overalladmin':
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
