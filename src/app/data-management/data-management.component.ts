import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.css']
})
export class DataManagementComponent implements OnInit {

  constructor(private router: Router, private titleService: Title) {
    this.titleService.setTitle("Data-Management");
    localStorage.removeItem('selectedClient');
  }

  ngOnInit() {
    localStorage.removeItem('clientUpdated');
  }

  createData() {
    this.router.navigate(['/create-new-client']);
  }
  viewData() {
    this.router.navigate(['/clients'])
      .then(() => {
        window.location.reload();
      });
  }
}
