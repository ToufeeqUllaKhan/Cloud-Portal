import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cec-edid-view',
  templateUrl: './cec-edid-view.component.html',
  styleUrls: ['./cec-edid-view.component.css']
})
export class CecEdidViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('TicketSelected')
  }

  viewrawcapture() {
    this.router.navigate(['/view_raw_capture']);
  }

  stagingdata() {
    this.router.navigate(['/view_staging_data']);
  }

  cec_ediddata() {
    localStorage.setItem('TicketSelected', 'CEC-EDID Data');
    this.router.navigate(['/clients']);
  }

  decodeedid() {
    this.router.navigate(['/decode-edid']);
  }
}
