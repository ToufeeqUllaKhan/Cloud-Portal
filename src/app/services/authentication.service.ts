import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod'
import { map } from 'rxjs/operators';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }

  login(username: string, password: string) {
    ///users/authenticate
    return this.http.post<any>(`${ environment.apiUrl }/api/Authentication/Login`, { Username: username, Password: password }).pipe(map(
      user => {
       // alert(JSON.stringify(user.statusCode));
       // alert(JSON.stringify(user.message));
       // alert(JSON.stringify(user.data[0]['sessionToken']));
        if (user.statusCode == 500) {
          this.toastr.error(user.message,'');
        }
        if (user) {
          localStorage.setItem('userValidation', JSON.stringify(user));
        }
          if (user && user.data[0].sessionToken) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        return user;
      }
    ))

  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    this.router.navigate(['./login'])
      .then(() => {
        location.reload();
      });
  }

}
