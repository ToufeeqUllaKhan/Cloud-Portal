import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private router: Router) {
    /** removing storage items */
    localStorage.removeItem('choosenAdminProjects');
    localStorage.removeItem('serachHistoryProj');
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
    localStorage.removeItem('previousUrl');
    localStorage.removeItem('moduleselected');
  }

  ngOnInit() {
    localStorage.removeItem('TicketSelected');
    localStorage.setItem('moduleselected', 'admin-dashboard')
  }


  clientsView() {
    this.router.navigate(['/project-library']);
  }

  userView() {
    this.router.navigate(['/accessible-modules']);
  }

  addApi() {
    this.router.navigate(['/edit-api']);
  }

  changeHistory() {
    localStorage.setItem('TicketSelected', 'Change History');
    this.router.navigate(['/clients']);
  }

  ClearDefaultBoxIdLogs() {
    this.router.navigate(['/UpdateDefaultBoxIdLogs']);
  }

  importprojectfromprod() {
    this.router.navigate(['/importfromprod']);
  }

  cec_edidHistory() {
    this.router.navigate(['/Data Update History']);
  }

}
