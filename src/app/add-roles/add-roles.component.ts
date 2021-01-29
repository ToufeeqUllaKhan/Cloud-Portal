import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MainService } from '../services/main-service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.css']
})
export class AddRolesComponent implements OnInit {

  modulesList = [];
  roleName: any;
  checkedArr = []; isroleModules: Boolean = false;
  isCreateUsers: Boolean = false; isEditUsers: Boolean = false;
  urlMap: String;
  public success = 0; public failed = 0;
  roleStatus: any;

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;


  constructor(private mainService: MainService, private router: Router, private spinnerService: NgxSpinnerService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    /** to handle breadcrumbs where add role is clicked. i.e., from edit user add role or add user add role or role module view add role option */
    let getPrevUrl = localStorage.getItem('previousUrl');
    this.urlMap = "" + getPrevUrl + "";
    if (getPrevUrl == '/role-module-view') {
      this.isroleModules = true;
      this.isCreateUsers = false;
      this.isEditUsers = false;
    } if (getPrevUrl == '/create-users') {
      this.isCreateUsers = true;
      this.isroleModules = false;
      this.isEditUsers = false;
    }
    if (getPrevUrl == '/edit-user-details') {
      this.isEditUsers = true;
      this.isroleModules = false;
      this.isCreateUsers = false;
    }
    this.spinnerService.show();
    /** List of all Modules */
    let crudType = 9;
    this.mainService.getRoleModule(crudType, null, null, null, null)
      .then(value => {
        let moduleData = [];
        for (var i = 0; i < value.data.length; i++) {
          moduleData.push(value.data[i]['mainModule']);
        }
        var uniqueModules = moduleData.filter((v, i, a) => a.indexOf(v) === i);
        let deleteValue = 'Profile Module';
        uniqueModules = uniqueModules.filter(item => item !== deleteValue);
        this.modulesList = uniqueModules;
        this.spinnerService.hide();
      });
    /** validation for not to accept space in input */
    $(document).ready(function () {
      $("input").on("keypress", function (e) {
        if (e.which === 32 && !this.value.length)
          e.preventDefault();
      });
    });
  }

  /** to handle to set previous url from where the add role is clicked to traverse back the url */
  close() {
    this.router.navigate(['' + this.urlMap + '']);
  }

  /**
  checked items to map the selected module based on role
   */
  click(value, status: boolean) {
    if (this.checkedArr.indexOf(value) === -1 && status) {
      this.checkedArr.push(value);
    }
    else if (!status) {
      let index = this.checkedArr.indexOf(value);
      this.checkedArr.splice(index, 1);
    }
  }

  /** resetting checkboxes */

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  /** Role creation  */
  createRole() {
    if (this.roleName != '' && this.roleName != undefined) {
      let crudType = 3; let role = this.roleName;
      this.roleStatus = '';
      this.mainService.createUser(6, null, null, role, null, null, null, null, null, null)
        .subscribe(value => {
          if (value.data[0]['result'] == 1) {
            this.roleStatus = 'success';
            this.roleSubmit();
            this.toastr.success('', value.data[0]['message']);

            /** Here we are adding profile module manually since when user logins to websits he should have access to profile even though he dont have access for main Modules */
            let module = 'Profile Module'; let user = null; let project = null;
            this.mainService.getRoleModules(1, role, module, user, project, null, null, null)
              .subscribe(value => {
              });
            this.mainService.getRoleModules(crudType, role, module, user, project, 1, null, null)
              .subscribe(value => {
              });
          }
        });
    } else {
      this.toastr.warning('', 'Please Enter the role');
    }
  }

  /** Role Submit Operation along with mapping modules */

  async roleSubmit() {
    this.success = 0;
    this.failed = 0;
    if (this.roleName != '' && this.roleName != undefined) {
      let crudType = 3; let role = this.roleName;
      if (this.roleStatus == undefined || this.roleStatus == '' || this.roleStatus == null) {
        this.createRole();
      } else {
        for (var j = 0; j < this.checkedArr.length; j++) {
          let module = this.checkedArr[j]; let user = null; let project = null;
          await this.mainService.getRoleModules(crudType, role, module, user, project, 1, null, null)
            .subscribe(value => {
              if (value.data[0]['result'] == 1) {
                this.success++;
                this.uncheckAll();
                this.roleName = null;
              } else {
                this.failed++;
              }
              this.router.navigate(['' + this.urlMap + '']);
            });
          if (j + 1 == this.checkedArr.length) {
            if (this.success != 0) {
              this.toastr.success('', this.success + ' ' + 'Records Mapped Successfully');
            }
            if (this.failed != 0) {
              this.toastr.warning('', this.failed + ' ' + 'Records Mapped Unsuccessfully');
            }
          }
        }
        if (this.checkedArr.length == 0) {
          this.router.navigate(['' + this.urlMap + '']);
        }
      }
    } else {
      this.toastr.warning('', 'Please Enter the role');
    }
  }

}
