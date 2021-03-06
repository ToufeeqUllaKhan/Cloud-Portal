import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MainService } from '../services/main-service';
import { User } from '../../app/model/user';
import { NgxSpinnerService } from 'ngx-spinner';
import mainscroll from '../model/Scroll';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User = new User();
  role: any; modules = [];
  isDataMgmt: Boolean = false; isCloudApi: Boolean = false;
  isAnalytics: Boolean = false; isCentralized: Boolean = false; isTestModule: Boolean = false;
  isNone: Boolean = false;

  constructor(private router: Router, private titleService: Title, private mainService: MainService, private spinnerService: NgxSpinnerService) {
    this.titleService.setTitle("Dashboard");
    localStorage.removeItem('selectedClient');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.spinnerService.show();
    let crudType = 7;
    let userName = localStorage.getItem('userName');
    /** role name based on user login  **/
    this.mainService.createUser(4, userName, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        if (value.data.length > 0) {
          this.role = value.data[0]['roleName'];
          localStorage.setItem('AccessRole', this.role);
        }
        /** roles list  **/
        this.mainService.getRoleModule(crudType, null, null, null, null)
          .then(value => {
            let resultFetchArr: any = value.data.filter(u =>
              u.name == this.role);
            let mainModules = [];
            for (var i = 0; i < resultFetchArr.length; i++) {
              mainModules.push(resultFetchArr[i]['mainModule']);
            }
            let deleteValue = 'Profile Module';
            mainModules = mainModules.filter(item => item !== deleteValue);
            if (mainModules.length == 0) {
              this.isNone = true;
            } else {
              this.isNone = false;
            }
            this.modules = mainModules;
            /** for accessing roles based on user assigned modules  **/
            if (this.modules.includes('Data Management Tool')) {
              this.isDataMgmt = true;
            }
            if (this.modules.includes('Cloud API Search Tester')) {
              this.isCloudApi = true;
            }
            if (this.modules.includes('Analytics Report')) {
              this.isAnalytics = true;
            }
            if (this.modules.includes('Centralized CEC-EDID DB')) {
              this.isCentralized = true;
            }
            if (this.modules.includes('TestModule')) {
              this.isTestModule = true;
            }
          });
      });
    localStorage.removeItem('sideMenuItem');
    localStorage.removeItem('ApiMenuItem');
    localStorage.removeItem('clientUpdated');
    localStorage.removeItem('choosenProjects');
    localStorage.removeItem('fetchedProj');
    localStorage.removeItem('BrandLibraryProjects');
    localStorage.removeItem('updatedBrandProjects');
    localStorage.removeItem('versionSelects');
    localStorage.removeItem('reloadedProjects');
    localStorage.removeItem('dataConfigProjects');
    localStorage.removeItem('CloudApiProjects');
    localStorage.removeItem('CloudApi');
    localStorage.removeItem('moduleselected')
    this.spinnerService.hide();
    mainscroll();
  }

  /** for routing to clients when data management is clicked  **/
  dataMgt() {
    localStorage.setItem('moduleselected', 'Data Management Tool')
    this.router.navigate(['/clients'])
      .then(() => {
        location.reload();
      });
  }

  /** for routing to api-clients when cloud api module is clicked  **/
  cloudTest() {
    localStorage.setItem('moduleselected', 'Cloud API Search Tester')
    this.router.navigate(['/clients'])
      .then(() => {
        location.reload();
      });
  }
  /** for routing to reports-view when Analytical reports module is clicked  **/
  reports() {
    localStorage.setItem('moduleselected', 'Analytics Report')
    this.router.navigate(['/reports-view']);
  }

  centralized() {
    localStorage.setItem('moduleselected', 'Centralized CEC-EDID DB')
    this.router.navigate(['/Centralized-DB-view']);
  }
}
