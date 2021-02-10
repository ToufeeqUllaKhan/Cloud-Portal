import { Component, OnInit, ViewChild, QueryList, ElementRef, ViewChildren } from '@angular/core';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { ToastrService } from 'ngx-toastr';
import * as alertify from 'alertify.js';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-new-client',
  templateUrl: './create-new-client.component.html',
  styleUrls: ['./create-new-client.component.css']
})

export class CreateNewClientComponent implements OnInit {

  isClientDivVisible: Boolean = false;
  isDBInstanceVisible: Boolean = true; NewRegion: Boolean = true; NewClient: Boolean = true;
  isClientDetailsVisible: Boolean = false;
  createClientForm: FormGroup;
  newregionForm: FormGroup; newclientForm: FormGroup;
  newdbInstanceForm: FormGroup;
  createNewProjectForm: FormGroup;
  submitted: Boolean = false;
  projectSubmitted: Boolean = false;
  newRegSubmitted: Boolean = false; newCliSubmitted: Boolean = false; dbNewsubmitted: Boolean = false;
  clientSelected: any = null; db_instance: any = null; regionSelected: any = null;
  new_DB_Instance: String; project_name: any;
  signature_key: any;
  createProject: Boolean = true; isNextVisible: Boolean = false;
  regions: Array<any> = []; clients: Array<any> = [];
  dbinstance: Array<any> = [];

  NewDbInstance: Boolean = true;
  dbPageInstance: [];
  dbPageRegion: []; newRegName: String; newCliName: String; finalItem = []; delItem = [];

  @ViewChild(FormGroupDirective, { static: false }) formGroupDirective: FormGroupDirective;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;


  constructor(private fb: FormBuilder, private router: Router, private mainService: MainService, private toastr: ToastrService, private titleService: Title) {
    this.titleService.setTitle("Create-New-Client");
  }



  ngOnInit(): void {
    /** List of Regions */
    let Region = ''; let Regionlogopath = ''; let Statusflag = 1; let Crudtype = 4;
    this.mainService.createClient('', '', Statusflag, Crudtype)
      .subscribe(value => {
        this.clients = value.data;
      });
    this.mainService.getAllRegions(Region, Regionlogopath, Statusflag, Crudtype)
      .subscribe(value => {
        this.regions = value.data;
      });
    /** List of DB Instance */
    let Dbinstance = '';
    let ConnectionString = '';
    this.mainService.getAllDbInstance(Crudtype, Dbinstance, ConnectionString, Statusflag)
      .subscribe(value => {
        this.dbinstance = value.data;
      });

    /** Validations for required fields for create client Form */
    this.createClientForm = this.fb.group({
      clientName: ['', Validators.required],
      regionName: ['', Validators.required],
      dbInstance: ['', Validators.required],
      projectName: ['', Validators.required],
      signatureKey: ['', Validators.required],
      clientLogo: ['', null]
    });

    this.newregionForm = this.fb.group({
      newRegionName: ['', Validators.required]
    });
    this.newclientForm = this.fb.group({
      newClientName: ['', Validators.required]
    });
    this.newdbInstanceForm = this.fb.group({
      newDBInstance: ['', Validators.required]
    });


  }

  get o() { return this.newclientForm.controls; }
  get n() { return this.newregionForm.controls; }
  get f() { return this.createClientForm.controls; }
  get g() { return this.newdbInstanceForm.controls; }

  /** Trigger the new Client Div Form if New Client button is Clicked */

  newClient() {
    this.NewClient = false;
    this.NewRegion = true;
    this.newCliName = '';
    this.NewDbInstance = true;
    this.isClientDivVisible = true;
  }
  /** Trigger the new Region Div Form if New Region button is Clicked */

  newRegion() {
    this.NewClient = true;
    this.NewRegion = false;
    this.newRegName = '';
    this.NewDbInstance = true;
    this.isClientDivVisible = true;
  }

  /** Trigger the new DB Instance Div Form if New DB Instance button is Clicked */

  newDbInstances() {
    this.NewDbInstance = false;
    this.NewClient = true;
    this.NewRegion = true;
    this.new_DB_Instance = '';
    this.isClientDivVisible = true;
  }

  /** display of main create client page by hiding the new option div element */

  regBack() {
    this.NewClient = true;
    this.NewRegion = true;
    this.NewDbInstance = true;
    this.isClientDivVisible = false;
  }

  /** display of main create client page by hiding the new option div element */

  dbBack() {
    this.NewClient = true;
    this.NewDbInstance = true;
    this.NewRegion = true;
    this.isClientDivVisible = false;
  }

  close() {
    this.router.navigate(['/client-library']);
  }

  /** New Client Creation Submit Operation */
  onNewClientSubmit() {

    this.newCliSubmitted = true;
    // stop here if form is invalid
    if (this.newclientForm.invalid) {
      return;
    }
    let StatusFlag = '1';
    let Crudtype = '1';
    this.mainService.createClient(this.o.newClientName.value, '', StatusFlag, Crudtype)
      .pipe()
      .subscribe(value => {
        if (value.data == '0') {
          this.toastr.warning(value.message, '');
          this.NewClient = true;
        }
        if (value.statusCode == '200' && value.data != '' && value.data != '0') {
          this.NewClient = true;
          this.toastr.success(value.message, '');
        }

        let Statusflag = 1; let Crudtype = 4;
        this.mainService.createClient('', '', Statusflag, Crudtype)
          .subscribe(value => {
            this.clients = [];
            for (var i = 0; i < value.data.length; i++) {
              this.clients.push(value.data[i]);
            }

          });

        this.isClientDivVisible = false;
      });
  }

  /** New Region Creation Submit Operation */
  onNewRegionSubmit() {

    this.newRegSubmitted = true;

    // stop here if form is invalid
    if (this.newregionForm.invalid) {
      return;
    }
    let RegionLogoPath = '';
    let StatusFlag = '1';
    let Crudtype = '1';
    this.mainService.createNewRegion(this.n.newRegionName.value, RegionLogoPath, StatusFlag, Crudtype)
      .pipe()
      .subscribe(value => {
        if (value.data == '0') {
          this.toastr.warning(value.message, '');
          this.NewRegion = true;
        }
        if (value.statusCode == '200' && value.data != '' && value.data != '0') {
          this.NewRegion = true;
          this.toastr.success(value.message, '');
        }

        let Region = ''; let Regionlogopath = ''; let Statusflag = 1; let Crudtype = 4;
        this.mainService.getAllRegions(Region, Regionlogopath, Statusflag, Crudtype)
          .subscribe(value => {
            this.regions = [];
            for (var i = 0; i < value.data.length; i++) {
              this.regions.push(value.data[i]);
            }

          });

        this.isClientDivVisible = false;
      });
  }

  keyPressHandler(e) {
    if (e.keyCode === 32 && !e.target.value.length) {
      return false;
    }
  }
  /** Create Client Submit Operation */

  oncreateClientSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.createClientForm.invalid) {
      return;
    }

    let allowDownload;
    let checkStatus = $('#allow_download').prop('checked');
    if (checkStatus == true) {
      allowDownload = 1;
    } else {
      allowDownload = 0;
    }
    this.mainService.createNewProjectDef(this.db_instance, this.clientSelected, this.regionSelected, this.project_name, this.signature_key, this.db_instance, 1, 1, allowDownload)
      .subscribe(value => {
        console.log(value.data);
        if (value.data == "1") {
          this.toastr.success('Project Created Successfully', '');
          this.isNextVisible = true;
          // this.formGroupDirective.resetForm();
          this.checkboxes.forEach((element) => {
            element.nativeElement.checked = false;
          });
          this.submitted = false;
        } else {
          this.toastr.warning(value.message, '');
          this.submitted = false;
        }
        this.mainService.CECEDID_NewProject(1, this.project_name, this.signature_key, this.db_instance, 1, null)
          .then(value => {
            this.formGroupDirective.resetForm();
          })
      });
  }

  /** New DB Instance Creation Submit Operation */
  onNewDbInstanceSubmit() {

    this.dbNewsubmitted = true;

    // stop here if form is invalid
    if (this.newdbInstanceForm.invalid) {
      return;
    }
    let Dbinstance = this.new_DB_Instance.trim();
    let Statusflag = 1; let Crudtype = 1;
    let ConnectionString = "";
    this.mainService.getAllDbInstance(Crudtype, Dbinstance, ConnectionString, Statusflag)
      .subscribe(value => {

        if (value.data == '0') {
          this.toastr.warning(value.message, '');
        }
        if (value.statusCode == '200' && value.data != '' && value.data != '0') {
          this.toastr.success(value.message, '');
          let Dbinstance = '';
          let ConnectionString = '';
          let crudType = 4;
          this.mainService.getAllDbInstance(crudType, Dbinstance, ConnectionString, Statusflag)
            .subscribe(value => {
              this.dbinstance = [];
              this.dbinstance = value.data;
            });
        }
        this.NewDbInstance = true;
        this.isClientDivVisible = false;
      });
  }

}
