import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { Subject } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BtnCellRenderer } from './btn-cell-renderer.component';
import mainscroll from '../model/Scroll';

@Component({
  selector: 'app-project-library',
  templateUrl: './project-library.component.html',
  styleUrls: ['./project-library.component.css']
})
export class ProjectLibraryComponent implements OnInit {

  submitted: Boolean = false;
  clientDetails = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  editedSignature: any;
  editSignatureData: FormGroup; signatureDetails = [];
  projectName: any = []; instance: any;
  count: number;
  oldValue: any;
  modalCount: number; showunlinkbutton: Boolean = false; showeditbutton: Boolean = false;
  loginid: string;
  usersName: string;

  public gridApi;
  public gridColumnApi;
  public frameworkComponents;
  public columnDefs;
  public defaultColDef;
  public rowData;
  public paginationNumberFormatter;
  public paginationPageSize;
  public context;
  public rowSelection;
  searchValue: any;

  constructor(private router: Router, private mainService: MainService, private fb: FormBuilder, private toastr: ToastrService) {
    this.loginid = JSON.parse(localStorage.getItem('currentUser'));
    this.usersName = localStorage.getItem('userName');
    this.paginationPageSize = 10;
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer
    };
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
    this.context = { componentParent: this };
  }

  ngOnInit(): void {
    /** Datatable setting option to display default rows */
    let crudtype = 1;
    let loginid = this.loginid['data'][0]['loginId'];
    this.details();

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
    $('#ModuleSubmit').click(function () {
      let dbpath = self.instance;
      let Projectname = self.projectName.replace(dbpath + "_", '')
      self.mainService.Unlinkanddeletetheproject(Projectname, dbpath)
        .subscribe(value => {
          if ((value.data[0]['status'] === 1 || value.data[0]['status'] === "1") && value.statusCode === "200") {
            self.toastr.success('', value.data[0]['message']);
            let log = 'LoginID:- ' + loginid + ' , Project:- ' + self.projectName + ' has unlink successfully ';
            self.mainService.Genericlog(crudtype, loginid, log)
              .then(value => {
                setTimeout(() => {
                  location.reload();
                }, 2000);
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
    mainscroll();
  }

  get f() { return this.editSignatureData.controls; }

  newClient() {
    this.router.navigate(['/create-new-project']);
  }

  /** Popup trigger if edit is clicked in Client Library screen and appending the signature key and allow download status of its available Information */

  editSignatureKey(details) {
    this.editSignatureData.reset();
    var allowDownload = details['allowDownload']
    this.editedSignature = details['signatureKey'];
    if (allowDownload == 1) {
      $("#allow_download").prop('checked', true);
    } else {
      $("#allow_download").prop('checked', false);
    }
    this.signatureDetails = [];
    this.signatureDetails = details;
    console.log(this.signatureDetails)
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
    let project = this.signatureDetails['projectName'];
    let Dbname = this.signatureDetails['dbPath']; let Client = this.signatureDetails['client'];
    let Region = this.signatureDetails['region']; let Projectname = project.replace(Dbname + "_", '');
    let Signaturekey = this.editedSignature; let Dbpath = this.signatureDetails['dbPath']; let Statusflag = this.signatureDetails['statusFlag']; let Flagtype = 2;
    this.mainService.createNewProjectDef(Dbname, Client, Region, Projectname, Signaturekey, Dbpath, Statusflag, Flagtype, allowDownload)
      .subscribe(value => {
        $("#editDataModal .close").click();
        if (value.data == "1") {
          this.toastr.success('', value.message);
          this.mainService.CECEDID_NewProject(3, Projectname, Signaturekey, Dbpath, 1, null)
            .then(value => {
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
        } else {
          this.toastr.warning('', value.message);
        }
      });
  }

  details() {
    let arr = [];
    /** List of Client Details and Overall Projects available in the portal */
    this.mainService.getClientViewProjects()
      .subscribe(value => {
        let filterProjectwithstatus = value.data;
        let i = 1;
        filterProjectwithstatus.forEach(element => {
          arr.push({
            Serial: i++,
            projectId: element.projectId,
            region: element.region,
            client: element.client,
            projectName: element.dbPath + "_" + element.projectName,
            dbPath: element.dbPath,
            signatureKey: element.signatureKey,
            allowDownload: element.allowDownload,
            createdDate: element.createdDate,
            modifiedDate: element.modifiedDate,
            statusFlag: element.statusFlag
          })
        });
        this.clientDetails = arr;
        this.viewdata();
        this.showeditbutton = true;
        this.showunlinkbutton = true;
      });
  }

  onPageSizeChanged() {
    var value = (<HTMLInputElement>document.getElementById('page-size')).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }


  viewdata() {
    this.searchValue = null
    this.defaultColDef = {
      flex: 1,
    };
    this.columnDefs = [
      { headerName: "Serial Number", field: "Serial", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, width: 135 },
      { headerName: "Region", field: "region", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, width: 130 },
      { headerName: "Client", field: "client", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, width: 130 },
      { headerName: "Project Name", field: "projectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, minWidth: 150 },
      { headerName: "Signature Key", field: "signatureKey", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, minWidth: 150 },
      { headerName: "Allow Download", field: "allowDownload", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, width: 130 },
      { headerName: "Action", field: "Status", resizable: true, cellRenderer: "btnCellRenderer", minWidth: 170 }
    ];
    this.rowData = this.clientDetails;
    if (this.rowData.length < 8) {
      this.setAutoHeight();
    }
    else {
      this.setFixedHeight();
    }
    this.gridApi.setQuickFilter(this.searchValue)


  }

  search() {
    this.gridApi.setQuickFilter(this.searchValue);
  }


  setAutoHeight() {
    this.gridApi.setDomLayout('autoHeight');
    (<HTMLInputElement>document.querySelector('#myGrid')).style.height = '';
  }

  setFixedHeight() {
    this.gridApi.setDomLayout('normal');
    (<HTMLInputElement>document.querySelector('#myGrid')).style.height = '500px';
  }

  methodFromParent_edit(cell) {
    this.editSignatureKey(cell);
    $('#showeditbutton').click();
  }

  methodFromParent_unlink(cell) {
    let rowid = cell['projectId'];
    let Filterrow: any = this.clientDetails.filter(u => (u.projectId === rowid))
    if (Filterrow.length === 1) {
      this.projectName = Filterrow[0]['projectName'];
      this.instance = Filterrow[0]['dbPath'];
    }
    else {
      this.projectName = null;
    }
    $('#showunlinkbutton').click();
  }
}
