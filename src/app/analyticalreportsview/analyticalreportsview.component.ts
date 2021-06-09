import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import mainscroll from '../model/Scroll';

@Component({
  selector: 'app-analyticalreportsview',
  templateUrl: './analyticalreportsview.component.html',
  styleUrls: ['./analyticalreportsview.component.css']
})
export class AnalyticalreportsviewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('previousUrl');
    mainscroll();
  }

  AnalyticalreportsView() {
    this.router.navigate(['/Analyticalreports']);
  }

  CustomizedreportsView() {
    this.router.navigate(['/clients']);
  }

}
