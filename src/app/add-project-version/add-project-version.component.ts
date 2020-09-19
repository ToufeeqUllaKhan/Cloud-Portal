import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainService } from '../services/main-service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-add-project-version',
  templateUrl: './add-project-version.component.html',
  styleUrls: ['./add-project-version.component.css']
})
export class AddProjectVersionComponent implements OnInit {

  addProjectVersionForm: FormGroup;
  clientSelected: any; submitted: Boolean = false;
  project_name: any; project_version: any; embed_version: any;
  db_version: any; sw_version: any; signature_key: any;
  regions: [];
  region_list: any;
  selectUniqueDbInstance: any;
  projectNames: [];
  dataArray = []; db_instance: any; db_connection_string: any;
  bin_file: any; zip_file: any;
  base64textString: string;
  base64zipString: string; binchecksum: any; zipchecksum: any;


  constructor(private mainService: MainService, private router: Router, private fb: FormBuilder, private titleService: Title, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {

    this.titleService.setTitle("Update Project Details");
    var clientPage = localStorage.getItem('clientUpdated');
    var createClient = localStorage.getItem('selectedClient');
    if (clientPage != null) {
      this.clientSelected = clientPage;
    }
    if (createClient != null) {
      this.clientSelected = createClient.replace(/\"/g, "");
    }
  }

  ngOnInit() {
    this.addProjectVersionForm = this.fb.group({
      regionList: ['', null],
      projectName: ['', null],
      embeddedDBversion: ['', null],
      dbversion: ['', null],
      swversion: ['', null],
      binFile: ['', null],
      signatureKey: ['', null],
      zipFile: ['', null],
      allowDownload: ['', null],
      projectVersion: ['',null]
    });

    this.spinnerService.show();
    let Clientname = this.clientSelected;
    let Region = null;
    let Dbinstance = null;
    let crudtype = 4;
    this.mainService.searchProject(Clientname, Region, Dbinstance, crudtype)
      .pipe()
      .subscribe(value => {
        console.log(value.data);
        if (value.data != null && value.data != undefined && value.data != '' && value.data != 0) {
          let filterClient: any = value.data.filter(u =>
            u.client == this.clientSelected);
          console.log(filterClient[0]['region']);
          this.regions = filterClient;
          console.log(this.regions);
          if (this.region_list === undefined) {
            this.region_list = filterClient[0]['region'];
            this.onRegionSelect();
          }
          }
        this.spinnerService.hide();
      });
  }

  get f() { return this.addProjectVersionForm.controls; }

  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.bin_file = this.base64textString;
    var b64 = this.base64textString;
    if (b64 != undefined && b64 != '') {
      /** Binary Data */
      var getArr = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
      console.log(getArr);

      var result = 0;
      getArr.forEach(function (value) {
        result += value;
      });
      var checkResult = result & 0xFF;
      var hexString = checkResult.toString(16);
      this.binchecksum = hexString.toUpperCase();

    }
  }

  handleZipFile(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleZipReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleZipReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64zipString = btoa(binaryString);
    this.zip_file = this.base64zipString;
    var zipb64 = this.base64zipString;
    //console.log(zipb64);
    if (zipb64 != undefined && zipb64 != '') {
      var getZipArr = Uint8Array.from(atob(zipb64), c => c.charCodeAt(0));

      var zip_result = 0;
      getZipArr.forEach(function (value) {
        zip_result += value;
      });
      var checkZipResult = zip_result & 0xFF;
      var hexZipString = checkZipResult.toString(16);
      this.zipchecksum = hexZipString.toUpperCase();
    }
  }



  onRegionSelect() {
    let Clientname = this.clientSelected;
    let regionSelected = this.region_list;
    let dbinstance = ''; let crudtype = 4;
    this.mainService.searchProject(Clientname, regionSelected, dbinstance, crudtype)
      .pipe()
      .subscribe(value => {
        console.log(value.data);
        if (value.data != null && value.data != undefined && value.data != '' && value.data != 0) {
          let filterDBInstance: any = value.data.filter(u =>
            u.client == this.clientSelected && u.region == this.region_list);
          console.log("db Instance data");
          console.log(filterDBInstance[0]['dbinstance']);
          this.selectUniqueDbInstance = filterDBInstance[0]['dbinstance'];

        }
      });

    let Region = this.region_list;
    let Dbinstance = this.selectUniqueDbInstance;
    let Crudtype = 5;

    this.mainService.searchProject(Clientname, Region, Dbinstance, Crudtype)
      .pipe()
      .subscribe(value => {
        console.log(value.data);
        if (value.data != null && value.data != undefined && value.data != '' && value.data != 0) {
          let filterResult: any = value.data.filter(u =>
            u.client == this.clientSelected && u.regions == this.region_list && u.dbInstance == this.selectUniqueDbInstance);

          this.projectNames = filterResult;
          console.log(filterResult);
          if (this.project_name === undefined) {
            this.project_name = filterResult[0]['projectName'];
          }
          if (this.signature_key === undefined) {
            this.signature_key = filterResult[0]['signatureKey'];
          }

        }
      });
  }

  onProjectSelect() {

    let Clientname = this.clientSelected;
    let Region = this.region_list;
    let Dbinstance = this.selectUniqueDbInstance;
    let Crudtype = 5;

    this.mainService.searchProject(Clientname, Region, Dbinstance, Crudtype)
      .pipe()
      .subscribe(value => {
        this.dataArray = value.data;
        if (value.data != null && value.data != undefined && value.data != '' && value.data != 0) {
          let filterEmbeddVersions: any = value.data.filter(u =>
            u.client == this.clientSelected && u.regions == this.region_list && u.dbInstance == this.selectUniqueDbInstance && u.projectName == this.project_name);

        }

      });
  }

  onProjectVersionSubmit() {
    this.submitted = true;

    if (this.addProjectVersionForm.invalid) {
      return;
    }

    if (this.clientSelected != null && this.clientSelected != undefined) {

      let Client = this.clientSelected; let Region = this.region_list; let Crudtype = 4;
      this.mainService.filterClient(Client, Region, Crudtype)
        .subscribe(value => {
          console.log(value.data);

          if (value.data != '' && value.data.length != 0 && value.data != undefined) {
            let filterResult: any = value.data.filter(u =>
              u.client == this.clientSelected && u.region == this.region_list);
            //  console.log(filterResult);
            if (filterResult.length > 0) {
              this.db_instance = filterResult[0]['dbinstance'];
              console.log(this.db_instance);
              this.db_connection_string = filterResult[0]['connectionString'];

              let Dbname = this.db_instance; let Client = this.clientSelected; let Region = this.region_list;
              let Projectname = this.project_name; let Signaturekey = this.signature_key; let Dbpath = this.db_instance;
              let Embeddeddbversion = this.embed_version; let Dbversion = this.db_version; let Statusflag = 1;
              let Flagtype = 1; let Projectversion = this.project_version; let Swversion = this.sw_version;
              var getCheck = $('#check_value').is(":checked");
              if (getCheck == true) {
                var Allowdownload = 1;
              } if (getCheck == false) {
                var Allowdownload = 0;
              }

              let Binfilechecksum = this.binchecksum; let Zipfilechecksum = this.zipchecksum;
              this.mainService.createNewProject(Dbname, Client, Region, Projectname, Signaturekey, Dbpath, Embeddeddbversion, Dbversion, Statusflag, Flagtype,
                Projectversion, Swversion, Allowdownload, this.bin_file, Binfilechecksum, this.zip_file, Zipfilechecksum)
                .subscribe(value => {
                  console.log(value.data);
                  if (value.data != null && value.data != undefined) {
                    for (var i = 0; i < value.data.length; i++) {

                      if (value.data[i]['result'] == 1) {
                        this.toastr.success(value.data[i]['message'], '');
                        localStorage.setItem('VersionDBName', this.db_instance);
                        localStorage.setItem('VersionProjectName', this.project_name);
                        localStorage.setItem('VersionEmbedVersion', this.embed_version);
                        window.location.href = '/version-data-uploads';
                      } else {
                        this.toastr.warning(value.data[i]['message'], '');
                      }

                    }
                  }

                });
            }

          }
        });
    }

  }

  close() {
    this.router.navigate(['/dashboard']);
  }

}
