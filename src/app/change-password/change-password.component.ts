import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../services/main-service';
import { User } from '../../app/model/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changepasswordForm: FormGroup;
  submitted: Boolean = false;
  user: User = new User();
  oldpassword: any; newpassword: any; confirmpassword: any;


  constructor(private fb: FormBuilder, private mainService: MainService, private toastr: ToastrService, private router: Router) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.changepasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  get f() { return this.changepasswordForm.controls; }



  onUpdatePasswordSubmit() {
    this.submitted = false;



    if (this.changepasswordForm.invalid) {
      return;
    }

    if (this.f.newPassword.value != this.f.confirmPassword.value) {
      this.toastr.error('password doesnot match', '');
    }

    if (this.f.newPassword.value === this.f.confirmPassword.value) {

      let userName = localStorage.getItem('userName');
      console.log(userName);
      this.mainService.changePasswordRequest(userName, this.f.oldPassword.value, this.f.newPassword.value).pipe()
        .subscribe(value => {
          console.log(value);
          if (value.data != '' && value.data[0]['result'] == '1') {
            this.toastr.success(value.message, '');
            this.router.navigate(['/dashboard']);
          }
          if (value.data[0]['result'] == '0') {
            this.toastr.error(value.message, '');
          }
        });
    }

  }

  close() {
    history.back();
  }
}
