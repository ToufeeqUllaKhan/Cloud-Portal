import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import mainscroll from '../model/Scroll';

@Component({
  selector: 'app-api-congiguration',
  templateUrl: './api-congiguration.component.html',
  styleUrls: ['./api-congiguration.component.css']
})
export class ApiCongigurationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    mainscroll();
  }

  editApi() {
    this.router.navigate(['/edit-api']);
  }

}
