import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main-service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UUID } from 'angular2-uuid';
import { Logintoken } from '../model/logintoken';
import { User } from '../model/user';

@Component({
  selector: 'app-api-db-test',
  templateUrl: './api-db-test.component.html',
  styleUrls: ['./api-db-test.component.css']
})
export class ApiDbTestComponent implements OnInit {

  apiModelsearchForm: FormGroup; apiloginForm: FormGroup;
  apiregisterForm: FormGroup; apiDownloadBinForm: FormGroup;
  apiDownloadZipForm: FormGroup; apiAutosearchForm: FormGroup;
  apiDeltasearchForm: FormGroup; apiFeedbacksearchForm: FormGroup;
  apiCurrentDbForm: FormGroup; apiLatestDbForm: FormGroup;
  apiGenericLogForm: FormGroup;
  apiGenericsubmitted: Boolean = false;
  apiDownloadStatsForm: FormGroup; downStatsubmitted: Boolean = false;
  submitted: Boolean = false; logsubmitted: Boolean = false;
  regsubmitted: Boolean = false; binsubmitted: Boolean = false;
  zipsubmitted: Boolean = false; autosubmitted: Boolean = false;
  deltasubmitted: Boolean = false; fbsubmitted: Boolean = false;
  currentdbsubmitted: Boolean = false; latestdbsubmitted: Boolean = false;
  isDownloadStats: Boolean = false;
  projectNames: any;projects: Array<any> = [];selectedItems: Array<any> = [];
  finalArray = []; limitSelection = false;
  dropdownSettings: any = {}; ShowFilter = false;
  api_list: any = null; apis = [];
  ApiForm: any; device_list: any = null;
  device_id: any; sign_key: any; country_code: any;
  devices = []; session_data: any; osd_data: any;
  vendor_id: any; edid_data: any;
  isRegister: Boolean = false; isLogin: Boolean = false;
  isDownloadZip: Boolean = false; isDownloadBin: Boolean = false;
  isAutoSearch: Boolean = false;
  isModelSearch: Boolean = false; dbVersion = [];
  versionArr = []; db_version: any = null; urlData: any;
  tabslist = []; guidData: any; checksumData: any;
  isTabDataVisible: Boolean = false;
  zip_datatype: any; data_type: any; guid_data: any;
  isRegisterTab: Boolean = false; isLoginTab: Boolean = false;
  jwtToken: any; tabName: any; version_list: any = null;
  uuidValue: string; guidValue: any;
  isVersionDataVisible: Boolean = false; projArr = [];
  logintoken: Logintoken = new Logintoken();
  isBinVisible: Boolean = false; bin = []; getZipData: any;
  getBinData: any; isZipVisible: Boolean = false; zip = [];
  auto_device: any = null; auto_edid: any; auto_vendorId: any;
  auto_osd: any; autoResult = []; isAutoSearchTab: Boolean = false;
  autoHeadersResult = []; brand_data: any; model_data: any;
  modelHeadersResult = []; isModelSearchTab: Boolean = false; modelResult = [];
  isDeltaSearch: Boolean = false; delta_device: any = null; delta_brand: any; delta_dbVersion: any;
  deltaArr = []; isDeltaSearchTab: Boolean = false; isFeedbackSearch: Boolean = false;
  feedback_device: any = null; fb_brand: any; fb_model: any; fb_vendor: any; fb_osd: any;
  fb_edid: any; fb_codeset: any; fb_searchtype: any; fb_message: any; fb_statusflag: any;
  isCurrentDb: Boolean = false; isLatestDb: Boolean = false; current_datatype: any; latest_datatype: any;
  isCurrentDBTab: Boolean = false; isLatestDBTab: Boolean = false; currentDBVersion: any; latestDBVersion: any;
  isGenericLogTab: Boolean = false; genericlog: any;
  isGenericSearch: Boolean = false; apiname: any; inputData: any; outputData: any; resultData: any;
  binFilename: any; zipFilename: any; edidError: Boolean = false; mainArr = []; down_status: any;
  isDownlStatsTab: Boolean = false; downstats: any; ProjectList = [];
  user: User = new User();

  constructor(private mainService: MainService, private router: Router, private fb: FormBuilder, private toastr: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.spinnerService.show();
    let dataSelected = JSON.parse(localStorage.getItem('CloudApiProjects'));
    let cloudApi = localStorage.getItem('CloudApi');
    var clientsProjects = JSON.parse(localStorage.getItem('choosenProjects'));
    this.api_list = cloudApi;
    this.ApiForm = cloudApi;
    if (dataSelected != undefined) {
      this.projectNames = dataSelected;
      this.tabslist = this.projectNames;
    }
    if (clientsProjects != null) {
      this.projectNames = clientsProjects;
      this.tabslist = this.projectNames;
    }
    /** List of Projects in multiselect dropdown */
    let dataType = 1;
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {
        this.mainArr = value.data;
        let resultFetchArr: any = value.data.filter(u =>
          u.projectname == this.projectNames[0]);
        let sessionToken = null; let Dbname = resultFetchArr[0]['dbPath']; let Project = this.projectNames[0];
        this.mainService.getAPIList(sessionToken, Dbname, Project)
          .subscribe(value => {
            this.apis = value.data;
            this.getRegisterLogin();
            this.checkApiForm();
          });
        const unique = [...new Set(value.data.map(item => item.projectname))];

        let arrData = [];
        for (var i = 0; i < unique.length; i++) {
          arrData.push({ item_id: i, item_text: unique[i] });
        }
        //this.projects = arrData;
        this.getDevices();
        this.ProjectList = arrData;
        let RoleLevel = localStorage.getItem('AccessRole');
        /** List of Projects and projects version list based on role */
        if (RoleLevel != 'Admin') {
          let userName = localStorage.getItem('userName');
          this.mainService.getRoleModulesAccess(8, null, null, userName, null)
            .then(value => {
              let filterProjects = [];
              for (var i = 0; i < value.data.length; i++) {
                let clientsArray: any = this.ProjectList.filter(u =>
                  u.item_text == value.data[i]['name']);
                filterProjects.push(...clientsArray);
              }
              let modifyItems = [];
              for (var j = 0; j < filterProjects.length; j++) {
                modifyItems.push({ item_id: j, item_text: filterProjects[j]['item_text'] });
              }
              this.projects = modifyItems;
              if (this.projectNames != '') {
                for (var k = 0; k < this.projectNames.length; k++) {
                  var setIndex = this.projects.findIndex(p => p.item_text == this.projectNames[k]);
                  this.selectedItems.push({ item_id: setIndex, item_text: this.projectNames[k] });
                }
                this.projectNames = this.selectedItems;
              }
              if (this.projectNames != '' && this.projectNames != undefined) {
                let ProjectSel;
                if (this.projectNames[0]['item_text'] != undefined) {
                  ProjectSel = this.projectNames[0]['item_text'];
                } else {
                  ProjectSel = this.projectNames[0];
                }
                let filterProject: any = this.mainArr.filter(u =>
                  u.projectname == ProjectSel);
                for (var j = 0; j < filterProject.length; j++) {
                  this.versionArr.push(filterProject[j]['embeddedDbVersion']);
                }
                var uniqueVersions = this.versionArr.filter((v, i, a) => a.indexOf(v) === i);
                this.dbVersion = uniqueVersions;
                this.version_list = this.dbVersion[0];
              }
            });
        } else {
          this.projects = this.ProjectList;
          if (this.projectNames != '' && this.projectNames != undefined) {
            let Project;
            if (this.projectNames[0]['item_text'] != undefined) {
              Project = this.projectNames[0]['item_text'];
            } else {
              Project = this.projectNames[0];
            }
            for (var i = 0; i < this.projectNames.length; i++) {
              var setIndex = this.projects.findIndex(p => p.item_text == this.projectNames[i]);

              this.selectedItems.push({ item_id: setIndex, item_text: this.projectNames[i] });
            }
            this.projectNames = this.selectedItems;
            let filterProject: any = this.mainArr.filter(u =>
              u.projectname == Project);

            for (var j = 0; j < filterProject.length; j++) {
              this.versionArr.push(filterProject[j]['embeddedDbVersion']);
            }
            var uniqueVersions = this.versionArr.filter((v, i, a) => a.indexOf(v) === i);
            this.dbVersion = uniqueVersions;
            this.version_list = this.dbVersion[0];
          }
        }
        
        
      });
    /** Multiselect dropdown settings */
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 3,
          allowSearchFilter: this.ShowFilter
    };
  /** Validations for forms */
    this.apiModelsearchForm = this.fb.group({
      Device: ['', Validators.required],
      Brand: ['', Validators.required],
      Model: ['', Validators.required]
    });
    this.apiregisterForm = this.fb.group({
      SignatureKey: ['', Validators.required],
      deviceId: ['', Validators.required],
      dbVersion: ['', Validators.required],
      countryCode: ['', null]
    });
    this.apiloginForm = this.fb.group({
      Guid: ['', Validators.required]
    });
    this.apiDownloadBinForm = this.fb.group({
      Datatype: ['', Validators.required]
    });
    this.apiDownloadZipForm = this.fb.group({
      ZipDatatype: ['', Validators.required]
    });
    this.apiAutosearchForm = this.fb.group({
      AutoDevice: ['', Validators.required],
      AutoEdid: ['', null],
      AutovendorId: ['', null],
      AutoOSD: ['', null]
    });
    this.apiDeltasearchForm = this.fb.group({
      deltaDevice: ['', Validators.required],
      deltaBrandId: ['', Validators.required]
    });
    this.apiFeedbacksearchForm = this.fb.group({
      FeedbackDevice: ['', Validators.required],
      FeedBackBrand: ['', Validators.required],
      FeedbackModel: ['', null],
      FeedbackVendor: ['', null],
      FeedbackOSD: ['', null],
      FeedbackEdid: ['', null],
      FeedbackCodeset: ['', null],
      FeedbackSearchtype: ['', Validators.required],
      FeedbackMessage: ['', null],
      FeedbackStatus: ['', Validators.required]
    });
    this.apiCurrentDbForm = this.fb.group({
      CurrentDatatype: ['', Validators.required]
    });
    this.apiLatestDbForm = this.fb.group({
      LatestDatatype: ['', Validators.required]
    });
    this.apiDownloadStatsForm = this.fb.group({
      DownloadStatus: ['', Validators.required]
    });
    this.apiGenericLogForm = this.fb.group({
      ApiName: ['', Validators.required],
      Input: ['', null],
      Output: ['', null],
      Result: ['', null]
    });
  }
/** List of devices based on project selection */
  getDevices() {
    let projectname;
    if (this.tabName == undefined) {
      if (this.projectNames[0]['item_text'] == undefined) {
        projectname = this.projectNames[0];
      } else {
        projectname = this.projectNames[0]['item_text'];
      }
    } else {
      projectname = this.tabName;
    }
    let filterProjects: any = this.mainArr.filter(u =>
      u.projectname == projectname);
    let version; let dbInstance;
    if (filterProjects.length != 0) {
      version = filterProjects[0]['embeddedDbVersion'];
      dbInstance = filterProjects[0]['dbinstance'];
    }
    this.mainService.getDevicesList(dbInstance, this.user, projectname, version)
      .subscribe(value => {
        this.devices = value.data;
      });
  }

/** unique UUID Generator */
  generateUUID() {
    this.uuidValue = UUID.UUID();
    return this.uuidValue;
  }

/** show and hide the forms based on api selection for example if apiname is selected as Registration ,
  Registration form will be shown rest of the form will be hidden */

  async checkApiForm() {
    this.spinnerService.show();
    let sessionToken = null; 
    let Project;
    if (this.tabName == undefined) {
      if (this.projectNames[0]['item_text'] != undefined) {
        Project = this.projectNames[0]['item_text'];
      } else {
        Project = this.projectNames[0];
      }
    } else {
      Project = this.tabName;
    }
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == Project);
        let Dbname = resultFetchArr[0]['dbPath'];
    await this.mainService.getAPIListData(sessionToken, Dbname, Project)
          .then(value => {
            if (value.data.length != 0) {
              this.apis = value.data;
              if (this.api_list != "null") {
                let searchUrl: any = value.data.filter(u => u.name == this.api_list);
                this.urlData = searchUrl[0]['address'] + searchUrl[0]['uri'];
                if (this.api_list == 'REGISTRATION' || this.api_list == 'LOGIN') {
                  this.isVersionDataVisible = false;
                } else {
                  this.isVersionDataVisible = true;
                }
                $('.noDataExists').show();
              } else {
                $('.noDataExists').hide();
              }
            } else {
              this.apis = [];
              this.toastr.warning('', 'No API Exists for this projects');
              $('.noDataExists').hide();
            }
            
    if (this.api_list == 'REGISTRATION') {
      this.isRegister = true;
      this.isLogin = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.isLatestDb = false;
      this.isDownloadStats = false;
      this.isGenericSearch = false;
    }
    if (this.api_list == 'LOGIN') {
      this.isLogin = true;
      this.isRegister = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.isLatestDb = false;
      this.isDownloadStats = false;
      this.isGenericSearch = false;
     }
     if (this.api_list == 'CURRENTDBVERSION') {
      this.isCurrentDb = true;
      this.isLogin = false;
      this.isRegister = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
       this.isFeedbackSearch = false;
       this.isLatestDb = false;
       this.current_datatype = 1;
       this.isDownloadStats = false;
       this.isGenericSearch = false;
    }
    if (this.api_list == 'LATESTDBVERSION') {
      this.isLatestDb = true;
      this.isLogin = false;
      this.isRegister = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.latest_datatype = 2;
      this.isDownloadStats = false;
      this.isGenericSearch = false;
    }
    if (this.api_list == 'DOWNLOAD BIN') {
      this.isDownloadBin = true;
      this.isLogin = false;
      this.isRegister = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.isLatestDb = false;
      this.data_type = 1;
      this.isDownloadStats = false;
      this.isGenericSearch = false;
    }
    if (this.api_list == 'DOWNLOAD ZIP') {
      this.isDownloadZip = true;
      this.isDownloadBin = false;
      this.isLogin = false;
      this.isRegister = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.isLatestDb = false;
      this.zip_datatype = 2;
      this.isDownloadStats = false;
      this.isGenericSearch = false;
    }
    if (this.api_list == 'AUTOSEARCH') {
      this.isLogin = false;
      this.isRegister = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = true;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.isLatestDb = false;
      this.isDownloadStats = false;
      this.isGenericSearch = false;
    }
    if (this.api_list == 'MODELSEARCH') {
      this.isLogin = false;
      this.isRegister = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = true;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.isLatestDb = false;
      this.isDownloadStats = false;
      this.isGenericSearch = false;
    }
    if (this.api_list == 'DELTASEARCH') {
      this.isLogin = false;
      this.isRegister = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = true;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.isLatestDb = false;
      this.isDownloadStats = false;
      this.isGenericSearch = false;
    }
    if (this.api_list == 'FEEDBACK') {
      this.isLogin = false;
      this.isRegister = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = true;
      this.isCurrentDb = false;
      this.isLatestDb = false;
      this.isDownloadStats = false;
      this.isGenericSearch = false;
    }
    if (this.api_list == 'DOWNLOADDBUPDATES') {
      this.isDownloadStats = true;
      this.down_status = 0;
      this.isLogin = false;
      this.isRegister = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.isLatestDb = false;
      this.isGenericSearch = false;
     }
   if (this.api_list == 'GENERICLOG') {
      this.isGenericSearch = true;
      this.isDownloadStats = false;
      this.isLogin = false;
      this.isRegister = false;
      this.isDownloadBin = false;
      this.isDownloadZip = false;
      this.isAutoSearch = false;
      this.isModelSearch = false;
      this.isDeltaSearch = false;
      this.isFeedbackSearch = false;
      this.isCurrentDb = false;
      this.isLatestDb = false;
     }
    });
    
  }

/** default Register and Login will happened if user opted any other api models other than register and login to continue testing further  */

  async getRegisterLogin() {
    
    let Project;
    if (this.tabName == undefined || this.tabName == null) {
      if (this.projectNames[0]['item_text'] != undefined || this.projectNames[0]['item_text'] != null) {
        Project = this.projectNames[0]['item_text'];
      } else {
        Project = this.projectNames[0];
      }
    } else {
      Project = this.tabName;
   }
   let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == Project);
        let sessionToken = null; let Dbname = resultFetchArr[0]['dbPath'];
        let SignatureKey = resultFetchArr[0]['signatureKey'];
   await this.mainService.getAPIListData(sessionToken, Dbname, Project)
          .then(value => {
            if (this.api_list != 'REGISTRATION' && this.api_list != 'LOGIN') {
              let crudType = 2; let BoxId;
              BoxId = null;
              this.mainService.getBoxId(crudType, Project, SignatureKey, BoxId)
                .subscribe(value => {
                  if (value.data[0]['result'] == "0") {
                    this.generateUUID();
                    BoxId = this.uuidValue;
                    this.mainService.getBoxId(1, Project, SignatureKey, BoxId)
                      .subscribe(value => {
                        if (value.data.length != 0) {
                          this.mainService.getBoxId(2, Project, SignatureKey, null)
                            .subscribe(value => {
                              if (value.data.length != 0) {
                                this.uuidValue = value.data[0]['message'];
                              }
                            });
                        }
                      });
                  } else {
                    if (value.data.length != 0) {
                      this.uuidValue = value.data[0]['message'];
                    }
                  }
                  let resultFetchArr: any = this.mainArr.filter(u =>
                    u.projectname == Project);
                  let Dbname = resultFetchArr[0]['dbPath'];
                  this.mainService.getAPIList(null, Dbname, Project)
                    .subscribe(value => {
                      if (value.data.length > 0) {
                        let searchUrl: any = value.data.filter(u => u.name == 'REGISTRATION');
                        this.urlData = searchUrl[0]['address'] + searchUrl[0]['uri'];
                        let eventUrl = this.urlData; let deviceId = this.uuidValue;
                        // let dbVersion = resultFetchArr[0]['embeddedDbVersion'];
                        let dbVersion;
                        if (this.version_list != undefined || this.version_list != null) {
                          dbVersion = this.version_list;
                        } else {
                          dbVersion = resultFetchArr[0]['embeddedDbVersion'];
                        }
                        let signatureKey = resultFetchArr[0]['signatureKey']; let countryCode = null;
                        this.mainService.getTestApiRegister(eventUrl, deviceId, dbVersion, signatureKey, countryCode)
                          .subscribe(e => {
                            let searchUrl: any = value.data.filter(u => u.name == 'LOGIN');
                            this.urlData = searchUrl[0]['address'] + searchUrl[0]['uri'];
                            if (Object(e)["data"] != '' && Object(e)["data"] != undefined) {
                              let guid = Object(e)["data"]["guid"];
                              this.mainService.getTestApiLogin(this.urlData, guid)
                                .subscribe(dataResult => {
                                  this.guidValue = Object(dataResult)["data"]["jwttoken"];
                                  localStorage.setItem('token', JSON.stringify(this.guidValue));
                                  this.checkApiForm();
                                  this.spinnerService.hide();
                                });
                            }
                            
                          });
                      }
                      
                    });
            });
            }
          });
   
  }

/** Multiselect dropdown options start */

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
/** Multiselect dropdown options start */

/** On Project selection in multiselect dropdown to update the api list and and version list based on selection */

  async onProjectSelect(e) {
    let projectSelectedList = [];
    let datatype = 1;
    await this.mainService.getProjectNamesWaitReq(null, null, null, null, null, datatype)
      .then(value => {
        for (var i = 0; i < this.projectNames.length; i++) {
          let filterClient: any = value.data.filter(u =>
            u.projectname == this.projectNames[i]['item_text']);
          this.projArr.push(filterClient);
          projectSelectedList.push(this.projectNames[i]['item_text']);
        }
        this.tabslist = projectSelectedList;
        var resultproj = [];
        for (var k = 0; k < this.projArr.length; k++) {
          resultproj = resultproj.concat(this.projArr[k]);
        }

        this.projArr = resultproj;
        let versionArr = [];
        for (var m = 0; m < this.projArr.length; m++) {
          let filterVersions: any = this.projArr.filter(u =>
            u.projectname == projectSelectedList[m]);
          if (filterVersions.length != 0) {
            for (var j = 0; j < filterVersions.length; j++) {
              if (filterVersions.length != 0) {
                let fetchVersion = filterVersions[j]['embeddedDbVersion'];
                versionArr.push(fetchVersion);
              }
            }
          }
        }
        var uniqueVersions = versionArr.filter((v, i, a) => a.indexOf(v) === i);
        this.dbVersion = uniqueVersions;
      });
  }

/** Change of Api in Multiselect Dropdown */

  changeApi() {
    this.ApiForm = this.api_list;
    this.checkApiForm();
    this.resetFiles();
    if (JSON.parse(localStorage.getItem('token')) == null) {
      this.getRegisterLogin();
    }
  }

/** If Project are deselected and empty in Multiselect Dropdown to hide the entire section until project selects */
  changeProject() {
    if (this.projectNames.length === 0) {
      $('.noDataExists').hide();
      $('.noneProjects').hide();
      this.toastr.warning('', 'Please select a Project');
    } else {
      $('.noDataExists').show();
      $('.noneProjects').show();
      let pushArr = [];
      this.projectNames.forEach(function (value) {
        pushArr.push(value['item_text'])
      });
      this.tabslist = pushArr;
      this.checkApiForm();
      this.getTabName(this.projectNames[0]['item_text']);
      this.onProjectSelect(this.tabslist[0]);
      this.getDevices();
    }
  }

/** If previous route was selected in breadcrumbs to maintain the selection of projects to be updated in previous route as well */

  cloudMod() {
    let projSelectedData = [];
    for (var i = 0; i < this.projectNames.length; i++) {
      projSelectedData.push(this.projectNames[i]['item_text']);
    }
    this.projectNames = projSelectedData;
    localStorage.setItem('BrandLibraryProjects', JSON.stringify(this.projectNames));
    this.router.navigate(['/cloud-api-modules']);
  }

/** If Api Clients was clicked in Braedcrumbs to route to client page */

  apiClients() {
    this.router.navigate(['/api-clients'])
      .then(() => {
        window.location.reload();
      });
  }

/** None of the version selected in dropdown */

  changeVersion() {
    if (this.version_list == "null") {
      $('.noDataExists').hide();
    } else {
      $('.noDataExists').show();
      this.changeApi();
      this.getRegisterLogin();
    }
  }

/** For Resetting entire Forms */

  resetFiles() {
    this.isRegisterTab = false;
    this.isLoginTab = false;
    this.isBinVisible = false;
    this.isZipVisible = false;
    this.isAutoSearch = false;
    this.isModelSearch = false;
    this.isDeltaSearch = false;
    this.isFeedbackSearch = false;
    this.isCurrentDBTab = false;
    this.isLatestDBTab = false;
    this.isDownlStatsTab = false;
    this.isModelSearchTab = false;
    this.isAutoSearchTab = false;
    this.isDeltaSearchTab = false;
    this.isDownloadStats = false;
    this.isGenericLogTab = false;
    this.regsubmitted = false;
    this.logsubmitted = false;
    this.binsubmitted = false;
    this.zipsubmitted = false;
    this.autosubmitted = false;
    this.apiGenericsubmitted = false;
    this.submitted = false;
    this.deltasubmitted = false;
    this.fbsubmitted = false;
    this.currentdbsubmitted = false;
    this.latestdbsubmitted = false;
    this.downStatsubmitted = false;
    this.isTabDataVisible = false;
    this.apiregisterForm.reset();
    this.apiloginForm.reset();
    this.apiDownloadBinForm.reset();
    this.apiDownloadZipForm.reset();
    this.apiAutosearchForm.reset();
    this.apiModelsearchForm.reset();
    this.apiDeltasearchForm.reset();
    this.apiFeedbacksearchForm.reset();
    this.apiCurrentDbForm.reset();
    this.apiLatestDbForm.reset();
    this.apiDownloadStatsForm.reset();
    this.apiGenericLogForm.reset();
  }

/** For Resetting entire Forms, since we are handling multiple forms in single page by using hide show method */

  resetSubmission() {
    this.isRegisterTab = false;
    this.isLoginTab = false;
    this.isBinVisible = false;
    this.isZipVisible = false;
    this.isAutoSearch = false;
    this.isModelSearch = false;
    this.isDeltaSearch = false;
    this.isFeedbackSearch = false;
    this.isCurrentDBTab = false;
    this.isLatestDBTab = false;
    this.isDownlStatsTab = false;
    this.isModelSearchTab = false;
    this.isAutoSearchTab = false;
    this.isDeltaSearchTab = false;
    this.isDownloadStats = false;
    this.regsubmitted = false;
    this.logsubmitted = false;
    this.binsubmitted = false;
    this.zipsubmitted = false;
    this.autosubmitted = false;
    this.submitted = false;
    this.deltasubmitted = false;
    this.fbsubmitted = false;
    this.currentdbsubmitted = false;
    this.latestdbsubmitted = false;
    this.downStatsubmitted = false;
    this.isTabDataVisible = false;
    this.isGenericSearch = false;
    this.apiGenericsubmitted = false;
  }

/** Getting data result based on tab switching */

  getTabName(tabs) {
    this.resetSubmission();
    this.tabName = tabs;
    this.getDevices();
    if (this.api_list == 'LOGIN') {
      this.api_list = 'REGISTRATION';
    }
    this.ApiForm = this.api_list;
    if (tabs != undefined && tabs != '') {
      let versionArray: any = this.mainArr.filter(u =>
        u.projectname == tabs);
      this.version_list = versionArray[0]['embeddedDbVersion'];
      this.checkApiForm();
      if (this.api_list != 'REGISTRATION' && this.api_list != 'LOGIN') {
        this.getRegisterLogin();
      }
    }
  }

  dbVersionChange() {
    if (this.db_version == "null") {
      this.db_version = null;
    }
  }

/** Validation Trigger for each forms when user submits the form without filling data */

  get h() { return this.apiModelsearchForm.controls; }
  get g() { return this.apiregisterForm.controls; }
  get j() { return this.apiloginForm.controls; }
  get k() { return this.apiDownloadBinForm.controls; }
  get m() { return this.apiDownloadZipForm.controls; }
  get n() { return this.apiAutosearchForm.controls; }
  get p() { return this.apiDeltasearchForm.controls; }
  get q() { return this.apiFeedbacksearchForm.controls; }
  get r() { return this.apiCurrentDbForm.controls; }
  get t() { return this.apiLatestDbForm.controls; }
  get v() { return this.apiDownloadStatsForm.controls; }
  get s() { return this.apiGenericLogForm.controls; }

/** Registration Form Submit Operation */

  onRegisterSearchSubmit() {
    this.spinnerService.show();
    this.regsubmitted = true;
    if (this.apiregisterForm.invalid) {
      return;
    }
    let eventUrl = this.urlData; let deviceId = this.device_id; let dbVersion = this.db_version;
    let signatureKey = this.sign_key; let countryCode = this.country_code;
    this.mainService.getTestApiRegister(eventUrl, deviceId, dbVersion, signatureKey, countryCode)
      .subscribe(value => {
        this.spinnerService.hide();
        if (Object(value)["message"] != '' && Object(value)["message"] != undefined) {
          this.isTabDataVisible = true;
          this.isRegisterTab = true;
          this.toastr.info('', Object(value)["message"]);
          this.guidData = Object(value)["data"]["guid"];
          this.checksumData = Object(value)["data"]["checksum"];
          this.guid_data = this.guidData;
          let BoxId = deviceId;
          let Project;
          if (this.tabName == undefined || this.tabName == null) {
            if (this.projectNames[0]['item_text'] != undefined || this.projectNames[0]['item_text'] != null) {
              Project = this.projectNames[0]['item_text'];
            } else {
              Project = this.projectNames[0];
            }
          } else {
            Project = this.tabName;
          }
          this.mainService.getProjectNames(null, null, null, null, null, 1)
            .subscribe(value => {
              let resultFetchArr: any = value.data.filter(u =>
                u.projectname == Project);
              let SignatureKey = resultFetchArr[0]['signatureKey'];
              this.mainService.getBoxId(1, Project, SignatureKey, BoxId)
                .subscribe(boxIdData => {

                });
            });
        } 
        
       
      });
  }

/** Login Form Submit Operation */

  onLoginSearchSubmit() {
    this.spinnerService.show();
    this.logsubmitted = true;
    if (this.apiloginForm.invalid) {
      return;
    }
    this.isRegisterTab = false;
    let eventUrl = this.urlData; let guid = this.guid_data;
    this.mainService.getTestApiLogin(eventUrl, guid)
      .subscribe(value => {
        this.spinnerService.hide();
        if (Object(value)["message"] != '' && Object(value)["message"] != undefined) {
          this.isTabDataVisible = true;
          this.isLoginTab = true;
          this.toastr.info('', Object(value)["message"]);
          this.jwtToken = Object(value)["data"]["jwttoken"];
        }
      });
  }

/** Current Db Version Submit Operation */

  onCurrentDbSearchSubmit() {
    this.spinnerService.show();
    this.currentdbsubmitted = true;
    if (this.apiCurrentDbForm.invalid) {
      return;
    }
      let eventUrl = this.urlData; let datatype = this.current_datatype;
      this.mainService.getTestApiCurrentDbVersion(eventUrl, datatype)
        .subscribe(value => {
          if (value.data != '' && value.data != undefined) {
            this.isTabDataVisible = true;
            this.isCurrentDBTab = true;
            this.currentDBVersion = value.data.dbversion;
          }
          this.spinnerService.hide();
        });
  }

/** Download Stats Submit Operation */

  onDownloadStatsSubmit() {
    this.downStatsubmitted = true;
    if (this.apiDownloadStatsForm.invalid) {
      return;
    }
    let eventUrl = this.urlData; let donwloadStatus = this.down_status;
    let dbVersion = this.version_list;
    this.mainService.getTestApiDownloadStats(eventUrl, donwloadStatus,dbVersion)
      .subscribe(value => {
          this.isTabDataVisible = true;
          this.isDownlStatsTab = true;
          this.downstats = value.message;
      });
  }

/** Latest Db Version Submit Operation */

  onLatestDbSearchSubmit() {
    this.latestdbsubmitted = true;
    if (this.apiLatestDbForm.invalid) {
      return;
    }
    let eventUrl = this.urlData; let datatype = this.latest_datatype;
    this.mainService.getTestApiLatestDbVersion(eventUrl, datatype)
      .subscribe(value => {
        if (value.data != '' && value.data != undefined) {
          this.isTabDataVisible = true;
          this.isLatestDBTab = true;
          this.latestDBVersion = value.data.dbversion;
        }
      });
  }

/** Generic Log Submit Operation */

  onApiGenericSearchSubmit() {
    this.apiGenericsubmitted = true;
    if (this.apiGenericLogForm.invalid) {
      return;
    }
    let eventUrl = this.urlData; let apiName = this.apiname;
    let input = this.inputData; let output = this.outputData;
    let result = this.resultData;
    this.spinnerService.show();
    this.mainService.getUpdateGenericLog(eventUrl, apiName, input, output, result)
      .subscribe(value => {
        this.isTabDataVisible = true;
        this.isGenericLogTab = true;
        this.genericlog = value.message;
      });
    this.spinnerService.hide();
  }

/** Download Bin Submit Operation */

  onDownloadBinSearchSubmit() {
    this.binsubmitted = true;
    if (this.apiDownloadBinForm.invalid) {
      return;
    }
    let eventUrl = this.urlData; let datatype = this.data_type;
    this.mainService.getDownloadStatus(eventUrl, datatype)
      .subscribe(value => {
        this.isTabDataVisible = true;
        if (value.data.filecontent == null || value.data.filecontent == "null") {
          this.isBinVisible = false;
          this.isDownlStatsTab = true;
          this.downstats = value.message;
        } else {
          if (value.data != '') {
            this.isBinVisible = true;
            this.isZipVisible = false;
            this.binFilename = value.data.dbversion;
            this.getBinData = value.data.filecontent;
            delete value.data.filecontent;
            this.bin = value.data;
          }
        }
      });
  }

/** Bin File Download format to download in .bin file extension and the binFile data to save in local folders */

  downloadBin() {
    var fileText = this.getBinData;
    var fileName = this.binFilename + '.bin';
    this.saveTextAsFile(fileText, fileName);
  }

/** Zip File Download format to download in .zip file extension and the ZipFile data to save in local folders */

  downloadZip() {
    var fileText = this.getZipData;
    var fileName = this.zipFilename+ '.zip';
    this.saveTextAsFile(fileText, fileName);
  }

/** Download Bin Submit Operation */
  onDownloadZipSearchSubmit() {
    this.zipsubmitted = true;
    if (this.apiDownloadZipForm.invalid) {
      return;
    }
    let eventUrl = this.urlData; let datatype = this.zip_datatype;
    this.mainService.getDownloadStatus(eventUrl, datatype)
      .subscribe(value => {
        this.isTabDataVisible = true;
        if (value.data.filecontent == null) {
          this.isBinVisible = false;
          this.isDownlStatsTab = true;
          this.downstats = value.message;
        } else {
          if (value.data != '') {
            this.isDownlStatsTab = false;
            this.isBinVisible = false;
            this.isZipVisible = true;
            this.zipFilename = value.data.dbversion;
            this.getZipData = value.data.filecontent;
            delete value.data.filecontent;
            this.zip = value.data;
          }
        }
      });
  }

/** Auto Search Submit Operation */
  onApiAutoSearchSubmit() {
    this.autosubmitted = true;
    if (this.apiAutosearchForm.invalid) {
      return;
    }
    if (this.auto_edid != undefined || this.auto_osd != undefined || this.auto_vendorId != undefined) {
      
      if (this.auto_edid == undefined) {
        this.auto_edid = "";
      } if (this.auto_osd == undefined) {
        this.auto_osd = "";
      } if (this.auto_vendorId == undefined) {
        this.auto_vendorId = "";
      }
      this.autoHeadersResult = ['Codeset Number', 'Codeset Binary', 'Checksum', 'Brand Id', 'Brand Name', 'Search Result'];
      let eventUrl = this.urlData; let Device = this.auto_device;
      let Edid = this.auto_edid; let Vendorid = this.auto_vendorId; let Osd = this.auto_osd;
      this.mainService.getTestAutoSearch(eventUrl, Device, Edid, Vendorid, Osd)
        .subscribe(value => {
          this.isTabDataVisible = true;
          if (value.data != '') {
            this.isAutoSearchTab = true;
            this.autoResult = value.data;
          }
        });
    } else {
      this.toastr.warning('', 'Please Enter Edid or Vendor Id or OSD to proceed further');
    }
  }

/** Model Search Submit Operation */
  onApiModelSearchSubmit() {
    this.submitted = true;
    if (this.apiModelsearchForm.invalid) {
      return;
    }
    this.modelHeadersResult = ['Codeset Number', 'Codeset Binary', 'Checksum', 'Brand Id', 'Brand Name', 'Search Result'];
    let eventUrl = this.urlData; let Device = this.device_list; let brand = this.brand_data;
    let Model = this.model_data; 
    this.mainService.getTestModelSearch(eventUrl, Device, brand,Model)
      .subscribe(value => {
        this.isTabDataVisible = true;
        if (value.data != '') {
          this.isModelSearchTab = true;
          this.modelResult = value.data;
        }
      });
  }

/** Delta Search Submit Operation */

  onApiDeltaSearchSubmit() {
    this.deltasubmitted = true;
    this.downstats = '';
    this.isDeltaSearchTab = false;
    if (this.apiDeltasearchForm.invalid) {
      return;
    }
    let eventUrl = this.urlData; let Device = this.delta_device; let brand = this.delta_brand;
    let dbVersion = this.version_list;
    this.mainService.getTestDeltaSearch(eventUrl, Device, brand, dbVersion)
      .subscribe(value => {
        this.isTabDataVisible = true;
        if (value.data.length == 0 || value.data == "null") {
          this.isDownlStatsTab = true;
          this.downstats = value.message;
        } else {
          this.isDeltaSearchTab = true;
          if (value.data != '') {
            this.deltaArr = value.data;
          }
        }
        if (value.data != "null") {
          value.data.forEach(function (item) {
            Object.keys(item).forEach(function (key) {
              // this.deltaArr.push(key);
            });
          });
        }
      });
  }

/** Feedback Submit Operation */

  onApiFeedbackSearchSubmit() {
    this.fbsubmitted = true;
    if (this.apiFeedbacksearchForm.invalid) {
      return;
    }
    if (this.fb_model == undefined) {
      this.fb_model = "";
    }if (this.feedback_device == undefined) {
      this.feedback_device = "";
    } if (this.fb_brand == undefined) {
      this.fb_brand = "";
    } if (this.fb_model == undefined) {
      this.fb_model = "";
    } if (this.fb_vendor == undefined) {
      this.fb_vendor = "";
    } if (this.fb_osd == undefined) {
      this.fb_osd = "";
    } if (this.fb_edid == undefined) {
      this.fb_edid = "";
    } if (this.fb_codeset == undefined) {
      this.fb_codeset = "";
    } if (this.fb_searchtype == undefined) {
      this.fb_searchtype = "";
    }
    let eventUrl = this.urlData; let Device = this.feedback_device; let brand = this.fb_brand;
    let model = this.fb_model; let vendorId = this.fb_vendor; let Osd = this.fb_osd;
    let Edid = this.fb_edid; let codeset = this.fb_codeset; let searchType = this.fb_searchtype;
    let statusFlag = this.fb_statusflag; let message = this.fb_message;
    this.mainService.getTestFeedbackSearch(eventUrl, Device, brand, model, vendorId, Osd, Edid, codeset, searchType,
      message, statusFlag)
      .subscribe(value => {
        this.fbsubmitted = false;
        this.apiFeedbacksearchForm.reset();
        this.toastr.success('', value.message);
        //if (value.data == "0") {
        //  this.toastr.success('', value.message);
        //  this.fbsubmitted = false;
        //  this.apiFeedbacksearchForm.reset();
        //} else {
        //  this.toastr.warning('', value.message);
        //}
      });
  }

/** Saving File Operations */

  saveTextAsFile(data, filename) {

    if (!data) {
      console.error('Console.save: No data')
      return;
    }

    var byteCharacters = atob(data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers)

    var blob = new Blob([byteArray], { type: "octet/stream" }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')
    // FOR IE:

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
      var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }


}
