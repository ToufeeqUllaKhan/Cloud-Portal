import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'jszip';

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
  projectName: any = [];
  status: any;
  count: number;
  oldValue: any;
  modalCount: number; showunlinkbutton: Boolean = false; showeditbutton: Boolean = false;
  loginid: string;
  usersName: string;


  constructor(private router: Router, private mainService: MainService, private fb: FormBuilder, private toastr: ToastrService) {
    this.status = 1;
    this.loginid = JSON.parse(localStorage.getItem('currentUser'));
    this.usersName = localStorage.getItem('userName');
  }

  ngOnInit(): void {
    /** Datatable setting option to display default rows */
    this.dtOptions = {
      pagingType: 'full_numbers',
    };
    let statusflag = this.status; let crudtype = 1;
    let loginid = this.loginid['data'][0]['loginId'];
    this.details(statusflag);

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

    var self = this;
    $('#projectView').on('click', '#delete', function () {
      let rowid = parseInt($(this).val());
      let Filterrow: any = self.clientDetails.filter(u => (u.projectId === rowid) && (u.statusFlag === 2 || u.statusFlag === '2'))
      if (Filterrow.length === 1) {
        self.projectName = Filterrow[0]['projectName'];
      }
      else {
        self.projectName = null;
      }

    })

    $('#ModuleSubmit').click(function () {
      let Projectname = self.projectName.replace("PROD_", '')
      self.mainService.Unlinkanddeletetheproject(Projectname)
        .subscribe(value => {
          if ((value.data[0]['status'] === 1 || value.data[0]['status'] === "1") && value.statusCode === "200") {
            self.toastr.success('', value.data[0]['message']);
            let log = 'LoginID:- ' + loginid + ' , Project:- ' + self.projectName + ' has unlink successfully ';
            self.mainService.Genericlog(crudtype, loginid, log)
              .then(value => {
                setTimeout(() => {
                  location.reload();
                }, 1000);
              })
          }
          else {
            self.toastr.error('', value.data[0]['message']);
          }
          $('.close').click();
        });
    })

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

  editSignatureKey(details, allowDownload) {
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
    this.mainService.createNewProjectDef(Dbname, Client, Region, Projectname, Signaturekey, Dbpath, Statusflag, Flagtype, allowDownload)
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

  // (change)="onchangestatus()" (ngModelChange)="onModelChange($event)"
  onchangestatus() {
    let statusflag = this.status;
    if (statusflag == null || statusflag == 'null') {
      statusflag = null;
    }
    else {
      statusflag = parseInt(this.status);
    }
    this.getTabResponseData(statusflag);
  }

  getTabResponseData(statusflag) {

    if (this.count == 1 && this.oldValue == undefined && this.modalCount != 1) {
      $('#projectView').dataTable().fnClearTable();
      $('#projectView').dataTable().fnDestroy();
    }
    var Table1 = $('#projectView').DataTable();
    Table1.destroy();
    Table1.clear();
    this.details(statusflag);

  }

  details(status) {
    let arr = [];
    /** List of Client Details and Overall Projects available in the portal */
    this.mainService.getClientViewProjects()
      .subscribe(value => {
        let filterProjectwithstatus2 = value.data.filter(u => u.statusFlag === 2);
        let filterProjectwithstatus = value.data.filter(u => u.statusFlag != 2);
        filterProjectwithstatus2.forEach(element => {
          arr.push({
            projectId: element.projectId,
            region: element.region,
            client: element.client,
            projectName: "PROD_" + element.projectName,
            dbPath: element.dbPath,
            signatureKey: element.signatureKey,
            allowDownload: element.allowDownload,
            createdDate: element.createdDate,
            modifiedDate: element.modifiedDate,
            statusFlag: element.statusFlag
          })
        });

        filterProjectwithstatus.forEach(element => {
          arr.push(element)
        });

        if (status === null) {
          this.clientDetails = arr;
        }
        else {
          this.clientDetails = arr.filter(u => u.statusFlag === status);
        }

        for (let i = 0; i < this.clientDetails.length; i++) {
          if (this.clientDetails[i]['statusFlag'] === 1) {
            this.showeditbutton = true;
            this.showunlinkbutton = false;
          }
          if (this.clientDetails[i]['statusFlag'] === 2) {
            this.showeditbutton = false;
            this.showunlinkbutton = true;
          }
          if (status === null) {
            this.showeditbutton = false;
            this.showunlinkbutton = false;
          }
        }

        this.dtTrigger.next();
      });
  }
}
