import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var $: any;
import 'datatables.net';
import mainscroll from '../model/Scroll';

@Component({
  selector: 'app-user-library',
  templateUrl: './user-library.component.html',
  styleUrls: ['./user-library.component.css']
})
export class UserLibraryComponent implements OnInit {

  userDetails = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private router: Router, private mainService: MainService) {
    localStorage.removeItem('userViewId');
  }

  ngOnInit(): void {
    /** Datatable setting option to set page length */
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    var userName = localStorage.getItem('userName');
    /** List of users and information */
    this.mainService.getUserRoleModuleInfo(1, userName)
      .subscribe(value => {
        this.userDetails = value.data;
        this.dtTrigger.next();
      });

    localStorage.removeItem('editUser');
    mainscroll();
  }

  userConfig(name: any) {
    localStorage.setItem('userViewId', name);
    this.router.navigate(['/user-configuration']);
  }

  CreateUser() {
    this.router.navigate(['/create-users']);
  }

  /** Edited user information to edit user details page */
  editUser(user) {
    localStorage.setItem('editUser', user);
    this.router.navigate(['/edit-user-details']);
  }

}
