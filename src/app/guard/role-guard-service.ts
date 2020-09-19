import { Injectable } from '@angular/core';
import { Router,CanActivate,ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    
    const role = route.data.role;

    if (localStorage.getItem('currentUser')) {
      if (role && localStorage.getItem('AccessRole') == role)
        return true;
      else
        this.router.navigate(['/dashboard']);
    }
    return false;
  }
}
