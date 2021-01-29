import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analyticalreportsview',
  templateUrl: './analyticalreportsview.component.html',
  styleUrls: ['./analyticalreportsview.component.css']
})
export class AnalyticalreportsviewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('previousUrl');
  }

  AnalyticalreportsView() {
    this.router.navigate(['/Analyticalreports']);
  }

  CustomizedreportsView() {
    this.router.navigate(['/report-clients']);
  }

}
