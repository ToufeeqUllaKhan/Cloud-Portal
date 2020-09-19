import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.css']
})
export class LogViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('logSelected');
  }
/** setting logselected storage value since admin clients page should route based on click operation here
 * i.e., if user clicked searchlogView then admin clients page route to search history page else generic-logs page will be routed based on client selection in admin clients page
 * */
  searchlogView() {
    localStorage.setItem('logSelected', 'SearchLog');
    this.router.navigate(['/report-clients']).then(() => {
      // location.reload();
    });
  }
/** setting logselected storage value since admin clients page should route based on click operation here
 * i.e., if user clicked searchlogView then admin clients page route to search history page else generic-logs page will be routed based on client selection in admin clients page
 * */
  genericView() {
    localStorage.setItem('logSelected', 'GenericLog');
    this.router.navigate(['/report-clients']).then(() => {
      // location.reload();
    });
  }

}
