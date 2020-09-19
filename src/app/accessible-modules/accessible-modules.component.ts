import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accessible-modules',
  templateUrl: './accessible-modules.component.html',
  styleUrls: ['./accessible-modules.component.css']
})
export class AccessibleModulesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('previousUrl');
  }

  usersView() {
    this.router.navigate(['/user-library']);
  }

  rolesView() {
    this.router.navigate(['/role-module-view']);
  }

}
