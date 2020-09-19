import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { Title } from '@angular/platform-browser';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable, Subject, merge } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { Data } from '../model/data';
import { User } from '../model/user';
import { UpperCasePipe } from '@angular/common';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

var BrandListData = [];

@Component({
  selector: 'app-brand-library',
  templateUrl: './brand-library.component.html',
  styleUrls: ['./brand-library.component.css']
})

export class BrandLibraryComponent implements OnInit {

  saveUpdateData: FormGroup; saveUpdateCodesets: FormGroup;
  saveEditCodesets: FormGroup;
  saveUpdateBrandInfoCec: FormGroup; saveUpdateBrandInfoEdid: FormGroup;
  saveUpdateComponentData: FormGroup; saveUpdateCrossReferenceBrands: FormGroup;
  saveUpdateCecEdidData: FormGroup;
  submitted: Boolean = false; cecsubmitted: Boolean = false;
  edidsubmitted: Boolean = false; componentsubmitted: Boolean = false;
  crsubmitted: Boolean = false; cecEdidsubmitted: Boolean = false;
  projects: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false;
  limitSelection = false;
  projectNames: any; selectedItems: Array<any> = [];
  brands = []; brand_list: any = null; versions = []; 
  version_list: any = null; tabslist = [];
  projArr = []; tabHeader = []; dataList = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  resultProjArr = []; Datatype: Number; 
  mainArr = []; tabsProject: any; versionArr = [];
  SelectedBrandName: any; dataMainArr = [];
  isCecVisible: Boolean = true;
  isBrandModel: Boolean = false; isBrandInfoCec: Boolean = false;
  isBrandInfoEdid: Boolean = false; isComponentData: Boolean = false;
  isCodesets: Boolean = false; isCrossReferencebyBrands: Boolean = false; isCecEdidData: Boolean = false;
  submittedFile: Boolean = false; componentFile: any; base64CompData: any; checksumCompData: any;
  isVersionDataVisible: Boolean = false; changeVersionCount: any = 0; ce_brand: any; ce_brandcode: any;
  isMasterBrand: Boolean = true; isbrandInfoCec: Boolean = true; isbrandInfoEdid: Boolean = true; iscomponentData: Boolean = true;
  iscodeSets: Boolean = true; iscrossReferenceBrands: Boolean = true; isCecEdid: Boolean = true;
  isCecOnly: Boolean = true; isEdidOnly: Boolean = true;
  brand_name: any; brand_code: any; codesetFileName: any; device_data: any=null; cec_brandName: any; cec_brandcode: any=null; cec_vendorId: any;
  edid_device: any=null; edid_brandName: any=null; edid_brandcode: any=null; edid_brand: any; component_device: any=null; component_brandName: any=null;
  component_model: any; component_modelx: any; cr_device: any=null; cr_brandName: any=null; cr_codeset: any=null; cs_rank: any;
  codesetFile: any; codesetDataValue: any; codesetChecksum: any; component_codeset: any = null; codeSetsData = [];
  tabValue: any; noData: Boolean = false; ce_device: any = null; ce_region: any; ce_country: any; ce_model: any; ce_vendorId: any;
  ce_osd_string: any; ce_edid: any; ce_codeset: any=null; cec_enabled: any=null; cec_present: any = null;
  brandTable: Boolean = false; CecTable: Boolean = false; EdidTable: Boolean = false;
  CodesetTable: Boolean = false; CrossRefTable: Boolean = false; ComponentTable: Boolean = false;
  EdidData: any; vendorError: Boolean = false; edidError: Boolean = false;
  oldValue: string; previous: any; selectPrev: any; count: any = 0; modalCount: any = 0;
  currentVal: any; edidDataView: Boolean = false; edid128DataView: Boolean = false; Edid128Data: any;
  EditcodesetFileName: any; editedCodeset: any;
  finalArray = []; edidDevices = []; edidBrands = [];
  user: User = new User(); recordId: any; ProjectList = [];

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
 
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(private fb: FormBuilder, private router: Router, private mainService: MainService, private titleService: Title, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private data: Data) {
    this.titleService.setTitle("Data View Library");
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.spinnerService.show();
  /** list of selected projects in previous page **/
    var updateBrandsProjects = JSON.parse(localStorage.getItem('updatedBrandProjects'));
    var configProjects = JSON.parse(localStorage.getItem('configureProjectNames'));
    var getReloadedProject = JSON.parse(localStorage.getItem('reloadedProjects'));
    var clientsProjects = JSON.parse(localStorage.getItem('choosenProjects'));
    
    if (updateBrandsProjects != '' && updateBrandsProjects != undefined && getReloadedProject == null) {
      this.projectNames = updateBrandsProjects;
    } else {
      this.projectNames = configProjects;
    }
    if (getReloadedProject != null) {
      this.projectNames = getReloadedProject;
    }
    if (clientsProjects != null) {
      this.projectNames = clientsProjects;
    }
    var getName = localStorage.getItem('selectedBrand');
    if (getName != '') {
      this.SelectedBrandName = getName;
    }
    this.selectModelView();
    /** mutiselect dropdown project list start */
    let dataType = 1;
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {
        this.finalArray = value.data;
        const unique = [...new Set(value.data.map(item => item.projectname))];

        let arrData = [];
        for (var i = 0; i < unique.length; i++) {
          arrData.push({ item_id: i, item_text: unique[i] });
        }
        this.ProjectList = arrData;
        let RoleLevel = localStorage.getItem('AccessRole');
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
            });
        } else {
          this.projects = this.ProjectList;
          if (this.projectNames != '') {
            for (var i = 0; i < this.projectNames.length; i++) {
              var setIndex = this.projects.findIndex(p => p.item_text == this.projectNames[i]);
              this.selectedItems.push({ item_id: setIndex, item_text: this.projectNames[i] });
            }
            this.projectNames = this.selectedItems;
          }
        }

      });
  /** mutiselect dropdown project list start */

    $('#BrandView').hide();
    $('#CecView').hide();
    $('#EdidView').hide();
    $('#codeSetsView').hide();
    $('#crossReferenceBrandsView').hide();
    $('#componentDataView').hide();
    $('#cecEdidDataView').hide();
    $('#cecOnlyDataView').hide();
    $('#edidOnlyDataView').hide();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter
    };
  /** brand list start */
    let datatype = 20;
    this.mainService.getProjectNames(null, null, null, null, null, datatype)
      .subscribe(value => {
        this.brands = value.data;

        this.brands = this.brands.filter(function (obj) {
          return obj.ticketName !== 'WDB Bin' && obj.ticketName !== 'Zip';
        });

      });
  /** brand list end */
    var searchBrand = localStorage.getItem('selectedBrand');
    if (searchBrand != undefined && searchBrand != '') {
      this.brand_list = searchBrand;
      this.previous = this.brand_list;
    }
  /** Default show List Start**/

    this.selectDatatype();
    let filtProj = [];
    let Projectname = this.projectNames;
    this.tabslist = Projectname;
    let data_type = 1;
  /** version list */
    this.mainService.getProjectNames(null, null, null, null, null, data_type)
      .subscribe(value => {
        this.mainArr = value.data;
        for (var i = 0; i < Projectname.length; i++) {
          let filterProject: any = value.data.filter(u =>
            u.projectname == Projectname[i]);
          filtProj.push(filterProject);
          if (this.versions.length == 0) {
            for (var j = 0; j < filterProject.length; j++) {
              this.versionArr.push(filterProject[j]['embeddedDbVersion']);
            }
          }
        }
        var uniqueVersions = this.versionArr.filter((v, i, a) => a.indexOf(v) === i);
        this.versions = uniqueVersions;
        
        var versionSelected = localStorage.getItem('versionSelects');
        if (this.version_list == null && versionSelected == null) {
          this.version_list = this.versionArr[0];
        }
        if (versionSelected != null) {
          this.version_list = versionSelected;
        }
        this.tabVersions();
        this.latestVersions();
        /** loading datatable based on selection brand dropdown start **/
        if (Projectname != null || Projectname != undefined) {
          $("select").prop("disabled", true);
          $("a").css('pointer-events', 'none');
            let resultFetchArr: any = value.data.filter(u =>
              u.projectname == Projectname[0] && u.embeddedDbVersion == this.version_list);
            this.resultProjArr = resultFetchArr;
         
          if (this.resultProjArr.length != 0) {
            let Client = this.resultProjArr[0]['client']; let Region = this.resultProjArr[0]['region'];
            let Dbversion = this.resultProjArr[0]['embeddedDbVersion'];
            let Dbinstance = this.resultProjArr[0]['dbinstance'];
            let dataTypecount = 6
            this.mainService.getProjectNames(Client, Region, Projectname[0], Dbversion, Dbinstance, dataTypecount)
              .subscribe(value => {
                let dataTypeSelection = 0;
                if (this.Datatype == 8) {
                  dataTypeSelection = 5;
                }
                if (this.Datatype == 9) {
                  dataTypeSelection = 6;
                }
                if (this.Datatype == 10) {
                  dataTypeSelection = 4;
                }
                if (this.Datatype == 11) {
                  dataTypeSelection = 1;
                }
                if (this.Datatype == 12) {
                  dataTypeSelection = 2;
                }
                if (this.Datatype == 13) {
                  dataTypeSelection = 3;
                }
                if (this.Datatype == 14) {
                  dataTypeSelection = 7;
                }
                if (this.Datatype == 15) {
                  dataTypeSelection = 8;
                }
                if (this.Datatype == 16) {
                  dataTypeSelection = 9;
                }

                var dbName = this.resultProjArr[0]['dbPath'];
                var projectName = this.resultProjArr[0]['projectname'];
                let dbVersion = this.resultProjArr[0]['embeddedDbVersion'];
                 if (this.brand_list == 'Brand' || this.brand_list == 'Brand Info CEC' || this.brand_list == 'Brand Info EDID') {
                  dbVersion = "";
                  this.isVersionDataVisible = false;
                } else {
                  dbVersion = this.resultProjArr[0]['embeddedDbVersion'];
                  this.isVersionDataVisible = true;
                }
                var dataType = dataTypeSelection;
                var brandName = this.brand_list;
                $('#loadView').DataTable({
                "bProcessing": true,
                "bDestroy": true,
                  "bServerSide": true,
                  "bFilter": false,
                  "ordering": true,
                  "searching": true,
                  "fixedHeader": true,
                  "sScrollY": "235px",
                  "scrollX": true,
                  "bScrollCollapse": true,
                  "language": {
                    "processing": "Processing.. Please Wait..."
                  },
                  drawCallback: function () {
                    $('.dataTables_scroll table').css({ display: 'inline-table' });
                    $('.dataTables_scrollBody table').css({ display: 'table' });
                  },
                  ajax: {
                    type: "POST",
                    url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
                    contentType: "application/json",
                    data: function (data) {
                      data.Dbname = dbName;
                      data.Projectname = projectName;
                      data.Dbversion = dbVersion;
                      data.Datatype = dataType;
                      return JSON.stringify(data);
                    },
                    "dataSrc": function (json) {
                      if (json.data != "0") {
                        
                        if (brandName === 'Codesets') {
                          if (json.data.length > 0) {
                            for (var i = 0, ien = json.data.length; i < ien; i++) {
                              json.data[i][2] = '<button type="button" class="btn btn-primary btn-edit btn-download" value="' + json.data[i][2] + ' ' + json.data[i][1] +'"><i class="fa fa-download" aria-hidden="true"></i></button>';
                              json.data[i][4] = '<button type="button" style="cursor:pointer;background:none;border:none;" class="dataVal" value="' + json.data[i][1] + ' '+ json.data[i][0] +'" data-toggle="modal" data-target="#edidCodesetModal">&nbsp;&nbsp;<u><strong>Edit</strong></u></button>';
                              json.data[i].splice(0, 1);
                            }
                          }
                        }

                        if (brandName === 'CEC-EDID Data') {
                          if (json.data.length > 0) {
                            for (var i = 0, ien = json.data.length; i < ien; i++) {
                              json.data[i][6] = '<button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-edid" value="' + json.data[i][6] + '"><i class="fa fa-eye" aria-hidden="true"></i></button>';
                             }
                          }
                        }
                        if (brandName == 'EDID Only') {
                          if (json.data.length > 0) {
                            for (var i = 0, ien = json.data.length; i < ien; i++) {
                              json.data[i][4] = '<button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-edid128" value="' + json.data[i][4] + '"><i class="fa fa-eye" aria-hidden="true"></i></button>';
                            }
                          }
                        }
                        return json.data;
                      } else {
                        return json;
                      }
                    },
                    error: function (e) {
                    },
                  },
                  autofill: true,
                  responsive: true
                });
                this.spinnerService.show();
                if (this.SelectedBrandName != '') {

                  this.getDropdownValues();
                  this.getCodeSets();
                  $("select").prop("disabled", false);
                  $("a").css('pointer-events', 'auto');
                } else {
                  this.spinnerService.hide();
                  $("select").prop("disabled", false);
                  $("a").css('pointer-events', 'auto');
                }
              });
           }
        }
      /** loading datatable based on selection brand dropdown end **/
      });

    //$('#dataView').on('click', '.btn-edit', function () {
      
    //});
    /** for bin download */
    var self = this;
    $('#loadView').on('click', '.btn-download', function () {
      var binVal = $(this).val();
      var binData = binVal.split(" ");
      self.downloadBin(binData[0], binData[1]);
    });
  /** for edid data view */
    $('#loadView').on('click', '.btn-edid', function () {
      
      var setEdid = $(this).val();
      self.viewEdidData(setEdid);
    });
    $('#loadView').on('click', '.dataVal', function () {

      var setCodeset = $(this).val();
      var ret = setCodeset.split(" ");
      var str1 = ret[0];
      var str2 = ret[1];
      self.viewcodesetData(str1,str2);
    });

    $('#loadView').on('click', '.btn-edid128', function () {
      var setEdid = $(this).val();
      self.viewEdid128Data(setEdid);
    });
    /** required validations for form **/
    this.saveUpdateData = this.fb.group({
      brandsName: [null, Validators.required],
      brandCode: ['', Validators.required]
    });

    this.saveUpdateBrandInfoCec = this.fb.group({
      deviceValue: ['', Validators.required],
      cecBrandName: ['', null],
      cecBrandCode: ['', Validators.required],
      cecVendorID: ['', Validators.required]
    });

    this.saveUpdateBrandInfoEdid = this.fb.group({
      edidDevice: ['', Validators.required],
      edidBrandName: ['', Validators.required],
      edidBrandCode: ['', Validators.required],
      edidBrand: ['', Validators.required]
    });

    this.saveUpdateComponentData = this.fb.group({
      componentDevice: ['', Validators.required],
      componentBrandName: ['', Validators.required],
      componentModel: ['', Validators.required],
      componentCodeset: ['', Validators.required]
    });

    this.saveUpdateCrossReferenceBrands = this.fb.group({
      crDevice: ['', Validators.required],
      crBrandName: ['', Validators.required],
      crCodeset: ['', Validators.required],
      csRank: ['', Validators.required]
    });

    this.saveUpdateCodesets = this.fb.group({
      CodeSetData:['',null]
    });

    this.saveEditCodesets = this.fb.group({
      EditCodeSetData: ['', null]
    });

    this.saveUpdateCecEdidData = this.fb.group({
      ceDevice: ['', Validators.required],
      ceBrand: ['', Validators.required],
      ceBrandCode: ['', Validators.required],
      ceRegion: ['', Validators.required],
      ceCountry: ['', Validators.required],
      ceModel: ['', Validators.required],
      ceVendorId: ['', null],
      ceOSDString: ['', null],
      ceEdid: ['', null],
      ceCodeset: ['', Validators.required],
      cecPresent: ['', Validators.required],
      cecEnabled: ['', Validators.required]
    });

    this.tabValue = this.projectNames[0];
    /** number restrictions validations **/
    $(document).ready(function () {
      $("input").on("keypress", function (e) {
        if (e.which === 32 && !this.value.length)
          e.preventDefault();
      });
    });

  }

/** Download Bin Function  **/

  downloadBin(BinData,FileName) {
    var fileText = BinData;
    var fileName = FileName + '.bin';
    this.saveTextAsFile(fileText, fileName);
  }

/** View Edid Data **/

  viewEdidData(value) {
    this.edidDataView = true;
    this.edid128DataView = false;
    this.EdidData = value;
  }

/** View Edid 128 data **/

  viewEdid128Data(value) {
    this.edidDataView = false;
    this.edid128DataView = true;
    this.Edid128Data = value;
  }

/** Edit Codeset record id to update codeset **/ 
  viewcodesetData(value1, value2) {
    this.editedCodeset = value1;
    this.recordId = value2;
  }

/** Multiselect project selection functions start **/
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

/** Multiselect project selection functions end **/

  /** autocomplete data for brands list start **/

  formatter = (result: string) => result.toUpperCase();

  brandSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : BrandListData.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 5))
    )

/** autocomplete data for brands list end **/

  keyPressHandler(e) {
    if (e.keyCode === 32 && !e.target.value.length) {
      return false;
    }
  }

  /** Get Latest Versions Only */
  latestVersions() {
    if (this.brand_list == 'Component Data' || this.brand_list == 'CEC-EDID Data' || this.brand_list == 'CEC Only' || this.brand_list == 'EDID Only') {
      let projectName; let datatype = 21;
      if (this.tabsProject != undefined) {
        projectName = this.tabsProject;
      } else {
        projectName = this.projectNames[0]['item_text'];
      }
      let versionArr = [];
      this.mainService.getProjectNames(null, null, projectName, null, null, datatype)
        .subscribe(value => {
          if (value.data.length != 0) {
            versionArr.push(value.data[0]['version']);
            this.versions = versionArr;
            this.version_list = versionArr[0];
          }
        });
    } else {
      let filtProj = [];
      let projectName;
      if (this.tabsProject != undefined) {
        projectName = this.tabsProject;
      } else {
        projectName = this.projectNames[0]['item_text'];
      }
      let data_type = 1;
      this.mainService.getProjectNames(null, null, null, null, null, data_type)
        .subscribe(value => {
          this.mainArr = value.data;
          let filterProject: any = value.data.filter(u =>
            u.projectname == projectName);
          filtProj.push(filterProject);
          if (this.versions.length == 0) {
            for (var j = 0; j < filterProject.length; j++) {
              this.versionArr.push(filterProject[j]['embeddedDbVersion']);
            }
          }
          var uniqueVersions = this.versionArr.filter((v, i, a) => a.indexOf(v) === i);
          this.versions = uniqueVersions;
            this.version_list = this.versionArr[0];
        });
    }
  }

/** refresh page **/

  refreshScreen() {
    let project;
    if (this.tabsProject != undefined) {
      project = this.tabsProject;
    } else {
      project = this.projectNames[0]['item_text']
    }
    this.getTabName(project);
  }

/** datatype selection based on selection of brands list start **/

  selectDatatype() {
    if (this.brand_list == 'Cross Reference By Brands') {
      this.Datatype = 8;
      this.iscrossReferenceBrands = false;
      this.isCecOnly = true; this.isEdidOnly = true;
      this.iscomponentData = true; this.iscodeSets = true; this.isMasterBrand = true;
      this.isbrandInfoCec = true; this.isbrandInfoEdid = true; this.isCecEdid = true;
      $('.newBtn').css('display', 'block');
    } if (this.brand_list == 'Component Data') {
      this.Datatype = 9;
      this.iscomponentData = false;
      this.isCecOnly = true; this.isEdidOnly = true;
      this.iscrossReferenceBrands = true; this.iscodeSets = true; this.isMasterBrand = true;
      this.isbrandInfoCec = true; this.isbrandInfoEdid = true; this.isCecEdid = true;
      $('.newBtn').css('display', 'block');
    } if (this.brand_list == 'Codesets') {
      this.Datatype = 10;
      this.iscodeSets = false;
      this.isCecOnly = true; this.isEdidOnly = true;
      this.iscrossReferenceBrands = true; this.iscomponentData = true; this.isMasterBrand = true;
      this.isbrandInfoCec = true; this.isbrandInfoEdid = true; this.isCecEdid = true;
      $('.newBtn').css('display', 'block');
    } if (this.brand_list == 'Brand') {
      this.Datatype = 11;
      this.isMasterBrand = false;
      this.isCecOnly = true; this.isEdidOnly = true;
      this.iscrossReferenceBrands = true; this.iscomponentData = true; this.iscodeSets = true;
      this.isbrandInfoCec = true; this.isbrandInfoEdid = true; this.isCecEdid = true;
      $('.newBtn').css('display', 'block');
    } if (this.brand_list == 'Brand Info CEC') {
      this.Datatype = 12;
      this.isbrandInfoCec = false;
      this.isCecOnly = true; this.isEdidOnly = true;
      this.iscrossReferenceBrands = true; this.iscomponentData = true; this.iscodeSets = true;
      this.isMasterBrand = true; this.isbrandInfoEdid = true; this.isCecEdid = true;
      $('.newBtn').css('display', 'block');
    } if (this.brand_list == 'Brand Info EDID') {
      this.Datatype = 13;
      this.isbrandInfoEdid = false;
      this.isCecOnly = true; this.isEdidOnly = true;
      this.iscrossReferenceBrands = true; this.iscomponentData = true; this.iscodeSets = true;
      this.isMasterBrand = true; this.isbrandInfoCec = true; this.isCecEdid = true;
      $('.newBtn').css('display', 'block');
    }
    if (this.brand_list == 'CEC-EDID Data') {
      this.Datatype = 14;
      this.isCecEdid = false;
      this.isCecOnly = true; this.isEdidOnly = true;
      this.isbrandInfoEdid = true; this.iscrossReferenceBrands = true; this.iscomponentData = true;
      this.iscodeSets = true;this.isMasterBrand = true; this.isbrandInfoCec = true; 
    }
    if (this.brand_list == 'CEC Only') {
      this.Datatype = 16;
      this.isCecOnly = false; this.isEdidOnly = true;
      this.isCecEdid = true;this.isbrandInfoEdid = true; this.iscrossReferenceBrands = true; this.iscomponentData = true;
      this.iscodeSets = true; this.isMasterBrand = true; this.isbrandInfoCec = true;
      $('.newBtn').css('display', 'none');
      
    }
    if (this.brand_list == 'EDID Only') {
      this.Datatype = 15;
      this.isEdidOnly = false;
      this.isCecEdid = true; this.isCecOnly = true;
      this.isbrandInfoEdid = true; this.iscrossReferenceBrands = true; this.iscomponentData = true;
      this.iscodeSets = true; this.isMasterBrand = true; this.isbrandInfoCec = true;
      $('.newBtn').css('display', 'none');
    }
  }

/** datatype selection based on selection of brands list start **/

/** Project selection in multiselect dropdown to update the view of datatable start **/

  async onProjectSelect(e) {
    this.dataList = [];
    this.tabHeader = [];
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
        this.versions = uniqueVersions;
      });
  }

/** Project selection in multiselect dropdown to update the view of datatable start **/

/** If None of the Project selected in multiselect dropdown to show blank view  **/
  changeProject() {
    let pushArr = [];
    this.projectNames.forEach(function (value) {
      pushArr.push(value['item_text'])
    });
    this.tabslist = pushArr;
    if (this.projectNames.length === 0) {
      this.noData = true;
      $('.hideData').css('display', 'none');
      $('.tabView').css('display', 'none');
    } else {
      this.noData = false;
      $('.hideData').css('display', 'block');
      $('.tabView').css('display', 'block');
      $('.nav-item').removeClass('active');
      $('a#nav-home-tab0').addClass('active');
      this.getTabName(this.projectNames[0]['item_text']);
      this.onProjectSelect(this.tabslist[0]);
      this.tabVersions();
      this.latestVersions();
    }
  }

/** Validation to accept only hexa characters only **/

  hexaOnly(event: any) {

    const pattern = /^[0-9A-Fa-f]+$/;

      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
  }

/** Validation to accept only alphanumeric characters only **/

  alphaOnly(event: any) {

    const pattern = /^[A-Za-z]+$/;
   
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

/** If Brand List drodown is changed to show version activation based on selection for needed brands **/

  changeTicket() {
    this.SelectedBrandName = this.brand_list;
    if (this.brand_list == 'Brand' || this.brand_list == 'Brand Info CEC' || this.brand_list == 'Brand Info EDID') {
      this.isVersionDataVisible = false;
    } else {
      this.isVersionDataVisible = true;
    } 
    if (this.brand_list == 'CEC Only' || this.brand_list == 'EDID Only') {
      $('.newBtn').css('display', 'none');
    } else {
      $('.newBtn').css('display', 'block');
    }
    if (this.brand_list == "null") {
      this.noData = true;
      $('.tabView').css('display', 'none');
    } else {
      this.noData = false;
      $('.tabView').css('display', 'block');
      this.selectDatatype();
      this.spinnerService.show();
      this.selectModelView();
      this.getViewResponse();
      this.getDropdownValues();
      this.getCodeSets();
      this.tabVersions();
      this.latestVersions();
    }
    
  }


/** Version selection data view in table **/
  changeVersion() {
    if (this.version_list != "null") {
      let projectName = '';
      if (this.tabsProject == undefined) {
        projectName = this.projectNames[0]['item_text'];
      } else {
        projectName = this.tabsProject
      }
    let filterVersion: any = this.mainArr.filter(u =>
      u.projectname == projectName && u.embeddedDbVersion == this.version_list);
     
      if (filterVersion.length != 0) {
        this.selectDatatype();
        this.spinnerService.show();
        this.selectModelView();
        this.changeVersionCount++;
        this.getVersionResponseData();
        this.noData = false;
        $('.tab-content').css('display', 'block');
      } else {
        $('.tab-content').css('display', 'none');
        this.noData = true;
      }
      this.getDropdownValues();
      this.getCodeSets();
    }
    
  }

/** show and hide the data view based on user selected brand list start **/

  selectModelView() {
    if (this.SelectedBrandName == 'Brand') {
      this.isBrandModel = true;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isCrossReferencebyBrands = false;
      this.isCecEdidData = false;
    }
   
    if (this.SelectedBrandName == 'Brand Info CEC') {
      this.isBrandInfoCec = true;
      this.isBrandModel = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isCrossReferencebyBrands = false;
      this.isCecEdidData = false;
    }
    if (this.SelectedBrandName == 'Brand Info EDID') {
      this.isBrandInfoEdid = true;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isCrossReferencebyBrands = false;
      this.isCecEdidData = false;
    }
    if (this.SelectedBrandName == 'Component Data') {
      this.isComponentData = true;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isCodesets = false;
      this.isCrossReferencebyBrands = false;
      this.isCecEdidData = false;
    }
    if (this.SelectedBrandName == 'Codesets') {
      this.isCodesets = true;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCrossReferencebyBrands = false;
      this.isCecEdidData = false;
    }
    if (this.SelectedBrandName == 'Cross Reference By Brands') {
      this.isCrossReferencebyBrands = true;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isCecEdidData = false;
    }
    if (this.SelectedBrandName == 'CEC-EDID Data') {
      this.isCecEdidData = true;
      this.isCrossReferencebyBrands = false;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCodesets = false;
    }
  }

/** show and hide the data view based on user selected brand list end **/

/** get list of all devices registered for the project start **/

  getDropdownValues() {
    this.spinnerService.show();
    let pushBrands = [];
    let projectName = this.tabValue;
    let dbInstance = this.resultProjArr[0]['dbinstance'];
    if (this.version_list != null) {
      this.mainService.getDevicesList(dbInstance, this.user, projectName, this.version_list)
        .subscribe(value => {
          this.edidDevices = value.data;
        });
    }
    if (this.resultProjArr != null && this.resultProjArr != undefined) {
      let Client = this.resultProjArr[0]['client']; let Region = this.resultProjArr[0]['region'];
      let dbInstance = this.resultProjArr[0]['dbinstance']; let dataType = 11;
      this.mainService.getProjectNames(Client, Region, projectName, this.version_list, dbInstance, dataType)
        .subscribe(value => {
          this.edidBrands = value.data;
          
          for (var i = 0; i < value.data.length; i++) {
            pushBrands.push(value.data[i]['brandName']);
          }
          BrandListData = pushBrands;
          
        });
    }
    this.spinnerService.hide();
  }

/** get list of all devices registered for the project start **/

/** get list of all codesets start **/

  getCodeSets() {
    let projectName = this.tabValue;

    if (this.resultProjArr != null && this.resultProjArr != undefined) {
      let Client = this.resultProjArr[0]['client']; let Region = this.resultProjArr[0]['region'];
      let dbInstance = this.resultProjArr[0]['dbinstance']; let dataType = 10;
      this.mainService.getProjectNames(Client, Region, projectName, this.version_list, dbInstance, dataType)
        .subscribe(value => {
          this.codeSetsData = value.data;
          this.spinnerService.hide();
        });
    }
   
  }

/** get list of all codesets end **/

/** getting previous selected dropdown value to handle datatable view start **/
  onModelChange(event) {
    if (event) {
      this.oldValue = this.currentVal;
      this.currentVal = event;
    }
  }
/** getting previous selected dropdown value to handle datatable view end **/

/** tab switching project data view start **/

  getTabName(name) {
    if (name != undefined && name != '') {
      this.count++;
      this.tabsProject = name;
      this.tabValue = name;
      let versionArray: any = this.mainArr.filter(u =>
        u.projectname == name);
      if (versionArray.length != 0) {
        this.version_list = versionArray[0]['embeddedDbVersion'];
      }
      let filterVersion: any = this.mainArr.filter(u =>
        u.projectname == name && u.embeddedDbVersion == this.version_list);
      if (filterVersion.length != 0) {
        this.tabsProject = name;
        this.tabValue = name;
        this.noData = false;
        $('.tab-content').css('display', 'block');
        this.spinnerService.show();
        this.getTabResponseData();
      } else {
        this.count--;
        this.noData = true;
        $('.tab-content').css('display', 'none');
      }
      this.getDropdownValues();
      this.getCodeSets();
      this.tabVersions();
      this.latestVersions();
    }
    
  }

  tabVersions() {
    let projectName;
    if (this.tabsProject == undefined) {
      projectName = this.projectNames[0]['item_text'];
    } else {
      projectName = this.tabsProject;
    }
      let filterProject: any = this.mainArr.filter(u =>
        u.projectname == projectName);
    this.versions = [];
    if (this.versions.length == 0) {
      this.versionArr = [];
        for (var j = 0; j < filterProject.length; j++) {
          this.versionArr.push(filterProject[j]['embeddedDbVersion']);
        }
    }
    var uniqueVersions = this.versionArr.filter((v, i, a) => a.indexOf(v) === i);
    this.versions = uniqueVersions;
  }

/** tab switching project data view end **/

/** version switching project data view start **/

  getVersionResponseData() {

    if (this.count == 0 && this.oldValue == undefined && this.modalCount == 0 && this.changeVersionCount == 1) {
      $('#loadView').dataTable().fnClearTable();
      $('#loadView').dataTable().fnDestroy();
      $('#loadView').hide();
    }
    if (this.SelectedBrandName == 'Component Data') {
      var Table4 = $('#componentDataView').DataTable();
      Table4.destroy();
      Table4.clear();
      //Table4.draw();
      this.componentData();
      $('#componentDataView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Codesets') {
      var Table5 = $('#codeSetsView').DataTable();
      Table5.destroy();
      Table5.clear();
      //Table5.draw();
      this.codeSetData();
      $('#codeSetsView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Cross Reference By Brands') {
      var Table6 = $('#crossReferenceBrandsView').DataTable();
      Table6.destroy();
      Table6.clear();
      //Table6.draw();
      this.crossRefBrands();
      $('#crossReferenceBrandsView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'CEC-EDID Data') {
      var Table7 = $('#cecEdidDataView').DataTable();
      Table7.destroy();
      Table7.clear();
      //Table7.draw();
      this.cecEdidBrands();
      $('#cecEdidDataView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'CEC Only') {
      var Table8 = $('#cecOnlyDataView').DataTable();
      Table8.destroy();
      Table8.clear();
      //Table8.draw();
      this.cecOnly();
      $('#cecOnlyDataView').show();
      $('#edidOnlyDataView').hide();
      $('#cecEdidDataView').hide();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
    }
    if (this.SelectedBrandName == 'EDID Only') {
      var Table9 = $('#edidOnlyDataView').DataTable();
      Table9.destroy();
      Table9.clear();
      //Table8.draw();
      this.edidOnly();
      $('#edidOnlyDataView').show();
      $('#cecOnlyDataView').hide();
      $('#cecEdidDataView').hide();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
    }
  }

/** version switching project data view end **/

/** based on selected tab get data view start **/

  getTabResponseData() {
    if (this.count == 1 && this.oldValue == undefined && this.modalCount != 1) {
      $('#loadView').dataTable().fnClearTable();
      $('#loadView').dataTable().fnDestroy();
      $('#loadView').hide();
    }
    if (this.SelectedBrandName == 'Brand') {
      var Table1 = $('#BrandView').DataTable();
      Table1.destroy();
      Table1.clear();
     // Table1.draw();
      this.brandView();
      $('#BrandView').show();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Brand Info CEC') {
      var Table2 = $('#CecView').DataTable();
      Table2.destroy();
      Table2.clear();
     // Table2.draw();
      this.cecView();
      $('#CecView').show();
      $('#BrandView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Brand Info EDID') {
      var Table3 = $('#EdidView').DataTable();
      Table3.destroy();
      Table3.clear();
     // Table3.draw();
      this.edidView();
      $('#EdidView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Component Data') {
      var Table4 = $('#componentDataView').DataTable();
      Table4.destroy();
      Table4.clear();
     // Table4.draw();
      this.componentData();
      $('#componentDataView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Codesets') {
      var Table5 = $('#codeSetsView').DataTable();
      Table5.destroy();
      Table5.clear();
     // Table5.draw();
      this.codeSetData();
      $('#codeSetsView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Cross Reference By Brands') {
      var Table6 = $('#crossReferenceBrandsView').DataTable();
      Table6.destroy();
      Table6.clear();
     // Table6.draw();
      this.crossRefBrands();
      $('#crossReferenceBrandsView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'CEC-EDID Data') {
      var Table7 = $('#cecEdidDataView').DataTable();
      Table7.destroy();
      Table7.clear();
     // Table7.draw();
      this.cecEdidBrands();
      $('#cecEdidDataView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'CEC Only') {
      var Table8 = $('#cecOnlyDataView').DataTable();
      Table8.destroy();
      Table8.clear();
      //Table8.draw();
      this.cecOnly();
      $('#cecOnlyDataView').show();
      $('#edidOnlyDataView').hide();
      $('#cecEdidDataView').hide();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
    }
    if (this.SelectedBrandName == 'EDID Only') {
      var Table9 = $('#edidOnlyDataView').DataTable();
      Table9.destroy();
      Table9.clear();
      //Table9.draw();
      this.edidOnly();
      $('#edidOnlyDataView').show();
      $('#cecOnlyDataView').hide();
      $('#cecEdidDataView').hide();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
    }
  }

/** based on selected tab get data view end **/

/** datatable resetting function to handle multiple selected datatable view start **/

  getViewResponse() {
    if (this.oldValue == undefined || this.oldValue == "null" && this.previous != undefined) {
      this.selectPrev = this.previous;
      if (this.changeVersionCount == 0) {
        var Table = $('#loadView').DataTable();
        Table.destroy();
        $('#loadView').empty();
      }
      this.modalCount = 1;
    }
    if (this.oldValue != null && this.oldValue != undefined) {
      this.selectPrev = this.oldValue;
    }
    if (this.selectPrev == 'Brand') {
      var Table1 = $('#BrandView').DataTable();
      Table1.destroy();
      Table1.clear();
     // Table1.draw();
    }
    if (this.selectPrev == 'Brand Info CEC') {
      var Table2 = $('#CecView').DataTable();
      Table2.destroy();
      Table2.clear();
     // Table2.draw();
    }
    if (this.selectPrev == 'Brand Info EDID') {
      var Table3 = $('#EdidView').DataTable();
      Table3.destroy();
      Table3.clear();
     // Table3.draw();
    }
    if (this.selectPrev == 'Component Data') {
      var Table4 = $('#componentDataView').DataTable();
      Table4.destroy();
      Table4.clear();
     // Table4.draw();
    }
    if (this.selectPrev == 'Codesets') {
      var Table5 = $('#codeSetsView').DataTable();
      Table5.destroy();
      Table5.clear();
     // Table5.draw();
    }
    if (this.selectPrev == 'Cross Reference By Brands') {
      var Table6 = $('#crossReferenceBrandsView').DataTable();
      Table6.destroy();
      Table6.clear();
     // Table6.draw();
    }
    if (this.selectPrev == 'CEC-EDID Data') {
      var Table7 = $('#cecEdidDataView').DataTable();
      Table7.destroy();
      Table7.clear();
     // Table7.draw();
    }
    if (this.selectPrev == 'CEC Only') {
      var Table8 = $('#cecOnlyDataView').DataTable();
      Table8.destroy();
      Table8.clear();
    }
    if (this.selectPrev == 'EDID Only') {
      var Table9 = $('#edidOnlyDataView').DataTable();
      Table9.destroy();
      Table9.clear();
    }
    if (this.SelectedBrandName == 'Brand') {
      this.brandView();
      $('#BrandView').show();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#cecEdidDataView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }

    if (this.SelectedBrandName == 'Brand Info CEC') {
      this.cecView();
      $('#CecView').show();
      $('#BrandView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#cecEdidDataView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Brand Info EDID') {
      this.edidView();
      $('#EdidView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#cecEdidDataView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Component Data') {
      this.componentData();
      $('#componentDataView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#cecEdidDataView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'Codesets') {
      this.codeSetData();
      $('#codeSetsView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#cecEdidDataView').hide();
    }
    if (this.SelectedBrandName == 'Cross Reference By Brands') {
      this.crossRefBrands();
      $('#crossReferenceBrandsView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#cecEdidDataView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'CEC-EDID Data') {
      this.cecEdidBrands();
      $('#cecEdidDataView').show();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
      $('#edidOnlyDataView').hide();
      $('#cecOnlyDataView').hide();
    }
    if (this.SelectedBrandName == 'CEC Only') {
      this.cecOnly();
      $('#cecOnlyDataView').show();
      $('#edidOnlyDataView').hide();
      $('#cecEdidDataView').hide();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
    }
    if (this.SelectedBrandName == 'EDID Only') {
      this.edidOnly();
      $('#edidOnlyDataView').show();
      $('#cecOnlyDataView').hide();
      $('#cecEdidDataView').hide();
      $('#BrandView').hide();
      $('#CecView').hide();
      $('#EdidView').hide();
      $('#componentDataView').hide();
      $('#codeSetsView').hide();
      $('#crossReferenceBrandsView').hide();
    }
  }

/** datatable resetting function to handle multiple selected datatable view end **/

/** brand selection request for an api to view brand data start **/

  brandView() {
    if (this.tabsProject != undefined) {
      let searchVersion: any = this.mainArr.filter(u => u.projectname == this.tabsProject);
      this.version_list = searchVersion[0]['embeddedDbVersion'];
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text']);
        this.version_list = resultFetchArr[0]['embeddedDbVersion'];
        this.resultProjArr = resultFetchArr;
      }
    }
    
    let dataTypeSelection = 0;
    if (this.Datatype == 8) {
      dataTypeSelection = 5;
    }
    if (this.Datatype == 9) {
      dataTypeSelection = 6;
    }
    if (this.Datatype == 10) {
      dataTypeSelection = 4;
    }
    if (this.Datatype == 11) {
      dataTypeSelection = 1;

    }
    if (this.Datatype == 12) {
      dataTypeSelection = 2;
    }
    if (this.Datatype == 13) {
      dataTypeSelection = 3;
    }
    if (this.Datatype == 14) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 16) {
      dataTypeSelection = 9;
    }
    
    var dbName = this.resultProjArr[0]['dbPath'];
    var projectName = this.resultProjArr[0]['projectname'];
    if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
      this.version_list = "";
    }
    var dbVersion = this.version_list;
    var dataType = dataTypeSelection;
    
    $('#BrandView').DataTable({
      "bProcessing": true,
      "bServerSide": true,
      "bDestroy": true,
      "bFilter": false,
      "bRetrieve": true,
      "autoWidth": false,
      "searching": true,
      "ordering": true,
      "fixedHeader": true,
      "sScrollY": "235px",
      "bScrollCollapse": true,
      "language": {
        "processing": "Processing.. Please Wait..."
      },
      drawCallback: function () {
        $('.dataTables_scroll table').css({ display: 'inline-table' });
        $('.dataTables_scrollBody table').css({ display: 'table' });
      },
      ajax: {
        type: "POST",
        url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
        contentType: "application/json",
        data: function (data) {
          data.Dbname = dbName;
          data.Projectname = projectName;
          data.Dbversion = dbVersion;
          data.Datatype = dataType;

          return JSON.stringify(data);
        },
        "dataSrc": function (json) {
          if (json.data != '0') {
            return json.data;
          } else {
            return json;
          }
        },
        error: function (e) {
        },
      },
      autofill: true,
      responsive: true
    });

    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    this.spinnerService.hide();
  }
/** brand selection request for an api to view brand data end **/

/** BrandInfoCec selection request for an api to view BrandInfoCec data start **/
  cecView() {
    if (this.tabsProject != undefined) {
      let searchVersion: any = this.mainArr.filter(u => u.projectname == this.tabsProject);
      this.version_list = searchVersion[0]['embeddedDbVersion'];
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text']);
        this.version_list = resultFetchArr[0]['embeddedDbVersion'];
        this.resultProjArr = resultFetchArr;
      }
    }
    let dataTypeSelection = 0;
    if (this.Datatype == 8) {
      dataTypeSelection = 5;
    }
    if (this.Datatype == 9) {
      dataTypeSelection = 6;
    }
    if (this.Datatype == 10) {
      dataTypeSelection = 4;
    }
    if (this.Datatype == 11) {
      dataTypeSelection = 1;

    }
    if (this.Datatype == 12) {
      dataTypeSelection = 2;
    }
    if (this.Datatype == 13) {
      dataTypeSelection = 3;
    }
    if (this.Datatype == 14) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 16) {
      dataTypeSelection = 9;
    }


    var dbName = this.resultProjArr[0]['dbPath'];
    var projectName = this.resultProjArr[0]['projectname'];
    if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
      this.version_list = "";
    }
    var dbVersion = this.version_list;
    var dataType = dataTypeSelection;
    
    $('#CecView').DataTable({
      "bProcessing": true,
      "bServerSide": true,
      "bDestroy": true,
      "bFilter": false,
      "bRetrieve": true,
      //"autoWidth": false,
      "searching": true,
      "ordering": true,
      "fixedHeader": true,
      "sScrollY": "235px",
      "bScrollCollapse": true,
      "language": {
        "processing": "Processing.. Please Wait..."
      },
      drawCallback: function () { 
        $('.dataTables_scroll table').css({ display: 'inline-table' });
        $('.dataTables_scrollBody table').css({ display: 'table' });
      },
      ajax: {
        type: "POST",
        url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
        contentType: "application/json",
        data: function (data) {
          data.Dbname = dbName;
          data.Projectname = projectName;
          data.Dbversion = dbVersion;
          data.Datatype = dataType;

          return JSON.stringify(data);
        },
        "dataSrc": function (json) {
          if (json.data != '0') {
            
            return json.data;
          } else {
            return json;
          }
          
        },
        error: function (e) {
        },
      },
      autofill: true,
      responsive: true
    });
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    this.spinnerService.hide();
  }
/** BrandInfoCec selection request for an api to view BrandInfoCec data end **/

/** BrandInfoEdid selection request for an api to view BrandInfoEdid data start **/
  edidView() {
    if (this.tabsProject != undefined) {
      let searchVersion: any = this.mainArr.filter(u => u.projectname == this.tabsProject);
      this.version_list = searchVersion[0]['embeddedDbVersion'];
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text']);
        this.version_list = resultFetchArr[0]['embeddedDbVersion'];
        this.resultProjArr = resultFetchArr;
      }
    }
    let dataTypeSelection = 0;
    if (this.Datatype == 8) {
      dataTypeSelection = 5;
    }
    if (this.Datatype == 9) {
      dataTypeSelection = 6;
    }
    if (this.Datatype == 10) {
      dataTypeSelection = 4;
    }
    if (this.Datatype == 11) {
      dataTypeSelection = 1;

    }
    if (this.Datatype == 12) {
      dataTypeSelection = 2;
    }
    if (this.Datatype == 13) {
      dataTypeSelection = 3;
    }
    if (this.Datatype == 14) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 16) {
      dataTypeSelection = 9;
    }


    var dbName = this.resultProjArr[0]['dbPath'];
    var projectName = this.resultProjArr[0]['projectname'];
    if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
      this.version_list = "";
    }
    var dbVersion = this.version_list;
    var dataType = dataTypeSelection;
    
    $('#EdidView').DataTable({
      "bProcessing": true,
      "bServerSide": true,
      "bDestroy": true,
      "bFilter": false,
      "bRetrieve": true,
      "autoWidth": false,
      "searching": true,
      "ordering": true,
      "fixedHeader": true,
      "sScrollY": "235px",
      "bScrollCollapse": true,
      "language": {
        "processing": "Processing.. Please Wait..."
      },
      drawCallback: function () {
        $('.dataTables_scroll table').css({ display: 'inline-table' });
        $('.dataTables_scrollBody table').css({ display: 'table' });
      },
      ajax: {
        type: "POST",
        url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
        contentType: "application/json",
        data: function (data) {
          data.Dbname = dbName;
          data.Projectname = projectName;
          data.Dbversion = dbVersion;
          data.Datatype = dataType;

          return JSON.stringify(data);
        },
        "dataSrc": function (json) {
          if (json.data != '0') {
            return json.data;
          } else {
            return json;
          }
        },
        error: function (e) {
        },
      },
      autofill: true,
      responsive: true
    });

    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    this.spinnerService.hide();
  }
/** BrandInfoEdid selection request for an api to view BrandInfoEdid data end **/

/** Component Data selection request for an api to view Component data start **/
  componentData() {
    if (this.tabsProject != undefined) {
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == this.version_list);
        this.resultProjArr = resultFetchArr;
      }
    }
    let dataTypeSelection = 0;
    if (this.Datatype == 8) {
      dataTypeSelection = 5;
    }
    if (this.Datatype == 9) {
      dataTypeSelection = 6;
    }
    if (this.Datatype == 10) {
      dataTypeSelection = 4;
    }
    if (this.Datatype == 11) {
      dataTypeSelection = 1;

    }
    if (this.Datatype == 12) {
      dataTypeSelection = 2;
    }
    if (this.Datatype == 13) {
      dataTypeSelection = 3;
    }
    if (this.Datatype == 14) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 16) {
      dataTypeSelection = 9;
    }

    if (this.resultProjArr.length != 0) {
      var dbName = this.resultProjArr[0]['dbPath'];
      var projectName = this.resultProjArr[0]['projectname'];
      if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
        this.version_list = "";
      }
      var dbVersion = this.version_list;
      var dataType = dataTypeSelection;
      $('#componentDataView').DataTable({
        "bProcessing": true,
        "bServerSide": true,
        "bDestroy": true,
        "bFilter": false,
        "bRetrieve": true,
        "autoWidth": false,
        "searching": true,
        "ordering": true,
        "fixedHeader": true,
        "sScrollY": "235px",
        "bScrollCollapse": true,
        "language": {
          "processing": "Processing.. Please Wait..."
        },
        drawCallback: function () {
          $('.dataTables_scroll table').css({ display: 'inline-table' });
          $('.dataTables_scrollBody table').css({ display: 'table' });
        },
        ajax: {
          type: "POST",
          url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
          contentType: "application/json",
          data: function (data) {
            data.Dbname = dbName;
            data.Projectname = projectName;
            data.Dbversion = dbVersion;
            data.Datatype = dataType;

            return JSON.stringify(data);
          },
          "dataSrc": function (json) {
            if (json.data != '0') {
              
              return json.data;
            } else {
              return json;
            }
            
          },
          error: function (e) {
          },
        },
        autofill: true,
        responsive: true
      });
    }
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    this.spinnerService.hide();
  }
/** Component Data selection request for an api to view Component data end **/

/** Codeset Data selection request for an api to view Codeset data start **/
  codeSetData() {
    if (this.tabsProject != undefined) {
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == this.version_list);
        this.resultProjArr = resultFetchArr;
      }
    }
    let dataTypeSelection = 0;
    if (this.Datatype == 8) {
      dataTypeSelection = 5;
    }
    if (this.Datatype == 9) {
      dataTypeSelection = 6;
    }
    if (this.Datatype == 10) {
      dataTypeSelection = 4;
    }
    if (this.Datatype == 11) {
      dataTypeSelection = 1;

    }
    if (this.Datatype == 12) {
      dataTypeSelection = 2;
    }
    if (this.Datatype == 13) {
      dataTypeSelection = 3;
    }
    if (this.Datatype == 14) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 16) {
      dataTypeSelection = 9;
    }

    if (this.resultProjArr.length != 0) {
      var dbName = this.resultProjArr[0]['dbPath'];
      var projectName = this.resultProjArr[0]['projectname'];
      if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
        this.version_list = "";
      }
      var dbVersion = this.version_list;
      var dataType = dataTypeSelection;
      var brandName = this.brand_list;

      $('#codeSetsView').DataTable({
        "bProcessing": true,
        "bServerSide": true,
        "bDestroy": true,
        "bFilter": false,
        "bRetrieve": true,
        "autoWidth": false,
        "searching": true,
        "ordering": true,
        "fixedHeader": true,
        "sScrollY": "235px",
        "bScrollCollapse": true,
        "language": {
          "processing": "Processing.. Please Wait..."
        },
        drawCallback: function () {
          $('.dataTables_scroll table').css({ display: 'inline-table' });
          $('.dataTables_scrollBody table').css({ display: 'table' });
        },
        ajax: {
          type: "POST",
          url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
          contentType: "application/json",
          data: function (data) {
            data.Dbname = dbName;
            data.Projectname = projectName;
            data.Dbversion = dbVersion;
            data.Datatype = dataType;

            return JSON.stringify(data);
          },
          "dataSrc": function (json) {
            if (json.data != '0') {
              if (brandName === 'Codesets') {
                if (json.data.length > 0) {
                  for (var i = 0, ien = json.data.length; i < ien; i++) {
                    json.data[i][2] = '<button type="button" class="btn btn-primary btn-edit btn-download" value="' + json.data[i][2] + ' ' + json.data[i][1] +'"><i class="fa fa-download" aria-hidden="true"></i></button>';
                    json.data[i][4] = '<button type="button" style="cursor:pointer;background:none;border:none;" class="dataVal" value="' + json.data[i][1] + ' ' + json.data[i][0] +'" data-toggle="modal" data-target="#edidCodesetModal">&nbsp;&nbsp;<u><strong>Edit</strong></u></button>';
                    json.data[i].splice(0, 1);
                  }
                }
              }
              return json.data;
            } else {
              return json;
            }
            
          },
          error: function (e) {
          },
        },
        autofill: true,
        responsive: true
      });
    }
    var self = this;
    $('#codeSetsView').on('click', '.dataVal', function () {
      var seteditCodeset = $(this).val();
      var ret = seteditCodeset.split(" ");
      var str1 = ret[0];
      var str2 = ret[1];
      self.viewcodesetData(str1, str2);
    });
    $('#codeSetsView').on('click', '.btn-download', function () {
      var binVal = $(this).val();
      var binData = binVal.split(" ");
      self.downloadBin(binData[0], binData[1]);
    });
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    this.spinnerService.hide();
  }
/** Codeset Data selection request for an api to view Codeset data end **/

/** Cross Reference by Brands Data selection request for an api to view Cross Reference by Brands data start **/
  crossRefBrands() {
    if (this.tabsProject != undefined) {
      
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == this.version_list);
        this.resultProjArr = resultFetchArr;
      }
    }
    let dataTypeSelection = 0;
    if (this.Datatype == 8) {
      dataTypeSelection = 5;
    }
    if (this.Datatype == 9) {
      dataTypeSelection = 6;
    }
    if (this.Datatype == 10) {
      dataTypeSelection = 4;
    }
    if (this.Datatype == 11) {
      dataTypeSelection = 1;

    }
    if (this.Datatype == 12) {
      dataTypeSelection = 2;
    }
    if (this.Datatype == 13) {
      dataTypeSelection = 3;
    }
    if (this.Datatype == 14) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 16) {
      dataTypeSelection = 9;
    }

    if (this.resultProjArr.length != 0) {
      var dbName = this.resultProjArr[0]['dbPath'];
      var projectName = this.resultProjArr[0]['projectname'];
      if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
        this.version_list = "";
      }
      var dbVersion = this.version_list;
      var dataType = dataTypeSelection;

      $('#crossReferenceBrandsView').DataTable({
        "bProcessing": true,
        "bServerSide": true,
        "bDestroy": true,
        "bFilter": false,
        "bRetrieve": true,
        "autoWidth": false,
        "searching": true,
        "ordering": true,
        "fixedHeader": true,
        "sScrollY": "235px",
        "bScrollCollapse": true,
        "language": {
          "processing": "Processing.. Please Wait..."
        },
        drawCallback: function () {
          $('.dataTables_scroll table').css({ display: 'inline-table' });
          $('.dataTables_scrollBody table').css({ display: 'table' });
        },
        ajax: {
          type: "POST",
          url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
          contentType: "application/json",
          data: function (data) {
            data.Dbname = dbName;
            data.Projectname = projectName;
            data.Dbversion = dbVersion;
            data.Datatype = dataType;

            return JSON.stringify(data);
          },
          "dataSrc": function (json) {
            if (json.data != '0') {
              return json.data;
            } else {
              return json;
            }
           
          },
          error: function (e) {
          },
        },
        autofill: true,
        responsive: true
      });
    }
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    this.spinnerService.hide();
  }
/** Cross Reference by Brands Data selection request for an api to view Cross Reference by Brands data end **/

/** CEC-EDID Data selection request for an api to view CEC-EDID data start **/

  cecEdidBrands() {
    
    if (this.tabsProject != undefined) {
      
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == this.version_list);
        this.resultProjArr = resultFetchArr;
      }
    }
    let dataTypeSelection = 0;
    if (this.Datatype == 8) {
      dataTypeSelection = 5;
    }
    if (this.Datatype == 9) {
      dataTypeSelection = 6;
    }
    if (this.Datatype == 10) {
      dataTypeSelection = 4;
    }
    if (this.Datatype == 11) {
      dataTypeSelection = 1;

    }
    if (this.Datatype == 12) {
      dataTypeSelection = 2;
    }
    if (this.Datatype == 13) {
      dataTypeSelection = 3;
    }
    if (this.Datatype == 14) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 16) {
      dataTypeSelection = 9;
    }

    if (this.resultProjArr.length != 0) {
      var dbName = this.resultProjArr[0]['dbPath'];
      var projectName = this.resultProjArr[0]['projectname'];
      if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
        this.version_list = "";
      }
      var dbVersion = this.version_list;
      var dataType = dataTypeSelection;
      var brandName = this.brand_list;
      $('#cecEdidDataView').DataTable({
        "bProcessing": true,
        "bServerSide": true,
        "bDestroy": true,
        "bFilter": false,
        "bRetrieve": true,
        "autoWidth": false,
        "searching": true,
        "ordering": true,
        "fixedHeader": true,
        "sScrollY": "235px",
        "scrollX": true,
        "bScrollCollapse": true,
        "language": {
          "processing": "Processing.. Please Wait..."
        },
        drawCallback: function () {
          $('.dataTables_scroll table').css({ display: 'inline-table' });
          $('.dataTables_scrollBody table').css({ display: 'table' });
        },
        ajax: {
          type: "POST",
          url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
          contentType: "application/json",
          data: function (data) {
            data.Dbname = dbName;
            data.Projectname = projectName;
            data.Dbversion = dbVersion;
            data.Datatype = dataType;

            return JSON.stringify(data);
          },
          "dataSrc": function (json) {
            if (json.data != '0') {
              if (brandName === 'CEC-EDID Data') {
                if (json.data.length > 0) {
                  for (var i = 0, ien = json.data.length; i < ien; i++) {
                    json.data[i][6] = '<button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-edid" value="' + json.data[i][6] + '"><i class="fa fa-eye" aria-hidden="true"></i></button>';
                  }
                }
              }
              return json.data;
            } else {
              return json;
            }
            
          },
          error: function (e) {
          },
        },
        autofill: true,
        responsive: true
      });
    }

    var self = this;
    $('#cecEdidDataView').on('click', '.btn-edid', function () {

      var setEdid = $(this).val();
      self.viewEdidData(setEdid);
    });

    $('#cecEdidDataView').on('click', '.btn-edid128', function () {

      var setEdid = $(this).val();
      self.viewEdid128Data(setEdid);
    });
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    this.spinnerService.hide();
  }

/** CEC-EDID Data selection request for an api to view CEC-EDID data end **/

/** CEC Only Data selection request for an api to view CEC Only data start **/
  cecOnly() {

    if (this.tabsProject != undefined) {

      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == this.version_list);
        this.resultProjArr = resultFetchArr;
      }
    }
    let dataTypeSelection = 0;
    if (this.Datatype == 8) {
      dataTypeSelection = 5;
    }
    if (this.Datatype == 9) {
      dataTypeSelection = 6;
    }
    if (this.Datatype == 10) {
      dataTypeSelection = 4;
    }
    if (this.Datatype == 11) {
      dataTypeSelection = 1;

    }
    if (this.Datatype == 12) {
      dataTypeSelection = 2;
    }
    if (this.Datatype == 13) {
      dataTypeSelection = 3;
    }
    if (this.Datatype == 14) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 16) {
      dataTypeSelection = 9;
    }

    if (this.resultProjArr.length != 0) {
      var dbName = this.resultProjArr[0]['dbPath'];
      var projectName = this.resultProjArr[0]['projectname'];
      if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
        this.version_list = "";
      }
      var dbVersion = this.version_list;
      var dataType = dataTypeSelection;
      $('#cecOnlyDataView').DataTable({
        "bProcessing": true,
        "bServerSide": true,
        "bDestroy": true,
        "bFilter": false,
        "bRetrieve": true,
        "autoWidth": false,
        "searching": true,
        "ordering": true,
        "fixedHeader": true,
        "sScrollY": "235px",
        "scrollX": true,
        "bScrollCollapse": true,
        "language": {
          "processing": "Processing.. Please Wait..."
        },
        drawCallback: function () {
          $('.dataTables_scroll table').css({ display: 'inline-table' });
          $('.dataTables_scrollBody table').css({ display: 'table' });
        },
        ajax: {
          type: "POST",
          url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
          contentType: "application/json",
          data: function (data) {
            data.Dbname = dbName;
            data.Projectname = projectName;
            data.Dbversion = dbVersion;
            data.Datatype = dataType;

            return JSON.stringify(data);
          },
          "dataSrc": function (json) {
            if (json.data != '0') {
              
              return json.data;
            } else {
              return json;
            }

          },
          error: function (e) {
          },
        },
        autofill: true,
        responsive: true
      });
    }

    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    this.spinnerService.hide();
  }
/** CEC Only Data selection request for an api to view CEC Only data end **/

/** EDID Only Data selection request for an api to view EDID Only data start **/
  edidOnly() {

    if (this.tabsProject != undefined) {

      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == this.version_list);
        this.resultProjArr = resultFetchArr;
      }
    }
    let dataTypeSelection = 0;
    if (this.Datatype == 8) {
      dataTypeSelection = 5;
    }
    if (this.Datatype == 9) {
      dataTypeSelection = 6;
    }
    if (this.Datatype == 10) {
      dataTypeSelection = 4;
    }
    if (this.Datatype == 11) {
      dataTypeSelection = 1;

    }
    if (this.Datatype == 12) {
      dataTypeSelection = 2;
    }
    if (this.Datatype == 13) {
      dataTypeSelection = 3;
    }
    if (this.Datatype == 14) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 16) {
      dataTypeSelection = 9;
    }

    if (this.resultProjArr.length != 0) {
      var dbName = this.resultProjArr[0]['dbPath'];
      var projectName = this.resultProjArr[0]['projectname'];
      if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
        this.version_list = "";
      }
      var dbVersion = this.version_list;
      var dataType = dataTypeSelection;
      var brandName = this.brand_list;
      $('#edidOnlyDataView').DataTable({
        "bProcessing": true,
        "bServerSide": true,
        "bDestroy": true,
        "bFilter": false,
        "bRetrieve": true,
        "autoWidth": false,
        "searching": true,
        "ordering": true,
        "fixedHeader": true,
        "sScrollY": "235px",
        "scrollX": true,
        "bScrollCollapse": true,
        "language": {
          "processing": "Processing.. Please Wait..."
        },
        drawCallback: function () {
          $('.dataTables_scroll table').css({ display: 'inline-table' });
          $('.dataTables_scrollBody table').css({ display: 'table' });
        },
        ajax: {
          type: "POST",
          url: `${environment.apiUrl}/api/UI/GetPaginatedData`,
          contentType: "application/json",
          data: function (data) {
            data.Dbname = dbName;
            data.Projectname = projectName;
            data.Dbversion = dbVersion;
            data.Datatype = dataType;

            return JSON.stringify(data);
          },
          "dataSrc": function (json) {
            if (json.data != '0') {
              if (brandName == 'EDID Only') {
                if (json.data.length > 0) {
                  for (var i = 0, ien = json.data.length; i < ien; i++) {
                    json.data[i][4] = '<button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-edid128" value="' + json.data[i][4] + '"><i class="fa fa-eye" aria-hidden="true"></i></button>';
                  }
                }
              }
              return json.data;
            } else {
              return json;
            }

          },
          error: function (e) {
          },
        },
        autofill: true,
        responsive: true
      });
    }
    var self = this;
    $('#edidOnlyDataView').on('click', '.btn-edid128', function () {

      var setEdid = $(this).val();
      self.viewEdid128Data(setEdid);
    });

    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    this.spinnerService.hide();
  }
/** EDID Only Data selection request for an api to view EDID Only data end **/

/** Sending selected projects in Brand Library to Data Configuration page if its selected in breadcrumbs start  **/
  dataConfig() {
    let projSelectedData = [];
    for (var i = 0; i < this.projectNames.length; i++) {
      projSelectedData.push(this.projectNames[i]['item_text']);
    }
    this.projectNames = projSelectedData;
    localStorage.setItem('BrandLibraryProjects', JSON.stringify(this.projectNames));
    this.router.navigate(['/data-configuration-list']);
  }

/** Sending selected projects in Brand Library to Data Configuration page if its selected in breadcrumbs end  **/

  clients() {
    localStorage.removeItem('fetchedProj');
    let projSelectedData = [];
    for (var i = 0; i < this.projectNames.length; i++) {
      projSelectedData.push(this.projectNames[i]['item_text']);
    }
    this.projectNames = projSelectedData;
    localStorage.setItem('BrandLibraryProjects', JSON.stringify(this.projectNames));
    this.router.navigate(['/clients'])
      .then(() => {
      location.reload();
    });
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }


  get f() { return this.saveUpdateData.controls; }

 
/** Save Functionality for Brand if new Brand is added using New Option start  **/
  onsaveUpdateDataSubmit() {
   
    this.submitted = true;
    if (this.saveUpdateData.invalid) {
      return;
    }
    let brand = this.brand_name;
    let brandCode = this.brand_code;
   let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue; let Dbversion = searchDbName[0]['embeddedDbVersion'];
      this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, null, this.brand_name, this.brand_code, null, null, null,
          null, null, null, null, null, null, null, null, null, null, 1, 1)
          .subscribe(value => {
            $("#editDataModal .close").click()
            if (value.data === '0') {
              this.toastr.warning(value.message, '');
            } else {
              this.toastr.success(value.message, '');
              let userName = localStorage.getItem('userName'); let Datasection = 'Brands';
              let recordCount = 1; let Updateadddescription = '' + brand + ',' + brandCode + '';
              let Updatestatus = 1;
              this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Updatestatus)
                .subscribe(value => {
                  
                });
              if (this.oldValue == undefined && this.modalCount == 0 && this.count == 0) {
                $('#loadView').DataTable().ajax.reload();
              } else {
                $('#BrandView').DataTable().ajax.reload();
              }
            }
          });  
  }
/** Save Functionality for Brand if new Brand is added using New Option end  **/
 
  get c() { return this.saveUpdateBrandInfoCec.controls; }

/** Save Functionality for BrandInfoCEC data using New Option start  **/
  onsaveBrandInfoCecSubmit() {

    this.cecsubmitted = true;
    if (this.saveUpdateBrandInfoCec.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);
    
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue; let Dbversion = searchDbName[0]['embeddedDbVersion'];
    
    if (this.cec_vendorId.length < 6) {
      if (this.cec_vendorId.length === 1) {
        this.cec_vendorId = '00000' + this.cec_vendorId;
      }
      if (this.cec_vendorId.length === 2) {
        this.cec_vendorId = '0000' + this.cec_vendorId;
      }
      if (this.cec_vendorId.length === 3) {
        this.cec_vendorId = '000' + this.cec_vendorId;
      }
      if (this.cec_vendorId.length === 4) {
        this.cec_vendorId = '00' + this.cec_vendorId;
      }
      if (this.cec_vendorId.length === 5) {
        this.cec_vendorId = '0' + this.cec_vendorId;
      }
    }
    let cecVendor = this.cec_vendorId.toUpperCase();
    let Device = this.device_data; let brand = this.cec_brandName; let brandcode = this.cec_brandcode;
    this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, this.device_data, this.cec_brandName, this.cec_brandcode, null, null, null,
      null, null, null, null, null, null, null, cecVendor, null, null, 2, 1)
      .subscribe(value => {
        $("#editDataModal .close").click()
        if (value.data === '0') {
          this.toastr.warning(value.message, '');
        } else {
          this.spinnerService.show();
          if (this.oldValue == undefined && this.modalCount == 0 && this.count == 0) {
            $('#loadView').DataTable().ajax.reload();
          } else {
            $('#CecView').DataTable().ajax.reload();
          }
          this.spinnerService.hide();
          this.toastr.success(value.message, '');
          let userName = localStorage.getItem('userName'); let Datasection = 'Brand Info CEC';
          let recordCount = 1; 
          let Updateadddescription = '' + Device + ',' + brand + ',' + brandcode + ',' + cecVendor+ '';
          let Updatestatus = 1;
          this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Updatestatus)
            .subscribe(value => {
             
            });
        }
      });  
  }
/** Save Functionality for BrandInfoCEC data using New Option end  **/

  get e() { return this.saveUpdateBrandInfoEdid.controls; }

/** Save Functionality for BrandInfoEDID data using New Option start  **/

  onsaveBrandInfoEdidSubmit() {

    this.edidsubmitted = true;
    if (this.saveUpdateBrandInfoEdid.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);
    
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue; let Dbversion = searchDbName[0]['embeddedDbVersion'];
    let Edid_Brand = this.edid_brand.toUpperCase();
    let Device = this.edid_device; let brand = this.edid_brandName; let brandcode = this.edid_brandcode;
    this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, this.edid_device, this.edid_brandName, this.edid_brandcode, null, null, null,
      null, null, null, null, null, null, null, null, null, Edid_Brand, 3, 1)
      .subscribe(value => {
        $("#editDataModal .close").click()
        if (value.data === '1') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Brand Info EDID';
          let recordCount = 1; 
          let Updateadddescription = '' + Device + ',' + brand + ',' + brandcode + ',' + Edid_Brand + '';
          let Updatestatus = 1;
          this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Updatestatus)
            .subscribe(value => {
              
            });
          this.spinnerService.show();
          if (this.oldValue == undefined && this.modalCount == 0 && this.count == 0) {
            $('#loadView').DataTable().ajax.reload();
          } else {
            $('#EdidView').DataTable().ajax.reload();
          }
          this.spinnerService.hide();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }
/** Save Functionality for BrandInfoEDID data using New Option end  **/

 
  get g() { return this.saveUpdateComponentData.controls; }

/** Save Functionality for Component data using New Option start  **/

  onsaveComponentDataSubmit() {

    this.componentsubmitted = true;
    if (this.saveUpdateComponentData.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
      
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue; let Dbversion = this.version_list;
    let codesetFileName = this.componentFile; let codesetData = this.base64CompData; let Cschecksum = this.checksumCompData;
    let componentModel = this.component_model.toUpperCase();
    this.component_modelx = componentModel;
    if (componentModel != null && componentModel != undefined) {
      this.component_modelx = componentModel.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      }
    let model_x = this.component_modelx;
    let Device = this.component_device; let brand = this.component_brandName; let codeset = this.component_codeset;
    this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, this.component_device, this.component_brandName, null, componentModel, model_x, this.component_codeset,
        null, null, null, null, null, null, null, null, null, null, 6, 1)
        .subscribe(value => {
          $("#editDataModal .close").click()
          if (value.data === '0') {
            this.toastr.warning(value.message, '');
          } else {
            let userName = localStorage.getItem('userName'); let Datasection = 'Component Data';
            let recordCount = 1; 
            let Updateadddescription = '' + Device + ',' + brand + ',' + model_x + ',' + codeset + '';
            let Updatestatus = 1;
            this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Updatestatus)
              .subscribe(value => {
               
              });
            this.spinnerService.show();
            if (this.oldValue == undefined && this.modalCount == 0 && this.count == 0 && this.changeVersionCount != 1) {
              $('#loadView').DataTable().ajax.reload();
            } else {
              $('#componentDataView').DataTable().ajax.reload();
            }
            this.spinnerService.hide();
            this.toastr.success(value.message, '');
          }
        });
  }
/** Save Functionality for Component data using New Option end  **/

/** resetting codeset selection if popup is closed  **/
  closePopup() {
    $('#codeset-edit-file-info').html('');
    $('#codeset-selector').val('');
    $('#codeset-selector').html('');
    $("#alertCodesetModal .close").click();
  }

/** Submitting data of codeset if new codeset file is choosen  **/
  submitEditCodeset() {
    $("#alertCodesetModal .close").click();
    this.onsaveEditCodesetsSubmit();
  }

/** Choosing Codeset file if new codeset is choosen by adding new option start  **/
  CodesetsFile(evt) {
    if ($('#my-file-codeset-selector').val() != '') {
      var filename = $('#my-file-codeset-selector').val().replace(/C:\\fakepath\\/i, '');
      var afterDot = filename.toString().split(".")[0];
      this.editedCodeset = '';
    }
    var files = evt.target.files;
    var file = files[0];
    this.codesetFile = file['name'].slice(0, -4);
    if (this.codesetFile != '' && this.codesetFile != undefined) {
      this.submittedFile = false;
    }
    if (this.editedCodeset != '') {
      if (this.codesetFile != this.editedCodeset) {
        $('#alertModalButton').click();
      }
    }
    
    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._codesetReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }
  _codesetReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    var base64 = btoa(binaryString);
    this.codesetDataValue = base64;
    if (base64 != undefined && base64 != '') {
      var getArr = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
      var result = 0;
      getArr.forEach(function (value) {
        result += value;
      });
      var checkResult = result & 0xFF;
      var hexString = checkResult.toString(16);
      this.codesetChecksum = hexString.toUpperCase();
      if (this.codesetChecksum.length == 1) {
        this.codesetChecksum = '0' + this.codesetChecksum;
      }
    }
  }
/** Choosing Codeset file if new codeset is choosen by adding new option end  **/

/** Save functionality to save the Codeset in New Option start **/
  onsaveCodesetsSubmit() {
    if (this.codesetFileName != undefined && this.codesetFileName != null) {
      this.submittedFile = false;
      let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
      
      let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue; let Dbversion = this.version_list;
      let codeset = this.codesetFile; let codesetData = this.codesetDataValue; let cschecksum = this.codesetChecksum;
      this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, null, null, null, null, null, codeset, codesetData,
        cschecksum, null, null, null, null, null, null, null, null, 4, 1)
        .subscribe(value => {
          $("#editDataModal .close").click()
          this.codesetFileName = null;
          $('#codeset-upload-file-info').html('');
          if (value.data === '1') {
            let userName = localStorage.getItem('userName'); let Datasection = 'Codesets';
            let recordCount = 1; 
            let Updateadddescription = '' + codeset + ',' + codesetData + ',' + cschecksum + '';
            let Updatestatus = 1;
            this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Updatestatus)
              .subscribe(value => {
                
              });
            this.spinnerService.show();
            if (this.oldValue == undefined && this.modalCount == 0 && this.count == 0 && this.changeVersionCount != 1) {
              $('#loadView').DataTable().ajax.reload();
            } else {
              $('#codeSetsView').DataTable().ajax.reload();
            }
            this.spinnerService.hide();
            this.toastr.success(value.message, '');
          } else {
            this.toastr.warning(value.message, '');
          }
        });
    } else {
      this.submittedFile = true;
    }
  }
/** Save functionality to save the Codeset in New Option end **/

/** Edit Codeset functionality to update the codeset using Edit Option start **/
  onsaveEditCodesetsSubmit() {
    if (this.EditcodesetFileName != undefined && this.EditcodesetFileName != null) {
      this.submittedFile = false;
      let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);

      let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue; let Dbversion = this.version_list;
      let codeset = this.editedCodeset; let codesetData = this.codesetDataValue; let cschecksum = this.codesetChecksum;
      let recordid = this.recordId;
      this.mainService.getSaveEditCodesetDetailsInfo(Dbname, Projectname, Dbversion, null, null, null, null, null, codeset, codesetData,
        cschecksum, null, null, null, null, null, null, null, null, 4, 3,recordid)
        .subscribe(value => {
          $("#edidCodesetModal .close").click()
          this.EditcodesetFileName = null;
          $('#codeset-edit-file-info').html('');
          if (value.data === '1') {
            let userName = localStorage.getItem('userName'); let Datasection = 'Codesets';
            let recordCount = 1;
            let Updateadddescription = '' + codeset + ',' + codesetData + ',' + cschecksum + ',' + recordid + '';
            let Updatestatus = 1;
            this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Updatestatus)
              .subscribe(value => {

              });
            this.spinnerService.show();
            if (this.oldValue == undefined && this.modalCount == 0 && this.count == 0 && this.changeVersionCount != 1) {
              $('#loadView').DataTable().ajax.reload();
            } else {
              $('#codeSetsView').DataTable().ajax.reload();
            }
            this.spinnerService.hide();
            this.toastr.success(value.message, '');
          } else {
            this.toastr.warning(value.message, '');
          }
        });
    } else {
      this.submittedFile = true;
    } 
  }
/** Edit Codeset functionality to update the codeset using Edit Option end **/

  get r() { return this.saveUpdateCrossReferenceBrands.controls; }

/** Save functionality to save the Cross Reference by Brands Using New Option start **/

  onsaveCrossReferenceBrandsSubmit() {
    
    this.crsubmitted = true;
    if (this.saveUpdateCrossReferenceBrands.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
   
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue; let Dbversion = this.version_list;
    let Device = this.cr_device; let brand = this.cr_brandName; let codeset = this.cr_codeset; let rank = this.cs_rank;
    this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, this.cr_device, this.cr_brandName, null, null, null, this.cr_codeset,
      null, null, null, null, null, null, this.cs_rank, null, null, null, 5, 1)
      .subscribe(value => {
        
        $("#editDataModal .close").click()
        if (value.data != '0') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Cross Reference by Brands';
          let recordCount = 1;
          let Updateadddescription = '' + Device + ',' + brand + ',' + codeset + ',' + rank + '';
          let Updatestatus = 1;
          this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Updatestatus)
            .subscribe(value => {
              
            });
          this.spinnerService.show();
          if (this.oldValue == undefined && this.modalCount == 0 && this.count == 0 && this.changeVersionCount != 1) {
            $('#loadView').DataTable().ajax.reload();
          } else {
            $('#crossReferenceBrandsView').DataTable().ajax.reload();
          }
          this.spinnerService.hide();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }

/** Save functionality to save the Cross Reference by Brands Using New Option start **/

/** function to convert bits value to alphabet start **/

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
/** function to convert bits value to alphabet end **/

/** function to convert hexa value start **/
  convertHexa(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }
/** function to convert hexa value end **/

  get m() { return this.saveUpdateCecEdidData.controls; }

/** Save Functionality to add CEC EDID data if New Option is selected start **/

  onsaveCecEdidDataSubmit() {
    this.cecEdidsubmitted = true;
    if (this.saveUpdateCecEdidData.invalid) {
      return;
    }
    let checkEdidData;
    if (this.ce_edid != null && this.ce_edid != undefined) {
      checkEdidData = this.ce_edid.includes('00 FF FF FF FF FF FF 00');
    } 
    //let checkEdidData = this.ce_edid.includes('00 FF FF FF FF FF FF 00');
    if (this.ce_vendorId != undefined || this.ce_osd_string != undefined || this.ce_edid != undefined) {
      if (this.ce_edid != undefined && checkEdidData == true) {
        $('#checkEdidValid').css('border', '1px solid #ced4da');
        this.edidError = false;
        this.cecEdidValidate();
      } if (this.ce_edid != undefined && checkEdidData == false) {
        this.edidError = true;
        this.cecEdidsubmitted = false;
      }
      if (this.ce_edid == undefined) {
        this.cecEdidValidate();
      }

    }
  }


    cecEdidValidate() {
      if (this.ce_vendorId != undefined || this.ce_osd_string != undefined || this.ce_edid != undefined) {
      let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
      let RowId = 1; let device = this.ce_device; let brand = this.ce_brand; let model = this.ce_model;
      if (model != undefined) {
        var filterChars = model.replace(/[^a-zA-Z0-9]/g, '');
      }
      let modelx = filterChars;
      let region = this.ce_region; let country = this.ce_country;
      let edid;
      if (this.ce_edid == undefined) {
        edid = null;
      } else {
        edid = this.ce_edid;
      }

      let edid128 = '';
      if (edid != undefined) {
        if (edid.length < 383) {
          edid128 = '';
        } else {
          edid128 = edid.slice(0, 383);
        }
      } else {
        edid128 = null;
        }
      var edidBrand = edid;
      let finalBit;
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
          finalBit = this.convertAlpha(getBit.slice(0, 5)) + '' + this.convertAlpha(getBit.slice(5, 10)) + '' + this.convertAlpha(getBit.slice(10, 15));
        }
      } else {
        finalBit = null;
      }
      let edidbrand = finalBit;
      let vendorid; let osdstr;
      if (this.ce_vendorId == undefined) {
        vendorid = null;
      } else {
        vendorid = this.ce_vendorId.toUpperCase();
      }

      let iscecpresent = parseInt(this.cec_present);
        let iscecenabled = parseInt(this.cec_enabled); let codeset = this.ce_codeset;
        let osd;
        if (this.ce_osd_string != undefined && this.ce_osd_string != null) {
          osd = this.convertHexa(this.ce_osd_string);
        } else {
          osd = null;
        }
      if (this.ce_osd_string == undefined || this.ce_osd_string == null) {
        osdstr = null;
      } else {
        osdstr = this.ce_osd_string.toUpperCase();
      }
      let Projectname = this.tabValue; let Dbversion = this.version_list;

      let Dbname = searchDbName[0]['dbinstance']; let JsonCecEdidtype = [{
        "RowId": RowId, "device": device, "brand": brand, "model": model, "modelx": modelx, "region": region, "country": country,
        "edid": edid, "edidbrand": edidbrand, "edid128": edid128, "vendorid": vendorid, "osd": osd, "osdstr": osdstr,
        "iscecpresent": iscecpresent, "iscecenabled": iscecenabled, "codeset": codeset
      }];

      this.mainService.insertCecEdidData(Dbname, Projectname, Dbversion, JsonCecEdidtype)
        .subscribe(value => {
          $("#editDataModal .close").click();
          if (value.statusCode == "200" && value.message == "SUCCESS" && value.data != 0) {
            let userName = localStorage.getItem('userName'); let Datasection = 'CEC EDID Data';
            let recordCount = 1;
            let Updateadddescription = '' + device + ',' + brand + ',' + model + ',' + modelx + ',' + region + ',' + country + ',' + edid +
              ',' + edidbrand + ',' + edid128 + ',' + vendorid + ',' + osd + ',' + osdstr + ',' + iscecpresent + ',' + iscecenabled + ',' + codeset +'';
            let Updatestatus = 1;
            this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Updatestatus)
              .subscribe(value => {

              });
            this.spinnerService.show();
            if (this.oldValue == undefined && this.modalCount == 0 && this.count == 0 && this.changeVersionCount != 1) {
              $('#loadView').DataTable().ajax.reload();
            } else {
              $('#cecEdidDataView').DataTable().ajax.reload();
            }
            this.spinnerService.hide();
            this.toastr.success('Value Inserted Successfully', '');
          } else {
            this.toastr.warning(value.message, '');
          }
        });
    } else {
      $('#checkInputValid').css('border', '1px solid #bb2a38');
      this.vendorError = true;
    }
  }

/** Save Functionality to add CEC EDID data if New Option is selected end **/

/** Vendor Validation in CEC EDID add Option start **/
  vendorMod() {
    if (this.ce_vendorId != undefined && this.ce_vendorId != null) {
      this.vendorError = false; 
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if (this.ce_osd_string != undefined && this.ce_osd_string != null) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if (this.ce_edid != undefined && this.ce_edid != null) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if (this.ce_edid != undefined) {
      let checkEdid = this.ce_edid.includes('00 FF FF FF FF FF FF 00');
      if (checkEdid == true) {
        $('#checkEdidValid').css('border', '1px solid #ced4da');
        this.edidError = false;
      } else {
        this.edidError = true;
      }
    }
    if (this.ce_edid == undefined && this.ce_vendorId != undefined || this.ce_osd_string != undefined) {
      this.edidError = false;
    }
  }
/** Vendor Validation in CEC EDID add Option end **/

  modalClose() {
    this.submittedFile = false;
    this.componentsubmitted = false;
    this.saveUpdateComponentData.reset();
    this.edidsubmitted = false;
    this.saveUpdateBrandInfoEdid.reset();
    this.cecsubmitted = false;
    this.saveUpdateBrandInfoCec.reset();
    this.submitted = false;
    this.saveUpdateData.reset();
    this.crsubmitted = false;
    this.saveUpdateCrossReferenceBrands.reset();
    this.codesetFileName = null;
    this.cecEdidsubmitted = false;
    this.saveUpdateCecEdidData.reset();
    $('#codeset-upload-file-info').html('');
  }

  newAll() {
    localStorage.removeItem('updatebrandLibraryProjects');
    
    let pushArr = [];
    for (var i = 0; i < this.projectNames.length; i++) {
      pushArr.push(this.projectNames[i]['item_text']);
    }
   
    localStorage.setItem('updatebrandLibraryProjects', JSON.stringify(pushArr));
    this.router.navigate(['/update-brand']);
  }

/** Brand Code Generation if Brand is selected in autocomplete option in Add Brands start **/
  brandSelects() {
    if (this.cec_brandName != null) {
      let selectedBrand = this.cec_brandName;
      let filterBrand: any = this.edidBrands.filter(u =>
        u.brandName == selectedBrand);
      if (filterBrand.length > 0) {
        this.cec_brandcode = filterBrand[0]['brandCode'];
      } else {
        this.cec_brandName = '';
        this.cec_brandcode = '';
      }
    }
  }
/** Brand Code Generation if Brand is selected in autocomplete option in Add Brands end **/

/** Brand Code Generation if Brand is selected in autocomplete option in Add BrandInfo Edid start **/
  brandEdidSelects() {
    if (this.edid_brandName != null) {
      let selectedEdidBrand = this.edid_brandName;
      let filterEdidBrand: any = this.edidBrands.filter(u =>
        u.brandName == selectedEdidBrand);
      if (filterEdidBrand.length > 0) {
        this.edid_brandcode = filterEdidBrand[0]['brandCode'];
      } else {
        this.edid_brandName = '';
        this.edid_brandcode = '';
      }
      
    }
  }
/** Brand Code Generation if Brand is selected in autocomplete option in Add BrandInfo Edid end **/

/** Brand Code Generation if Brand is selected in autocomplete option in Add BrandInfo CEC start **/

  brandCECSelect() {

    if (this.ce_brand != null) {
      let selectedBrand = this.ce_brand;
      let filterBrand: any = this.edidBrands.filter(u =>
        u.brandName == selectedBrand);
      if (filterBrand.length > 0) {
        this.ce_brandcode = filterBrand[0]['brandCode'];
      } else {
        this.ce_brand = '';
        this.ce_brandcode = '';
      }
    }
  }
/** Brand Code Generation if Brand is selected in autocomplete option in Add BrandInfo CEC end **/

/** Bin Download Functionality start **/

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
/** Bin Download Functionality end **/

}

