import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-library',
  templateUrl: './client-library.component.html',
  styleUrls: ['./client-library.component.css']
})
export class ClientLibraryComponent implements OnInit {

  submitted: Boolean = false;
  clientDetails = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  editedSignature: any;
  editSignatureData: FormGroup; signatureDetails = [];


  constructor(private router: Router, private mainService: MainService, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
  /** Datatable setting option to display default rows */
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
  /** List of Client Details and Overall Projects available in the portal */
    this.mainService.getClientViewProjects()
      .subscribe(value => {
        this.clientDetails = value.data;
        this.dtTrigger.next();
      });
    $(document).ready(function () {
      $(".pop-menu").click(function () {
        $(this).toggleClass("transition");
      });
    });
    /** validation for not to accept space in input */
    $(document).ready(function () {
      $("input").on("keypress", function (e) {
        if (e.which === 32 && !this.value.length)
          e.preventDefault();
      });
    });
  /** Validation for updating Signature Key */
    this.editSignatureData = this.fb.group({
      editSignatureKey: ['', Validators.required]
    })
    
  }

  get f() { return this.editSignatureData.controls; }

  newClient() {
    this.router.navigate(['/create-new-client']);
  }

/** Popup trigger if edit is clicked in Client Library screen and appending the signature key and allow download status of its available Information */

  editSignatureKey(details,allowDownload) {
    this.submitted = false;
    this.editSignatureData.reset();
    $('#btn-active').click();
    this.editedSignature = details.signatureKey;
    if (allowDownload == 1) {
      $("#allow_download").prop('checked', true);
    } else {
      $("#allow_download").prop('checked', false);
    }
    this.signatureDetails = [];
    this.signatureDetails.push(details);
  }
/** Resetting the popup data if close is triggered */
  modalClose() {
    this.submitted = false;
    this.editSignatureData.reset();
  }

/** Updating Signature Key Operation */

  onsaveUpdateSignatureSubmit() {
    this.submitted = true;
    if (this.editSignatureData.invalid) {
      return;
    }
    let allowDownload;
    let checkStatus = $('#allow_download').prop('checked');
    if (checkStatus == true) {
      allowDownload = 1;
    } else {
      allowDownload = 0;
    }
    let Dbname = this.signatureDetails[0]['dbPath']; let Client = this.signatureDetails[0]['client'];
    let Region = this.signatureDetails[0]['region']; let Projectname = this.signatureDetails[0]['projectName'];
    let Signaturekey = this.editedSignature; let Dbpath = this.signatureDetails[0]['dbPath']; let Statusflag = 1; let Flagtype = 2;
    this.mainService.createNewProjectDef(Dbname, Client, Region, Projectname, Signaturekey, Dbpath, Statusflag, Flagtype,allowDownload)
      .subscribe(value => {
        $("#editDataModal .close").click();
        if (value.data == "1") {
          this.toastr.success('', value.message);
          location.reload();
        } else {
          this.toastr.warning('', value.message);
        }
      });
  }

}
