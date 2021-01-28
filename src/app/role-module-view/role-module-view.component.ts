import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main-service';
import { Router, NavigationStart } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-module-view',
  templateUrl: './role-module-view.component.html',
  styleUrls: ['./role-module-view.component.css']
})
export class RoleModuleViewComponent implements OnInit {
  modulesList = []; roles = [];

  constructor(private mainService: MainService, private router: Router, private spinnerService: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.spinnerService.show();
    /** List of Roles */
    let crudtype = 5;
    this.mainService.createUser(crudtype, null, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        this.roles = value.data;
      });
    /** List of Main Modules */
    let crudType = 9;
    this.mainService.getRoleModule(crudType, null, null, null, null)
      .then(value => {
        let moduleData = [];
        for (var i = 0; i < value.data.length; i++) {
          moduleData.push(value.data[i]['mainModule']);
        }
        var uniqueModules = moduleData.filter((v, i, a) => a.indexOf(v) === i);
        /** Profile module deletion since when role is created and saved without mapping module default profile module gets saved, since that module shouldnot be visible to anyone */
        let deleteValue = 'Profile Module';
        uniqueModules = uniqueModules.filter(item => item !== deleteValue);
        this.modulesList = uniqueModules;
        this.spinnerService.hide();
      });
  }

  /** To set the url for add role page */
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

  /** Url for edit role page for breadcrumbs modification*/

  EditRole(role) {
    localStorage.removeItem('prevEditUrl');
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          window.localStorage.setItem('prevEditUrl', this.router.url);
        }
      });
    localStorage.setItem('roleSelected', role);
    this.router.navigate(['/edit-role-module']);
  }
}
