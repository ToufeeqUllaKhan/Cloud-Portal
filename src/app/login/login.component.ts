import { Component, OnInit, ViewContainerRef } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';
import { User } from '../model/user';
import { ToastrService } from 'ngx-toastr';
import { Title } from "@angular/platform-browser";
import { MainService } from '../services/main-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  userName: any;
  pwd: any;
  submitted: Boolean = false;
  error = '';
  loading = false;
  user: User = new User();

  constructor(private router: Router, private fb: FormBuilder, private authenticationService: AuthenticationService, private toastr: ToastrService, private titleService: Title, private mainService: MainService) {
    this.titleService.setTitle("Login - SSC");
  }



  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    $(document).ready(function () {
      $(window).resize(function () {
        var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
        if (browserZoomLevel < 100) {
          $('.container-fluid').css('height', 'auto');
        } if (browserZoomLevel == 100) {
          $('.container-fluid').css('height', '100vh');
          $('body').css('overflow-y', 'hidden');
          $('#wrapper').css('overflow-y', 'auto');
          $('.card-body').css('padding', '1.3rem');
        }
        if (browserZoomLevel == 110) {
          $('.card-signin').css('transform', 'scale(1.1,1.1)');
        }
        if (browserZoomLevel == 125) {
          $('.card-signin').css('transform', 'scale(1.2,1.2)');
          $('.card-body').css('padding', '0.5rem');
          $('.container-fluid').css('height', '120vh');
        }
        if (browserZoomLevel == 150) {
          $('.card-signin').css('transform', 'scale(1.3,1.3)');
          $('body').css('overflow-y', 'auto');
          $('#wrapper').css('overflow-y', 'auto');
          $('.card-body').css('padding', '0.5rem');
          $('.container-fluid').css('height', '130vh');
        }
        if (browserZoomLevel == 175) {
          $('.card-signin').css('transform', 'scale(1.4,1.4)');
          $('body').css('overflow-y', 'auto');
          $('#wrapper').css('overflow-y', 'auto');
          $('.card-body').css('padding', '0.5rem');
          $('.container-fluid').css('height', '155vh');
        }
        //if (browserZoomLevel == 200) {
        //  $('.card-signin').css('transform', 'scale(0.5,0.5)');
        //  $('body').css('overflow-y', 'auto');
        //  $('#wrapper').css('overflow-y', 'auto');
        //  $('.card-body').css('padding', '0.5rem');
        //}
        //if (browserZoomLevel == 250) {
        //  $('.card-signin').css('transform', 'scale(0.7,0.7)');
        //  $('body').css('overflow-y', 'auto');
        //  $('#wrapper').css('overflow-y', 'auto');
        //  $('.card-body').css('padding', '0.5rem');
        //}
        //if (browserZoomLevel == 300) {
        //  $('.card-signin').css('transform', 'scale(0.9,0.9)');
        //  $('body').css('overflow-y', 'auto');
        //  $('#wrapper').css('overflow-y', 'auto');
        //  $('.card-body').css('padding', '0.5rem');
        //}
      });
    });
  }

  get f() { return this.loginForm.controls; }

  onLoginSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    let userName = this.userName
    let password = this.pwd
    this.mainService.createUser(4, userName, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        if (value.data.length == 0) {
          localStorage.setItem('userName', userName);
          this.login();
        }
        else {
          localStorage.setItem('userName', value.data[0]['username']);
          if (password != value.data[0]['password']) {
            this.toastr.error('', 'Invalid Password!');
          }
          else {
            this.login();
          }
        }
      })
  }

  login() {
    localStorage.setItem('passWord', this.pwd);
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(value => {
        if (value.data.length > 0) {
          if (value.data[0]['result'] == 0) {
            this.toastr.error('', value.data[0]['message']);
          } else {
            this.toastr.success('', 'User Logged Successfully');
            this.router.navigate(['/dashboard'])
              .then(() => {
                location.reload();
              });
          }
        }
      },
        error => {
          this.error = error;
          this.loading = false;
        });

    //var getValidation = JSON.parse(localStorage.getItem('userValidation'));
    //if (getValidation['data'] !== undefined && getValidation['data'].length > 0) {
    //  //this.toastr.error(getValidation['message'], 'SSC Says..');
    //}
  }

}
