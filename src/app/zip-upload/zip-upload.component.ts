import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../services/main-service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from "jquery";
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { DeviceCategory } from '../model/DeviceCategory';
import { Brand } from '../model/Brand';
import { NotifierService } from 'angular-notifier';
import { environment } from '../../environments/environment.prod';

"use strict";

declare var ActiveXObject: (type: string) => void;

@Component({
  selector: 'app-zip-upload',
  templateUrl: './zip-upload.component.html',
  styleUrls: ['./zip-upload.component.css']
})
export class ZipUploadComponent implements OnInit {
 
  uploadData: FormGroup;
  uploadNewVersionData: FormGroup;
  uploadZipFileData: FormGroup;
  updateZipFileData: FormGroup;
  UpdateForm: FormGroup; selecttoUpdateForm: FormGroup;
  submitted: Boolean = false;
  newDataSubmitted: Boolean = false;
  projectNames: any; SelectedBrandName: any;
  finalArray = []; projects: Array<any> = [];
  selectedItems: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false;
  limitSelection = false;
  version_list: any = null; versions = [];
  versionArr = []; versionAvail: Boolean = false;
  countDetails = []; VersionAvailability: Boolean = false;
  createVersion: Boolean = false;
  project_version: any; embed_version: any; db_version: any;
  sw_version: any; csData: any = []; csChecksum: any;
  fileContent: any; fs: any;
  masterBrandList = []; brandModelList = []; brandInfoCecList = []; brandInfoEdidList = []; brandInfoCecEdidList = [];
  codesetsList = []; progressWidth: any; isdataUploaded: Boolean = false;
  public index: any; public index2: any; public index3: any; public index4: any; public index5: any; public index6: any;
  public index7: any; progressName: any; dataName: any;
  InsertCount: any; ExistsCount: any; FailedCount: any; 
  dataCodeName: any; InsertCodeCount: any; ExistsCodeCount: any; FailedCodeCount: any;
  dataBrandName: any; InsertBrandCount: any; ExistsBrandCount: any; FailedBrandCount: any;
  dataCrossName: any; InsertCrossCount: any; ExistsCrossCount: any; FailedCrossCount: any;
  dataCecName: any; InsertCecCount: any; ExistsCecCount: any; FailedCecCount: any;
  dataEdidName: any; InsertEdidCount: any; ExistsEdidCount: any; FailedEdidCount: any;
  dataCecEdidName: any; InsertCecEdidCount: any; ExistsCecEdidCount: any; FailedCecEdidCount: any;
  codeVisible: Boolean = false; brandVisible: Boolean = false; crossDataVisible: Boolean = false; masterDataVisible: Boolean = false;
  cecDataVisible: Boolean = false; edidDataVisible: Boolean = false; cecEdidDataVisible: Boolean = false;
  public existsBrandCount: any = 0; public addedBrandCount: any = 0; public failedBrandCount: any = 0;
  public existsCodeCount: any = 0; public addedCodeCount: any = 0; public failedCodeCount: any = 0;
  public existsModelCount: any = 0; public addedModelCount: any = 0; public failedModelCount: any = 0;
  public existsXmlCount: any = 0; public addedXmlCount: any = 0; public failedXmlCount: any = 0;
  public existsCecCount: any = 0; public addedCecCount: any = 0; public failedCecCount: any = 0;
  public existsEdidCount: any = 0; public addedEdidCount: any = 0; public failedEdidCount: any = 0;
  public existsCecEdidCount: any = 0; public addedCecEdidCount: any = 0; public failedCecEdidCount: any = 0;
  public codeArrResult = []; uploadIcon: Boolean = false; updateIcon: Boolean = false;
  public xmlDataResult = []; versionUpdate: Boolean = false; UpdateZip: Boolean = false;
  isProgreessVisible: Boolean = false; loaderVisible: Boolean = false;
  fileSelected: any; _incValue: number; updateZipData: Boolean = false;
  _objectParse: Array<DeviceCategory>; _brand: Array<Brand>;
  private increment: number; private cecincrement: number; public codesetArr = [];
  codesetUrl = []; zipUploadDiv: Boolean = false; viewFiles: Boolean = false; Listitems = [];
  validateCecHeaders: any; validateEdidHeaders: any; validateMasterBrandHeaders: any;
  validateXmlHeaders: any; validateComponentHeaders: any; validateCecEdidHeaders: any;
  codeSetFileLength: any; validated = []; advancedOption: Boolean = false;
  hideAdvanced: Boolean = true; deletedHistory: Boolean = false;
  statsVisible: Boolean = true; deletedItems = [];
  deletedprogressName: any; indexDelete: any; edidFailed: any = 0;
  ipAddress: any;

  @ViewChild(FormGroupDirective, { static: false }) formGroupDirective: FormGroupDirective;

  private notifier: NotifierService;
  constructor(private mainService: MainService, private toastr: ToastrService, private titleService: Title, private router: Router, private fb: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService, private http: HttpClient, notifier: NotifierService) {
    this.titleService.setTitle('Zip Upload');
    this.increment = 1;
    this.cecincrement = 1;
    this._incValue = 0;
    this.notifier = notifier;
    localStorage.removeItem('choosenProjects'); 
    localStorage.removeItem('BrandLibraryProjects');
  }

  ngOnInit() {
      var self = this;
      $.getJSON("https://api.ipify.org?format=json",
        function (data) {
          self.dataIpAddress(data.ip);
        });
    /** Getting project from data configuration list  */
    var selectedProjects = JSON.parse(localStorage.getItem('dataConfigProjects'));

    if (selectedProjects == null || selectedProjects != undefined) {
      this.projectNames = selectedProjects;
    }

  /** Overall Project list  */
    let dataType = 1;
    let filtProj = [];
    let Projectname = this.projectNames;
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {
        this.finalArray = value.data;
        const unique = [...new Set(value.data.map(item => item.projectname))];
        let arrData = [];
        for (var i = 0; i < unique.length; i++) {
          arrData.push({ item_id: i, item_text: unique[i] });
        }
        this.projects = arrData;
        if (this.projectNames != '') {
          for (var j = 0; j < this.projectNames.length; j++) {
            var setIndex = this.projects.findIndex(p => p.item_text == this.projectNames[j]);
            this.selectedItems.push({ item_id: setIndex, item_text: this.projectNames[j] });
          }
          this.projectNames = this.selectedItems;
        }
      /** Selected project version list  */
        for (var k = 0; k < Projectname.length; k++) {
          let filterProject: any = value.data.filter(u =>
            u.projectname == Projectname[k]);
          filtProj.push(filterProject);
          if (this.versions.length == 0) {
            for (var m = 0; m < filterProject.length; m++) {
              this.versionArr.push(filterProject[m]['embeddedDbVersion']);
            }
          }
        }
        var uniqueVersions = this.versionArr.filter((v, i, a) => a.indexOf(v) === i);
        this.versions = uniqueVersions;
      /** Latest Version for the selected project  */
        this.latestVersions();
      /** Div Visibility based on version availablity or not */
        let filterProjects: any = this.finalArray.filter(u =>
          u.projectname == this.projectNames[0]['item_text']);

        let Client = filterProjects[0]['client']; let Region = filterProjects[0]['region']; let ProjectName = filterProjects[0]['projectname'];
        let Dbversion = this.versions[0]; let Dbinstance = filterProjects[0]['dbinstance'];

        this.mainService.filterDataUpload(Client, Region, ProjectName, Dbversion, Dbinstance, 6)
          .subscribe(value => {
            this.countDetails = value.data;
        if (this.versions.length == 1 && this.versions[0] == null) {

          this.VersionAvailability = false;
          this.versionAvail = false;
          this.createVersion = true;
          this.zipUploadDiv = false;

        } else {
          this.version_list = this.versions[0];
          if (this.countDetails[0]['codesetCount'] != 0 && this.countDetails[0]['crossReferenceCount'] != 0 &&
            this.countDetails[0]['brandModelCount'] != 0) {
            this.versionAvail = true;
            this.VersionAvailability = true;
            this.uploadIcon = true;
            this.versionUpdate = false;
            this.updateIcon = false;
          } else {
            this.uploadIcon = false;
            this.updateIcon = true;
            this.versionAvail = false;
            this.versionUpdate = true;
          }
          if (this.versions.length > 1 && this.versions[0] != null) {
            this.UpdateZip = false;
            this.VersionAvailability = true;
            this.createVersion = false;
            this.zipUploadDiv = false;
          }
          if (this.versions.length == 1 && this.versions[0] != null) {
            if (this.countDetails[0]['codesetCount'] != 0 && this.countDetails[0]['crossReferenceCount'] != 0 &&
              this.countDetails[0]['brandModelCount'] != 0) {
              this.zipUploadDiv = false;
              this.VersionAvailability = true;
              this.createVersion = false;
            } else {
              this.zipUploadDiv = true;
              this.VersionAvailability = false;
              this.createVersion = false;
              this.embed_version = filterProjects[0]['embeddedDbVersion'];
            }
          }
        }
        
      }); 

      });

  /** Multiselect Dropdown settings  */
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: this.ShowFilter
    };
  /** Validations for forms  */
    this.uploadData = this.fb.group({
      VersionData: ['', Validators.required],
      zipUpload: ['', null]
    });

    this.uploadZipFileData = this.fb.group({
      zipFileUpload: ['']
    });

    this.updateZipFileData = this.fb.group({
      zipFileUpdate:['']
    });

    this.uploadNewVersionData = this.fb.group({
      projectVersion: ['', Validators.required],
      embeddedDBversion: ['', Validators.required],
      dbversion: ['', Validators.required],
      swversion: ['', Validators.required]
    });

    this.UpdateForm = this.fb.group({
    });

    this.selecttoUpdateForm = this.fb.group({
    });
    
    
  }

/** Multiselect dropdown settings  */

  onInstanceSelect(item: any) {
  }

  onSelectAll(items: any) {
    this.projectNames = items;
  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }


  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }

  onProjectSelect(e) {

  }

  /** Get Latest Versions Only */
  latestVersions() {
      let datatype = 21;
      let projectName = this.projectNames[0]['item_text'];
      let versionArr = [];
      this.mainService.getProjectNames(null, null, projectName, null, null, datatype)
        .subscribe(value => {
          if (value.data.length != 0) {
            versionArr.push(value.data[0]['version']);
            this.versions = versionArr;
            this.version_list = versionArr[0];
          }
        });
  }

/** IP address data  */

  dataIpAddress(ipdata) {
    this.ipAddress = ipdata
  }
/** Advance options list  */
  advanceOptions() {
    this.advancedOption = true;
    this.hideAdvanced = false;
  }

  hideOptions() {
    this.advancedOption = false;
    this.hideAdvanced = true;
  }

/** Zip Update checking modules function based on selection to select dependency selection based on checked modules  */

  cecEdidCheck() {
    let cecEdidVal = $('#cec_edid').prop('checked');
    let compDataVal = $('#component_data').prop('checked');
    let crossRefVal = $('#cross_ref_value').prop('checked');
    let codesetVal = $('#codeset_data').prop('checked');
    let masterBrand = $('#master_brand_data').prop('checked');
    if (cecEdidVal == true) {
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    } else {
      $("#cec_edid1").prop('checked', false);
      $("#codeset_data1").prop('checked', false);
      $("#master_brand_data1").prop('checked', false);
    }
    if (cecEdidVal == false && compDataVal == true) {
      $("#cec_edid1").prop('checked', true);
      $("#component_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (cecEdidVal == false && crossRefVal == true) {
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (codesetVal == true && cecEdidVal == false) {
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
    }
    if (masterBrand == true && cecEdidVal == false) {
      $("#master_brand_data1").prop('checked', true);
    }
  }

  componentDataCheck() {
    let compDataVal = $('#component_data').prop('checked');
    let cecEdidVal = $('#cec_edid').prop('checked');
    let codesetVal = $('#codeset_data').prop('checked');
    let crossRefVal = $('#cross_ref_value').prop('checked');
    let masterBrand = $('#master_brand_data').prop('checked');
    if (compDataVal == true) {
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    } else {
      $("#component_data1").prop('checked', false);
      $("#cec_edid1").prop('checked', false);
      $("#codeset_data1").prop('checked', false);
      $("#cross_ref_value1").prop('checked', false);
      $("#master_brand_data1").prop('checked', false);
    }
    if (cecEdidVal == true && compDataVal == false) {
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (codesetVal == true && compDataVal == false) {
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
    }
    if (crossRefVal == true && compDataVal == false) {
      $("#cross_ref_value1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (masterBrand == true && compDataVal == false) {
      $("#master_brand_data1").prop('checked', true);
    }
  }

  crossRefDataCheck() {
    let crossRefVal = $('#cross_ref_value').prop('checked');
    let cecEdidVal = $('#cec_edid').prop('checked');
    let compDataVal = $('#component_data').prop('checked');
    let codesetVal = $('#codeset_data').prop('checked');
    let masterBrand = $('#master_brand_data').prop('checked');
    if (crossRefVal == true) {
      $("#cross_ref_value1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    } else {
      $("#cross_ref_value1").prop('checked', false);
      $("#codeset_data1").prop('checked', false);
      $("#master_brand_data1").prop('checked', false);
    }
    if (cecEdidVal == true && crossRefVal == false) {
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (compDataVal == true && crossRefVal == false) {
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (codesetVal == true && crossRefVal == false) {
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
    }
    if (masterBrand == true && crossRefVal == false) {
      $("#master_brand_data1").prop('checked', true);
    }
  }

  codesetsDataCheck() {
    let codesetVal = $('#codeset_data').prop('checked');
    let cecEdidVal = $('#cec_edid').prop('checked');
    let compDataVal = $('#component_data').prop('checked');
    let crossRefVal = $('#cross_ref_value').prop('checked');
    if (codesetVal == true) {
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
    } else {
      $("#codeset_data1").prop('checked', false);
      $("#cross_ref_value1").prop('checked', false);
      $("#component_data1").prop('checked', false);
      $("#cec_edid1").prop('checked', false);
    }
    if (cecEdidVal == true && codesetVal == false) {
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (compDataVal == true && codesetVal == false) {
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (crossRefVal == true && codesetVal == false) {
      $("#cross_ref_value1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
  }

  masterBrandCheck() {
    let masterBrand = $('#master_brand_data').prop('checked');
    let cecEdidVal = $('#cec_edid').prop('checked');
    let compDataVal = $('#component_data').prop('checked');
    let crossRefVal = $('#cross_ref_value').prop('checked');
    let cecData = $('#cec_data').prop('checked');
    let edidData = $('#edid_data').prop('checked');
    if (masterBrand == true) {
      $("#master_brand_data1").prop('checked', true);
    } else {
      $("#master_brand_data1").prop('checked', false);
    }
    if (cecEdidVal == true && masterBrand == false) {
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (compDataVal == true && masterBrand == false) {
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (crossRefVal == true && masterBrand == false) {
      $("#cross_ref_value1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (cecData == true && masterBrand == false) {
      $("#cec_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (edidData == true && masterBrand == false) {
      $("#edid_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    
  }

  brandInfoCecCheck() {
    let cecData = $('#cec_data').prop('checked');
    let cecEdidVal = $('#cec_edid').prop('checked');
    let compDataVal = $('#component_data').prop('checked');
    let crossRefVal = $('#cross_ref_value').prop('checked');
    let masterBrand = $('#master_brand_data').prop('checked');
    let edidData = $('#edid_data').prop('checked');
    if (cecData == true) {
      $("#cec_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    } else {
      $("#cec_data1").prop('checked', false);
      $("#master_brand_data1").prop('checked', false);
    }
    if (cecEdidVal == true && cecData == false) {
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (compDataVal == true && cecData == false) {
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (crossRefVal == true && cecData == false) {
      $("#cross_ref_value1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (masterBrand == true) {
      $("#master_brand_data1").prop('checked', true);
    }
    if (edidData == true && cecData == false) {
      $("#edid_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
  }

  brandInfoEdidCheck() {
    let edidData = $('#edid_data').prop('checked');
    let cecEdidVal = $('#cec_edid').prop('checked');
    let compDataVal = $('#component_data').prop('checked');
    let crossRefVal = $('#cross_ref_value').prop('checked');
    let cecData = $('#cec_data').prop('checked');
    let masterBrand = $('#master_brand_data').prop('checked');
    if (edidData == true) {
      $("#edid_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    } else {
      $("#edid_data1").prop('checked', false);
      $("#master_brand_data1").prop('checked', false);
    }
    if (cecEdidVal == true && edidData == false) {
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (compDataVal == true && edidData == false) {
      $("#component_data1").prop('checked', true);
      $("#cec_edid1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#cross_ref_value1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (crossRefVal == true && edidData == false) {
      $("#cross_ref_value1").prop('checked', true);
      $("#codeset_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
    if (masterBrand == true) {
      $("#master_brand_data1").prop('checked', true);
    }
    if (cecData == true && edidData == false) {
      $("#cec_data1").prop('checked', true);
      $("#master_brand_data1").prop('checked', true);
    }
  }

  zipDataCheck() {
    if ($('#zip_data').prop('checked') == true) {
      $("#zip_data1").prop('checked', true);
    } else {
      $("#zip_data1").prop('checked', false);
    }
  }

  binDataCheck() {
    if ($('#bin_data').prop('checked') == true) {
      $("#bin_data1").prop('checked', true);
    } else {
      $("#bin_data1").prop('checked', false);
    }
  }

/** checked modules will be deleted before it uploads function  */
  deleteCompData() {
    let compDataVal = $('#brand_model_value').prop('checked');
    if (compDataVal == true) {
      $("#brandinfocecEdidData").prop('checked', true);
      $("#brandinfocecEdidData").prop('disabled', true);
    } else {
      $("#brandinfocecEdidData").prop('checked', false);
      $("#brandinfocecEdidData").prop('disabled', false);
    }
  }

  deleteCodesetData() {
    let codesetVal = $('#code_value').prop('checked');
    if (codesetVal == true) {
      $("#brandinfocecEdidData").prop('checked', true);
      $("#brandinfocecEdidData").prop('disabled', true);
      $("#brand_model_value").prop('checked', true);
      $("#brand_model_value").prop('disabled', true);
      $("#cross_reference_value").prop('checked', true);
      $("#cross_reference_value").prop('disabled', true);
    } else {
      $("#brandinfocecEdidData").prop('checked', false);
      $("#brand_model_value").prop('checked', false);
      $("#cross_reference_value").prop('checked', false);
      $("#brandinfocecEdidData").prop('disabled', false);
      $("#brand_model_value").prop('disabled', false);
      $("#cross_reference_value").prop('disabled', false);
    }
  }

/** Add version is clicked handle Div Visibility  */
  CreateNewVersion() {
    this.VersionAvailability = false;
    this.versionAvail = false;
    this.createVersion = true;
    this.zipUploadDiv = false;
  }

/** to get the selected file and trigger the modal  */

  uploadFileData(e) {
    let file = (<HTMLInputElement>document.getElementById('file-upload')).files[0];
    let fileName = (<HTMLInputElement>document.getElementById('file-upload')).files[0].name;
    if (!(/\.(zip)$/i).test(fileName)) {
      this.notifier.notify('warning', 'Please Select Zip file to Upload');
    } else {
      
      if (fileName != undefined) {
        $('#file-upload').prev('label').text(fileName);
        $('#openModalButton').click();
      }
    }
    
  }

/** modal close function to reset the selected files  */

  closeModal() {
    $('#file-upload').prev('label').text('');
    $('#file-upload').val('');
    $('#zip-update').prev('label').text('');
    $('#zip-update').val('');
  }
 
/** If upload button is clicked based on version availability handle the Div Visibility  */
  fileUpload() {

    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);

    let Client = filterProjects[0]['client']; let Region = filterProjects[0]['region']; let ProjectName = filterProjects[0]['projectname'];
    let Dbversion = this.version_list; let Dbinstance = filterProjects[0]['dbinstance'];

    this.mainService.filterDataUpload(Client, Region, ProjectName, Dbversion, Dbinstance, 6)
      .subscribe(value => {
        if (value.data.length > 0) {
            this.VersionAvailability = false;
            this.createVersion = false;
            this.UpdateZip = true;
        }
      });

  }

/**
Zip Upload button is clicked to select a file and to send selected zip file to server to modify validated file
 */
  zipUpload(e) {
    let file = (<HTMLInputElement>document.getElementById('zip-upload')).files[0];
    let fileName = (<HTMLInputElement>document.getElementById('zip-upload')).files[0].name;
    if (!(/\.(zip)$/i).test(fileName)) {
      this.notifier.notify('warning', 'Please Select Zip file to Upload a Bin File');
    } else {
      try {
        this.updateZipData = false;
        $("input").prop('disabled', true);
        $("select").prop("disabled", true);
        $("a").css('pointer-events', 'none');
        $('#zip-upload').prev('label').text(fileName);

        this.fileSelected = fileName;
        this.loaderVisible = true;
        this.progressName = 'Unzipping Zip File...';
        let filename = 'zipfile';
        let formData = new FormData();
        formData.append(filename, file);
        this.http.post<any>(`${environment.apiUrl}/api/LoadData/UploadZipFile`, formData
        ).subscribe((val) => {
          if (val.data == true) {
            this.progressName = 'Zip Uploaded Successfully';
            this.loaderVisible = false;
            this.getListOfZipFiles();

            let filterProject: any = this.finalArray.filter(u =>
              u.projectname == this.projectNames[0]['item_text']);
                for (var m = 0; m < filterProject.length; m++) {
                  this.versionArr.push(filterProject[m]['embeddedDbVersion']);
                }
            var uniqueVersions = this.versionArr.filter((v, i, a) => a.indexOf(v) === i);
            this.versions = uniqueVersions;
            this.latestVersions();
            if (this.versions.length >= 1) {
              let filterProjects: any = this.finalArray.filter(u =>
                u.projectname == this.projectNames[0]['item_text']);
              let Dbname = filterProjects[0]['dbinstance'];
              let Projectname = this.projectNames[0]['item_text'];
              this.mainService.hdmiData(Dbname, Projectname)
                .subscribe(value => {

                });
            }
          }
        }); 
      } catch (error) {
        this.notifier.notify('error', error);
        $('#zip-upload').prev('label').text('');
        $('#zip-upload').val('');
      }
       
    }
    
  }

  /** File unzip operation when zip upload is successfully and to view the list of zip file from main zip file */

  getListOfZipFiles() {
    this.loaderVisible = true;
    try {
      this.mainService.getListofZipFiles().subscribe(value => {

        if (value.data.length != 0) {

          for (var i = 0; i < value.data.length; i++) {
            var url = value.data[i];
            var parts = url.split("/");
            // var last_part = parts[parts.length - 1];
            if (parts[parts.length - 1] == this.fileSelected) {
              var matchedUrl = url;
              this.loaderVisible = false;
              this.fileUnzipContent(matchedUrl)
            }
          }
        }
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
    }
    
  }

/** To unzip the list of zip file list from the main zip file */

  fileUnzipContent(urlValue) {
    
    try {
      this.loaderVisible = true;
      this.mainService.fileUnzipData(urlValue).subscribe(value => {
        // this.notifier.hideOldest();
        this.progressName = 'Unzipped Successfully';
        // this.notifier.notify("success", "Unzipped Successfully!");
        this.loaderVisible = false;
        if (value.data.length > 0) {
          for (var i = 0; i < value.data.length; i++) {
            var url = value.data[i];
            var parts = url.split("/");

            let getZipFile = parts[parts.length - 1];
            var index = getZipFile.lastIndexOf("_");
            var result = getZipFile.substr(index + 1);
            if (result == 'download.zip') {
              this.getMemoryZipFile(url);
            }
            if (parts[parts.length - 1] == this.fileSelected) {
              this.readZipFileContent(url);
            }
          }
        }
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
    }
    
  }

/** to send the zip file to get the memory stream of the file */

  getMemoryZipFile(zipurl) {
    try {
      this.mainService.getMemoryStream(zipurl).subscribe(value => {

        let base64Data = value.data;
        var decodedString = atob(base64Data);

        var b64 = base64Data;

        var base64 = b64;
        if (base64 != undefined && base64 != '') {
          /** Binary Data */
          var getArr = Uint8Array.from(atob(base64), c => c.charCodeAt(0))

          var result = 0;
          getArr.forEach(function (value) {
            result += value;
          });
          var checkResult = result & 0xFF;
          var hexString = checkResult.toString(16);
          var checksum = hexString.toUpperCase();

          if (checksum.length == 1) {
            checksum = '0' + checksum;
          }
          let dataType = 1;
          this.mainService.getProjectNames(null, null, null, null, null, dataType)
            .subscribe(value => {
              this.finalArray = value.data;
              let version;
              if (this.embed_version == undefined) {
                version = this.version_list;
              } else {
                version = this.embed_version;
              }
              let filterProjects: any = this.finalArray.filter(u =>
                u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == version);

              let Dbname = filterProjects[0]['dbinstance'];
              let Projectname = this.projectNames[0]['item_text'];
              let Embeddedversion;
              if (this.embed_version == undefined) {
                Embeddedversion = this.version_list;
              } else {
                Embeddedversion = this.embed_version;
              }
              let projectversion = filterProjects[0]['projectVersion'];
              let swversion = filterProjects[0]['softwareVersion'];
              let statusFlag = 1;
              this.mainService.loadBinZip(Dbname, Projectname, Embeddedversion, projectversion, swversion, null, null,
                base64Data, checksum, statusFlag)
                .subscribe(value => {
                  if (value.data.length != 0) {
                    //this.notifier.notify('success', 'Zip Uploaded Successfully');
                    this.progressName = 'Zip Uploaded Successfully';
                  } else {
                    this.notifier.notify('warning', value.message);
                  }

                  let cecEdidData = $('#cec_edid1').prop('checked');
                  let compData = $('#component_data1').prop('checked');
                  let crosRefData = $('#cross_ref_value1').prop('checked');
                  let codesetData = $('#codeset_data1').prop('checked');
                  let masterData = $('#master_brand_data1').prop('checked');
                  let cecData = $('#cec_data1').prop('checked');
                  let edidData = $('#edid_data1').prop('checked');
                  let binData = $('#bin_data1').prop('checked');
                  if (this.UpdateZip == true) {
                    if (cecEdidData == false && compData == false && crosRefData == false && codesetData == false &&
                      masterData == false && cecData == false && edidData == false && binData == false) {
                      this.viewFiles = false;
                      $("input").prop('disabled', false);
                      $("select").prop("disabled", false);
                      $("a").css('pointer-events', 'auto');
                      this.loaderVisible = false;
                      this.notifier.notify("success", "Files Updated Successfully!!!");
                      this.progressName = '';
                      $('#zip-update').val('');
                      $('#zip-update').prev('label').text('Updated Successfully');
                      $('#uploadedModalButton').click();
                    }
                  }
                });

            });
        }

      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
    }
    
  }

/** Bin file upload */

  binUploadData(binUrl) {
    try {
      this.mainService.getMemoryStream(binUrl).subscribe(value => {

        let base64Data = value.data;

        var b64 = base64Data;

        var base64 = b64;
        if (base64 != undefined && base64 != '') {
          /** Binary Data */
          var getArr = Uint8Array.from(atob(base64), c => c.charCodeAt(0))

          var result = 0;
          getArr.forEach(function (value) {
            result += value;
          });
          var checkResult = result & 0xFF;
          var hexString = checkResult.toString(16);
          var checksum = hexString.toUpperCase();

          if (checksum.length == 1) {
            checksum = '0' + checksum;
          }

          let versionChoosen;
          if (this.embed_version != undefined) {
            versionChoosen = this.embed_version;
          } else {
            versionChoosen = this.version_list;
          }
          let filterProjects: any = this.finalArray.filter(u =>
            u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == versionChoosen);

          let Dbname = filterProjects[0]['dbinstance'];
          let Projectname = this.projectNames[0]['item_text'];
          let Embeddedversion = versionChoosen;
          let projectversion = filterProjects[0]['projectVersion'];
          let swversion = filterProjects[0]['softwareVersion'];
          let statusFlag = 1;

          this.mainService.loadBinZip(Dbname, Projectname, Embeddedversion, projectversion, swversion,
            base64Data, checksum, null, null, statusFlag)
            .subscribe(value => {
              if (value.data.length != 0) {
                if (value.data[0]['result'] != '0') {
                  // this.notifier.hideOldest();
                  this.progressName = 'Bin Uploaded Successfully';
                  // this.notifier.notify('success', 'Bin Uploaded Successfully');
                }
              } else {
                this.notifier.notify('warning', value.data.message);
              }

              let cecEdidData = $('#cec_edid1').prop('checked');
              let compData = $('#component_data1').prop('checked');
              let crosRefData = $('#cross_ref_value1').prop('checked');
              let codesetData = $('#codeset_data1').prop('checked');
              let masterData = $('#master_brand_data1').prop('checked');
              let cecData = $('#cec_data1').prop('checked');
              let edidData = $('#edid_data1').prop('checked');
              let zipData = $('#zip_data1').prop('checked');
              if (this.UpdateZip == true) {
                if (cecEdidData == false && compData == false && crosRefData == false && codesetData == false &&
                  masterData == false && cecData == false && edidData == false && zipData == false) {
                  $("input").prop('disabled', false);
                  $("select").prop("disabled", false);
                  $("a").css('pointer-events', 'auto');
                  this.viewFiles = false;
                  this.loaderVisible = false;
                  this.progressName = '';
                  this.notifier.notify("success", "Files Updated Successfully!!!");
                  $('#zip-update').val('');
                  $('#zip-update').prev('label').text('Updated Successfully');
                  $('#uploadedModalButton').click();
                }

                if (cecEdidData == false && compData == false && crosRefData == false && codesetData == false &&
                  masterData == false && cecData == false && edidData == false && zipData == true) {
                  $("input").prop('disabled', false);
                  $("select").prop("disabled", false);
                  $("a").css('pointer-events', 'auto');
                  this.viewFiles = false;
                  this.loaderVisible = false;
                  this.progressName = '';
                  $('#zip-update').val('');
                  this.notifier.notify("success", "Files Updated Successfully!!!");
                  $('#zip-update').prev('label').text('Updated Successfully');
                  $('#uploadedModalButton').click();
                }
              }


            });
        }
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
    }
    
  }

/** Validating the file name list in the zip file contains and adding the file names */

  checkFiles() {
    this.viewFiles = true;
    this.Listitems = ['MasterbrandList.csv', 'Codesets', 'CrossReferenceByBrands.xml', 'ComponentData.csv', 'BrandInfo_CEC.csv', 'BrandInfo_EDID.csv', 'CEC_EDID.csv','wdb.bin','download.zip'];
    
  }

/** Read the zip file and validating each file name exists inside the unzipped file */

  readZipFileContent(unzipUrl) {
    try {
      this.loaderVisible = true;
      this.progressName = 'Extracting Files ..!';
      this.mainService.fileUnzipData(unzipUrl).subscribe(value => {

        this.progressName = 'Unzipped Files Succesfully';
        var l = 1;
        for (var i = 0; i < value.data.length; i++) {
          var url = value.data[i];
          var parts = url.split("/");

          if (parts[parts.length - 1] == 'BrandInfo_CEC.csv' || parts[parts.length - 1] == 'BrandInfo_EDID.csv' || parts[parts.length - 1] == 'MasterbrandList.csv' || parts[parts.length - 1] == 'CrossReferenceByBrands.xml' ||
            parts[parts.length - 1] == 'ComponentData.csv' || parts[parts.length - 1] == 'CEC_EDID.csv' || parts[parts.length - 1] == 'wdb.bin') {

            l++;
            if (l == 8) {
              this.checkFiles();
            }
          }
        }

        for (var j = 0; j < value.data.length; j++) {
          var url = value.data[j];
          var parts = url.split("/");
          if (parts[parts.length - 1] == 'wdb.bin') {
            this.binUploadData(url);
          }
          if (parts[parts.length - 1] == 'MasterbrandList.csv') {
            this.masterBrandData(url);
          }
          if (parts[parts.length - 1] == 'CrossReferenceByBrands.xml') {
            this.crossReferenceBrands(url);
          }
          if (parts[parts.length - 1] == 'ComponentData.csv') {
            this.componentData(url);
          }
          if (parts[parts.length - 1] == 'BrandInfo_CEC.csv') {
            var brandCec = url;
            this.brandInfoCecData(brandCec);
          }
          if (parts[parts.length - 1] == 'BrandInfo_EDID.csv') {
            this.brandInfoEdidData(url);
          }
          if (parts[parts.length - 1] == 'CEC_EDID.csv') {
            this.cecEdidData(url);
          }
        }
        let pushData = [];
        for (var k = 0; k < value.data.length; k++) {

          pushData.push(value.data[k]);
        }

        this.codesetUrl = pushData;
        if (this.codesetUrl.length > 0) {
          this.callCodesets();
        }
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
    }
    
  }

/** reading codeset file to send each codeset file is correct */
 async callCodesets() {

    const items = this.codesetUrl;
    const matches = items.filter(s => s.includes('.bin'));
    matches.shift();
   let codesetName = [];
   this.progressName = 'Validating Codesets...';
   for (var k = 0; k < matches.length; k++) {
     var url = matches[k];
     var parts = url.split("/");
     var data = parts[parts.length - 1];
     data = data.substr(0, data.lastIndexOf(".bin"));
     codesetName.push(data);
   }
   this.codesetArr = codesetName;

   this.codeSetFileLength = matches.length; 
   for (var i = 0; i < matches.length; i++) {
     try {
       await this.mainService.getCodesetMemoryStream(matches[i]).then(value => {
         this.progressName = 'Validating Codesets...';
         let base64codesetData = value.data;
         this.CodesetBase64Data(base64codesetData);
       });
     } catch (error) {
       this.notifier.notify('error', error);
       $('#zip-upload').prev('label').text('');
       $('#zip-upload').val('');
       $('#zip-update').prev('label').text('');
       $('#zip-update').val('');
     }
     
    }
      
  }

/** Validation message for zip and bin file in a table view */
  checkZipandBin() {
    $("td[data-val='data-download.zip']").html('Validated');
    $("td[data-val='data-download.zip']").removeClass('red');
    $("td[data-val='data-download.zip']").addClass('greenColor');
    $("td[data-val='data-wdb.bin']").html('Validated');
    $("td[data-val='data-wdb.bin']").removeClass('red');
    $("td[data-val='data-wdb.bin']").addClass('greenColor');
  }

/** List of memory stream for each brand info cec data */

  brandInfoCecData(brandCec) {
    try {
      this.mainService.getMemoryStream(brandCec).subscribe(value => {

        var c = 0, c1 = 0, c2 = 0; var c3 = 0;
        var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
        var string = value.data;
        var decodedUtfString = Base64.decode(string);
        this.CecdecodeBase64Data(decodedUtfString);
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }
    
  }

/** List of memory stream for each brand info edid data */
  brandInfoEdidData(brandEdid) {
    try {
      this.mainService.getMemoryStream(brandEdid).subscribe(value => {

        var c = 0, c1 = 0, c2 = 0; var c3 = 0;
        var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
        var string = value.data;
        var decodedUtfString = Base64.decode(string);
        this.EdiddecodeBase64Data(decodedUtfString);
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }
    
  }

/** List of memory stream for each master brand data */

  masterBrandData(brands) {
    try {
      this.mainService.getMemoryStream(brands).subscribe(value => {
        var c = 0, c1 = 0, c2 = 0; var c3 = 0;
        var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
        var string = value.data;
        var decodedUtfString = Base64.decode(string);
        this.MasterBranddecodeBase64Data(decodedUtfString);
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }
    
  }

/** List of memory stream for each cross reference by brands data */

  crossReferenceBrands(crossRef) {
    try {
      this.mainService.getMemoryStream(crossRef).subscribe(value => {

        var c = 0, c1 = 0, c2 = 0; var c3 = 0;
        var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
        var string = value.data;
        var decodedUtfString = Base64.decode(string);
        this.CrossRefBase64Data(decodedUtfString);
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }
    
  }

/** List of memory stream for each component data */

  componentData(compUrl) {
    try {
      this.mainService.getMemoryStream(compUrl).subscribe(value => {

        var c = 0, c1 = 0, c2 = 0; var c3 = 0;
        var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
        var string = value.data;
        var decodedUtfString = Base64.decode(string);
        this.ComponentBase64Data(decodedUtfString);
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }
    
  }

/** List of memory stream for each cec-edid data */

  cecEdidData(cecEdidUrl) {
    try {
      this.mainService.getMemoryStream(cecEdidUrl).subscribe(value => {

        var c = 0, c1 = 0, c2 = 0; var c3 = 0;
        var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
        var string = value.data;
        var decodedUtfString = Base64.decode(string);
        this.CecEdidBase64Data(decodedUtfString);

      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-upload').prev('label').text('');
      $('#zip-upload').val('');
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }
  }

/** base64 data from codeset to decrypt and maintain an array */
  CodesetBase64Data(encodedCodesetString) {

    var b64 = encodedCodesetString;

    this.csData = b64;
    var base64 = b64;
    if (base64 != undefined && base64 != '') {
      /** Binary Data */
      var getArr = Uint8Array.from(atob(base64), c => c.charCodeAt(0))

      var result = 0;
      getArr.forEach(function (value) {
        result += value;
      });
      var checkResult = result & 0xFF;
      var hexString = checkResult.toString(16);
      this.csChecksum = hexString.toUpperCase();

      if (this.csChecksum.length == 1) {
        this.csChecksum = '0' + this.csChecksum;
      }
      this.codeArrResult.push({ "RowId": this._incValue, "Codeset": this.codesetArr[this._incValue], "CSData": this.csData, "CSChecksum": this.csChecksum });
      this._incValue = this._incValue + 1;
    }
    
    if (this.codeArrResult.length == this.codeSetFileLength) {
      if (this.UpdateZip == false) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.xmlDataResult.length != 0 &&
          this.brandModelList.length != 0 && this.brandInfoCecList.length != 0 && this.brandInfoEdidList.length != 0 &&
          this.brandInfoCecEdidList.length != 0) {

          this.validateHeaders();
        }
      }
      
      if (this.UpdateZip == true) {
        if (this.codeArrResult.length != 0) {
          this.validateUpdatedHeaders();
        }
      }

        $("td[data-val='data-Codesets']").html('Validated');
        $("td[data-val='data-Codesets']").removeClass('red');
        $("td[data-val='data-Codesets']").addClass('greenColor');
    }
    this.checkZipandBin();
  }
 
/** base64 data from brandinfocec to decrypt and maintain an array */
  CecdecodeBase64Data(decodedString) {
    var allTextLines = decodedString.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    if (headers[0] == 'device' && headers[2] == 'brandname' && headers[3] == 'vendorid') {
      this.validateCecHeaders = true;
    }
    for (var i = 1; i < allTextLines.length; i++) {

      var data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        var row = {}; var device = {}; var brand = {}; var vendorid = {};
        for (var j = 0; j < headers.length; j++) {
          row[headers[j].trim()] = data[j].trim();
          var b = {};
          device['device'] = data[0];
          brand['brand'] = data[2];
          vendorid['vendorid'] = data[3];
          b['RowId'] = i;
          var row1 = Object.assign({}, b, device, brand, vendorid);
        }
        lines.push(row1);
      }
    }
    
    this.brandInfoCecList = lines;
      $("td[data-val='data-BrandInfo_CEC.csv']").html('Validated');
      $("td[data-val='data-BrandInfo_CEC.csv']").removeClass('red');
    $("td[data-val='data-BrandInfo_CEC.csv']").addClass('greenColor');

    if (this.UpdateZip == true) {
      if (this.brandInfoCecList.length != 0) {
        this.validateUpdatedHeaders();
      }
    }
    this.checkZipandBin();
  }

/** base64 data from brandinfoedid to decrypt and maintain an array */

  EdiddecodeBase64Data(decodedEdidString) {

    var allTextLines = decodedEdidString.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    if (headers[0] == 'device' && headers[2] == 'brandname' && headers[3] == 'edidbrand') {
      this.validateEdidHeaders = true;
    }
    for (var i = 1; i < allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        var row = {}; var device = {}; var brand = {}; var edidbrand = {};
        for (var j = 0; j < headers.length; j++) {
          row[headers[j].trim()] = data[j].trim();
          var b = {};
          device['device'] = data[0];
          brand['brand'] = data[2];
          edidbrand['edidbrand'] = data[3];
          b['RowId'] = i;
          var row1 = Object.assign({}, b, device, brand, edidbrand);
        }
        lines.push(row1);
      }
    }
    this.brandInfoEdidList = lines;
    
      $("td[data-val='data-BrandInfo_EDID.csv']").html('Validated');
      $("td[data-val='data-BrandInfo_EDID.csv']").removeClass('red');
      $("td[data-val='data-BrandInfo_EDID.csv']").addClass('greenColor');

    if (this.UpdateZip == true) {
      if (this.brandInfoEdidList.length != 0) {
        this.validateUpdatedHeaders();
      }
    }
    this.checkZipandBin();
  }

/** base64 data from masterbrand to decrypt and maintain an array */
  MasterBranddecodeBase64Data(decodedMasterBrandString) {

    var allTextLines = decodedMasterBrandString.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    if (headers[0] == 'brandname' && headers[1] == 'brandcode') {
      this.validateMasterBrandHeaders = true;
    }
    for (var i = 1; i < allTextLines.length; i++) {

      var data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        var row = {};
        for (var j = 0; j < headers.length; j++) {
          row[headers[j].trim()] = data[j].trim();
          var b = {};
          b['RowId'] = i;
          var row1 = Object.assign({}, b, row);
        }
        lines.push(row1);
      }
    }
    this.masterBrandList = lines;

    if (this.masterBrandList.length > 0) {
     // this.notifier.notify("success", 'Master Brands Data Validated Successfully');
    //  this.progressName = 'Master Brands Data Validated Successfully';
    
      $("td[data-val='data-MasterbrandList.csv']").html('Validated');
      $("td[data-val='data-MasterbrandList.csv']").removeClass('red');
      $("td[data-val='data-MasterbrandList.csv']").addClass('greenColor');
      this.checkZipandBin();
       if (this.UpdateZip == true) {
        if (this.masterBrandList.length != 0) {
          this.validateUpdatedHeaders();
        }
      }
    }
  }

/** base64 data from cross reference by brands to decrypt and maintain an array */

  CrossRefBase64Data(decodedCrossRefString) {

    var xmlData = decodedCrossRefString;
    xmlData = xmlData.replace(/\ï»¿/g, '');

    let obj = {};
    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(xmlData, (err, result) => {
      obj = result;
    });

    this._objectParse = obj['CROSSREFERENCEBYBRANDS']['DEVICECATEGORY'];

    let codeSet = [];
    let diviceArrayForm = [];
    let dataval = {
      "RowId": 0,
      "device": "",
      "brand": "",
      "codeset": "",
      "ranking": 0
    };

    for (let i = 0; i < this._objectParse.length; i++) {
      this._brand = this._objectParse[i]['BRANDS'][0]['BRAND'];
      for (let j = 0; j < this._brand.length; j++) {

        dataval['brand'] = this._brand[j]["$"]['NAME'];
        codeSet = this._brand[j]['CODESETS'][0]['CODESETID'];

        if (typeof codeSet === 'string') {
          codeSet = Array(codeSet);
        }

        for (let k = 0; k < codeSet.length; k++) {
          dataval['device'] = this._objectParse[i]['$']['NAME'];
          this._brand = this._objectParse[i]['BRANDS'][0]['BRAND'];
          dataval['codeset'] = codeSet[k];
          dataval['ranking'] = k + 1;
          const setValue = {
            "RowId": this.increment++,
            "device": dataval['device'],
            "brand": dataval['brand'],
            "codeset": dataval['codeset'],
            "ranking": dataval['ranking'],

          };
          diviceArrayForm.push(setValue);
        }
      }

    }
    
    this.xmlDataResult = diviceArrayForm;
    if (this.xmlDataResult[0]['device'] != undefined && this.xmlDataResult[0]['brand'] != undefined &&
      this.xmlDataResult[0]['codeset'] != undefined && this.xmlDataResult[0]['ranking']) {
      this.validateXmlHeaders = true;
    }
    if (this.xmlDataResult.length > 0) {
        $("td[data-val='data-CrossReferenceByBrands.xml']").html('Validated');
        $("td[data-val='data-CrossReferenceByBrands.xml']").removeClass('red');
        $("td[data-val='data-CrossReferenceByBrands.xml']").addClass('greenColor');
        if (this.UpdateZip == true) {
          if (this.xmlDataResult.length != 0) {
          this.validateUpdatedHeaders();
        }
      }
    }
    this.checkZipandBin();
  }

/** base64 data from component data to decrypt and maintain an array */
  ComponentBase64Data(decodedComponentString) {

    var allTextLines = decodedComponentString.split(/\r\n|\n/);
    var headers = allTextLines[1].split(',');
    var lines = [];
    if (headers[0] == 'DeviceCategoryName' && headers[1] == 'Brand' && headers[2] == 'ModelName' && headers[3] == 'Codeset'
      && headers[4] == 'BrandID' && headers[5] == 'Country') {
      this.validateComponentHeaders = true;
    }
    var m = 1;

    for (var i = 2; i < allTextLines.length; i++) {

      var data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        var row = {};
        for (var j = 0; j < headers.length; j++) {
          data[j] = data[j].replace(/"/g, "");
          row[headers[j].trim()] = data[j].trim();
          var b = {}; var modelx = {}; var model = {}; var device = {};
          var brand = {}; var codeset = {}; var country = {};
          var ArrayValues = [];
          ArrayValues.push(row);
          for (var k = 0; k < ArrayValues.length; k++) {
            var modelX = ArrayValues[k]['ModelName'];
            var modeL = ArrayValues[k]['ModelName'];
            var Device = ArrayValues[k]['DeviceCategoryName'];
            var Brand = ArrayValues[k]['Brand'];
            var Codeset = ArrayValues[k]['Codeset'];
            var Country = ArrayValues[k]['Country'];
            if (modelX != undefined) {
              var removeChars = modelX.replace(/[^a-zA-Z0-9]/g, '');
            }
          }
          modelx['modelx'] = removeChars;
          model['model'] = modeL;
          device['device'] = Device;
          brand['brand'] = Brand;
          codeset['codeset'] = Codeset;
          country['country'] = Country;
          b['RowId'] = m;
          var row1 = Object.assign({}, b, device, brand, model, modelx, codeset, country);
        }
        lines.push(row1);
      }
      m++;
    }
    this.brandModelList = lines;
      $("td[data-val='data-ComponentData.csv']").html('Validated');
      $("td[data-val='data-ComponentData.csv']").removeClass('red');
      $("td[data-val='data-ComponentData.csv']").addClass('greenColor');

    if (this.UpdateZip == true) {
      if (this.brandModelList.length != 0) {
        this.validateUpdatedHeaders();
      }
    }
    this.checkZipandBin();
  }

/** base64 data from cec-edid data to decrypt and maintain an array */
  CecEdidBase64Data(decodedCecEdidString) {

    var allTextLines = decodedCecEdidString.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    let cecEdidArrayForm = [];

    if (headers[1] == 'Device Type' && headers[3] == 'Brand' && headers[4] == 'Model' && headers[5] == 'Region'
      && headers[6] == 'Country' && headers[7] == 'IS CEC Present' && headers[8] == 'IS CEC Enabled'
      && headers[9] == 'Vendor ID' && headers[10] == 'OSD Name' && headers[11] == 'EDID' && headers[12] == 'Id') {
      this.validateCecEdidHeaders = true;
    }

    let dataval = {
      "RowId": 0, "device": "", "brand": "", "model": "", "modelx": "", "region": "", "country": "", "edid": "",
      "edidbrand": "", "edid128": "", "vendorid": "", "osd": "", "osdstr": "", "iscecpresent": "", "iscecenabled": "",
      "codeset": ""
    };
    let resultArray = [];
   
    for (var i = 1; i < allTextLines.length; i++) {

      var data = allTextLines[i].split(',');

      if (data.length == headers.length) {
        var row = {};

        for (var j = 0; j < headers.length; j++) {
          row[headers[j].trim()] = data[j].trim();
          var ArrayValues = [];
          ArrayValues.push(row);
        }
      }
      resultArray.push(ArrayValues[0]);

    }
    resultArray = resultArray.filter(x => x.Id != "");
    for (var k = 0; k < resultArray.length; k++) {
      dataval['device'] = resultArray[k]['Device Type'];
      dataval['brand'] = resultArray[k]['Brand'];
      dataval['model'] = resultArray[k]['Model'];
      var modelX = resultArray[k]['Model'];
      if (modelX != undefined) {
        var filterChars = modelX.replace(/[^a-zA-Z0-9]/g, '');
      }
      dataval['modelx'] = filterChars;
      dataval['region'] = resultArray[k]['Region'];
      dataval['country'] = resultArray[k]['Country'];
      dataval['edid'] = resultArray[k]['EDID'];
      var edidBrand = resultArray[k]['EDID'];
      if (edidBrand != undefined && edidBrand != null && edidBrand != '') {
        var filterHex = edidBrand.replace(/[^a-zA-Z0-9]/g, '');
        if (filterHex.length >= 128) {
          var finalString = filterHex.slice(16, 20);
          let getBit = (parseInt(finalString, 16)).toString(2);
          if (finalString[0] == '0') {
            getBit = '0000' + getBit;
          }
          if (finalString[0] == '1' || finalString[0] == '3' || finalString[0] == '2') {
            getBit = '00' + getBit;
          }
          if (getBit.length > 15) {
            getBit = getBit.slice(1, 16);
          }
          var finalBit = this.convertAlpha(getBit.slice(0, 5)) + '' + this.convertAlpha(getBit.slice(5, 10)) + '' + this.convertAlpha(getBit.slice(10, 15));
          }
      }
      dataval['edidbrand'] = finalBit;
      var edid128 = resultArray[k]['EDID'];
      if (edid128 != null && edid128 != '') {
        let checkEdidData = edid128.includes('00 FF FF FF FF FF FF 00');
        let checkSpaceEdidData = edid128.includes('00  FF  FF  FF  FF  FF  FF  00');
        let checklowercaseEdidData = edid128.includes('00 ff ff ff ff ff ff 00');
        if (edid128.length < 383) {
          dataval['edid'] = null;
          dataval['edid128'] = null;
          dataval['edidbrand'] = null;
        } else {
          if (checkEdidData == true) {
            dataval['edid'] = edid128;
            dataval['edid128'] = edid128.slice(0, 383);
          } else {
            dataval['edid'] = null;
            dataval['edid128'] = null;
            dataval['edidbrand'] = null;
          }
          if (edid128.length < 383 && checkSpaceEdidData == true) {
            dataval['edid'] = null;
            dataval['edid128'] = null;
            dataval['edidbrand'] = null;
          }
          if (checklowercaseEdidData == true) {
            dataval['edid'] = edid128;
            dataval['edid128'] = edid128.slice(0, 383);
          }
        }
      } 
      var modVendorId = resultArray[k]['Vendor ID'];
      if (modVendorId == '') {
        modVendorId = null;
      } else {
        modVendorId = modVendorId.replace(/[^a-zA-Z0-9]/g, '');
      }
      dataval['vendorid'] = modVendorId;
      var modOsd = resultArray[k]['OSD Name'];
      if (modOsd == '') {
        modOsd = null;
      } else {
        modOsd = modOsd.replace(/[^a-zA-Z0-9]/g, '');
      }
      dataval['osd'] = modOsd;
      var modOstString;
      if (modOsd == null) {
        modOstString = null;
      } else {
        modOstString = modOsd.replace(/[^a-zA-Z0-9]/g, '');
      }
     // var modOstString = modOsd.replace(/[^a-zA-Z0-9]/g, '');
      var hex;
      if (modOstString == null) {
        hex = null;
      } else {
        hex = modOstString.toString();
      }
     // var hex = modOstString.toString();
      var str = '';
      if (hex == null) {
        str = null;
      } else {
        for (var i = 0; i < hex.length; i += 2)
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      
      dataval['osdstr'] = str;
      let cecPresent = resultArray[k]['IS CEC Present'];
      if (cecPresent != undefined && cecPresent != null && cecPresent != '') {
        if (cecPresent === 'Y') {
          cecPresent = 1;
        }
        if (cecPresent === 'N') {
          cecPresent = 0;
        }
      }
      let cecEnabled = resultArray[k]['IS CEC Enabled'];
      if (cecEnabled != undefined && cecEnabled != null && cecEnabled != '') {
        if (cecEnabled === 'Y') {
          cecEnabled = 1;
        }
        if (cecEnabled === 'N') {
          cecEnabled = 0;
        }
      }
      dataval['iscecpresent'] = cecPresent;
      dataval['iscecenabled'] = cecEnabled;
      dataval['codeset'] = resultArray[k]['Id'];

      const setValue = {
        "RowId": this.cecincrement++,
        "device": dataval['device'],
        "brand": dataval['brand'],
        "model": dataval['model'],
        "modelx": dataval['modelx'],
        "region": dataval['region'],
        "country": dataval['country'],
        "edid": dataval['edid'],
        "edidbrand": dataval['edidbrand'],
        "edid128": dataval['edid128'],
        "vendorid": dataval['vendorid'],
        "osd": dataval['osd'],
        "osdstr": dataval['osdstr'],
        "iscecpresent": dataval['iscecpresent'],
        "iscecenabled": dataval['iscecenabled'],
        "codeset": dataval['codeset']
      };
      cecEdidArrayForm.push(setValue);
    }

    for (var n = 0; n < cecEdidArrayForm.length; n++) {
    
      if (cecEdidArrayForm[n]['edid'] == "" && cecEdidArrayForm[n]['vendorid'] == "" && cecEdidArrayForm[n]['osd'] == "") {
        cecEdidArrayForm.splice(n, 1);
      }
      if (cecEdidArrayForm[n]['edid'] == null && cecEdidArrayForm[n]['vendorid'] == null && cecEdidArrayForm[n]['osd'] == null) {
        cecEdidArrayForm.splice(n, 1);
      }
      if (n + 1 == cecEdidArrayForm.length) {
        this.brandInfoCecEdidList = cecEdidArrayForm;
      }
    }
      $("td[data-val='data-CEC_EDID.csv']").html('Validated');
      $("td[data-val='data-CEC_EDID.csv']").removeClass('red');
      $("td[data-val='data-CEC_EDID.csv']").addClass('greenColor');
    
    if (this.UpdateZip == true) {
      if (this.brandInfoCecEdidList.length != 0) {
        this.validateUpdatedHeaders();
      }
    }
    this.checkZipandBin();
  }

/** convert into alphabets based on bits */

  convertAlpha(value) {
    var resVal = '';
    if (value == '00001') { resVal = 'A'; } if (value == '00010') { resVal = 'B'; } if (value == '00011') { resVal = 'C'; }
    if (value == '00100') { resVal = 'D'; } if (value == '00101') { resVal = 'E'; } if (value == '00110') { resVal = 'F'; }
    if (value == '00111') { resVal = 'G'; } if (value == '01000') { resVal = 'H'; } if (value == '01001') { resVal = 'I'; }
    if (value == '01010') { resVal = 'J'; } if (value == '01011') { resVal = 'K'; } if (value == '01100') { resVal = 'L'; }
    if (value == '01101') { resVal = 'M'; } if (value == '01110') { resVal = 'N'; } if (value == '01111') { resVal = 'O'; }
    if (value == '10000') { resVal = 'P'; } if (value == '10001') { resVal = 'Q'; } if (value == '10010') { resVal = 'R'; }
    if (value == '10011') { resVal = 'S'; } if (value == '10100') { resVal = 'T'; } if (value == '10101') { resVal = 'U'; }
    if (value == '10110') { resVal = 'V'; } if (value == '10111') { resVal = 'W'; } if (value == '11000') { resVal = 'X'; }
    if (value == '11001') { resVal = 'Y'; } if (value == '11010') { resVal = 'Z'; }
    return resVal;
  }

  
/** based on version show highlights */

  changeVersion() {

    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == this.version_list);
    
    let Client = filterProjects[0]['client']; let Region = filterProjects[0]['region']; let ProjectName = filterProjects[0]['projectname'];
    let Dbversion = this.version_list; let Dbinstance = filterProjects[0]['dbinstance'];

    this.mainService.filterDataUpload(Client, Region, ProjectName, Dbversion, Dbinstance, 6)
      .subscribe(value => {
        this.countDetails = [];
        this.countDetails = value.data;
        if (this.countDetails[0]['codesetCount'] != 0 && this.countDetails[0]['crossReferenceCount'] != 0 &&
          this.countDetails[0]['brandModelCount'] != 0) {
          this.versionAvail = true;
          this.versionUpdate = false;
          this.uploadIcon = true;
          this.updateIcon = false;
        } else {
          this.uploadIcon = false;
          this.versionAvail = false;
          this.versionUpdate = true;
          this.updateIcon = true;
        }
      });
  }

  get f() { return this.uploadData.controls; }
  get g() { return this.uploadNewVersionData.controls; }

  onUploadDataSubmit() {
    this.submitted = true;
  }

/** new version creation for the project */
  onUploadNewVersionDataSubmit() {
    let filterProject: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);

    this.newDataSubmitted = true;
    if (this.uploadNewVersionData.invalid) {
      return;
    }
    let Dbname = filterProject[0]['dbinstance']; let Client = filterProject[0]['client']; let Region = filterProject[0]['region'];
    let ProjectName = this.projectNames[0]['item_text']; let SignatureKey = filterProject[0]['signatureKey']; let DbPath = filterProject[0]['dbinstance'];
    let EmbedVersion = this.embed_version; let DbVersion = this.db_version; let Statusflag = 1;
    let Flagtype = 1; let ProjectVersion = this.project_version; let SwVersion = this.sw_version;
    let allowDownloads = null;
    this.mainService.createNewProject(Dbname, Client, Region, ProjectName, SignatureKey, DbPath, EmbedVersion,
      DbVersion, Statusflag, Flagtype, ProjectVersion, SwVersion, allowDownloads, null, null, null, null)
      .subscribe(value => {
        if (value.data[0]['result'] == '1') {
          this.toastr.success(value.data[0]['message'], '');
          this.zipUploadDiv = true;
          this.VersionAvailability = false;
          this.versionAvail = false;
          this.createVersion = false;
        } else {
          this.toastr.warning(value.data[0]['message'], '');
          this.zipUploadDiv = false;
        }
      }); 

  }

  onUploadZipSubmit() {

  }

/** validate array list */

  validateHeaders() {


    if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.xmlDataResult.length != 0 &&
      this.brandModelList.length != 0 && this.brandInfoCecList.length != 0 && this.brandInfoEdidList.length != 0 &&
      this.brandInfoCecEdidList.length != 0) {
      this.masterBrand();
    }

  }

/** master brand list submission */

  async masterBrand() {
    if (this.masterBrandList.length == 0) {
      this.codeSets();
    }
    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);

    this.progressWidth = 0;
    let Dbname = filterProjects[0]['dbinstance'];
    var j = 0;
    var k = 1;
    let checkLength = this.masterBrandList.length / 1;

    if (checkLength % 1 != 0) {
      checkLength = Math.trunc(checkLength) + 1;
    }

    for (var i = 0; i < checkLength; i++) {
      var Jsonbrand = this.masterBrandList.slice(j, k);
      j = j + 1;
      k = k + 1;
      try {
        await this.mainService.dataUploadloadBrands(Dbname, Jsonbrand)
          .then(value => {
            this.isProgreessVisible = true;
            this.progressWidth = Math.floor((i * 100) / checkLength);
            this.progressName = 'Uploading.. Master Brand';
            if (value.data != '' && value.data != undefined) {

              for (var l = 0; l < value.data.length; l++) {
                if (value.data[l]['searchResult'] == '2') {
                  this.existsBrandCount++;
                }
                if (value.data[l]['searchResult'] == '1') {
                  this.addedBrandCount++;
                }
                if (value.data[l]['searchResult'] == '0') {
                  this.failedBrandCount++;
                }
              }

            }
          });
        this.index = i;
      } catch (error) {
      }
      
    }

    if (this.index + 1 == checkLength) {
      this.isProgreessVisible = false;
     // this.isIconVis1 = true;
      this.progressName = '';
      this.isdataUploaded = true;
      this.viewFiles = false;

      /* Db Updates Start */
      this.masterDataVisible = true;
      this.dataName = 'Master Brand List';
      this.InsertCount = this.addedBrandCount;
      this.ExistsCount = this.existsBrandCount;
      this.FailedCount = this.failedBrandCount;
      let userName = localStorage.getItem('userName'); let Projectname = this.projectNames[0]['item_text'];
      let Dbversion;
      if (this.embed_version == undefined) {
        Dbversion = this.version_list;
      } else {
        Dbversion = this.embed_version;
      }
      let Datasection = "Master Brand List"; let recordCount2 = this.existsBrandCount; let Updatedescription = "Updated Records";
      let Updatestatus = 1;
      let addedCount = this.addedBrandCount + this.existsBrandCount + this.failedBrandCount;
      let Totalinsertedrecords = this.addedBrandCount; let Totalfailedrecords = this.failedBrandCount;
      let Totalupdatedrecords = this.existsBrandCount; let Recordcount = addedCount;
      let Operation = 'Insert'; let Systemuser = ''; let Ipaddress = this.ipAddress; 
      this.mainService.DataDBUpates(userName, Projectname, Dbversion, Datasection, Totalinsertedrecords,
        Totalfailedrecords, Totalupdatedrecords, Recordcount, Updatedescription, Operation, Systemuser,
        Ipaddress, Updatestatus)
        .subscribe(value => {
        });
    /* Db Updates End */
      if (this.codeArrResult.length == 0 && this.brandModelList.length == 0 && this.xmlDataResult.length == 0 && this.brandInfoCecList.length === 0 && this.brandInfoEdidList.length == 0 && this.brandInfoCecEdidList.length == 0) {
        this.loaderVisible = false;
        if (this.UpdateZip == true) {
          $('#zip-update').val('');
          $('#zip-update').prev('label').text('Uploaded Successfully');
        }
        $("input").prop('disabled', false);
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        this.notifier.notify("success", "Files are Uploaded Successfully!!!");
        $('#uploadedModalButton').click();
      }
      if (this.codeArrResult.length > 0) {
        this.codeSets();
      } else {
        this.codeSets();
      }

    }
  }

/** Codeset data submission */
  async codeSets() {
    if (this.codeArrResult.length == 0) {
      this.brandModel();
    }
    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);

    this.progressWidth = 0;
    let Dbname = filterProjects[0]['dbinstance'];
    let ProjectName = this.projectNames[0]['item_text'];
    let embedVersion;
    if (this.embed_version == undefined) {
      embedVersion = this.version_list;
    } else {
      embedVersion = this.embed_version;
    }
    var j = 0;
    var k = 1;
    var checkcodeArrLength = this.codeArrResult.length / 1;
    if (checkcodeArrLength % 1 != 0) {
      checkcodeArrLength = Math.trunc(checkcodeArrLength) + 1;
    }
    for (var i = 0; i < checkcodeArrLength; i++) {
      var JsonCodeArr = this.codeArrResult.slice(j, k);
      j = j + 1;
      k = k + 1;
      try {
        await this.mainService.dataUploadloadCodesets(Dbname, ProjectName, embedVersion, JsonCodeArr)
          .then(Codesetvalue => {
            this.isProgreessVisible = true;
            this.progressWidth = Math.floor((i * 100) / checkcodeArrLength);
            this.progressName = 'Uploading.. Codeset Data';
            if (Codesetvalue.data != '' && Codesetvalue.data != undefined) {
              for (var l = 0; l < Codesetvalue.data.length; l++) {
                if (Codesetvalue.data[l]['searchResult'] == '2') {
                  this.existsCodeCount++;
                }
                if (Codesetvalue.data[l]['searchResult'] == '1') {
                  this.addedCodeCount++;
                }
                if (Codesetvalue.data[l]['searchResult'] == '0') {
                  this.failedCodeCount++;
                }
              }
            }
          });
        this.index2 = i;
      }
      catch (error) {
    }
      
    }
    if (this.index2 + 1 == checkcodeArrLength) {

      this.isProgreessVisible = false;
      this.progressName = '';
     // this.isIconVis2 = true;

      /** Db Updates start **/
      this.dataCodeName = 'Codesets';
      this.isdataUploaded = true;
      this.viewFiles = false;
      this.codeVisible = true;
      this.InsertCodeCount = this.addedCodeCount;
      this.ExistsCodeCount = this.existsCodeCount;
      this.FailedCodeCount = this.failedCodeCount;

      let userName = localStorage.getItem('userName'); let Projectname = this.projectNames[0]['item_text'];
      let Dbversion;
      if (this.embed_version == undefined) {
        Dbversion = this.version_list;
      } else {
        Dbversion = this.embed_version;
      }
      let Datasection = "Codesets"; let recordCount2 = this.existsCodeCount; let Updatedescription = "Uploaded Records";
      let Updatestatus = 1;
      let addedCount = this.addedCodeCount + this.existsCodeCount + this.failedCodeCount;
      let Totalinsertedrecords = this.addedCodeCount; let Totalfailedrecords = this.failedCodeCount;
      let Totalupdatedrecords = this.existsCodeCount; let Recordcount = addedCount;
      let Operation = 'Insert'; let Systemuser = ''; let Ipaddress = this.ipAddress;
      this.mainService.DataDBUpates(userName, Projectname, Dbversion, Datasection, Totalinsertedrecords,
        Totalfailedrecords, Totalupdatedrecords, Recordcount, Updatedescription, Operation, Systemuser,
        Ipaddress, Updatestatus)
        .subscribe(value => {
        });
      /** Db Updates end **/
      if (this.brandModelList.length == 0 && this.xmlDataResult.length == 0 && this.brandInfoCecList.length === 0 && this.brandInfoEdidList.length == 0 && this.brandInfoCecEdidList.length == 0) {
        this.loaderVisible = false;
        if (this.UpdateZip == true) {
          $('#zip-update').val('');
          $('#zip-update').prev('label').text('Uploaded Successfully');
        }
        $("input").prop('disabled', false);
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        this.notifier.notify("success", "Files are Uploaded Successfully!!!");
        $('#uploadedModalButton').click();
      }
      if (this.brandModelList.length > 0) {
        this.brandModel();
      } else {
        this.brandModel();
      }
    }
  }

/** Brand Model Collection data submission */
  async brandModel() {
    if (this.brandModelList.length == 0) {
      this.crossReferenceBrandsModel();
    }
    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);

    this.progressWidth = 0;
    let Dbname = filterProjects[0]['dbinstance'];
    var j = 0;
    var k = 1;
    let checkBrandModelLength = this.brandModelList.length / 1;
    if (checkBrandModelLength % 1 != 0) {
      checkBrandModelLength = Math.trunc(checkBrandModelLength) + 1;
    }
    let ProjectName = this.projectNames[0]['item_text'];
    let embedVersion;
    if (this.embed_version == undefined) {
      embedVersion = this.version_list;
    } else {
      embedVersion = this.embed_version;
    }
    for (var i = 0; i < checkBrandModelLength; i++) {
      var JsonComponentModels = this.brandModelList.slice(j, k);
      j = j + 1;
      k = k + 1;
      try {
        await this.mainService.dataUploadloadComponentModel(Dbname, ProjectName, embedVersion, JsonComponentModels)
          .then(brandvalue => {
            this.isProgreessVisible = true;
            this.progressWidth = Math.floor((i * 100) / checkBrandModelLength);
            this.progressName = 'Uploading.. Brand Model';
            if (brandvalue.data != '' && brandvalue.data != undefined) {
              for (var l = 0; l < brandvalue.data.length; l++) {
                if (brandvalue.data[l]['searchResult'] == '2') {
                  this.existsModelCount++;
                }
                if (brandvalue.data[l]['searchResult'] == '1') {
                  this.addedModelCount++;
                }
                if (brandvalue.data[l]['searchResult'] == '0') {
                  this.failedModelCount++;
                }
              }
            }

          });
        this.index3 = i;

      } catch (error) {
      }
      

    }
    if (this.index3 + 1 == checkBrandModelLength) {

     // this.isIconVis3 = true;
      this.progressName = '';
      this.isProgreessVisible = false;

      /** Db Updates start **/
      this.dataBrandName = 'Brand Model Collection';
      this.isdataUploaded = true;
      this.viewFiles = false;
      this.brandVisible = true;
      this.InsertBrandCount = this.addedModelCount;
      this.ExistsBrandCount = this.existsModelCount;
      this.FailedBrandCount = this.failedModelCount;

      let userName = localStorage.getItem('userName'); let Projectname = this.projectNames[0]['item_text'];
      let Dbversion;
      if (this.embed_version == undefined) {
        Dbversion = this.version_list;
      } else {
        Dbversion = this.embed_version;
      }
      let Datasection = "Brand Model Collection";  let Updatedescription = "Uploaded Records";
      let Updatestatus = 1;
      let addedCount = this.addedModelCount + this.existsModelCount + this.failedModelCount;
      let Totalinsertedrecords = this.addedModelCount; let Totalfailedrecords = this.failedModelCount;
      let Totalupdatedrecords = this.existsModelCount; let Recordcount = addedCount;
      let Operation = 'Insert'; let Systemuser = ''; let Ipaddress = this.ipAddress;
      this.mainService.DataDBUpates(userName, Projectname, Dbversion, Datasection, Totalinsertedrecords,
        Totalfailedrecords, Totalupdatedrecords, Recordcount, Updatedescription, Operation, Systemuser,
        Ipaddress, Updatestatus)
        .subscribe(value => {
        });

    /** Db Updates end **/
      if (this.xmlDataResult.length == 0 && this.brandInfoCecList.length === 0 && this.brandInfoEdidList.length == 0 && this.brandInfoCecEdidList.length == 0) {
        this.loaderVisible = false;
        if (this.UpdateZip == true) {
          $('#zip-update').val('');
          $('#zip-update').prev('label').text('Uploaded Successfully');
        }
        $("input").prop('disabled', false);
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        this.notifier.notify("success", "Files are Uploaded Successfully!!!");
        $('#uploadedModalButton').click();
      }
      if (this.xmlDataResult.length > 0) {
        this.crossReferenceBrandsModel();
      } else {
        this.crossReferenceBrandsModel();
      }
    }
  }

/** cross reference by brands data submission */

  async crossReferenceBrandsModel() {
    if (this.xmlDataResult.length == 0) {
      this.brandInfoCecModel();
    }
    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);

    this.progressWidth = 0;
    let Dbname = filterProjects[0]['dbinstance'];
    let embedVersion;
    if (this.embed_version == undefined) {
      embedVersion = this.version_list;
    } else {
      embedVersion = this.embed_version;
    }
    let ProjectName = this.projectNames[0]['item_text'];
    var j = 0;
    var k = 1;
    var checkxmlDataArrLength = this.xmlDataResult.length / 1;
    if (checkxmlDataArrLength % 1 != 0) {
      checkxmlDataArrLength = Math.trunc(checkxmlDataArrLength) + 1;
    }
    for (var i = 0; i < checkxmlDataArrLength; i++) {
      var JsonXmlArr = this.xmlDataResult.slice(j, k);
      j = j + 1;
      k = k + 1;
      try {
        await this.mainService.dataUploadloadXmlData(Dbname, ProjectName, embedVersion, JsonXmlArr)
          .then(xmlValue => {
            this.isProgreessVisible = true;
            this.progressWidth = Math.floor((i * 100) / checkxmlDataArrLength);
            this.progressName = 'Uploading.. Cross Reference by Brands';
            if (xmlValue.data != '' && xmlValue.data != undefined) {
              for (var l = 0; l < xmlValue.data.length; l++) {
                if (xmlValue.data[l]['searchResult'] == '2') {
                  this.existsXmlCount++;
                }
                if (xmlValue.data[l]['searchResult'] == '1') {
                  this.addedXmlCount++;
                }
                if (xmlValue.data[l]['searchResult'] == '0') {
                  this.failedXmlCount++;
                }
              }
            }


          });
        this.index4 = i;
      } catch (error) {
      }
      
    }
    if (this.index4 + 1 === checkxmlDataArrLength) {
     // this.isIconVis4 = true;
      this.isProgreessVisible = false;
      this.progressName = '';

      /** Db Updates start **/
      this.dataCrossName = 'Cross Reference By Brands';
      this.isdataUploaded = true;
      this.viewFiles = false;
      this.crossDataVisible = true;
      this.InsertCrossCount = this.addedXmlCount;
      this.ExistsCrossCount = this.existsXmlCount;
      this.FailedCrossCount = this.failedXmlCount;

      let userName = localStorage.getItem('userName'); let Projectname = this.projectNames[0]['item_text'];
      let Dbversion;
      if (this.embed_version == undefined) {
        Dbversion = this.version_list;
      } else {
        Dbversion = this.embed_version;
      }
      let Datasection = "Cross Reference By Brands"; let Updatedescription = "Uploaded Records";
      let Updatestatus = 1;
      let addedCount = this.addedXmlCount + this.existsXmlCount + this.failedXmlCount;
      let Totalinsertedrecords = this.addedXmlCount; let Totalfailedrecords = this.failedXmlCount;
      let Totalupdatedrecords = this.existsXmlCount; let Recordcount = addedCount;
      let Operation = 'Insert'; let Systemuser = ''; let Ipaddress = this.ipAddress;
      this.mainService.DataDBUpates(userName, Projectname, Dbversion, Datasection, Totalinsertedrecords,
        Totalfailedrecords, Totalupdatedrecords, Recordcount, Updatedescription, Operation, Systemuser,
        Ipaddress, Updatestatus)
        .subscribe(value => {
        });
      /** Db Updates end **/
      if (this.brandInfoCecList.length > 0) {
        this.brandInfoCecModel();
      }
      if (this.brandInfoCecList.length === 0 && this.brandInfoEdidList.length > 0) {
        this.brandInfoEdidModel();
      }
      if (this.brandInfoCecEdidList.length > 0 && this.brandInfoCecList.length == 0 && this.brandInfoEdidList.length == 0) {
        this.brandInfoCecEdidModel();
      }
      if (this.brandInfoCecList.length === 0 && this.brandInfoEdidList.length == 0 && this.brandInfoCecEdidList.length == 0) {
        this.loaderVisible = false;
        if (this.UpdateZip == true) {
          $('#zip-update').val('');
          $('#zip-update').prev('label').text('Uploaded Successfully');
        }
        $("input").prop('disabled', false);
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        this.notifier.notify("success", "Files are Uploaded Successfully!!!");
        $('#uploadedModalButton').click();
      }
    }
  }

/** Brand Info Cec data submission */
  async brandInfoCecModel() {
    if (this.brandInfoCecList.length == 0) {
      this.brandInfoEdidModel();
    }
    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);

    this.progressWidth = 0;
    let Dbname = filterProjects[0]['dbinstance'];
    var j = 0;
    var k = 1;
    var checkBrandCecLength = this.brandInfoCecList.length / 1;
    if (checkBrandCecLength % 1 != 0) {
      checkBrandCecLength = Math.trunc(checkBrandCecLength) + 1;
    }
    for (var i = 0; i < checkBrandCecLength; i++) {
      var JsonBICEC = this.brandInfoCecList.slice(j, k);
      j = j + 1;
      k = k + 1;
      try {
        await this.mainService.dataUploadloadBrandInfoCec(Dbname, JsonBICEC)
          .then(brandInfoCecvalue => {
            this.isProgreessVisible = true;
            this.progressWidth = Math.floor((i * 100) / checkBrandCecLength);
            this.progressName = 'Uploading.. Brand Info CEC Data';
            if (brandInfoCecvalue.data != '' && brandInfoCecvalue.data != undefined) {
              for (var l = 0; l < brandInfoCecvalue.data.length; l++) {
                if (brandInfoCecvalue.data[l]['searchResult'] == '2') {
                  this.existsCecCount++;
                }
                if (brandInfoCecvalue.data[l]['searchResult'] == '1') {
                  this.addedCecCount++;
                }
                if (brandInfoCecvalue.data[l]['searchResult'] == '0') {
                  this.failedCecCount++;
                }
              }
            }

          });
        this.index5 = i;
      } catch (error) {
      }
      
    }
    if (this.index5 + 1 === checkBrandCecLength) {

      // this.isIconVis5 = true;
       this.isProgreessVisible = false;
      this.progressName = '';
      /** Db Updates start **/
      this.dataCecName = 'Brand Info CEC';
      this.isdataUploaded = true;
      this.viewFiles = false;
      this.cecDataVisible = true;
      this.InsertCecCount = this.addedCecCount;
      this.ExistsCecCount = this.existsCecCount;
      this.FailedCecCount = this.failedCecCount;

      let userName = localStorage.getItem('userName'); let Projectname = this.projectNames[0]['item_text'];
      let Dbversion;
      if (this.embed_version == undefined) {
        Dbversion = this.version_list;
      } else {
        Dbversion = this.embed_version;
      }
      let Datasection = "Brand Info Cec"; let Updatedescription = "Uploaded Records";
      let Updatestatus = 1;
      let addedCount = this.addedCecCount + this.existsCecCount + this.failedCecCount;
      let Totalinsertedrecords = this.addedCecCount; let Totalfailedrecords = this.failedCecCount;
      let Totalupdatedrecords = this.existsCecCount; let Recordcount = addedCount;
      let Operation = 'Insert'; let Systemuser = ''; let Ipaddress = this.ipAddress;
      this.mainService.DataDBUpates(userName, Projectname, Dbversion, Datasection, Totalinsertedrecords,
        Totalfailedrecords, Totalupdatedrecords, Recordcount, Updatedescription, Operation, Systemuser,
        Ipaddress, Updatestatus)
        .subscribe(value => {
        });
     
      /** Db Updates end **/
      if (this.brandInfoEdidList.length > 0) {
        this.brandInfoEdidModel();
      }
      if (this.brandInfoCecEdidList.length > 0 && this.brandInfoEdidList.length == 0) {
        this.brandInfoCecEdidModel();
      }
      if (this.brandInfoEdidList.length == 0 && this.brandInfoCecEdidList.length == 0) {
        this.loaderVisible = false;
        if (this.UpdateZip == true) {
          $('#zip-update').val('');
          $('#zip-update').prev('label').text('Uploaded Successfully');
        }
        $("input").prop('disabled', false);
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        this.notifier.notify("success", "Files are Uploaded Successfully!!!");
        $('#uploadedModalButton').click();
      }
    }

  }

/** Brand Info Edid data submission */
  async brandInfoEdidModel() {
    if (this.brandInfoEdidList.length == 0) {
      this.brandInfoCecEdidModel();
    }
    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);
    this.progressWidth = 0;
    let Dbname = filterProjects[0]['dbinstance'];
    var j = 0;
    var k = 1;
    var checkBrandEdidLength = this.brandInfoEdidList.length / 1;
    if (checkBrandEdidLength % 1 != 0) {
      checkBrandEdidLength = Math.trunc(checkBrandEdidLength) + 1;
    }
    for (var i = 0; i < checkBrandEdidLength; i++) {
      var JsonBIEDID = this.brandInfoEdidList.slice(j, k);
      j = j + 1;
      k = k + 1;
      try {
        await this.mainService.dataUploadloadBrandInfoEdid(Dbname, JsonBIEDID)
          .then(brandInfoEdidvalue => {
            this.isProgreessVisible = true;
            this.progressWidth = Math.floor((i * 100) / checkBrandEdidLength);
            this.progressName = 'Uploading.. Brand Info EDID Data';
            if (brandInfoEdidvalue.data != '' && brandInfoEdidvalue.data != undefined) {
              for (var l = 0; l < brandInfoEdidvalue.data.length; l++) {
                if (brandInfoEdidvalue.data[l]['searchResult'] == '2') {
                  this.existsEdidCount++;
                }
                if (brandInfoEdidvalue.data[l]['searchResult'] == '1') {
                  this.addedEdidCount++;
                }
                if (brandInfoEdidvalue.data[l]['searchResult'] == '0') {
                  this.failedEdidCount++;
                }
              }
            }


          });
        this.index6 = i;
      } catch (error) {
      }
    }
    if (this.index6 + 1 === checkBrandEdidLength) {

    //  this.isIconVis6 = true;
      this.isProgreessVisible = false;

      /** Db Updates start **/
      this.dataEdidName = 'Brand Info EDID';
      this.isdataUploaded = true;
      this.viewFiles = false;
      this.edidDataVisible = true;
      this.InsertEdidCount = this.addedEdidCount;
      this.ExistsEdidCount = this.existsEdidCount;
      this.FailedEdidCount = this.failedEdidCount;

      let userName = localStorage.getItem('userName'); let Projectname = this.projectNames[0]['item_text'];
      let Dbversion;
      if (this.embed_version == undefined) {
        Dbversion = this.version_list;
      } else {
        Dbversion = this.embed_version;
      }
      let Datasection = "Brand Info Edid"; let Updatedescription = "Uploaded Records";
      let Updatestatus = 1;
      let addedCount = this.addedEdidCount + this.existsEdidCount + this.failedEdidCount;
      let Totalinsertedrecords = this.addedEdidCount; let Totalfailedrecords = this.failedEdidCount;
      let Totalupdatedrecords = this.existsEdidCount; let Recordcount = addedCount;
      let Operation = 'Insert'; let Systemuser = ''; let Ipaddress = this.ipAddress;
      this.mainService.DataDBUpates(userName, Projectname, Dbversion, Datasection, Totalinsertedrecords,
        Totalfailedrecords, Totalupdatedrecords, Recordcount, Updatedescription, Operation, Systemuser,
        Ipaddress, Updatestatus)
        .subscribe(value => {
        });
    /** Db Updates end **/

      if (this.brandInfoCecEdidList.length > 0) {
        this.brandInfoCecEdidModel();
      }

      if (this.brandInfoCecEdidList.length == 0) {
        this.loaderVisible = false;
        if (this.UpdateZip == true) {
          $('#zip-update').val('');
          $('#zip-update').prev('label').text('Uploaded Successfully');
        }
        $("input").prop('disabled', false);
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        this.notifier.notify("success", "Files are Uploaded Successfully!!!");
        $('#uploadedModalButton').click();
      }
      
    }
  }

/** Cec-Edid data submission */

  async brandInfoCecEdidModel() {

    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);
    let Projectname = this.projectNames[0]['item_text'];
    let Dbversion;
    if (this.embed_version == undefined) {
      Dbversion = this.version_list;
    } else {
      Dbversion = this.embed_version;
    }
    this.progressWidth = 0;
    let Dbname = filterProjects[0]['dbinstance'];
    var j = 0;
    var k = 1;
    var checkCecEdidArrLength = this.brandInfoCecEdidList.length / 1;
    if (checkCecEdidArrLength % 1 != 0) {
      checkCecEdidArrLength = Math.trunc(checkCecEdidArrLength) + 1;
    }
    for (var i = 0; i < checkCecEdidArrLength; i++) {
      var JsonCecEdidArr = this.brandInfoCecEdidList.slice(j, k);
      j = j + 1;
      k = k + 1;
      try {
        await this.mainService.dataUploadloadCecEdidData(Dbname, Projectname, Dbversion, JsonCecEdidArr)
          .then(cecEdidValue => {
            this.isProgreessVisible = true;
            this.progressWidth = Math.floor((i * 100) / checkCecEdidArrLength);
            this.progressName = 'Uploading.. CEC-EDID Data';
            if (cecEdidValue.data != '' && cecEdidValue.data != undefined) {
              for (var l = 0; l < cecEdidValue.data.length; l++) {
                if (cecEdidValue.data[l]['searchResult'] == '2') {
                  this.existsCecEdidCount++;
                }
                if (cecEdidValue.data[l]['searchResult'] == '1') {
                  this.addedCecEdidCount++;
                }
                if (cecEdidValue.data[l]['searchResult'] == '0') {
                  this.failedCecEdidCount++;
                }
              }
            }


          });
        this.index7 = i;
      } catch (error) {
      }
      
    }
    if (this.index7 + 1 === checkCecEdidArrLength) {

     // this.isIconVis7 = true;
      this.isProgreessVisible = false;
      this.progressName = '';

      /** Db Updates start **/
      this.dataCecEdidName = 'CEC-EDID';
      this.isdataUploaded = true;
      this.viewFiles = false;
      this.cecEdidDataVisible = true;
      this.InsertCecEdidCount = this.addedCecEdidCount;
      this.ExistsCecEdidCount = this.existsCecEdidCount;
      this.FailedCecEdidCount = this.failedCecEdidCount + this.edidFailed;

      let userName = localStorage.getItem('userName'); let Projectname = this.projectNames[0]['item_text'];
      let Dbversion;
      if (this.embed_version == undefined) {
        Dbversion = this.version_list;
      } else {
        Dbversion = this.embed_version;
      }
      let Datasection = "Cec-Edid"; let Updatedescription = "Uploaded Records";
      let Updatestatus = 1;
      let addedCount = this.addedCecEdidCount + this.existsCecEdidCount + this.FailedCecEdidCount;
      let Totalinsertedrecords = this.addedCecEdidCount; let Totalfailedrecords = this.FailedCecEdidCount;
      let Totalupdatedrecords = this.existsCecEdidCount; let Recordcount = addedCount;
      let Operation = 'Insert'; let Systemuser = ''; let Ipaddress = this.ipAddress;
      this.mainService.DataDBUpates(userName, Projectname, Dbversion, Datasection, Totalinsertedrecords,
        Totalfailedrecords, Totalupdatedrecords, Recordcount, Updatedescription, Operation, Systemuser,
        Ipaddress, Updatestatus)
        .subscribe(value => {
        });
    /** Db Updates end **/
      this.loaderVisible = false;
      $('#zip-upload').val('');
      $('#zip-upload').prev('label').text('Uploaded Successfully');
      if (this.UpdateZip == true) {
        $('#zip-update').val('');
        $('#zip-update').prev('label').text('Uploaded Successfully');
      }
      $("input").prop('disabled', false);
      $("select").prop("disabled", false);
      $("a").css('pointer-events', 'auto');
      this.notifier.notify("success", "Files are Uploaded Successfully!!!");
      $('#uploadedModalButton').click();
    }

  }

 deleteZip() {

 }

  updateZip() {
    $("#updateModal .close").click();
  }

/** Update zip file name */
  UpdatezipFiles(e) {
    $('input[type=checkbox]').prop('checked', false);
    
    let file = (<HTMLInputElement>document.getElementById('zip-update')).files[0];
    let fileName = (<HTMLInputElement>document.getElementById('zip-update')).files[0].name;
    $('#zip-update').prev('label').text(fileName);

    if (!(/\.(zip)$/i).test(fileName)) {
      this.notifier.notify('warning', 'Please Select Zip file to Upload');
    } else {
      $('#selectModalButton').click();
    }

  }

/** Update Zip file Operation */
  onselecttoUpdateFilesSubmit() {

    $("#UpdateSelectedModal .close").click();

    if ($('#cec_edid1').prop('checked') == true || $('#component_data1').prop('checked') == true ||
      $('#cross_ref_value1').prop('checked') == true || $('#codeset_data1').prop('checked') == true ||
      $('#master_brand_data1').prop('checked') == true || $('#cec_data1').prop('checked') == true ||
      $('#edid_data1').prop('checked') == true || $('#zip_data1').prop('checked') == true ||
      $('#bin_data1').prop('checked') == true) {
      let file = (<HTMLInputElement>document.getElementById('zip-update')).files[0];
      let fileName = (<HTMLInputElement>document.getElementById('zip-update')).files[0].name;

      if (!(/\.(zip)$/i).test(fileName)) {
        this.notifier.notify('warning', 'Please Select Zip file to Upload');
      } else {

        try {
          this.onUpdateFilesSubmit();
          $('#zip-update').prev('label').text(fileName);
          $("input").prop("disabled", true);
          $("select").prop("disabled", true);
          $("a").css('pointer-events', 'none');
          this.fileSelected = fileName;
          this.loaderVisible = true;
          let filename = 'zipfile';
          let formData = new FormData();
          formData.append(filename, file);
          this.http.post<any>(`${environment.apiUrl}/api/LoadData/UploadZipFile`, formData
          ).subscribe((val) => {
            if (val.data == true) {
              this.progressName = "Uploaded Successfully!";
              this.loaderVisible = false;
              this.getListOfUpdatedZipFiles();
              let filterProject: any = this.finalArray.filter(u =>
                u.projectname == this.projectNames[0]['item_text']);
              for (var m = 0; m < filterProject.length; m++) {
                this.versionArr.push(filterProject[m]['embeddedDbVersion']);
              }
              var uniqueVersions = this.versionArr.filter((v, i, a) => a.indexOf(v) === i);
              this.versions = uniqueVersions;
              this.latestVersions();
              if (this.versions.length >= 1) {
                let filterProjects: any = this.finalArray.filter(u =>
                  u.projectname == this.projectNames[0]['item_text']);
                let Dbname = filterProjects[0]['dbinstance'];
                let Projectname = this.projectNames[0]['item_text'];
                this.mainService.hdmiData(Dbname, Projectname)
                  .subscribe(value => {

                  });
              }
            }
          });
        } catch (error) {
          this.notifier.notify('error', error);
          $('#zip-update').prev('label').text('');
          $('#zip-update').val('');
        }
      }
    } else {
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }
     
  } 
/** List of zip files on main zip  */
  getListOfUpdatedZipFiles() {
    try {
      this.loaderVisible = true;
      this.mainService.getListofZipFiles().subscribe(value => {

        if (value.data.length != 0) {

          for (var i = 0; i < value.data.length; i++) {
            var url = value.data[i];
            var parts = url.split("/");

            if (parts[parts.length - 1] == this.fileSelected) {
              var matchedUrl = url;
              this.loaderVisible = false;
              this.fileUpdatedUnzipContent(matchedUrl)
            }
          }
        }
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }
  }

/** Unzipping list of zip file on main Zip */

  fileUpdatedUnzipContent(urlValue) {
    try {
      this.loaderVisible = true;
      this.mainService.fileUnzipData(urlValue).subscribe(value => {
        this.progressName = 'Unzipped Successfully';
        let zipData = $('#zip_data1').prop('checked');
        if (value.data.length > 0) {
          for (var i = 0; i < value.data.length; i++) {
            var url = value.data[i];
            var parts = url.split("/");
            if (zipData == true) {
              let getZipFile = parts[parts.length - 1];
              var index = getZipFile.lastIndexOf("_");
              var result = getZipFile.substr(index + 1);
              if (result == 'download.zip') {
                this.getMemoryZipFile(url);
              }
            }

            if (parts[parts.length - 1] == this.fileSelected) {
              this.readUpdatedZipFileContent(url);
            }
          }
        }
      });
    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }
  }

/** Reading Unzipped File names and validation */

  readUpdatedZipFileContent(unzipUrl) {
    try {
      this.loaderVisible = true;
      this.progressName = 'Extracting Files..!';
      this.mainService.fileUnzipData(unzipUrl).subscribe(value => {
        this.progressName = 'Unzipped Files Succesfully!';
        let cecEdidData = $('#cec_edid1').prop('checked');
        let compData = $('#component_data1').prop('checked');
        let crosRefData = $('#cross_ref_value1').prop('checked');
        let codesetData = $('#codeset_data1').prop('checked');
        let masterData = $('#master_brand_data1').prop('checked');
        let cecData = $('#cec_data1').prop('checked');
        let edidData = $('#edid_data1').prop('checked');
        let binData = $('#bin_data1').prop('checked');
        let zipData = $('#zip_data1').prop('checked');

        var l = 1;

        for (var i = 0; i < value.data.length; i++) {
          var url = value.data[i];
          var parts = url.split("/");

          if (binData == true) {
            if (parts[parts.length - 1] == 'wdb.bin') {
              this.binUploadData(url);
            }
          }

        }
        if (cecEdidData == false && compData == false && crosRefData == false && codesetData == false &&
          masterData == false && cecData == false && edidData == false) {
          this.viewFiles = false;
        } else {
          this.viewFiles = true;
        }
        if (masterData == true) {
          this.Listitems.push('MasterbrandList.csv');
        }
        if (codesetData == true) {
          this.Listitems.push('Codesets');
        }
        if (crosRefData == true) {
          this.Listitems.push('CrossReferenceByBrands.xml');
        }
        if (compData == true) {
          this.Listitems.push('ComponentData.csv');
        }
        if (cecData == true) {
          this.Listitems.push('BrandInfo_CEC.csv');
        }
        if (edidData == true) {
          this.Listitems.push('BrandInfo_EDID.csv');
        }
        if (cecEdidData == true) {
          this.Listitems.push('CEC_EDID.csv');
        }

        for (var j = 0; j < value.data.length; j++) {
          var url = value.data[j];
          var parts = url.split("/");
          var uniqueItems = this.Listitems.filter((v, i, a) => a.indexOf(v) === i);
          this.Listitems = uniqueItems;
          if (masterData == true) {
            if (parts[parts.length - 1] == 'MasterbrandList.csv') {
              this.masterBrandData(url);
            }
          }
          if (crosRefData == true) {
            if (parts[parts.length - 1] == 'CrossReferenceByBrands.xml') {
              this.crossReferenceBrands(url);
            }
          }
          if (compData == true) {
            if (parts[parts.length - 1] == 'ComponentData.csv') {
              this.componentData(url);
            }
          }
          if (cecData == true) {
            if (parts[parts.length - 1] == 'BrandInfo_CEC.csv') {
              var brandCec = url;
              this.brandInfoCecData(brandCec);
            }
          }
          if (edidData == true) {
            if (parts[parts.length - 1] == 'BrandInfo_EDID.csv') {
              this.brandInfoEdidData(url);
            }
          }
          if (cecEdidData == true) {
            if (parts[parts.length - 1] == 'CEC_EDID.csv') {
              this.cecEdidData(url);
            }
          }
        }
        if (codesetData == true) {
          let pushData = [];
          for (var k = 0; k < value.data.length; k++) {
            pushData.push(value.data[k]);
          }

          this.codesetUrl = pushData;
          if (this.codesetUrl.length > 0) {
            this.callCodesets();
          }
        }
      });

    } catch (error) {
      this.notifier.notify('error', error);
      $('#zip-update').prev('label').text('');
      $('#zip-update').val('');
    }

  }

/** validation to check the models checked in update zip */
  validateUpdatedHeaders() {
    let cecEdidData = $('#cec_edid1').prop('checked');
    let compData = $('#component_data1').prop('checked');
    let crosRefData = $('#cross_ref_value1').prop('checked');
    let codesetData = $('#codeset_data1').prop('checked');
    let masterData = $('#master_brand_data1').prop('checked');
    let cecData = $('#cec_data1').prop('checked');
    let edidData = $('#edid_data1').prop('checked');

    if (cecEdidData == true && compData == false && crosRefData == false && codesetData == true && masterData == true &&
      cecData == false && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == true && crosRefData == true && codesetData == true && masterData == true &&
      cecData == false && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 &&
          this.xmlDataResult.length != 0 && this.brandModelList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == true && crosRefData == true && codesetData == true && masterData == false &&
      cecData == false && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 && this.xmlDataResult.length != 0
          && this.brandModelList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == true && crosRefData == true && codesetData == true && masterData == false &&
      cecData == true && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 && this.xmlDataResult.length != 0
          && this.brandModelList.length != 0 && this.brandInfoCecList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == true && crosRefData == true && codesetData == true && masterData == false &&
      cecData == false && edidData == true) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 && this.xmlDataResult.length != 0
          && this.brandModelList.length != 0 && this.brandInfoEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == true && crosRefData == true && codesetData == true && masterData == false &&
      cecData == true && edidData == true) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 && this.xmlDataResult.length != 0
          && this.brandModelList.length != 0 && this.brandInfoCecList.length != 0 && this.brandInfoEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == true && crosRefData == true && codesetData == true && masterData == true &&
      cecData == true && edidData == true) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0  && this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 && this.xmlDataResult.length != 0
          && this.brandModelList.length != 0 && this.brandInfoCecList.length != 0 && this.brandInfoEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == true && crosRefData == true && codesetData == true && masterData == true &&
      cecData == false && edidData == true) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 && this.xmlDataResult.length != 0
          && this.brandModelList.length != 0 && this.brandInfoEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }


    if (cecEdidData == true && compData == true && crosRefData == true && codesetData == true && masterData == true &&
      cecData == true && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 && this.xmlDataResult.length != 0
          && this.brandModelList.length != 0 && this.brandInfoCecList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == false && crosRefData == false && codesetData == true && masterData == true &&
      cecData == true && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 &&
          this.brandInfoCecList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == false && crosRefData == false && codesetData == true && masterData == true &&
      cecData == false && edidData == true) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 &&
          this.brandInfoEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == false && crosRefData == false && codesetData == true && masterData == true &&
      cecData == true && edidData == true) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.brandInfoCecEdidList.length != 0 &&
          this.brandInfoCecList.length != 0 && this.brandInfoEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == false && compData == false && crosRefData == true && codesetData == true && masterData == true &&
      cecData == false && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.xmlDataResult.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == false && compData == true && crosRefData == true && codesetData == true && masterData == true &&
      cecData == false && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.xmlDataResult.length != 0 &&
          this.brandModelList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == false && compData == false && crosRefData == true && codesetData == true && masterData == true &&
      cecData == false && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.xmlDataResult.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == false && compData == false && crosRefData == false && codesetData == false && masterData == true &&
      cecData == true && edidData == false) {
      if (this.brandInfoCecList.length != 0 && this.masterBrandList.length != 0) {
        this.masterBrand();
      }
    }

    if (cecEdidData == false && compData == false && crosRefData == false && codesetData == false && masterData == true &&
      cecData == false && edidData == true) {
      if (this.brandInfoEdidList.length != 0 && this.masterBrandList.length != 0) {
        this.masterBrand();
      }
    }

    if (cecEdidData == false && compData == false && crosRefData == false && codesetData == false && masterData == true &&
      cecData == true && edidData == true) {
      if (this.brandInfoCecList.length != 0 && this.brandInfoEdidList.length != 0 && this.masterBrandList.length != 0) {
        this.masterBrand();
      }
    }

    if (cecEdidData == false && compData == false && crosRefData == false && codesetData == true && masterData == true &&
      cecData == false && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.codeArrResult.length != 0 && this.masterBrandList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == false && compData == false && crosRefData == false && codesetData == false && masterData == true &&
      cecData == false && edidData == false) {
      if (this.masterBrandList.length != 0) {
        this.masterBrand();
      }
    }

    if (cecEdidData == true && compData == false && crosRefData == true && codesetData == true && masterData == true &&
      cecData == true && edidData == true) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.xmlDataResult.length != 0 && 
          this.brandInfoCecEdidList.length != 0 && this.brandInfoCecList.length != 0 && this.brandInfoEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == false && crosRefData == true && codesetData == true && masterData == true &&
      cecData == false && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.xmlDataResult.length != 0 &&
          this.brandInfoCecEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }

    if (cecEdidData == true && compData == false && crosRefData == true && codesetData == true && masterData == true &&
      cecData == true && edidData == false) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.xmlDataResult.length != 0 &&
          this.brandInfoCecEdidList.length != 0 && this.brandInfoCecList.length != 0) {
          this.masterBrand();
        }
      }
    }
    if (cecEdidData == true && compData == false && crosRefData == true && codesetData == true && masterData == true &&
      cecData == false && edidData == true) {
      if (this.codeArrResult.length == this.codeSetFileLength) {
        if (this.masterBrandList.length != 0 && this.codeArrResult.length != 0 && this.xmlDataResult.length != 0 &&
          this.brandInfoCecEdidList.length != 0  && this.brandInfoEdidList.length != 0) {
          this.masterBrand();
        }
      }
    }  

  }

  deviceAuth() {
    var deviceVal = $('#device_auth').prop('checked');
    var checkSession = $('#session_data').prop('checked');

    if (deviceVal == true && checkSession == false) {
      $("#session_data").prop('checked', true);
      $("#session_data").prop('disabled', true);
    } else {
      $("#session_data").prop('disabled', false);
    }
    
  }

/** Delete data before submission of selected model checklist */
 async onUpdateFilesSubmit() {
    let filterProjects: any = this.finalArray.filter(u =>
      u.projectname == this.projectNames[0]['item_text']);

    let Dbname = filterProjects[0]['dbinstance'];
    let Projectname = this.projectNames[0]['item_text'];
   let Embeddedversion = this.version_list;
   var arr = [];
   let cecEdidValue1; let cecEdidValue2; let componentDataValue;
   let crossRefDataValue; 

   if ($('#cec_edid').prop('checked') == true) {
     cecEdidValue1 = 4;
     arr.push(cecEdidValue1);
     cecEdidValue2 = 5;
     arr.push(cecEdidValue2);
   } else {
     var cecEdidItem1 = 4;
     arr = jQuery.grep(arr, function (value) {
       return value != cecEdidItem1;
     });
     var cecEdidItem2 = 5;
     arr = jQuery.grep(arr, function (value) {
       return value != cecEdidItem2;
     });
   }

   if ($('#component_data').prop('checked') == true) {
     let checkCecEdid = $('#cec_edid').prop('checked');
     if (checkCecEdid == false) {
       let insertArr = 4;
       arr.push(insertArr);
       let insertArr2 = 5;
       arr.push(insertArr2);
     }
     componentDataValue = 6;
     arr.push(componentDataValue);
   } else {
     var componentDataItem = 6;
     arr = jQuery.grep(arr, function (value) {
       return value != componentDataItem;
     });
   }

   if ($('#cross_ref_value').prop('checked') == true) {
     crossRefDataValue = 7;
     arr.push(crossRefDataValue);
   } else {
     var crossRefDataItem = 7;
     arr = jQuery.grep(arr, function (value) {
       return value != crossRefDataItem;
     });
   }

   if ($('#codeset_data').prop('checked') == true) {
     let checkCecEdid = $('#cec_edid').prop('checked');
     let checkCompData = $('#component_data').prop('checked');
     let checkCrossRefData = $('#cross_ref_value').prop('checked');
     if (checkCecEdid == false) {
       let insertCecEdidArr1 = 4;
       arr.push(insertCecEdidArr1);
       let insertCecEdidArr2 = 5;
       arr.push(insertCecEdidArr2);
     }
     if (checkCompData == false) {
       let insertcompData = 6;
       arr.push(insertcompData);
     }
     if (checkCrossRefData == false) {
       let insertcrosRefData = 7;
       arr.push(insertcrosRefData);
     }
     let codesetValue = 8;
     arr.push(codesetValue);
   } else {
     var codesetItem = 8;
     arr = jQuery.grep(arr, function (value) {
       return value != codesetItem;
     });
   }
   if (arr.length != 0) {
     for (var i = 0; i < arr.length; i++) {
       let Contenttype = arr[i];
       if (Contenttype == 4 || Contenttype == 5) {
         this.deletedprogressName = 'Deleting CEC-EDID Data...';
       } if (Contenttype == 6) {
         this.deletedprogressName = 'Deleting Component Data...';
       } if (Contenttype == 7) {
         this.deletedprogressName = 'Deleting Cross Reference By Brands...';
       } if (Contenttype == 8) {
         this.deletedprogressName = 'Deleting Codesets Data...';
       } if (Contenttype == 9) {
         this.deletedprogressName = 'Deleting Search Logs...';
       } if (Contenttype == 10) {
         this.deletedprogressName = 'Deleting Download Tracker...';
       } if (Contenttype == 11) {
         this.deletedprogressName = 'Deleting Zip...';
       } if (Contenttype == 12) {
         this.deletedprogressName = 'Deleting Bin...';
       } if (Contenttype == 13) {
         this.deletedprogressName = 'Deleting Session Token...';
       } if (Contenttype == 14) {
         this.deletedprogressName = 'Deleting Device Authentication...';
       }

       await this.mainService.deleteZipFile(Dbname, Projectname, Embeddedversion, Contenttype)
         .then(value => {
           if (value.data.length != 0) {
             this.progressName = value.data[0]['description'];
             var checkSearch = arr.includes(9);
             var checkDownloads = arr.includes(10);
             var checkZip = arr.includes(11);
             var checkBin = arr.includes(12);
             var checkSession = arr.includes(13);
             var checkDevice = arr.includes(14);

             let userName = localStorage.getItem('userName'); let Projectname = this.projectNames[0]['item_text'];
             let Dbversion;
             if (this.embed_version == undefined) {
               Dbversion = this.version_list;
             } else {
               Dbversion = this.embed_version;
             }
             let Datasection = 'Delete'; let Totalinsertedrecords = 0; let Totalfailedrecords = 0;
             let Totalupdatedrecords = 0; let Recordcount = "0"; let Updatedescription = this.progressName;
             let Operation = 'Delete'; let Systemuser = ''; let Ipaddress = this.ipAddress; let Updatestatus = 1;
             this.mainService.DataDBUpates(userName, Projectname, Dbversion, Datasection, Totalinsertedrecords,
               Totalfailedrecords, Totalupdatedrecords, Recordcount, Updatedescription, Operation, Systemuser,
               Ipaddress, Updatestatus)
               .subscribe(value => {
               });
             if (checkSearch == true) {
               this.deletedItems.push('Search Log');
             }
             if (checkDownloads == true) {
               this.deletedItems.push('Download Tracker');
             }
             if (checkSession == true) {
               this.deletedItems.push('Sessions');
             }
             if (checkDevice == true) {
               this.deletedItems.push('Device Authentication');
             }
             if (checkZip == true) {
               this.deletedItems.push('Zip File');
             }
             if (checkBin == true) {
               this.deletedItems.push('Bin File');
             }
             if (Contenttype == 4) {
               this.deletedprogressName = 'Deleted CEC-EDID Data Successfully...';
               $('#1').html('Deleted');
             } if (Contenttype == 5) {
               this.deletedprogressName = 'Deleted CEC-EDID Data Successfully...';
               $('#1').html('Deleted');
             } if (Contenttype == 6) {
               this.deletedprogressName = 'Deleted Component Data Successfully...';
               $('#2').html('Deleted');
             } if (Contenttype == 7) {
               this.deletedprogressName = 'Deleted Cross Reference By Brands Successfully...';
               $('#3').html('Deleted');
             } if (Contenttype == 8) {
               this.deletedprogressName = 'Deleting Codesets Data...';
               $('#4').html('Deleted');
             } if (Contenttype == 9) {
               this.deletedprogressName = 'Deleting Search Logs...';
               $('#5').html('Deleted');
             } if (Contenttype == 10) {
               this.deletedprogressName = 'Deleting Download Tracker...';
               $('#6').html('Deleted');
             } if (Contenttype == 11) {
               this.deletedprogressName = 'Deleting Zip...';
               $('#7').html('Deleted');
             } if (Contenttype == 12) {
               this.deletedprogressName = 'Deleting Bin...';
               $('#8').html('Deleted');
             } if (Contenttype == 13) {
               this.deletedprogressName = 'Deleting Session Token...';
               $('#9').html('Deleted');
             } if (Contenttype == 14) {
               this.deletedprogressName = 'Deleting Device Authentication...';
               $('#10').html('Deleted');
             }
             
           } else {
             this.notifier.notify('warning', value.data[0]['description']);
             this.progressName = value.data[0]['description'];
           }


         });
       this.indexDelete = i;
       if (this.indexDelete === arr.length) {
         this.progressName = 'File Contents Deleted Successfully';
         $('.highlight-red').css('color', 'blue');
         this.VersionAvailability = false;
         this.zipUploadDiv = false;
         this.UpdateZip = true;
       }
     } 
   }
  }

  uploadedZip() {
    $("#uploadedModal .close").click();
    location.reload();
  }

  onUpdateZipSubmit() {

  }

  close() {
    this.router.navigate(['/data-configuration-list']);
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }
  prev() {
    this.router.navigate(['/clients'])
      .then(() => {
       location.reload();
      });
  }
}
