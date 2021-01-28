import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MainService } from '../services/main-service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-role-module-permission',
  templateUrl: './edit-role-module-permission.component.html',
  styleUrls: ['./edit-role-module-permission.component.css']
})
export class EditRoleModulePermissionComponent implements OnInit {
  modulesList = [];
  roleName: any;
  arr = [];
  checkedArr = []; isroleModules: Boolean = false;
  uncheckedArr = [];
  urlMap: any;
  public success = 0; public failed = 0;
  module: any; read: any; write: any; download: any;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  roles: any;
  permissionfilter: any;

  constructor(private mainService: MainService, private router: Router, private spinnerService: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.spinnerService.show();
    /** List of Roles */
    let crudtype = 5;
    this.mainService.createUser(crudtype, null, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        this.roles = value.data;
        this.roleName = this.roles[0]['name'];
        let crudType = 7;
        this.mainService.getRoleModule(crudType, null, null, null, null)
          .then(value => {
            /** based on role get modules accessible checked or not checked*/
            let resultFetchArr: any = value.data.filter(u =>
              u.name == this.roleName);
            this.permissionfilter = resultFetchArr;
            let fetchModule = [];
            for (var i = 0; i < resultFetchArr.length; i++) {
              fetchModule.push(resultFetchArr[i]['mainModule'].trim())
            }
            this.arr = fetchModule.filter((v, i, a) => a.indexOf(v) === i).sort();
            let deleteValue = 'Profile Module';
            this.modulesList = this.arr.filter(item => item !== deleteValue);
            this.module = this.modulesList[0]
            let permission = resultFetchArr.filter(u => u.mainModule === this.module)
            console.log(permission)
            if (permission.length === 0) {
              this.read = 0;
              this.write = 0;
              this.download = 0;
            }
            else {
              if (permission[0]['readPermission'] === undefined || permission[0]['readPermission'] === null) {
                this.read = 0
              }
              else {
                this.read = permission[0]['readPermission']
              }
              if (permission[0]['writePermission'] === undefined || permission[0]['writePermission'] === null) {
                this.write = 0
              }
              else {
                this.write = permission[0]['writePermission'];
              }
              if (permission[0]['downloadPermission'] === undefined || permission[0]['downloadPermission'] === null) {
                this.download = 0
              }
              else {
                this.download = permission[0]['downloadPermission']
              }
            }
            this.spinnerService.hide();
          });
      });
    let getPrevUrl = localStorage.getItem('prevEditUrl');

    this.urlMap = "" + getPrevUrl + "";
  }

  /** Checked List to map module to the particular role */

  click(e, status: boolean) {
    if (e.target.id === "Read" && !status) {
      this.read = 0;
    }
    else if (e.target.id === "Read" && status) {
      this.read = 1;
    }
    if (e.target.id === "Write" && !status) {
      this.write = 0;
    }
    else if (e.target.id === "Write" && status) {
      this.write = 1;
    }
    if (e.target.id === "Down" && !status) {
      this.download = 0;
    }
    else if (e.target.id === "Down" && status) {
      this.download = 1;
    }
  }

  /** Resetting checkboxes */

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  /** Edit Role Module mapping submit operation */

  async roleSubmit() {
    console.log(this.roleName, this.read, this.write, this.download, this.module)
    this.spinnerService.show();
    let crudType = 3; let role = this.roleName; let module = this.module;
    if (this.roleName === null || this.roleName === 'null' || this.roleName === '') {
      this.toastr.error('Please select the role')
    } else {
      await this.mainService.getRoleModules(4, role, module, null, null, 0, 0, 0)
        .subscribe(value => {
          let user = null; let project = null;
          this.mainService.getRoleModules(crudType, role, module, user, project, this.read, this.write, this.download)
            .subscribe(value => {
              if (value.data[0]['result'] == 1) {
                this.toastr.success('', value.data[0]['message']);
                location.reload();
              }
              else {
                this.toastr.warning('', value.data[0]['message']);
                location.reload();
              }
            });
        });
    }
    this.spinnerService.hide();
  }

  close() {
    this.router.navigate(['/role-module-view']);
  }

  onchangerole() {
    let crudType = 7;
    this.mainService.getRoleModule(crudType, null, null, null, null)
      .then(value => {
        /** based on role get modules accessible checked or not checked*/
        let resultFetchArr: any = value.data.filter(u =>
          u.name == this.roleName);
        let fetchModule = [];
        for (var i = 0; i < resultFetchArr.length; i++) {
          fetchModule.push(resultFetchArr[i]['mainModule'].trim())
        }
        this.arr = fetchModule.filter((v, i, a) => a.indexOf(v) === i).sort();
        let deleteValue = 'Profile Module';
        this.modulesList = this.arr.filter(item => item !== deleteValue);
        let permission = resultFetchArr.filter(u => u.mainModule === this.module)
        console.log(permission)
        if (permission.length === 0) {
          this.read = 0;
          this.write = 0;
          this.download = 0;
        }
        else {
          if (permission[0]['readPermission'] === undefined || permission[0]['readPermission'] === null) {
            this.read = 0
          }
          else {
            this.read = permission[0]['readPermission']
          }
          if (permission[0]['writePermission'] === undefined || permission[0]['writePermission'] === null) {
            this.write = 0
          }
          else {
            this.write = permission[0]['writePermission'];
          }
          if (permission[0]['downloadPermission'] === undefined || permission[0]['downloadPermission'] === null) {
            this.download = 0
          }
          else {
            this.download = permission[0]['downloadPermission']
          }
        }
      })
  }
}
