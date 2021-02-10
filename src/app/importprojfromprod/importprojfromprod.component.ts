import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MainService } from '../services/main-service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-importprojfromprod',
  templateUrl: './importprojfromprod.component.html',
  styleUrls: ['./importprojfromprod.component.css']
})
export class ImportprojfromprodComponent implements OnInit {
  newdbInstanceForm: FormGroup; newregionForm: FormGroup; createClientForm: FormGroup;
  dbNewsubmitted: Boolean = false; newRegSubmitted: boolean = false; projectdetails: any = [];
  new_DB_Instance: any;
  dbinstance: any[];
  regions: any[]; clients: any = [];
  isClientDivVisible: boolean = false; NewRegion: boolean = true;
  submitted: boolean = false;
  newRegName: string;
  clientSelected: any = null; db_instance: any = null; regionSelected: any = null;
  project_name: any = null;
  isNextVisible: boolean = false; projectnames: any[];

  @ViewChild(FormGroupDirective, { static: false }) formGroupDirective: FormGroupDirective;
  filterproject: any;
  constructor(private fb: FormBuilder, private router: Router, private mainService: MainService, private toastr: ToastrService, private titleService: Title, private spinnerService: NgxSpinnerService) {
    this.titleService.setTitle("Import-Project-To-Prod");
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
      projectName: ['', Validators.required]
    });

    this.newregionForm = this.fb.group({
      newRegionName: ['', Validators.required]
    });

    this.newdbInstanceForm = this.fb.group({
      newDBInstance: ['', Validators.required]
    });

  }


  get n() { return this.newregionForm.controls; }
  get f() { return this.createClientForm.controls; }
  get g() { return this.newdbInstanceForm.controls; }

  /** Trigger the new Region Div Form if New Region button is Clicked */

  newRegion() {
    this.NewRegion = false;
    this.newRegName = '';
    this.isClientDivVisible = true;
  }

  /** Trigger the new DB Instance Div Form if New DB Instance button is Clicked */

  newDbInstances() {
    this.NewRegion = true;
    this.new_DB_Instance = '';
    this.isClientDivVisible = true;
  }

  /** display of main create client page by hiding the new option div element */

  regBack() {
    this.NewRegion = true;
    this.isClientDivVisible = false;
  }


  close() {
    this.router.navigate(['/admin-dashboard']);
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
    this.mainService.createNewRegion(this.newRegName, RegionLogoPath, StatusFlag, Crudtype)
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

  /** Create Client Submit Operation */

  oncreateClientSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createClientForm.invalid) {
      return;
    }
    for (let i = 0; i < this.filterproject.length; i++) {
      let Dbname = this.db_instance; let Client = this.clientSelected; let Region = this.regionSelected; let Dbpath = this.db_instance;
      let Projectname = this.filterproject[i]['projectName']; let Signaturekey = this.filterproject[i]['signatureKey'];
      let Embeddeddbversion = this.filterproject[i]['embeddedDBVersion']; let Dbversion = this.filterproject[i]['dbVersion'];
      let Statusflag = 2; let Flagtype = 6; let Projectversion = this.filterproject[i]['projectVersion'];
      let Swversion = this.filterproject[i]['swVersion']; let Allowdownload = this.filterproject[i]['allowDownloads'];
      let bin_file = this.filterproject[i]['binFile']; let Binfilechecksum = this.filterproject[i]['binChecksum'];
      let zip_file = this.filterproject[i]['zipFile']; let Zipfilechecksum = this.filterproject[i]['zipChecksum'];
      this.mainService.CreateNewProjectWithVersion(Dbname, Client, Region, Projectname, Signaturekey, Dbpath, Embeddeddbversion, Dbversion, Statusflag, Flagtype,
        Projectversion, Swversion, Allowdownload, bin_file, Binfilechecksum, zip_file, Zipfilechecksum)
        .subscribe(value => {
          if (value.statusCode == "200" || value.statusCode == 200) {
            this.toastr.success('Project created or updated Successfully', '');
            this.isNextVisible = true;
            this.spinnerService.show();
            this.clientSelected = null;
            this.regionSelected = null;
            this.db_instance = null;
            this.projectnames = null;
            this.submitted = false;
            this.spinnerService.hide();
          } else {
            this.toastr.warning(value.message, '');
            this.submitted = false;
          }
        });
    }
  }

  /** New DB Instance Creation Submit Operation */
  onNewDbInstanceSubmit() {

    this.dbNewsubmitted = true;

    // stop here if form is invalid
    if (this.newdbInstanceForm.invalid) {
      return;
    }
    else if (this.new_DB_Instance.trim() === '') {
      this.toastr.error('', 'Please enter DBInstance');
      this.new_DB_Instance = '';
    }
    else {
      let Dbinstance = this.new_DB_Instance.trim(); let Statusflag = 1; let Crudtype = 1; let ConnectionString = "";
      this.mainService.getAllDbInstance(Crudtype, Dbinstance, ConnectionString, Statusflag)
        .subscribe(value => {
          if (value.data == '0') {
            this.toastr.warning(value.message, '');
          }
          if (value.statusCode == '200' && value.data != '' && value.data != '0') {
            this.toastr.success(value.message, '');
            $('#next').click();
            let Dbinstance = '';
            let ConnectionString = '';
            let crudType = 4;
            this.mainService.getAllDbInstance(crudType, Dbinstance, ConnectionString, Statusflag)
              .subscribe(value => {
                this.dbinstance = [];
                this.dbinstance = value.data;
              });
          }
          this.isClientDivVisible = false;
        });
    }
  }

  onchangedbinstance() {
    // let dbname='"'+this.db_instance+'"';
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 3000);
    let dbname = this.db_instance;
    let projectnames = [];
    this.mainService.getAllprojectdetails(dbname)
      .subscribe(value => {
        if (value.statusCode === '200' || value.statusCode === 200) {
          this.projectdetails = value.data;
          for (let i = 0; i < value.data.length; i++) {
            projectnames.push(value.data[i]['projectName']);
          }
          this.projectnames = projectnames.filter((v, i, a) => a.indexOf(v) === i);
        }
        else {
          this.projectnames = null;
        }

      });
  }

  onchangeproject() {
    let filterProject: any = this.projectdetails.filter(u =>
      u.projectName == this.project_name);
    this.filterproject = filterProject;
  }

  keyPressHandler(e) {
    if (e.keyCode === 32 && !e.target.value.length) {
      return false;
    }
  }
}
