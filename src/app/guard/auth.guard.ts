import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Authguard implements CanActivate {

  constructor(private router: Router, private authenticationService: AuthenticationService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const role = route.data.role;
    //  alert(JSON.stringify(localStorage.getItem('currentUser')));
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }


}
