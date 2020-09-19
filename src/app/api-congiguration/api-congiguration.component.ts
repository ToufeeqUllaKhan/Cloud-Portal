import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-api-congiguration',
  templateUrl: './api-congiguration.component.html',
  styleUrls: ['./api-congiguration.component.css']
})
export class ApiCongigurationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  editApi() {
    this.router.navigate(['/edit-api']);
  }

}
