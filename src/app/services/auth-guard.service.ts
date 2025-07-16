import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const requiredRoles = route.data['roles'] as Array<string>;

    if (user && requiredRoles.includes(user.role)) {
      return true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Accès refusé',
        text: 'Vous n\'avez pas la permission de voir cette page.',
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return false;
    }
  }
}
