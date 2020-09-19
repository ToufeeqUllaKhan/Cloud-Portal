import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../services/main-service';
import { Router, NavigationStart } from '@angular/router';
import { User } from '../model/user';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.css']
})
export class CreateUsersComponent implements OnInit {

  createUserForm: FormGroup;
  submitted: Boolean = false;
  user: User = new User();
  roles = [];
  role: any = null; username: any; firstname: any; lastname: any;
  email: any; phonenumber: any; password: any; selectedproject: any;
  projects: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false;
  limitSelection = false; mobileNumber: any;
  projectNames: any; selectedItems: Array<any> = [];

  @ViewChild(FormGroupDirective, { static: false }) formGroupDirective: FormGroupDirective;

  constructor(private mainService: MainService, private router: Router, private fb: FormBuilder, private toastr: ToastrService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    $(document).ready(function () {
      $('.dropdown-list ul').css('max-height', '97px');
    });
  /** List of Overall Projects */
    let dataType = 1;
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {

        const unique = [...new Set(value.data.map(item => item.projectname))];

        let arrData = [];
        for (var i = 0; i < unique.length; i++) {
          arrData.push({ item_id: i, item_text: unique[i] });
        }
        this.projects = arrData;

      });
  /** Validation for create user */
    this.createUserForm = this.fb.group({
      Role: ['', Validators.required],
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      passWord: ['', [Validators.required, Validators.minLength(6)]],
      eMail: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.maxLength(10)]]
    });
  /** List of Roles */
    let crudType = 5;
    this.mainService.createUser(crudType, null, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        this.roles = value.data;
      });
  /** Project list multiselect option settings */
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter
    };
  }

  onInstanceSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
    let arrData1 = [];
    for (var i = 0; i < items.length; i++) {
      arrData1.push(items[i]['item_text']);
    }
    this.projectNames = arrData1;
  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }

  onProjectSelect(e) {
    // console.log(this.projectNames);
  }

/** Role change functionality ie., if admin role is selected default all projects will be selected else selected projects will select based on selection */

  roleChange() {
    if (this.role != 'Admin') {
      $('.projectAccess').css('pointer-events', 'auto');
    } else {
      $('.projectAccess').css('pointer-events', 'none');
      for (var i = 0; i < this.projects.length; i++) {

        var setIndex = this.projects.findIndex(p => p.item_text == this.projects[i]['item_text']);

        this.selectedItems.push({ item_id: setIndex, item_text: this.projects[i]['item_text'] });
      }
      this.projectNames = this.selectedItems;
    }
  }

  get f() { return this.createUserForm.controls; }

/** Create Users Submit Operation */
  onCreateUserSubmit() {
    if (this.password.length < 4) {
      this.toastr.warning('', 'Please enter a password with at least 4 characters');
    }
    this.submitted = true;
    if (this.createUserForm.invalid) {
      return;
    }
    
    let crudType = 1;
    let userName = this.username;
    this.mainService.createUser(crudType, userName, this.password, this.role, this.firstname, this.lastname, this.email, this.mobileNumber,null,null)
      .pipe()
      .subscribe(value => {
        if (value.data[0]['result'] == 1) {
          this.toastr.success('', value.data[0]['message']);
          this.formGroupDirective.resetForm();
          this.submitted = false;
          let crudtype = 5;
          for (var i = 0; i < this.projectNames.length; i++) {
            let project = this.projectNames[i]['item_text'];
            this.mainService.userProjectLinkingScenario(crudtype, null, null, userName, project)
              .then(val => {
              });
          }
          this.projectNames = [];
          this.router.navigate(['/user-library']);
        } else {
          this.toastr.warning('', value.data[0]['message']);
        }
    });
  }
/** New Role is clicked to handle new role page breadcrumbs list in add role page */
  newRole() {
    localStorage.removeItem('previousUrl');
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          window.localStorage.setItem('previousUrl', this.router.url);
        }
      });
    this.router.navigate(['/add-roles']);
  }

  close() {
    this.router.navigate(['/user-library']);
  }

}
