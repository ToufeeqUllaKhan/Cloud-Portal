import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MainService } from '../services/main-service';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-role-module',
  templateUrl: './edit-role-module.component.html',
  styleUrls: ['./edit-role-module.component.css']
})
export class EditRoleModuleComponent implements OnInit {
  modulesList = [];
  roleName: any;
  arr = [];
  checkedArr = []; isroleModules: Boolean = false;
  uncheckedArr = [];
  urlMap: any;
  public success = 0; public failed = 0;

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;

  constructor(private mainService: MainService, private router: Router, private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    let role = localStorage.getItem('roleSelected');
    this.roleName = role;
    this.spinnerService.show();
  /** List of Roles */
    let crudType = 7;
    this.mainService.getRoleModules(crudType, null, null, null, null)
      .subscribe(value => {
      /** based on role get modules accessible checked or not checked*/
        let resultFetchArr: any = value.data.filter(u =>
          u.name == role);
        let fetchModule = [];
        for (var i = 0; i < resultFetchArr.length; i++) {
          fetchModule.push(resultFetchArr[i]['mainModule']);
        }
        this.arr = fetchModule;
        for (var j = 0; j < this.arr.length; j++) {
          this.click(this.arr[j], true);
        }
        let crudtype = 9; let moduleData = [];
        this.mainService.getRoleModules(crudtype, null, null, null, null)
          .subscribe(value => {
            for (var k = 0; k < value.data.length; k++) {
              moduleData.push(value.data[k]['mainModule']);
            }
            var uniqueModules = moduleData.filter((v, i, a) => a.indexOf(v) === i);
            /** deleting profile module for appearing in edit role module view since there is no need to show profile module */
            let deleteValue = 'Profile Module';
            uniqueModules = uniqueModules.filter(item => item !== deleteValue);
            this.modulesList = uniqueModules;
          });
        
        this.spinnerService.hide();
      });
    let getPrevUrl = localStorage.getItem('prevEditUrl');

    this.urlMap = "" + getPrevUrl + "";
  }

/** Checked List to map module to the particular role */

  click(value, status: boolean) {
    if (this.checkedArr.indexOf(value) === -1 && status) {
      this.checkedArr.push(value);
      if (this.uncheckedArr.indexOf(value) !== -1) {
        this.uncheckedArr.splice($.inArray(value, this.uncheckedArr), 1);
      }
    }
    else if (!status) {
      let index = this.checkedArr.indexOf(value);
      this.checkedArr.splice(index, 1);
      if (this.arr.indexOf(value) !== -1 && this.checkedArr.indexOf(value) === -1) {
        this.uncheckedArr.push(value);
      }
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
    this.success = 0;
    this.failed = 0;
    this.spinnerService.show();
    for (var k = 0; k < 4; k++) {
      if (this.checkedArr.indexOf(this.arr[k]) !== -1) {
        this.checkedArr.splice($.inArray(this.arr[k], this.checkedArr), 1);
      }
    }
     let crudType = 3; let role = this.roleName;
    this.mainService.createUser(6, null, null, role, null, null, null, null, null, null)
      .subscribe(value => {
        if (value.data[0]['result'] == 1) {
          this.toastr.success('', value.data[0]['message']);
        }
      });
    for (var i = 0; i < this.uncheckedArr.length; i++) {
      let module = this.uncheckedArr[i]; let user = null; let project = null;
      await this.mainService.getRoleModulesAccess(4, role, module, user, project)
        .then(value => {
          if (value.data[0]['result'] == 1) {
            this.success++;
          } else {
            this.failed++;
          }
        });
      if (i + 1 == this.uncheckedArr.length) {
        if (this.success != 0) {
          this.toastr.success('', this.success + ' ' + 'Records Removed Successfully');
        }
        if (this.failed != 0) {
          this.toastr.warning('', this.failed + ' ' + 'Records Mapping Failed');
        }
        if (this.checkedArr.length == 0) {
          this.router.navigate(['' + this.urlMap + '']);
        }
        this.success = 0; this.failed = 0;
      }
    }
    
    for (var j = 0; j < this.checkedArr.length; j++) {
      let module = this.checkedArr[j]; let user = null; let project = null;
      await this.mainService.getRoleModulesAccess(crudType, role, module, user, project)
        .then(value => {
          if (value.data[0]['result'] == 1) {
            this.success++;
            this.uncheckAll();
            this.roleName = null;
            this.router.navigate([''+this.urlMap+'']);
          } else {
            this.failed++;
          }
        });
      if (j + 1 == this.checkedArr.length) {
        if (this.success != 0) {
          this.toastr.success('', this.success + ' ' + 'Records Mapped Successfully');
        }
        if (this.failed != 0) {
          this.toastr.warning('', this.failed + ' ' + 'Records Mapping Unsuccessful');
        }
      }
    }
    this.spinnerService.hide();
   
  }

  close() {
    this.router.navigate(['/role-module-view']);
  }

}
