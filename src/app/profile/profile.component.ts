import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../services/main-service';
import { User } from '../../app/model/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  submitted: Boolean = false;
  roles = [];
  user: User = new User();
  firstname: any; role: any; phonenumber: any; email: any; lastname: any;
  username: any; userSelected: any; fileExt: any; imagePath: any; profilePicture: any;

  constructor(private fb: FormBuilder, private mainService: MainService, private toastr: ToastrService, private router: Router, private spinnerService: NgxSpinnerService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    /** Profile Validations */
    this.profileForm = this.fb.group({
      Role: ['', Validators.required],
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      eMail: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
    /** User related Information to set in the form */
    let crudtype = 4;
    let userName = localStorage.getItem('userName');
    this.mainService.createUser(crudtype, userName, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        if (value.data.length > 0) {
          this.firstname = value.data[0]['firstName'];
          this.role = value.data[0]['roleName'];
          this.phonenumber = value.data[0]['mobile'];
          this.email = value.data[0]['eMail'];
          this.lastname = value.data[0]['lastName'];
          this.username = localStorage.getItem('userName');
          this.userSelected = value.data[0]['firstName'] + ' ' + value.data[0]['lastName'];
        }
        if (value.data[0]['profilePicture'] != null) {
          this.imagePath = value.data[0]['profilePicture'];
          this.profilePicture = 'data:image/jpg;base64,' + this.imagePath;
        } else {
          this.profilePicture = 'assets/images/logo_user.png';
        }

      });
    /** List of roles */
    this.mainService.createUser(5, null, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        this.roles = value.data;
      });
    /** For Image Upload */
    $(document).ready(function () {
      $("#profileImage").click(function (e) {
        $("#imageUpload").click();
      });

      function fasterPreview(uploader) {
        if (uploader.files && uploader.files[0]) {
          $('#profileImage').attr('src',
            window.URL.createObjectURL(uploader.files[0]));
        }
      }

      $("#imageUpload").change(function () {
        fasterPreview(this);
      });
    });
  }

  /** Validation of Image Size to restrict the file size of an image */

  ValidateSize(e) {
    this.spinnerService.hide();
    var file_list = e.target.files;
    for (var i = 0, file; file = file_list[i]; i++) {
      var sFileName = file.name;
      var sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
      this.fileExt = sFileExtension;
      var iFileSize = file.size;
      var iConvert = (file.size / 1048576).toFixed(2);
      var sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      if ((this.fileExt === 'jpg') || (this.fileExt === 'jpeg') || (this.fileExt === 'png')) {
        if (iFileSize > 1000000) {
          this.toastr.warning('', 'Please upload file less than 1MB');
          $('#imageUpload').val('');
        } else {
          var files = e.target.files;

          if (files) {
            var reader = new FileReader();

            reader.onload = this.FileReader.bind(this);

            reader.readAsBinaryString(file);
          }
        }
      }
      else {
        this.toastr.error('', 'Accepts only .jpg, .jpeg, .png format');
        $('#imageUpload').val('');
      }
    }
  }

  /** File Reader the convert image file to base64 to save the image in DB */

  FileReader(readerEvt) {

    var binaryString = readerEvt.target.result;

    var b64 = btoa(binaryString);

    var base64 = b64;
    let crudtype = 4;
    console.log(this.username);
    let userName = localStorage.getItem('userName');
    this.mainService.createUser(crudtype, userName, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        this.mainService.createUser(2, userName, value.data[0]['password'], this.role, this.firstname, this.lastname, this.email,
          this.phonenumber, base64, this.fileExt)
          .subscribe(value => {
            if (value.data.length > 0) {
              if (value.data[0]['result'] == 1) {
                this.toastr.success('', value.data[0]['message']);
                this.spinnerService.hide();
                location.reload();
              }
            } else {
              this.spinnerService.hide();
            }
          });
      });

  }

  get f() { return this.profileForm.controls; }

  /** Profile Updation Operation */

  onUpdateProfileSubmit() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }
    this.mainService.updateUserInfo(this.user, this.firstname, this.lastname, this.email, this.phonenumber, this.role).pipe()
      .subscribe(value => {
        console.log(value);
        if (value.data != '' && value.data == 1) {
          this.toastr.success(value.message, '');
          this.router.navigate(['/profile']);
          location.reload();
        }
      });

  }

  dashboard() {
    this.router.navigate(['/dashboard'])
      .then(() => {
        location.reload();
      });
  }

  close() {
    this.router.navigate(['/dashboard']).then(() => {
      location.reload();
    });
  }

}
