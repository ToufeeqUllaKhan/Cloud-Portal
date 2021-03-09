import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, merge } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { Data } from '../model/data';
import { User } from '../model/user';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { BtnCellRenderer } from "./btn-cell-renderer.component";
import { CodesetDownloadCellRenderer } from "./codesetdownload-cell-renderer.component";
import { EdidviewCellRenderer } from "./edidview-cell-renderer.component";
var BrandListData = [];
var lodash = require('lodash');

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
  saveUpdateCecEdidData: FormGroup; saveEditCecEdidData: FormGroup; saveUpdateRegionData: FormGroup;
  saveEditBrand: FormGroup; saveEditBrandInfoCec: FormGroup; saveEditBrandInfoEdid: FormGroup;
  saveEditComponentData: FormGroup; saveEditCrossReferenceBrands: FormGroup; saveEditRegionData: FormGroup;
  saveEditCeconlyData: FormGroup; saveEditEdidonlyData: FormGroup;
  submitted: Boolean = false; cecsubmitted: Boolean = false;
  edidsubmitted: Boolean = false; componentsubmitted: Boolean = false;
  crsubmitted: Boolean = false; cecEdidsubmitted: Boolean = false;
  editsubmitted: Boolean = false; editcecsubmitted: Boolean = false;
  editedidsubmitted: Boolean = false; editcomponentsubmitted: Boolean = false;
  editcrsubmitted: Boolean = false; editceconlysubmitted: Boolean = false; editEdidonlysubmitted: Boolean = false;
  projects: Array<any> = [];
  dropdownSettings: any = {}; columnSettings: any = {}; ShowFilter = false;
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
  isCecVisible: Boolean = true; regioncountrysubmitted: Boolean = false; editregioncountrysubmitted: Boolean = false;
  isBrandModel: Boolean = false; isBrandInfoCec: Boolean = false; isRegion: Boolean = false;
  isBrandInfoEdid: Boolean = false; isComponentData: Boolean = false;
  isCodesets: Boolean = false; isCrossReferencebyBrands: Boolean = false; isCecEdidData: Boolean = false;
  submittedFile: Boolean = false; componentFile: any; base64CompData: any; checksumCompData: any;
  isVersionDataVisible: Boolean = false; changeVersionCount: any = 0; ce_brand: any; ce_brandcode: any;
  isMasterBrand: Boolean = true; isbrandInfoCec: Boolean = true; isbrandInfoEdid: Boolean = true; iscomponentData: Boolean = true;
  iscodeSets: Boolean = true; iscrossReferenceBrands: Boolean = true; isCecEdid: Boolean = true; isregion: Boolean = true; iscecOnly: Boolean = true;
  isCecOnly: Boolean = false; isEdidOnly: Boolean = false; isedidOnly: Boolean = true;
  brand_name: any; brand_code: any; codesetFileName: any; device_data: any = null; cec_brandName: any; cec_brandcode: any = null; cec_vendorId: any;
  edid_device: any = null; edid_brandName: any = null; edid_brandcode: any = null; edid_brand: any; component_device: any = null; component_brandName: any = null;
  component_model: any; component_modelx: any; component_country: any = null; cr_device: any = null; cr_brandName: any = null; cr_codeset: any = null; cs_rank: any;
  codesetFile: any; codesetDataValue: any; codesetChecksum: any; component_codeset: any = null; codeSetsData = [];
  tabValue: any; noData: Boolean = false; ce_device: any = null; ce_region: any = null; ce_country: any = null; ce_model: any; ce_vendorId: any;
  ce_osd: any; ce_edid: any; ce_codeset: any = null; cec_enabled: any = null; cec_present: any = null;
  brandTable: Boolean = false; CecTable: Boolean = false; EdidTable: Boolean = false;
  CodesetTable: Boolean = false; CrossRefTable: Boolean = false; ComponentTable: Boolean = false;
  EdidData: any; vendorError: Boolean = false; edidError: Boolean = false;
  oldValue: string; previous: any; selectPrev: any; count: any = 0; modalCount: any = 0;
  currentVal: any; edidDataView: Boolean = false; edid128DataView: Boolean = false; Edid128Data: any;
  EditcodesetFileName: any; editedCodeset: any;
  editedBrandname: any; editedBrandcode: any;
  finalArray = []; edidDevices = []; edidBrands = []; arrayJsonData = []; editedComponentCountry: any;
  editedComponentRegion: any;
  country: any[];
  user: User = new User(); recordId: any; ProjectList = []; Countrycode: any; EditCountrycode: any; RegionrecordId: any;
  Regioncode: any; EditRegioncode: any; brandrecordId: any; editedcecDevice: any; editedcecBrandname: any; editedcecBrandcode: any; editedcecVendor: any; cecrecordId: any;
  Country: any; EditCountry: any; editedEdidDevice: any; editedEdidBrandname: any; editedEdidBrandcode: any; editedEdidBrand: any; EdidrecordId: any; editedCrossDevice: any;
  Region: any; EditRegion: any; editedCrossBrandname: any; editedCrossBrandcode: any; editedCrossCodeset: any; editedCrossRank: any; CrossrecordId: any;
  editedComponentDevice: any; editedComponentBrandname: any; editedComponentModel: any; editedComponentModelx: any; editedComponentCodeset: any; ComponentrecordId: any;
  editedCeconlyDevice: any; editedCeconlyBrandname: any; editedCeconlyCountry: any;
  editedCeconlyModel: any; editedCeconly_Vendor: any; editedCeconly_OSD: any; editedCeconlyCodeset: any;
  CeconlyrecordId: any; editedEdidonlyDevice: any; editedEdidonlyBrandname: any; editedEdidonlyCountry: any;
  editedEdidonlyModel: any; editedEdidonly_EDID128: any; editedEdidonly_EDIDBrand: any; editedEdidonlyCodeset: any;
  EdidonlyrecordId: any; editedEdidonlyregion: any; editedCeconlyregion: any; regionlist = []; countrylist = [];
  ipAddress: any; role: any; Actions: boolean = false; parameters: any; editcountrylist = [];
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;

  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  BrandModel: boolean = false;
  ComponentData: boolean = false;
  Codesets: boolean = false;
  Regioncountry: boolean = false;
  SelectedBrand: string;
  report_visiblity: any = [];
  columns_visible: any = [];
  columns: any = [];

  public gridApi;
  public gridColumnApi;
  public frameworkComponents;
  public columnDefs;
  public columnDef;
  public defaultColDef;
  public rowData;
  public paginationNumberFormatter;
  public paginationPageSize;
  public context;
  searchValue: any;
  module: string;
  editedceDevice: any;
  editedceBrand: any;
  editedceRegion: any = null;
  editedceCountry: any = null;
  editedceModel: any;
  editedceVendorId: any;
  editedceOSD: any;
  editedceEdid: any;
  editedceCodeset: any = null;
  UpdateosdHeader: any;
  EditosdHeader: any; osdstring: any; osdhex: any
  checked: boolean;


  constructor(private fb: FormBuilder, private router: Router, private mainService: MainService, private titleService: Title, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private data: Data) {
    this.titleService.setTitle("Data View Library");
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.role = localStorage.getItem('AccessRole');
    this.module = localStorage.getItem('moduleselected')
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
      codesetDownloadCellRenderer: CodesetDownloadCellRenderer,
      edidviewCellRenderer: EdidviewCellRenderer

    };
    this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.showSpinner();
    var self = this;
    $.getJSON("https://api.ipify.org?format=json",
      function (data) {
        self.dataIpAddress(data.ip);
      });

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
        this.finalArray.forEach(element => {
          element['projectname'] = element['dbinstance'] + '_' + element['projectname']
        })
        const unique = [...new Set(this.finalArray.map(item => item.projectname))];

        let arrData = [];
        for (var i = 0; i < unique.length; i++) {
          arrData.push({ item_id: i, item_text: unique[i] });
        }
        this.ProjectList = arrData;
        let RoleLevel = localStorage.getItem('AccessRole');
        if (RoleLevel != 'Admin') {
          let userName = localStorage.getItem('userName');
          this.mainService.getRoleModule(8, null, null, userName, null)
            .then(value => {
              let filterProjects = []; let clientArray = [];
              clientArray = value.data;
              clientArray.forEach(element => {
                element['name'] = element['dbPath'] + '_' + element['name']
              })
              for (var i = 0; i < clientArray.length; i++) {
                let clientsArray: any = this.ProjectList.filter(u =>
                  (u.item_text == clientArray[i]['name']));
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

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: this.ShowFilter
    };
    this.columnSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
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
        this.mainArr.forEach(element => {
          element['projectname'] = element['dbinstance'] + '_' + element['projectname']
        })
        for (var i = 0; i < Projectname.length; i++) {
          let filterProject: any = this.mainArr.filter(u =>
            (u.projectname == Projectname[i]));

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
          let resultFetchArr: any = this.mainArr.filter(u =>
            u.projectname == Projectname[0] && u.embeddedDbVersion == this.version_list);
          this.resultProjArr = resultFetchArr;
          if (this.resultProjArr.length != 0) {
            let Client = this.resultProjArr[0]['client']; let Region = this.resultProjArr[0]['region'];
            let Dbversion = this.resultProjArr[0]['embeddedDbVersion'];
            let Dbinstance = this.resultProjArr[0]['dbinstance'];
            let dataTypecount = 6
            let projectName = this.resultProjArr[0]['projectname'];
            if (projectName.startsWith(Dbinstance + '_')) {
              projectName = projectName.replace(Dbinstance + '_', '')
            }
            this.mainService.getProjectNames(null, null, null, null, Dbinstance, 18)
              .subscribe(value => {
                let temp = []; let a = []; let temp1 = []; let b = []; let c = [];
                for (i = 0; i < value.data.length; i++) {
                  temp.push(value.data[i]['region'])
                }
                a = temp.filter(u => (u != null) && (u != 'NULL') && (u != ''));
                this.regionlist = a.filter((v, i, a) => a.indexOf(v) === i).sort();

                for (var j = 0; j < value.data.length; j++) {
                  c.push(value.data[j]['country']);
                }
                this.country = c.filter((v, i, a) => a.indexOf(v) === i);
              })
            this.mainService.getProjectNames(Client, Region, projectName, Dbversion, Dbinstance, dataTypecount)
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
                  dataTypeSelection = 9;
                }
                if (this.Datatype == 15) {
                  dataTypeSelection = 8;
                }
                if (this.Datatype == 17) {
                  dataTypeSelection = 7;
                }
                if (this.Datatype == 18) {
                  dataTypeSelection = 11;
                }

                var dbName = this.resultProjArr[0]['dbPath'];
                let dbVersion = this.resultProjArr[0]['embeddedDbVersion'];
                var dataType = dataTypeSelection;
                // var brandName = this.brand_list;
                let search;
                search = {
                  "value": '',
                  "regex": false
                }
                let order = [
                  {
                    "column": 0,
                    "dir": "asc"
                  }
                ];
                if (this.brand_list == 'Brand' || this.brand_list == 'Brand Info CEC' || this.brand_list == 'Brand Info EDID' || this.brand_list == 'Region Country Code') {
                  dbVersion = "";
                  this.isVersionDataVisible = false;
                } else if (this.brand_list == 'Codesets' || this.brand_list == 'Cross Reference By Brands') {
                  dbVersion = this.resultProjArr[0]['embeddedDbVersion'];
                  this.isVersionDataVisible = true;
                }
                this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
                  .subscribe(value => {
                    let temp = parseInt(value.recordsTotal);
                    let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
                    this.parameters = parameter;
                    this.viewdata();
                  })
                if (this.brand_list == 'Component Data' || this.brand_list == 'CEC-EDID Data' || this.brand_list == 'CEC Only' || this.brand_list == 'EDID Only') {
                  let projectName; let datatype = 21;
                  if (this.tabsProject != undefined) {
                    projectName = this.tabsProject;
                  } else {
                    projectName = this.projectNames[0]['item_text'];
                  }
                  if (projectName.startsWith(dbName + '_')) {
                    projectName = projectName.replace(dbName + '_', '')
                  }
                  let versionArr = [];
                  this.mainService.getProjectNames(Client, Region, projectName, null, dbName, datatype)
                    .subscribe(value => {
                      if (value.data.length != 0) {
                        versionArr.push(value.data[0]['version']);
                        this.versions = versionArr;
                        this.version_list = versionArr[0];
                      }
                      dbVersion = this.version_list;
                      this.isVersionDataVisible = true;
                      this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
                        .subscribe(value => {
                          let temp = parseInt(value.recordsTotal);
                          let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
                          this.parameters = parameter;
                          this.viewdata();
                          this.getDropdownValues();
                          this.getCodeSets();
                        })
                    });

                }
                if (this.SelectedBrandName != '') {
                  this.getDropdownValues();
                  this.getCodeSets();
                  $('#osd_string').click();
                  $('#String').click();
                  $("select").prop("disabled", false);
                  $("a").css('pointer-events', 'auto');
                } else {
                  $("select").prop("disabled", false);
                  $("a").css('pointer-events', 'auto');
                }
              });
          }
        }
        /** loading datatable based on selection brand dropdown end **/
      });

    $('#single_download').click(function () {
      self.onBtnExport();
    })
    /** required validations for form **/
    this.saveUpdateData = this.fb.group({
      brandsName: [null, Validators.required],
      brandCode: ['', Validators.required]
    });

    this.saveEditBrand = this.fb.group({
      EditbrandsName: [null, Validators.required],
      EditbrandCode: ['', Validators.required]
    });

    this.saveUpdateBrandInfoCec = this.fb.group({
      deviceValue: ['', Validators.required],
      cecBrandName: ['', Validators.required],
      cecBrandCode: ['', Validators.required],
      cecVendorID: ['', Validators.required]
    });

    this.saveEditBrandInfoCec = this.fb.group({
      EditcecBrandName: ['', Validators.required],
      EditcecBrandCode: ['', Validators.required],
      EditcecVendorID: ['', Validators.required]
    });

    this.saveUpdateBrandInfoEdid = this.fb.group({
      edidDevice: ['', Validators.required],
      edidBrandName: ['', Validators.required],
      edidBrandCode: ['', Validators.required],
      edidBrand: ['', Validators.required]
    });

    this.saveEditBrandInfoEdid = this.fb.group({
      EditedidBrandName: ['', Validators.required],
      EditedidBrandCode: ['', Validators.required],
      EditedidBrand: ['', Validators.required]
    });

    this.saveUpdateComponentData = this.fb.group({
      componentDevice: ['', Validators.required],
      componentBrandName: ['', Validators.required],
      componentModel: ['', Validators.required],
      componentCodeset: ['', Validators.required],
      componentcountry: ['', null]
    });

    this.saveEditComponentData = this.fb.group({
      EditcomponentBrandName: ['', Validators.required],
      EditcomponentModel: ['', Validators.required],
      EditcomponentCodeset: ['', Validators.required],
      Editcomponentcountry: ['', null]
    });

    this.saveUpdateCrossReferenceBrands = this.fb.group({
      crDevice: ['', Validators.required],
      crBrandName: ['', Validators.required],
      crCodeset: ['', Validators.required],
      csRank: ['', Validators.required]
    });

    this.saveEditCrossReferenceBrands = this.fb.group({
      EditcrBrandName: ['', Validators.required],
      EditcrCodeset: ['', Validators.required],
      EditcsRank: ['', Validators.required]
    });

    this.saveUpdateCodesets = this.fb.group({
      CodeSetData: ['', null]
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
      ceOSD: ['', null],
      ceEdid: ['', null],
      ceCodeset: ['', Validators.required],
      cecPresent: ['', Validators.required],
      cecEnabled: ['', Validators.required]
    });

    this.saveEditCecEdidData = this.fb.group({
      EditceBrand: ['', Validators.required],
      EditceRegion: ['', Validators.required],
      EditceCountry: ['', Validators.required],
      EditceModel: ['', Validators.required],
      EditceVendorId: ['', null],
      EditceOSD: ['', null],
      EditceEdid: ['', null],
      EditceCodeset: ['', Validators.required]
    });

    this.saveUpdateRegionData = this.fb.group({
      Region: ['', Validators.required],
      Regioncode: ['', Validators.required],
      Country: ['', null],
      Countrycode: ['', null]
    });

    this.saveEditRegionData = this.fb.group({
      EditRegion: ['', Validators.required],
      EditRegioncode: ['', Validators.required],
      EditCountry: ['', null],
      EditCountrycode: ['', null]
    });

    this.saveEditCeconlyData = this.fb.group({
      ceconlyBrand: ['', Validators.required],
      ceconlyModel: ['', Validators.required],
      ceconlyRegion: ['', Validators.required],
      ceconlyCountry: ['', Validators.required],
      ceconlyVendorId: ['', null],
      ceconlyOSDString: ['', null],
      ceconlyCodeset: ['', Validators.required],
    });
    this.saveEditEdidonlyData = this.fb.group({
      EdidonlyBrand: ['', Validators.required],
      EdidonlyRegion: ['', Validators.required],
      EdidonlyCountry: ['', Validators.required],
      EdidonlyModel: ['', Validators.required],
      EdidonlyEdid: ['', Validators.required],
      EdidonlyCodeset: ['', Validators.required],
    });
    if (this.projectNames[0].startsWith('Import_')) {
      this.tabValue = this.projectNames[0].replace('Import_', '')
    }
    else {
      this.tabValue = this.projectNames[0];
    }
    /** number restrictions validations **/
    $(document).ready(function () {
      $("input").on("keypress", function (e) {
        if (e.which === 32 && !this.value.length)
          e.preventDefault();
      });
    });

    $('#column_visible').click(function (e) {
      if (!($('.tab-content .dropdown-list').hasClass('hidden'))) {
        $('.tab-content .dropdown-list').css('width', 'auto')
      }
      self.columnvisiblity();
    })
  }


  BrandView(ret) {
    var str = ret[0];
    var str1 = ret[1];
    var str2 = ret[2];
    if (str1 == 'null') {
      str1 = ''
    }
    if (str2 == 'null') {
      str2 = ''
    }
    this.viewBrandData(str, str1, str2);
  };

  CecView(ret) {
    var str = ret[0];
    var str1 = ret[1];
    var str2 = ret[2];
    var str3 = ret[3];
    var str4 = ret[4];
    if (str1 == 'null') {
      str1 = ''
    }
    if (str2 == 'null') {
      str2 = ''
    }
    if (str3 == 'null') {
      str3 = ''
    }
    if (str4 == 'null') {
      str4 = ''
    }
    this.viewBrandInfoCecData(str, str1, str2, str3, str4);
  };

  EdidView(ret) {
    var str = ret[0];
    var str1 = ret[1];
    var str2 = ret[2];
    var str3 = ret[3];
    var str4 = ret[4];
    if (str1 == 'null') {
      str1 = ''
    }
    if (str2 == 'null') {
      str2 = ''
    }
    if (str3 == 'null') {
      str3 = ''
    }
    if (str4 == 'null') {
      str4 = ''
    }
    this.viewBrandInfoEdidData(str, str1, str2, str3, str4);
  };

  componentDataView(ret) {
    var str = ret[0];
    var str1 = ret[1];
    var str2 = ret[2];
    var str3 = ret[3];
    var str4 = ret[4];
    var str5 = ret[6];
    if (str1 == 'null') {
      str1 = ''
    }
    if (str2 == 'null') {
      str2 = ''
    }
    if (str3 == 'null') {
      str3 = ''
    }
    if (str4 == 'null') {
      str4 = ''
    }
    this.viewComponentData(str, str1, str2, str3, str4, str5);
  };

  crossReferenceBrandsView(ret) {
    var str = ret[0];
    var str1 = ret[1];
    var str2 = ret[2];
    var str3 = ret[3];
    var str4 = ret[4];
    var str5 = ret[5];
    if (str1 == 'null') {
      str1 = ''
    }
    if (str2 == 'null') {
      str2 = ''
    }
    if (str3 == 'null') {
      str3 = ''
    }
    if (str4 == 'null') {
      str4 = ''
    }
    if (str5 == 'null') {
      str5 = ''
    }
    this.viewCrossData(str, str1, str2, str3, str4, str5);
  };

  regionView(ret) {
    var str = ret[0];
    var str1 = ret[1];
    var str2 = ret[2];
    var str3 = ret[3];
    var str4 = ret[4];
    if (str1 == 'null') {
      str1 = ''
    }
    if (str2 == 'null') {
      str2 = ''
    }
    if (str3 == 'null') {
      str3 = ''
    }
    if (str4 == 'null') {
      str4 = ''
    }
    this.viewRegionData(str, str1, str2, str3, str4);
  };

  cecOnlyDataView(ret) {
    var str = ret[0];
    var str1 = ret[1];
    var str2 = ret[2];
    var str3 = ret[3];
    var str4 = ret[4];
    var str5 = ret[5];
    var str6 = ret[6];
    var str7 = ret[7];
    var str8 = ret[8];
    if (str1 == 'null') {
      str1 = ''
    }
    if (str2 == 'null') {
      str2 = ''
    }
    if (str3 == 'null') {
      str3 = ''
    }
    if (str4 == 'null') {
      str4 = ''
    }
    if (str5 == 'null') {
      str5 = ''
    }
    if (str6 == 'null') {
      str6 = ''
    }
    if (str7 == 'null') {
      str7 = ''
    }
    if (str8 == 'null') {
      str8 = ''
    }
    this.viewCecOnlyData(str, str1, str2, str3, str4, str5, str6, str7, str8);
  };

  edidOnlyDataView(ret) {
    var str = ret[0];
    var str1 = ret[1];
    var str2 = ret[2];
    var str3 = ret[3];
    var str4 = ret[4];
    var str5 = ret[5];
    var str6 = ret[6];
    var str7 = ret[7];
    var str8 = ret[8];
    if (str1 == 'null') {
      str1 = ''
    }
    if (str2 == 'null') {
      str2 = ''
    }
    if (str3 == 'null') {
      str3 = ''
    }
    if (str4 == 'null') {
      str4 = ''
    }
    if (str5 == 'null') {
      str5 = ''
    }
    if (str6 == 'null') {
      str6 = ''
    }
    if (str7 == 'null') {
      str7 = ''
    }
    if (str8 == 'null') {
      str8 = ''
    }
    this.viewEdidOnlyData(str, str1, str2, str3, str4, str5, str6, str7, str8);
  };

  cecedidDataView(ret) {
    var str = ret[0];
    var str1 = ret[1];
    var str2 = ret[2];
    var str3 = ret[3];
    var str4 = ret[4];
    var str5 = ret[5];
    var str6 = ret[6];
    var str7 = ret[7];
    var str8 = ret[8];
    var str9 = ret[9];
    var str10 = ret[10];
    var str11 = ret[11];
    if (str1 == 'null') {
      str1 = ''
    }
    if (str2 == 'null') {
      str2 = ''
    }
    if (str3 == 'null') {
      str3 = ''
    }
    if (str4 == 'null') {
      str4 = ''
    }
    if (str5 == 'null') {
      str5 = ''
    }
    if (str6 == 'null') {
      str6 = ''
    }
    if (str7 == 'null') {
      str7 = ''
    }
    if (str8 == 'null') {
      str8 = ''
    }
    if (str9 == 'null') {
      str9 = ''
    }
    if (str10 == 'null') {
      str10 = ''
    }
    if (str11 == 'null') {
      str11 = ''
    }
    this.viewCecEdidData(str, str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11);
  };

  codesetdownload(binData) {
    this.downloadBin(binData[2], binData[1]);
  }

  codeSetsView(ret) {
    var str1 = ret[1];
    var str2 = ret[0];
    this.viewcodesetData(str1, str2);
  }

  ViewEdid(setEdid) {
    this.viewEdidData(setEdid[7]);
  };

  ViewEdid128(setEdid) {
    this.viewEdid128Data(setEdid[6]);
  };

  /** Download Bin Function  **/

  downloadBin(BinData, FileName) {
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

  viewBrandData(value, value1, value2) {
    this.editedBrandname = value1;
    this.editedBrandcode = value2;
    this.brandrecordId = value;
  }

  viewBrandInfoCecData(value, value1, value2, value3, value4) {
    this.editedcecDevice = value1;
    this.editedcecBrandname = value2;
    this.editedcecVendor = value4;
    this.editedcecBrandcode = value3;
    this.cecrecordId = value;
  }

  viewBrandInfoEdidData(value, value1, value2, value3, value4) {
    this.editedEdidDevice = value1;
    this.editedEdidBrandname = value2;
    this.editedEdidBrandcode = value3;
    this.editedEdidBrand = value4;
    this.EdidrecordId = value;
  }

  viewRegionData(value, value1, value2, value3, value4) {
    this.EditRegion = value1;
    this.EditRegioncode = value2;
    this.EditCountry = value3;
    this.EditCountrycode = value4;
    this.RegionrecordId = value;
  }

  viewCrossData(value, value1, value2, value3, value4, value5) {
    this.editedCrossDevice = value1;
    this.editedCrossBrandname = value2;
    this.editedCrossBrandcode = value3;
    this.editedCrossCodeset = value4;
    this.editedCrossRank = value5;
    this.CrossrecordId = value;
  }

  viewComponentData(value, value1, value2, value3, value4, value5) {
    this.editedComponentDevice = value1;
    this.editedComponentBrandname = value2;
    this.editedComponentModel = value3;
    this.editedComponentCodeset = value4;
    this.editedComponentCountry = value5;
    this.ComponentrecordId = value;
    console.log(value, value1, value2, value3, value4, value5)
  }

  viewCecOnlyData(value, value1, value2, value3, value4, value5, value6, value7, value8) {
    this.editedCeconlyDevice = value1;
    this.editedCeconlyBrandname = value2;
    this.editedCeconlyregion = value3;
    this.editedCeconlyCountry = value4;
    this.editedCeconlyModel = value5;
    this.editedCeconly_Vendor = value6;
    this.editedCeconly_OSD = value7;
    this.editedCeconlyCodeset = value8;
    this.CeconlyrecordId = value;
    let a = [];
    a.push(value4);
    this.countrylist = a;
  }

  viewEdidOnlyData(value, value1, value2, value3, value4, value5, value6, value7, value8) {
    this.editedEdidonlyDevice = value1;
    this.editedEdidonlyBrandname = value2;
    this.editedEdidonlyregion = value3;
    this.editedEdidonlyCountry = value4;
    this.editedEdidonlyModel = value5;
    this.editedEdidonly_EDID128 = value6;
    this.editedEdidonly_EDIDBrand = value7;
    this.editedEdidonlyCodeset = value8;
    this.EdidonlyrecordId = value;
    let a = [];
    a.push(value4);
    this.countrylist = a;
  }

  viewCecEdidData(value, value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11) {
    this.editedceDevice = value
    this.editedceBrand = value1;
    this.editedceRegion = value2;
    this.editedceCountry = value3;
    this.editedceModel = value4;
    this.editedceVendorId = value5;
    this.editedceOSD = value6;
    this.osdstring = value6;
    this.editedceEdid = value7;
    this.editedceCodeset = value9;
    this.CeconlyrecordId = value10;
    this.EdidonlyrecordId = value11;
    let a = [];
    a.push(value3);
    this.countrylist = a;
    this.editcountrylist = a;
  }
  /** Multiselect project selection functions start **/
  onInstanceSelect(item: any) {
  }

  onSelectAll(items: any) {
    this.projectNames = items;
  }

  onSelectColumnAll(items: any) {
    this.report_visiblity = items;
    this.columnvisiblity();
  }

  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
    this.columnSettings = Object.assign({}, this.columnSettings, { allowSearchFilter: this.ShowFilter });
  }


  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
      this.columnSettings = Object.assign({}, this.columnSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
      this.columnSettings = Object.assign({}, this.columnSettings, { limitSelection: null });
    }
  }

  onchange() {
    this.SelectedBrandName = this.brand_list;
    let region;
    if (this.brand_list == 'CEC Only') {
      let x = (<HTMLInputElement>document.getElementById('myselect1')).value;
      region = x;
    }
    if (this.brand_list == 'EDID Only') {
      let y = (<HTMLInputElement>document.getElementById('myselect2')).value;
      region = y;
    }
    if (this.brand_list == 'CEC-EDID Data') {
      let z = (<HTMLInputElement>document.getElementById('myselect')).value;
      region = z;
    }
    let projectName;
    if (this.tabsProject == undefined) {
      projectName = this.projectNames[0]['item_text'];
    } else {
      projectName = this.tabsProject;
    }
    /** loading datatable based on selection brand dropdown start **/
    if (projectName != null || projectName != undefined) {
      let filterProject: any = this.mainArr.filter(u =>
        u.projectname == projectName);
      this.resultProjArr = filterProject;
      if (this.resultProjArr.length != 0) {
        let Dbinstance = this.resultProjArr[0]['dbinstance'];
        let filtcount = [];
        this.mainService.getProjectNames(null, null, null, null, Dbinstance, 18)
          .subscribe(value => {
            let b = []; let c = [];
            let filtercountry: any = value.data.filter(u =>
              u.region == region);
            for (var j = 0; j < filtercountry.length; j++) {
              b.push(filtercountry[j]['country']);
            }
            let filtcountry: any = value.data.filter(u =>
              u.region == this.editedceRegion);
            for (var j = 0; j < filtcountry.length; j++) {
              c.push(filtcountry[j]['country']);
            }
            this.countrylist = b;
            this.editcountrylist = c;
          })

      }
    }
  }

  dataIpAddress(ipdata) {
    this.ipAddress = ipdata
  }
  /** Multiselect project selection functions end **/

  /** autocomplete data for brands list start **/

  formatter = (result: string) => result.toUpperCase();

  brandSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? BrandListData
        : BrandListData.filter(v => (v.startsWith(term.toLowerCase()) || v.startsWith(term.toUpperCase()))).slice(0, BrandListData.length))
      // BrandListData.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 5))
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
      let data_type = 1;
      this.mainService.getProjectNames(null, null, null, null, null, data_type)
        .subscribe(value => {
          this.mainArr = value.data;
          this.mainArr.forEach(element => {
            element['projectname'] = element['dbinstance'] + '_' + element['projectname']
          })
          let filterProject: any = this.mainArr.filter(u =>
            (u.projectname == projectName));
          let Client = filterProject[0]['client']; let Region = filterProject[0]['region'];
          let Dbinstance = filterProject[0]['dbinstance'];
          if (projectName.startsWith(Dbinstance + '_')) {
            projectName = projectName.replace(Dbinstance + '_', '')
          }
          this.mainService.getProjectNames(Client, Region, projectName, null, Dbinstance, datatype)
            .subscribe(value => {
              if (value.data.length != 0) {
                versionArr.push(value.data[0]['version']);
                this.versions = versionArr;
                this.version_list = versionArr[0];
              }
            });

        })

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
          this.mainArr.forEach(element => {
            element['projectname'] = element['dbinstance'] + '_' + element['projectname']
          })
          let filterProject: any = this.mainArr.filter(u =>
            (u.projectname == projectName));
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
    this.getDropdownValues();
    this.getCodeSets();
  }

  /** datatype selection based on selection of brands list start **/

  selectDatatype() {
    if (this.brand_list == 'Cross Reference By Brands') {
      this.Datatype = 8;
      this.iscrossReferenceBrands = false;
      this.iscecOnly = true; this.isedidOnly = true;
      this.iscomponentData = true; this.iscodeSets = true; this.isMasterBrand = true;
      this.isbrandInfoCec = true; this.isbrandInfoEdid = true; this.isCecEdid = true; this.isregion = true
    } if (this.brand_list == 'Component Data') {
      this.Datatype = 9;
      this.iscomponentData = false;
      this.iscecOnly = true; this.isedidOnly = true;
      this.iscrossReferenceBrands = true; this.iscodeSets = true; this.isMasterBrand = true;
      this.isbrandInfoCec = true; this.isbrandInfoEdid = true; this.isCecEdid = true; this.isregion = true
    } if (this.brand_list == 'Codesets') {
      this.Datatype = 10;
      this.iscodeSets = false;
      this.iscecOnly = true; this.isedidOnly = true;
      this.iscrossReferenceBrands = true; this.iscomponentData = true; this.isMasterBrand = true;
      this.isbrandInfoCec = true; this.isbrandInfoEdid = true; this.isCecEdid = true; this.isregion = true
    } if (this.brand_list == 'Brand') {
      this.Datatype = 11;
      this.isMasterBrand = false;
      this.iscecOnly = true; this.isedidOnly = true;
      this.iscrossReferenceBrands = true; this.iscomponentData = true; this.iscodeSets = true;
      this.isbrandInfoCec = true; this.isbrandInfoEdid = true; this.isCecEdid = true; this.isregion = true
    } if (this.brand_list == 'Brand Info CEC') {
      this.Datatype = 12;
      this.isbrandInfoCec = false;
      this.iscecOnly = true; this.isedidOnly = true;
      this.iscrossReferenceBrands = true; this.iscomponentData = true; this.iscodeSets = true;
      this.isMasterBrand = true; this.isbrandInfoEdid = true; this.isCecEdid = true; this.isregion = true
    } if (this.brand_list == 'Brand Info EDID') {
      this.Datatype = 13;
      this.isbrandInfoEdid = false;
      this.iscecOnly = true; this.isedidOnly = true;
      this.iscrossReferenceBrands = true; this.iscomponentData = true; this.iscodeSets = true;
      this.isMasterBrand = true; this.isbrandInfoCec = true; this.isCecEdid = true; this.isregion = true
    }
    if (this.brand_list == 'CEC-EDID Data') {
      this.Datatype = 17;
      this.isCecEdid = false;
      this.iscecOnly = true; this.isedidOnly = true;
      this.isbrandInfoEdid = true; this.iscrossReferenceBrands = true; this.iscomponentData = true;
      this.iscodeSets = true; this.isMasterBrand = true; this.isbrandInfoCec = true; this.isregion = true
    }
    if (this.brand_list == 'CEC Only') {
      this.Datatype = 14;
      this.iscecOnly = false; this.isedidOnly = true;
      this.isCecEdid = true; this.isbrandInfoEdid = true; this.iscrossReferenceBrands = true; this.iscomponentData = true;
      this.iscodeSets = true; this.isMasterBrand = true; this.isbrandInfoCec = true; this.isregion = true
    }
    if (this.brand_list == 'EDID Only') {
      this.Datatype = 15;
      this.isedidOnly = false;
      this.isCecEdid = true; this.iscecOnly = true;
      this.isbrandInfoEdid = true; this.iscrossReferenceBrands = true; this.iscomponentData = true;
      this.iscodeSets = true; this.isMasterBrand = true; this.isbrandInfoCec = true; this.isregion = true
    }
    if (this.brand_list == 'Region Country Code') {
      this.Datatype = 18;
      this.isregion = false;
      this.iscodeSets = true;
      this.iscecOnly = true; this.isedidOnly = true;
      this.iscrossReferenceBrands = true; this.iscomponentData = true; this.isMasterBrand = true;
      this.isbrandInfoCec = true; this.isbrandInfoEdid = true; this.isCecEdid = true;
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
      $('.newBtn').css('display', 'none');
    } else {
      this.noData = false;
      $('.hideData').css('display', 'block');
      $('.newBtn').css('display', 'block');
      $('.tabView').css('display', 'block');
      $('.nav-item').removeClass('active');
      $('a#nav-home-tab0').addClass('active');
      this.getTabName(this.projectNames[0]['item_text']);
      this.onProjectSelect(this.tabslist[0]);
      this.tabVersions();
      this.latestVersions();
    }
  }

  /** Validation to accept only hexa characters only  **/

  hexaOnly(event: any) {

    const pattern = /^[0-9A-Fa-f]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  hexaOnlyforosd(event: any) {
    if (this.brand_list == 'CEC-EDID Data') {
      if (this.EditosdHeader === 'OSD Hex') {
        this.hexaOnly(event);
      }
      if (this.UpdateosdHeader === 'OSD Hex') {
        this.hexaOnly(event);
      }
    }
    if (this.brand_list == 'CEC Only') {
      if (this.EditosdHeader === 'OSD Hex') {
        this.hexaOnly(event);
      }
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
    if (this.brand_list == 'Brand' || this.brand_list == 'Brand Info CEC' || this.brand_list == 'Brand Info EDID' || this.brand_list == 'Region Country Code') {
      this.isVersionDataVisible = false;
    } else {
      this.isVersionDataVisible = true;
    }
    // if (this.brand_list == 'CEC Only' || this.brand_list == 'EDID Only') {
    //   $('.newBtn').css('display', 'none');
    // } else {
    //   $('.newBtn').css('display', 'block');
    // }
    if (this.brand_list == "null") {
      this.noData = true;
      $('.tabView').css('display', 'none');
    } else {
      this.noData = false;
      $('.tabView').css('display', 'block');
      this.selectDatatype();
      this.getViewResponse();
      this.selectModelView();
      this.tabVersions();
      this.refreshScreen();
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
        this.selectModelView();
        this.changeVersionCount++;
        this.getVersionResponseData();
        this.getCodeSets();
        this.getDropdownValues();
        this.noData = false;
        $('.newBtn').css('display', 'block');
        $('.tab-content').css('display', 'block');
      } else {
        $('.newBtn').css('display', 'none');
        $('.tab-content').css('display', 'none');
        this.noData = true;
      }
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
      this.isCecOnly = false;
      this.isEdidOnly = false;
      this.isCecEdidData = false;
      this.isRegion = false;
    }

    if (this.SelectedBrandName == 'Brand Info CEC') {
      this.isBrandInfoCec = true;
      this.isBrandModel = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isCecOnly = false;
      this.isEdidOnly = false;
      this.isCrossReferencebyBrands = false;
      this.isCecEdidData = false;
      this.isRegion = false;
    }
    if (this.SelectedBrandName == 'Brand Info EDID') {
      this.isBrandInfoEdid = true;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isCecOnly = false;
      this.isEdidOnly = false;
      this.isCrossReferencebyBrands = false;
      this.isCecEdidData = false;
      this.isRegion = false;
    }
    if (this.SelectedBrandName == 'Component Data') {
      this.isComponentData = true;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isCodesets = false;
      this.isCecOnly = false;
      this.isEdidOnly = false;
      this.isCrossReferencebyBrands = false;
      this.isCecEdidData = false;
      this.isRegion = false;
    }
    if (this.SelectedBrandName == 'Codesets') {
      this.isCodesets = true;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isCecOnly = false;
      this.isEdidOnly = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCrossReferencebyBrands = false;
      this.isCecEdidData = false;
      this.isRegion = false;
    }
    if (this.SelectedBrandName == 'Cross Reference By Brands') {
      this.isCrossReferencebyBrands = true;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isCecOnly = false;
      this.isEdidOnly = false;
      this.isCecEdidData = false;
      this.isRegion = false;
    }
    if (this.SelectedBrandName == 'CEC-EDID Data') {
      this.isCecEdidData = true;
      this.UpdateosdHeader = 'OSD String';
      this.EditosdHeader = 'OSD String';
      this.isCrossReferencebyBrands = false;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isCecOnly = false;
      this.isEdidOnly = false;
      this.isRegion = false;
    }
    if (this.SelectedBrandName == 'CEC Only') {
      this.isCecOnly = true;
      this.isCecEdidData = false;
      this.isCrossReferencebyBrands = false;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isEdidOnly = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isRegion = false;
    }
    if (this.SelectedBrandName == 'EDID Only') {
      this.isEdidOnly = true;
      this.isCecEdidData = false;
      this.isCrossReferencebyBrands = false;
      this.isBrandModel = false;
      this.isCecOnly = false;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isComponentData = false;
      this.isCodesets = false;
      this.isRegion = false;
    }
    if (this.SelectedBrandName == 'Region Country Code') {
      this.isRegion = true;
      this.isCecEdidData = false;
      this.isCrossReferencebyBrands = false;
      this.isBrandModel = false;
      this.isBrandInfoCec = false;
      this.isBrandInfoEdid = false;
      this.isCecOnly = false;
      this.isEdidOnly = false;
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
    if (projectName.startsWith(dbInstance + '_')) {
      projectName = projectName.replace(dbInstance + '_', '')
    }
    let Client = this.resultProjArr[0]['client']; let Region = this.resultProjArr[0]['region'];
    if (this.brand_list == 'Component Data' || this.brand_list == 'CEC-EDID Data' || this.brand_list == 'CEC Only' || this.brand_list == 'EDID Only') {
      let versionArr = [];
      this.mainService.getProjectNames(Client, Region, projectName, null, dbInstance, 21)
        .subscribe(value => {
          if (value.data.length != 0) {
            versionArr.push(value.data[0]['version']);
            this.versions = versionArr;
            this.version_list = versionArr[0];
          }
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
                  pushBrands.push(value.data[i]['brandName'].toUpperCase());
                }
                BrandListData = pushBrands.filter((v, i, a) => a.indexOf(v) === i);
                this.spinnerService.hide();
              });
          }
        });

    } else {
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
              pushBrands.push(value.data[i]['brandName'].toUpperCase());
            }
            BrandListData = pushBrands.filter((v, i, a) => a.indexOf(v) === i);
            this.spinnerService.hide();
          });
      }
    }


  }

  /** get list of all devices registered for the project end **/

  /** get list of all codesets start **/

  getCodeSets() {
    let projectName = this.tabValue;
    if (this.resultProjArr != null && this.resultProjArr != undefined) {
      let Client = this.resultProjArr[0]['client']; let Region = this.resultProjArr[0]['region'];
      let dbInstance = this.resultProjArr[0]['dbinstance']; let dataType = 10;
      if (projectName.startsWith(dbInstance + '_')) {
        projectName = projectName.replace(dbInstance + '_', '')
      }
      if (this.brand_list == 'Component Data' || this.brand_list == 'CEC-EDID Data' || this.brand_list == 'CEC Only' || this.brand_list == 'EDID Only') {
        let versionArr = [];
        this.mainService.getProjectNames(Client, Region, projectName, null, dbInstance, 21)
          .subscribe(value => {
            if (value.data.length != 0) {
              versionArr.push(value.data[0]['version']);
              this.versions = versionArr;
              this.version_list = versionArr[0];
            }
            this.mainService.getProjectNames(Client, Region, projectName, this.version_list, dbInstance, dataType)
              .subscribe(value => {
                this.codeSetsData = value.data;
                this.spinnerService.hide();
              });
          });

      } else {
        this.mainService.getProjectNames(Client, Region, projectName, this.version_list, dbInstance, dataType)
          .subscribe(value => {
            this.codeSetsData = value.data;
            this.spinnerService.hide();
          });
      }

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
        $('#single_download').css('display', 'block');
        $('.tab-content').css('display', 'block');
        this.getTabResponseData();
      } else {
        this.count--;
        this.noData = true;
        $('#single_download').css('display', 'none');
        $('.tab-content').css('display', 'none');
      }
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
    if (this.SelectedBrandName == 'Component Data') {
      this.componentData();
    }
    if (this.SelectedBrandName == 'Codesets') {
      this.codeSetData();
    }
    if (this.SelectedBrandName == 'Cross Reference By Brands') {
      this.crossRefBrands();
    }
    if (this.SelectedBrandName == 'CEC-EDID Data') {
      this.cecEdidBrands();
    }
    if (this.SelectedBrandName == 'CEC Only') {
      this.cecOnly();
    }
    if (this.SelectedBrandName == 'EDID Only') {
      this.edidOnly();
    }
  }
  /** version switching project data view end **/

  /** based on selected tab get data view start **/

  getTabResponseData() {
    if (this.SelectedBrandName == 'Brand') {
      this.brandView();
    }
    if (this.SelectedBrandName == 'Brand Info CEC') {
      this.cecView();
    }
    if (this.SelectedBrandName == 'Brand Info EDID') {
      this.edidView();
    }
    if (this.SelectedBrandName == 'Component Data') {
      this.componentData();
    }
    if (this.SelectedBrandName == 'Codesets') {
      this.codeSetData();
    }
    if (this.SelectedBrandName == 'Cross Reference By Brands') {
      this.crossRefBrands();
    }
    if (this.SelectedBrandName == 'CEC-EDID Data') {
      this.cecEdidBrands();
    }
    if (this.SelectedBrandName == 'CEC Only') {
      this.cecOnly();
    }
    if (this.SelectedBrandName == 'EDID Only') {
      this.edidOnly();
    }
    if (this.SelectedBrandName == 'Region Country Code') {
      this.regionData();
    }
  }
  /** based on selected tab get data view end **/

  /** datatable resetting function to handle multiple selected datatable view start **/

  getViewResponse() {
    if (this.SelectedBrandName == 'Brand') {
      this.brandView();
    }
    if (this.SelectedBrandName == 'Brand Info CEC') {
      this.cecView();
    }
    if (this.SelectedBrandName == 'Brand Info EDID') {
      this.edidView();
    }
    if (this.SelectedBrandName == 'Component Data') {
      this.componentData();
    }
    if (this.SelectedBrandName == 'Codesets') {
      this.codeSetData();
    }
    if (this.SelectedBrandName == 'Cross Reference By Brands') {
      this.crossRefBrands();
    }
    if (this.SelectedBrandName == 'CEC-EDID Data') {
      this.cecEdidBrands();
    }
    if (this.SelectedBrandName == 'CEC Only') {
      this.cecOnly();
    }
    if (this.SelectedBrandName == 'EDID Only') {
      this.edidOnly();
    }
    if (this.SelectedBrandName == 'Region Country Code') {
      this.regionData();
    }
  }
  /** datatable resetting function to handle multiple selected datatable view end **/

  /** brand selection request for an api to view brand data start **/

  brandView() {
    //this.spinnerService.show();
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
      dataTypeSelection = 9;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 17) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 18) {
      dataTypeSelection = 11;
    }

    var dbName = this.resultProjArr[0]['dbPath'];
    var projectName = this.resultProjArr[0]['projectname'];
    if (projectName.startsWith(dbName + '_')) {
      projectName = projectName.replace(dbName + '_', '')
    }
    if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
      this.version_list = "";
    }
    var dbVersion = this.version_list;
    var dataType = dataTypeSelection;
    let search; let column; let dir; let regex;
    var brandName = this.brand_list;
    search = {
      "value": '',
      "regex": false
    }
    let order = [
      {
        "column": 0,
        "dir": "asc"
      }
    ];
    this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
      .subscribe(value => {
        let temp = parseInt(value.recordsTotal);
        let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
        this.parameters = parameter;
        this.viewdata();
      })
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    //this.spinnerService.hide();      
  }
  /** brand selection request for an api to view brand data end **/

  /** BrandInfoCec selection request for an api to view BrandInfoCec data start **/
  cecView() {
    //this.spinnerService.show();
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
      dataTypeSelection = 9;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 17) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 18) {
      dataTypeSelection = 11;
    }


    var dbName = this.resultProjArr[0]['dbPath'];
    var projectName = this.resultProjArr[0]['projectname'];
    if (projectName.startsWith(dbName + '_')) {
      projectName = projectName.replace(dbName + '_', '')
    }
    if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
      this.version_list = "";
    }
    var dbVersion = this.version_list;
    var dataType = dataTypeSelection;
    let search; let column; let dir; let regex;
    var brandName = this.brand_list;
    search = {
      "value": '',
      "regex": false
    }
    let order = [
      {
        "column": 0,
        "dir": "asc"
      }
    ];
    this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
      .subscribe(value => {
        let temp = parseInt(value.recordsTotal);
        let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
        this.parameters = parameter;
        this.viewdata();
      })
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    //this.spinnerService.hide();      
  }
  /** BrandInfoCec selection request for an api to view BrandInfoCec data end **/

  /** BrandInfoEdid selection request for an api to view BrandInfoEdid data start **/
  edidView() {
    //this.spinnerService.show();
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
      dataTypeSelection = 9;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 17) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 18) {
      dataTypeSelection = 11;
    }

    var dbName = this.resultProjArr[0]['dbPath'];
    var projectName = this.resultProjArr[0]['projectname'];
    if (projectName.startsWith(dbName + '_')) {
      projectName = projectName.replace(dbName + '_', '')
    }
    if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
      this.version_list = "";
    }
    var dbVersion = this.version_list;
    var dataType = dataTypeSelection;
    let search; let column; let dir; let regex;
    var brandName = this.brand_list;
    search = {
      "value": '',
      "regex": false
    }
    let order = [
      {
        "column": 0,
        "dir": "asc"
      }
    ];
    this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
      .subscribe(value => {
        let temp = parseInt(value.recordsTotal);
        let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
        this.parameters = parameter;
        this.viewdata();
      })
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    //this.spinnerService.hide();      
  }
  /** BrandInfoEdid selection request for an api to view BrandInfoEdid data end **/

  /** Component Data selection request for an api to view Component data start **/
  componentData() {
    //this.spinnerService.show();
    if (this.tabsProject != undefined) {
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        (u.projectname == this.tabsProject && u.embeddedDbVersion == this.version_list));
      this.resultProjArr = resultFetchArrTabs;
    }
    let projectName = this.resultProjArr[0]['projectname'];
    let datatype = 21;
    let Client = this.resultProjArr[0]['client'];
    let Region = this.resultProjArr[0]['region'];
    let Dbinstance = this.resultProjArr[0]['dbinstance'];
    if (projectName.startsWith(Dbinstance + '_')) {
      projectName = projectName.replace(Dbinstance + '_', '')
    }
    let versionArr = [];
    this.mainService.getProjectNames(Client, Region, projectName, null, Dbinstance, datatype)
      .subscribe(value => {
        if (value.data.length != 0) {
          versionArr.push(value.data[0]['version']);
          this.versions = versionArr;
          this.version_list = versionArr[0];
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
          dataTypeSelection = 9;
        }
        if (this.Datatype == 15) {
          dataTypeSelection = 8;
        }
        if (this.Datatype == 17) {
          dataTypeSelection = 7;
        }
        if (this.Datatype == 18) {
          dataTypeSelection = 11;
        }

        if (this.resultProjArr.length != 0) {
          var dbName = this.resultProjArr[0]['dbPath'];
          if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
            this.version_list = "";
          }
          var dbVersion = this.version_list;
          var dataType = dataTypeSelection;
          let search; let column; let dir; let regex;
          var brandName = this.brand_list;
          search = {
            "value": '',
            "regex": false
          }
          let order = [
            {
              "column": 0,
              "dir": "asc"
            }
          ];
          this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
            .subscribe(value => {
              let temp = parseInt(value.recordsTotal);
              let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
              this.parameters = parameter;
              this.viewdata();
            })
        }
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        //this.spinnerService.hide();      
      });
  }
  /** Component Data selection request for an api to view Component data end **/

  /** Codeset Data selection request for an api to view Codeset data start **/
  codeSetData() {
    //this.spinnerService.show();
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
      dataTypeSelection = 9;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 17) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 18) {
      dataTypeSelection = 11;
    }

    if (this.resultProjArr.length != 0) {
      var dbName = this.resultProjArr[0]['dbPath'];
      var projectName = this.resultProjArr[0]['projectname'];
      if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
        this.version_list = "";
      }
      if (projectName.startsWith(dbName + '_')) {
        projectName = projectName.replace(dbName + '_', '')
      }
      var dbVersion = this.version_list;
      var dataType = dataTypeSelection;
      var brandName = this.brand_list;
      let search; let column; let dir; let regex;
      search = {
        "value": '',
        "regex": false
      }
      let order = [
        {
          "column": 0,
          "dir": "asc"
        }
      ];
      this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
        .subscribe(value => {
          let temp = parseInt(value.recordsTotal);
          let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
          this.parameters = parameter;
          this.viewdata();
        })
    }
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    //this.spinnerService.hide();      
  }
  /** Codeset Data selection request for an api to view Codeset data end **/

  /** Cross Reference by Brands Data selection request for an api to view Cross Reference by Brands data start **/

  crossRefBrands() {
    //this.spinnerService.show();
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
      dataTypeSelection = 9;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 17) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 18) {
      dataTypeSelection = 11;
    }

    if (this.resultProjArr.length != 0) {
      var dbName = this.resultProjArr[0]['dbPath'];
      var projectName = this.resultProjArr[0]['projectname'];
      if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
        this.version_list = "";
      }
      if (projectName.startsWith(dbName + '_')) {
        projectName = projectName.replace(dbName + '_', '')
      }
      var dbVersion = this.version_list;
      var dataType = dataTypeSelection;
      let search; let column; let dir; let regex;
      var brandName = this.brand_list;
      search = {
        "value": '',
        "regex": false
      }
      let order = [
        {
          "column": 0,
          "dir": "asc"
        }
      ];
      this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
        .subscribe(value => {
          let temp = parseInt(value.recordsTotal);
          let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
          this.parameters = parameter;
          this.viewdata();
        })
    }
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    //this.spinnerService.hide();      
  }
  /** Cross Reference by Brands Data selection request for an api to view Cross Reference by Brands data end **/

  /** CEC-EDID Data selection request for an api to view CEC-EDID data start **/

  cecEdidBrands() {
    //this.spinnerService.show();
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
    let projectName = this.resultProjArr[0]['projectname'];
    let datatype = 21;
    let versionArr = [];
    let Client = this.resultProjArr[0]['client'];
    let Region = this.resultProjArr[0]['region'];
    let Dbinstance = this.resultProjArr[0]['dbinstance'];
    if (projectName.startsWith(Dbinstance + '_')) {
      projectName = projectName.replace(Dbinstance + '_', '')
    }
    this.mainService.getProjectNames(Client, Region, projectName, null, Dbinstance, datatype)
      .subscribe(value => {
        if (value.data.length != 0) {
          versionArr.push(value.data[0]['version']);
          this.versions = versionArr;
          this.version_list = versionArr[0];
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
          dataTypeSelection = 9;
        }
        if (this.Datatype == 15) {
          dataTypeSelection = 8;
        }
        if (this.Datatype == 17) {
          dataTypeSelection = 7;
        }
        if (this.Datatype == 18) {
          dataTypeSelection = 11;
        }

        if (this.resultProjArr.length != 0) {
          var dbName = this.resultProjArr[0]['dbPath'];
          if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
            this.version_list = "";
          }
          var dbVersion = this.version_list;
          var dataType = dataTypeSelection;
          var brandName = this.brand_list;
          let search; let column; let dir; let regex;
          search = {
            "value": '',
            "regex": false
          }
          let order = [
            {
              "column": 0,
              "dir": "asc"
            }
          ];
          this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
            .subscribe(value => {
              let temp = parseInt(value.recordsTotal);
              let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
              this.parameters = parameter;
              this.viewdata();
            })
        }
        $('#osd_string').click();
        $('#String').click();
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        //this.spinnerService.hide();      
      });
  }

  /** CEC-EDID Data selection request for an api to view CEC-EDID data end **/

  /** CEC Only Data selection request for an api to view CEC Only data start **/
  cecOnly() {
    //this.spinnerService.show();
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
    let projectName = this.resultProjArr[0]['projectname'];
    let datatype = 21;
    let versionArr = [];
    let Client = this.resultProjArr[0]['client'];
    let Region = this.resultProjArr[0]['region'];
    let Dbinstance = this.resultProjArr[0]['dbinstance'];
    if (projectName.startsWith(Dbinstance + '_')) {
      projectName = projectName.replace(Dbinstance + '_', '')
    }
    this.mainService.getProjectNames(Client, Region, projectName, null, Dbinstance, datatype)
      .subscribe(value => {
        if (value.data.length != 0) {
          versionArr.push(value.data[0]['version']);
          this.versions = versionArr;
          this.version_list = versionArr[0];
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
          dataTypeSelection = 9;
        }
        if (this.Datatype == 15) {
          dataTypeSelection = 8;
        }
        if (this.Datatype == 17) {
          dataTypeSelection = 7;
        }
        if (this.Datatype == 18) {
          dataTypeSelection = 11;
        }

        if (this.resultProjArr.length != 0) {
          var dbName = this.resultProjArr[0]['dbPath'];
          if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
            this.version_list = "";
          }
          var dbVersion = this.version_list;
          var dataType = dataTypeSelection;
          var brandName = this.brand_list;
          let search; let column; let dir; let regex;
          search = {
            "value": '',
            "regex": false
          }
          let order = [
            {
              "column": 0,
              "dir": "asc"
            }
          ];
          this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
            .subscribe(value => {
              let temp = parseInt(value.recordsTotal);
              let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
              this.parameters = parameter;
              this.viewdata();
            })
        }
        $('#osd_string').click();
        $('#String').click();
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        //this.spinnerService.hide();      
      });
  }
  /** CEC Only Data selection request for an api to view CEC Only data end **/

  /** EDID Only Data selection request for an api to view EDID Only data start **/
  edidOnly() {
    //this.spinnerService.show();
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
    let projectName = this.resultProjArr[0]['projectname'];
    let datatype = 21;
    let versionArr = [];
    let Client = this.resultProjArr[0]['client'];
    let Region = this.resultProjArr[0]['region'];
    let Dbinstance = this.resultProjArr[0]['dbinstance'];
    if (projectName.startsWith(Dbinstance + '_')) {
      projectName = projectName.replace(Dbinstance + '_', '')
    }
    this.mainService.getProjectNames(Client, Region, projectName, null, Dbinstance, datatype)
      .subscribe(value => {
        if (value.data.length != 0) {
          versionArr.push(value.data[0]['version']);
          this.versions = versionArr;
          this.version_list = versionArr[0];
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
          dataTypeSelection = 9;
        }
        if (this.Datatype == 15) {
          dataTypeSelection = 8;
        }
        if (this.Datatype == 17) {
          dataTypeSelection = 7;
        }
        if (this.Datatype == 18) {
          dataTypeSelection = 11;
        }

        if (this.resultProjArr.length != 0) {
          var dbName = this.resultProjArr[0]['dbPath'];
          if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
            this.version_list = "";
          }
          var dbVersion = this.version_list;
          var dataType = dataTypeSelection;
          let search; let column; let dir; let regex;
          var brandName = this.brand_list;
          search = {
            "value": '',
            "regex": false
          }
          let order = [
            {
              "column": 0,
              "dir": "asc"
            }
          ];
          this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
            .subscribe(value => {
              let temp = parseInt(value.recordsTotal);
              let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
              this.parameters = parameter;
              this.viewdata();
            })
        }
        $('#osd_string').click();
        $('#String').click();
        $("select").prop("disabled", false);
        $("a").css('pointer-events', 'auto');
        //this.spinnerService.hide();      
      });
  }
  /** EDID Only Data selection request for an api to view EDID Only data end **/

  /** Region Country Data selection request for an api to view Region Country Only data start **/
  regionData() {
    //this.spinnerService.show();
    if (this.tabsProject != undefined) {
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          u.projectname == this.projectNames[0]['item_text'] && u.embeddedDbVersion == this.version_list);
        this.resultProjArr = resultFetchArr;
      }
    }
    let projectName = this.resultProjArr[0]['projectname'];
    let filterProject: any = this.mainArr.filter(u =>
      u.projectname == projectName);
    this.version_list = filterProject[0]['embeddedDbVersion'];
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
      dataTypeSelection = 9;
    }
    if (this.Datatype == 15) {
      dataTypeSelection = 8;
    }
    if (this.Datatype == 17) {
      dataTypeSelection = 7;
    }
    if (this.Datatype == 18) {
      dataTypeSelection = 11;
    }

    if (this.resultProjArr.length != 0) {
      var dbName = this.resultProjArr[0]['dbPath'];
      if (projectName.startsWith(dbName + '_')) {
        projectName = projectName.replace(dbName + '_', '')
      }
      if (this.version_list == null || this.version_list == undefined || this.version_list == "null") {
        this.version_list = "";
      }
      var dbVersion = this.version_list;
      var dataType = dataTypeSelection;
      var brandName = this.brand_list;
      let search; let column; let dir; let regex;
      search = {
        "value": '',
        "regex": false
      }
      let order = [
        {
          "column": 0,
          "dir": "asc"
        }
      ];
      this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, 1, 10, search, order, dataType)
        .subscribe(value => {
          let temp = parseInt(value.recordsTotal);
          let parameter = [dbName, projectName, dbVersion, 1, temp, search, order, dataType]
          this.parameters = parameter;
          this.viewdata();
        })
    }
    $("select").prop("disabled", false);
    $("a").css('pointer-events', 'auto');
    //this.spinnerService.hide();      
  }
  /** Region Country Data selection request for an api to view Region Country Only data End **/

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
  get c() { return this.saveUpdateBrandInfoCec.controls; }
  get e() { return this.saveUpdateBrandInfoEdid.controls; }
  get g() { return this.saveUpdateComponentData.controls; }
  get r() { return this.saveUpdateCrossReferenceBrands.controls; }
  get m() { return this.saveUpdateCecEdidData.controls; }
  get n() { return this.saveUpdateRegionData.controls; }

  get f1() { return this.saveEditBrand.controls; }
  get c1() { return this.saveEditBrandInfoCec.controls; }
  get e1() { return this.saveEditBrandInfoEdid.controls; }
  get g1() { return this.saveEditComponentData.controls; }
  get r1() { return this.saveEditCrossReferenceBrands.controls; }
  get m1() { return this.saveEditCeconlyData.controls; }
  get m2() { return this.saveEditEdidonlyData.controls; }
  get m3() { return this.saveEditCecEdidData.controls; }
  get n1() { return this.saveEditRegionData.controls; }

  /** Save Functionality for Brand if new Brand is added using New Option start  **/
  onsaveUpdateDataSubmit() {

    this.submitted = true;
    if (this.saveUpdateData.invalid) {
      return;
    }
    let brand = this.brand_name;
    let brandCode = this.brand_code;
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = searchDbName[0]['embeddedDbVersion'];
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
          let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getTabResponseData();
        }
      });
  }
  /** Save Functionality for Brand if new Brand is added using New Option end  **/

  /** Edit Brand functionality to update the Brand using Edit Option start **/
  onsaveEditBrandSubmit() {
    this.editsubmitted = true;
    if (this.saveEditBrand.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = this.version_list;
    let Brand = this.editedBrandname; let Brandcode = this.editedBrandcode;
    let recordid = this.brandrecordId;
    this.mainService.getSaveEditBrandDetailsInfo(Dbname, Projectname, Dbversion, null, Brand, Brandcode, null, null, null, null,
      null, null, null, null, null, null, null, null, null, 1, 3, recordid)
      .subscribe(value => {
        $("#edidBrandModal .close").click()
        if (value.data === '1') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Brands';
          let recordCount = 1;
          let Updateadddescription = '' + Brand + ',' + Brandcode + ',' + recordid + '';
          let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress; let Totalinsertedrecords = '', Totalfailedrecords = '', Totalupdatedrecords = '', Systemuser = '';
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getTabResponseData();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }
  /** Edit Brand functionality to update the Brand using Edit Option end **/

  /** Save Functionality for BrandInfoCEC data using New Option start  **/
  onsaveBrandInfoCecSubmit() {

    this.cecsubmitted = true;
    if (this.saveUpdateBrandInfoCec.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);

    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = searchDbName[0]['embeddedDbVersion'];

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
          this.getTabResponseData();
          this.toastr.success(value.message, '');
          let userName = localStorage.getItem('userName'); let Datasection = 'Brand Info CEC';
          let recordCount = 1;
          let Updateadddescription = '' + Device + ',' + brand + ',' + brandcode + ',' + cecVendor + '';
          let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
        }
      });
  }
  /** Save Functionality for BrandInfoCEC data using New Option end  **/

  /** Edit BrandInfoCEC functionality to update the Vendorid using Edit Option start **/
  onsaveEditBrandInfoCecSubmit() {
    this.editcecsubmitted = true;
    if (this.saveEditBrandInfoCec.invalid) {
      return;
    }

    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = this.version_list;
    if (this.editedcecVendor.length < 6) {
      if (this.editedcecVendor.length === 1) {
        this.editedcecVendor = '00000' + this.editedcecVendor;
      }
      if (this.editedcecVendor.length === 2) {
        this.editedcecVendor = '0000' + this.editedcecVendor;
      }
      if (this.editedcecVendor.length === 3) {
        this.editedcecVendor = '000' + this.editedcecVendor;
      }
      if (this.editedcecVendor.length === 4) {
        this.editedcecVendor = '00' + this.editedcecVendor;
      }
      if (this.editedcecVendor.length === 5) {
        this.editedcecVendor = '0' + this.editedcecVendor;
      }
    }
    let cecVendor = this.editedcecVendor.toUpperCase();
    let Device = this.editedcecDevice; let brand = this.editedcecBrandname; let brandcode = this.editedcecBrandcode;
    let recordid = this.cecrecordId;
    this.mainService.getSaveEditBrandDetailsInfo(Dbname, Projectname, Dbversion, Device, brand, brandcode, null, null, null, null,
      null, null, null, null, null, null, cecVendor, null, null, 2, 3, recordid)
      .subscribe(value => {
        $("#edidBrandModal .close").click()
        if (value.data === '1') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Brand Info CEC';
          let recordCount = 1;
          let Updateadddescription = '' + Device + ',' + brand + ',' + cecVendor + ',' + recordid + '';
          let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getTabResponseData();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }
  /** Edit BrandInfoCEC functionality to update the Vendorid using Edit Option end **/

  /** Save Functionality for BrandInfoEDID data using New Option start  **/

  onsaveBrandInfoEdidSubmit() {

    this.edidsubmitted = true;
    if (this.saveUpdateBrandInfoEdid.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);

    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = searchDbName[0]['embeddedDbVersion'];
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
          let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getTabResponseData();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }
  /** Save Functionality for BrandInfoEDID data using New Option end  **/

  /** Edit BrandInfoEdid functionality to update the EdidBrand using Edit Option start **/
  onsaveEditBrandInfoEdidSubmit() {

    this.editedidsubmitted = true;
    if (this.saveEditBrandInfoEdid.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = this.version_list;
    let edidBrand = this.editedEdidBrand.toUpperCase();
    let Device = this.editedEdidDevice; let brand = this.editedEdidBrandname; let brandcode = this.editedEdidBrandcode;
    let recordid = this.EdidrecordId;
    this.mainService.getSaveEditBrandDetailsInfo(Dbname, Projectname, Dbversion, Device, brand, brandcode, null, null, null, null,
      null, null, null, null, null, null, null, null, edidBrand, 3, 3, recordid)
      .subscribe(value => {
        $("#edidBrandModal .close").click()
        if (value.data === '1') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Brand Info EDID';
          let recordCount = 1;
          let Updateadddescription = '' + Device + ',' + brand + ',' + edidBrand + ',' + recordid + '';
          let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getTabResponseData();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }
  /** Edit BrandInfoEdid functionality to update the EdidBrand using Edit Option end **/

  /** Save Functionality for Component data using New Option start  **/

  onsaveComponentDataSubmit() {

    this.componentsubmitted = true;
    if (this.saveUpdateComponentData.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);

    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = this.version_list;
    let codesetFileName = this.componentFile; let codesetData = this.base64CompData; let Cschecksum = this.checksumCompData;
    let componentModel = this.component_model.toUpperCase(); let componentcountry = this.component_country;
    this.component_modelx = componentModel;
    if (componentModel != null && componentModel != undefined) {
      this.component_modelx = componentModel.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    }
    let model_x = this.component_modelx;
    let Device = this.component_device; let brand = this.component_brandName; let codeset = this.component_codeset;
    if (this.component_country === 'null') {
      componentcountry = null;
    } else {
      componentcountry = this.component_country;
    }
    this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, this.component_device, this.component_brandName, null, componentModel, model_x, this.component_codeset,
      null, null, null, null, componentcountry, null, null, null, null, null, 6, 1)
      .subscribe(value => {
        $("#editDataModal .close").click()
        if (value.data === '0') {
          this.toastr.warning(value.message, '');
        } else {
          let userName = localStorage.getItem('userName'); let Datasection = 'Component Data';
          let recordCount = 1;
          let Updateadddescription = '' + Device + ',' + brand + ',' + model_x + ',' + codeset + ',' + componentcountry + '';
          let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.toastr.success(value.message, '');
          this.getTabResponseData();
        }
      });
  }
  /** Save Functionality for Component data using New Option end  **/

  /** Edit ComponentData functionality to update the Model using Edit Option start **/
  onsaveEditComponentDataSubmit() {
    this.editcomponentsubmitted = true;
    if (this.saveEditComponentData.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = this.version_list;
    let componentModel = this.editedComponentModel.toUpperCase();
    this.editedComponentModelx = componentModel;
    if (componentModel != null && componentModel != undefined) {
      this.editedComponentModelx = componentModel.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    }
    let model_x = this.editedComponentModelx;
    let Device = this.editedComponentDevice; let brand = this.editedComponentBrandname; let codeset = this.editedComponentCodeset;

    let recordid = this.ComponentrecordId;
    if (this.editedComponentCountry === 'null') {
      this.editedComponentCountry = null;
    }
    this.mainService.getSaveEditBrandDetailsInfo(Dbname, Projectname, Dbversion, Device, brand, null, componentModel, model_x, codeset, null,
      null, null, null, this.editedComponentCountry, null, null, null, null, null, 6, 3, recordid)
      .subscribe(value => {
        $("#edidBrandModal .close").click()
        if (value.data === '1') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Component Data';
          let recordCount = 1;
          let Updateadddescription = '' + Device + ',' + brand + ',' + model_x + ',' + codeset + ',' + this.editedComponentCountry + ',' + recordid + '';
          let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getTabResponseData();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }
  /** Edit ComponentData functionality to update the Model using Edit Option end **/

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

      let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
      if (Projectname.startsWith(Dbname + '_')) {
        Projectname = Projectname.replace(Dbname + '_', '')
      }
      let Dbversion = this.version_list;
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
            let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
            this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
              .subscribe(value => {

              });
            this.getTabResponseData();
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

      let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
      if (Projectname.startsWith(Dbname + '_')) {
        Projectname = Projectname.replace(Dbname + '_', '')
      }
      let Dbversion = this.version_list;
      let codeset = this.editedCodeset; let codesetData = this.codesetDataValue; let cschecksum = this.codesetChecksum;
      let recordid = this.recordId;
      this.mainService.getSaveEditBrandDetailsInfo(Dbname, Projectname, Dbversion, null, null, null, null, null, codeset, codesetData,
        cschecksum, null, null, null, null, null, null, null, null, 4, 3, recordid)
        .subscribe(value => {
          $("#edidCodesetModal .close").click()
          this.EditcodesetFileName = null;
          $('#codeset-edit-file-info').html('');
          if (value.data === '1') {
            let userName = localStorage.getItem('userName'); let Datasection = 'Codesets';
            let recordCount = 1;
            let Updateadddescription = '' + codeset + ',' + codesetData + ',' + cschecksum + ',' + recordid + '';
            let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
            this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
              .subscribe(value => {

              });
            this.getTabResponseData();
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


  /** Save functionality to save the Cross Reference by Brands Using New Option start **/

  onsaveCrossReferenceBrandsSubmit() {

    this.crsubmitted = true;
    if (this.saveUpdateCrossReferenceBrands.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);

    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = this.version_list;
    let Device = this.cr_device; let brand = this.cr_brandName; let codeset = this.cr_codeset; let rank = this.cs_rank;
    this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, this.cr_device, this.cr_brandName, null, null, null, this.cr_codeset,
      null, null, null, null, null, null, this.cs_rank, null, null, null, 5, 1)
      .subscribe(value => {

        $("#editDataModal .close").click()
        if (value.data != '0') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Cross Reference by Brands';
          let recordCount = 1;
          let Updateadddescription = '' + Device + ',' + brand + ',' + codeset + ',' + rank + '';
          let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getTabResponseData();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }

  /** Save functionality to save the Cross Reference by Brands Using New Option start **/

  /** Edit CrossReferenceBrands functionality to update the Rank using Edit Option start **/
  onsaveEditCrossReferenceBrandsSubmit() {
    this.editcrsubmitted = true;
    if (this.saveEditCrossReferenceBrands.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = this.version_list;
    let Device = this.editedCrossDevice; let brand = this.editedCrossBrandname; let codeset = this.editedCrossCodeset; let rank = this.editedCrossRank;
    let recordid = this.CrossrecordId;
    this.mainService.getSaveEditBrandDetailsInfo(Dbname, Projectname, Dbversion, Device, brand, null, null, null, codeset, null,
      null, null, null, null, null, rank, null, null, null, 5, 3, recordid)
      .subscribe(value => {
        $("#edidBrandModal .close").click()
        if (value.data === '1') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Cross Reference by Brands';
          let recordCount = 1;
          let Updateadddescription = '' + Device + ',' + brand + ',' + codeset + ',' + rank + ',' + recordid + '';
          let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getTabResponseData();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }
  /** Edit CrossReferenceBrands functionality to update the Rank using Edit Option end **/

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



  /** Save Functionality to add CEC EDID data if New Option is selected start **/

  onsaveCecEdidDataSubmit() {
    this.cecEdidsubmitted = true;
    if (this.saveUpdateCecEdidData.invalid) {
      return;
    }
    if ((this.ce_vendorId != undefined && this.ce_vendorId != '') || (this.ce_osd != undefined && this.ce_osd != '') || (this.ce_edid != undefined && this.ce_edid != '')) {
      var edid128 = this.ce_edid;
      if (edid128 != null && edid128 != '' && edid128 != undefined) {
        let checkEdidData = ((edid128.startsWith('00 FF FF FF FF FF FF 00') || edid128.startsWith('00 ff ff ff ff ff ff 00')) && edid128.length >= 383);
        if (!checkEdidData) {
          this.edidError = true;
          this.cecEdidsubmitted = false;
        }
        else {
          $('#checkEdidValid').css('border', '1px solid #ced4da');
          this.edidError = false;
          this.cecEdidValidate();
        }
      }
      else {
        $('#checkEdidValid').css('border', '1px solid #ced4da');
        this.edidError = false;
        this.cecEdidValidate();
      }

    } else {
      this.toastr.error('', 'Enter Vendorid or OSD or EDID', { timeOut: 4000 })
    }
  }

  cecEdidValidate() {
    if (this.ce_vendorId != undefined || this.ce_osd != undefined || this.ce_edid != undefined) {
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
      if (this.UpdateosdHeader === 'OSD Hex') {
        let ce_osd = this.ce_osd;
        var modOsdString; var str = '';
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.ce_osd.trim();
          if (ce_osd == '') {
            ce_osd = '';
            modOsdString = '';
          } else {
            ce_osd = ce_osd.replace(/[^a-zA-Z0-9]/g, '');
            modOsdString = ce_osd;
            for (var i = 0; i < modOsdString.length; i += 2)
              str += String.fromCharCode(parseInt(modOsdString.substr(i, 2), 16));
          }
          osd = ce_osd;
          osdstr = str;
        }
        else if (ce_osd == undefined || ce_osd == null) {
          osd = null;
          osdstr = null;
        }
      }
      if (this.UpdateosdHeader === 'OSD String') {
        let ce_osd = this.ce_osd;
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.ce_osd.trim();
          osd = this.convertHexa(ce_osd);
          osdstr = ce_osd;
        } else if (ce_osd == undefined || ce_osd == null) {
          osd = null;
          osdstr = null;
        }
      }
      let Projectname = this.tabValue; let Dbversion = this.version_list;
      let Dbname = searchDbName[0]['dbinstance'];
      if (Projectname.startsWith(Dbname + '_')) {
        Projectname = Projectname.replace(Dbname + '_', '')
      }
      let JsonCecEdidtype = [{
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
              ',' + edidbrand + ',' + edid128 + ',' + vendorid + ',' + osd + ',' + osdstr + ',' + iscecpresent + ',' + iscecenabled + ',' + codeset + '';
            let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
            this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
              .subscribe(value => {

              });
            this.getTabResponseData();
            this.toastr.success('Value Inserted Successfully', '');
            this.UpdateosdHeader = 'OSD String';
            $('#osd_string').click();
          } else {
            this.toastr.warning(value.message, '');
          }
        });
    } else {
      $('#checkInputValid').css('border', '1px solid #bb2a38');
      this.vendorError = true;
    }
  }

  onsaveEditCecEdidDataSubmit() {
    this.cecEdidsubmitted = true;
    if (this.saveEditCecEdidData.invalid) {
      return;
    }
    if ((this.editedceVendorId != undefined && this.editedceVendorId != '') || (this.editedceOSD != undefined && this.editedceOSD != '') || (this.editedceEdid != undefined && this.editedceEdid != '')) {
      var edid128 = this.editedceEdid;
      if (edid128 != null && edid128 != '' && edid128 != undefined) {
        let checkEdidData = ((edid128.startsWith('00 FF FF FF FF FF FF 00') || edid128.startsWith('00 ff ff ff ff ff ff 00')) && edid128.length >= 383);
        if (!checkEdidData) {
          this.edidError = true;
          this.cecEdidsubmitted = false;
        }
        else {
          $('#checkEdidValid').css('border', '1px solid #ced4da');
          this.edidError = false;
          this.EditcecEdidValidate();
        }
      }
      else {
        $('#checkEdidValid').css('border', '1px solid #ced4da');
        this.edidError = false;
        this.EditcecEdidValidate();
      }

    } else {
      this.toastr.error('', 'Enter Vendorid or OSD or EDID', { timeOut: 4000 })
    }
  }

  EditcecEdidValidate() {
    if (this.editedceVendorId != undefined || this.editedceOSD != undefined || this.editedceEdid != undefined) {
      let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
      let device = this.editedceDevice; let brand = this.editedceBrand; let model = this.editedceModel;
      if (model != undefined) {
        var filterChars = model.replace(/[^a-zA-Z0-9]/g, '');
      }
      let modelx = filterChars;
      let region = this.editedceRegion; let country = this.editedceCountry;
      let edid;
      if (this.editedceEdid == undefined) {
        edid = null;
      } else {
        edid = this.editedceEdid;
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
      if (this.editedceVendorId == undefined) {
        vendorid = null;
      } else {
        vendorid = this.editedceVendorId.toUpperCase();
      }
      let codeset = this.editedceCodeset;
      let osd;
      if (this.EditosdHeader === 'OSD Hex') {
        let ce_osd = this.editedceOSD;
        var modOsdString; var str = '';
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.editedceOSD.trim();
          if (ce_osd == '') {
            ce_osd = '';
            modOsdString = '';
          } else {
            ce_osd = ce_osd.replace(/[^a-zA-Z0-9]/g, '');
            modOsdString = ce_osd;
            for (var i = 0; i < modOsdString.length; i += 2)
              str += String.fromCharCode(parseInt(modOsdString.substr(i, 2), 16));
          }
          osd = ce_osd;
          osdstr = str;
        }
        else if (ce_osd == undefined || ce_osd == null) {
          osd = null;
          osdstr = null;
        }
      }
      if (this.EditosdHeader === 'OSD String') {
        let ce_osd = this.editedceOSD;
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.editedceOSD.trim();
          osd = this.convertHexa(ce_osd);
          osdstr = ce_osd;
        } else if (ce_osd == undefined || ce_osd == null) {
          osd = null;
          osdstr = null;
        }
      }
      // if(((vendorid != null && vendorid != '') && (osdstr != '' && osdstr != null))||(edid != '' && edid != null)){}
      if ((vendorid == null || vendorid == '') && (osdstr == '' || osdstr == null)) {
        this.toastr.error('', 'Enter Vendorid or OSD', { timeOut: 4000 })
      }
      else if (edid == null || edid == '') {
        this.toastr.error('', 'Enter Edid', { timeOut: 4000 })
      }
      else {
        let Projectname = this.tabValue; let Dbversion = this.version_list; let Dbname = searchDbName[0]['dbinstance'];
        if (Projectname.startsWith(Dbname + '_')) {
          Projectname = Projectname.replace(Dbname + '_', '')
        }
        this.mainService.getSaveEditCECEDIDdataInfo(Dbname, Projectname, Dbversion, device, brand, null, model, modelx, codeset, null,
          null, region, null, country, null, null, null, null, null, edid, edid128, edidbrand, 8, 3, this.EdidonlyrecordId)
          .subscribe(value => {
            $("#edidBrandModal .close").click()
            if (value.data === '1') {
              let userName = localStorage.getItem('userName'); let Datasection = 'CEC EDID Data';
              let recordCount = 1;
              let Updateadddescription = '' + device + ',' + brand + ',' + model + ',' + modelx + ',' + codeset + ',' + region + ',' + country + ',' + edid + ',' + edidbrand + ',' + edid128 + ',' + this.EdidonlyrecordId + '';
              let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
              this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
                .subscribe(value => {
                });
              this.toastr.success('EDID data updated successfully', '');
            }
            // else {
            //   this.toastr.warning('EDID data- ' + value.message, '');
            // }
            setTimeout(() => {
              this.mainService.getSaveEditCECEDIDdataInfo(Dbname, Projectname, Dbversion, device, brand, null, model, modelx, codeset, null,
                null, region, null, country, null, null, vendorid, osd, osdstr, null, null, null, 7, 3, this.CeconlyrecordId)
                .subscribe(value => {
                  if (value.data === '1') {
                    this.toastr.success('CEC data updated Successfully', '');
                    let userName = localStorage.getItem('userName'); let Datasection = 'CEC EDID Data';
                    let recordCount = 1;
                    let Updateadddescription = '' + device + ',' + brand + ',' + model + ',' + modelx + ',' + codeset + ',' + region + ',' + country + ',' + vendorid + ',' + osd + ',' + osdstr + ',' + this.CeconlyrecordId + '';
                    let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
                    this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
                      .subscribe(value => {

                      });
                  }
                  // else {
                  //   this.toastr.warning('CEC data- ' + value.message, '');
                  // }
                  this.getTabResponseData();
                  this.UpdateosdHeader = 'OSD String';
                  $('#osd_string').click();
                });
            }, 2000);

          });
      }

    } else {
      $('#checkInputValid').css('border', '1px solid #bb2a38');
      this.vendorError = true;
    }
  }

  EdidValidate() {
    if (this.editedEdidonly_EDID128 != undefined) {
      let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
      let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
      if (Projectname.startsWith(Dbname + '_')) {
        Projectname = Projectname.replace(Dbname + '_', '')
      }
      let Dbversion = this.version_list;
      let recordid = this.EdidonlyrecordId;
      let device = this.editedEdidonlyDevice; let brand = this.editedEdidonlyBrandname;
      let model = this.editedEdidonlyModel; let codeset = this.editedEdidonlyCodeset; let country = this.editedEdidonlyCountry;
      let region = this.editedEdidonlyregion;
      if (model != undefined) {
        var filterChars = model.replace(/[^a-zA-Z0-9]/g, '');
      }
      let modelx = filterChars;
      let edid;
      if (this.editedEdidonly_EDID128 == undefined) {
        edid = null;
      } else {
        edid = this.editedEdidonly_EDID128;
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

      this.mainService.getSaveEditCECEDIDdataInfo(Dbname, Projectname, Dbversion, device, brand, null, model, modelx, codeset, null,
        null, region, null, country, null, null, null, null, null, edid, edid128, edidbrand, 8, 3, recordid)
        .subscribe(value => {
          $("#edidBrandModal .close").click()
          if (value.data === '1') {
            let userName = localStorage.getItem('userName'); let Datasection = 'EDID Only';
            let recordCount = 1;
            let Updateadddescription = '' + device + ',' + brand + ',' + model + ',' + modelx + ',' + region + ',' + country + ',' + edid +
              ',' + edidbrand + ',' + edid128 + ',' + codeset + ',' + recordid + '';
            let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
            this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
              .subscribe(value => {

              });
            this.getTabResponseData();
            this.toastr.success(value.message, '');
          } else {
            this.toastr.warning(value.message, '');
          }
        });
    } else {
      $('#checkInputValid').css('border', '1px solid #bb2a38');
      this.vendorError = true;
    }
  }

  onsaveEditEdidonlySubmit() {
    this.editEdidonlysubmitted = true;
    if (this.saveEditEdidonlyData.invalid) {
      return;
    }
    if (this.editedEdidonly_EDID128 != undefined) {
      var edid128 = this.editedEdidonly_EDID128;
      if (edid128 != null && edid128 != '' && edid128 != undefined) {
        let checkEdidData = ((edid128.startsWith('00 FF FF FF FF FF FF 00') || edid128.startsWith('00 ff ff ff ff ff ff 00')) && edid128.length >= 383);
        if (!checkEdidData) {
          this.edidError = true;
          this.cecEdidsubmitted = false;
        }
        else {
          $('#checkEdidValid').css('border', '1px solid #ced4da');
          this.edidError = false;
          this.EdidValidate();
        }
      }
      else {
        $('#checkEdidValid').css('border', '1px solid #ced4da');
        this.edidError = false;
        this.EdidValidate();
      }
    } else {
      this.toastr.error('', 'Enter Valid EDID', { timeOut: 4000 })
    }
  }

  onsaveEditCeconlySubmit() {
    this.editceconlysubmitted = true;
    if (this.saveEditCeconlyData.invalid) {
      return;
    }
    if (this.editedCeconly_Vendor != undefined || this.editedCeconly_OSD != undefined) {
      let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
      let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
      if (Projectname.startsWith(Dbname + '_')) {
        Projectname = Projectname.replace(Dbname + '_', '')
      }
      let Dbversion = this.version_list;
      let recordid = this.CeconlyrecordId;
      let device = this.editedCeconlyDevice; let brand = this.editedCeconlyBrandname;
      let model = this.editedCeconlyModel; let codeset = this.editedCeconlyCodeset; let country = this.editedCeconlyCountry;
      let region = this.editedCeconlyregion;
      if (model != undefined) {
        var filterChars = model.replace(/[^a-zA-Z0-9]/g, '');
      }
      let modelx = filterChars;
      let vendorid; let osdstr;
      if (this.editedCeconly_Vendor == undefined) {
        vendorid = null;
      } else {
        vendorid = this.editedCeconly_Vendor.toUpperCase().trim();
      }

      let osd;
      if (this.EditosdHeader === 'OSD Hex') {
        let ce_osd = this.editedCeconly_OSD;
        var modOsdString; var str = '';
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.editedCeconly_OSD.trim();
          if (ce_osd == '') {
            ce_osd = '';
            modOsdString = '';
          } else {
            ce_osd = ce_osd.replace(/[^a-zA-Z0-9]/g, '');
            modOsdString = ce_osd;
            for (var i = 0; i < modOsdString.length; i += 2)
              str += String.fromCharCode(parseInt(modOsdString.substr(i, 2), 16));
          }
          osd = ce_osd;
          osdstr = str.trim();
        }
        else if (ce_osd == undefined || ce_osd == null) {
          osd = null;
          osdstr = null;
        }
      }
      if (this.EditosdHeader === 'OSD String') {
        let ce_osd = this.editedCeconly_OSD;
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.editedCeconly_OSD.trim();
          osd = this.convertHexa(ce_osd);
          osdstr = ce_osd;
        } else if (ce_osd == undefined || ce_osd == null) {
          osd = null;
          osdstr = null;
        }
      }
      if ((vendorid == null || vendorid == '') && (osdstr == '' || osdstr == null)) {
        this.toastr.error('', 'Enter Valid Vendorid or OSD', { timeOut: 4000 })
      }
      // if ((this.editedCeconly_OSD == null && this.editedCeconly_Vendor == null) || (this.editedCeconly_OSD == '' && this.editedCeconly_Vendor == '')) {
      //   this.toastr.error('', 'Enter Valid Vendorid or OSD', { timeOut: 4000 })
      // }
      else {
        this.mainService.getSaveEditCECEDIDdataInfo(Dbname, Projectname, Dbversion, device, brand, null, model, modelx, codeset, null,
          null, region, null, country, null, null, vendorid, osd, osdstr, null, null, null, 7, 3, recordid)
          .subscribe(value => {
            $("#edidBrandModal .close").click()
            if (value.data === '1') {
              let userName = localStorage.getItem('userName'); let Datasection = 'CEC Only';
              let recordCount = 1;
              let Updateadddescription = '' + device + ',' + brand + ',' + model + ',' + model + ',' + region + ',' + country + ',' + vendorid +
                ',' + osd + ',' + osdstr + ',' + codeset + ',' + recordid + '';
              let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
              this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
                .subscribe(value => {

                });
              this.getTabResponseData();
              this.toastr.success(value.message, '');
            } else {
              this.toastr.warning(value.message, '');
            }
          });
      }

    } else {
      $('#checkInputValid').css('border', '1px solid #bb2a38');
      this.vendorError = true;
    }
  }

  /** Save Functionality to add CEC EDID data if New Option is selected end **/


  /** Save Functionality for Region/country if new Region/Country is added using New Option start  **/
  onsaveRegionSubmit() {

    this.regioncountrysubmitted = true;
    if (this.saveUpdateRegionData.invalid) {
      return;
    }
    if (this.Region == undefined) {
      this.Region = null;
    }
    if (this.Regioncode == undefined) {
      this.Regioncode = null;
    }
    if (this.Country == undefined) {
      this.Country = null;
    }
    if (this.Countrycode == undefined) {
      this.Countrycode = null;
    }
    let regioncountrydata = [];
    let region = this.Region; let regioncode = this.Regioncode; let country = this.Country; let countrycode = this.Countrycode;
    regioncountrydata.push({ "RowId": 1, "region": this.Region, "regioncode": this.Regioncode, "country": this.Country, "countrycode": this.Countrycode });
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
    let Dbname = searchDbName[0]['dbinstance'];
    let Dbversion = this.version_list; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let data = regioncountrydata;
    this.mainService.dataUploadLoadCountryCodeData(1, Dbname, data)
      .then(value => {
        $("#editDataModal .close").click()

        if (value.data[0]['status'] === '1') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Region Country Code';
          let recordCount = 1;
          let Updateadddescription = '' + region + ',' + regioncode + ',' + country + ',' + countrycode + '';
          let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.spinnerService.show();
          this.getTabResponseData();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.data[0]['message'], '');
        }
      });
  }
  /** Save Functionality for Region/country if new Region/Country is added using New Option End  **/

  /** Edit Functionality for Region/country if Region/Country is updated using Edit Option start  **/
  onsaveEditRegionSubmit() {
    this.editregioncountrysubmitted = true;
    if (this.saveEditRegionData.invalid) {
      return;
    }
    if (this.Region == undefined) {
      this.Region = null;
    }
    if (this.Regioncode == undefined) {
      this.Regioncode = null;
    }
    if (this.Country == undefined) {
      this.Country = null;
    }
    if (this.Countrycode == undefined) {
      this.Countrycode = null;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = this.version_list;
    let recordid = this.RegionrecordId;
    let region = this.EditRegion; let regioncode = this.EditRegioncode; let country = this.EditCountry; let countrycode = this.EditCountrycode
    this.mainService.getSaveEditBrandDetailsInfo(Dbname, Projectname, Dbversion, null, null, null, null, null, null, null,
      null, region, regioncode, country, countrycode, null, null, null, null, 9, 3, recordid)
      .subscribe(value => {
        $("#edidBrandModal .close").click()
        if (value.data === '1') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Region Country Code';
          let recordCount = 1;
          let Updateadddescription = '' + region + ',' + regioncode + ',' + country + ',' + countrycode + ',' + recordid + '';
          let Updatestatus = 1; let Operation = "Update"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getTabResponseData();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.message, '');
        }
      });
  }
  /** Edit Functionality for Region/country if Region/Country is updated using Edit Option End  **/

  /** Vendor Validation in CEC EDID add Option start **/
  vendorMod() {
    if (this.ce_vendorId != undefined && this.ce_vendorId != null) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if (this.ce_osd != undefined && this.ce_osd != null) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if (this.ce_edid != undefined && this.ce_edid != null) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if (this.ce_edid != undefined) {
      let checkEdid = ((this.ce_edid.includes('00 FF FF FF FF FF FF 00') || this.ce_edid.includes('00 ff ff ff ff ff ff 00')) && this.ce_edid.length >= 383);
      if (checkEdid == true) {
        $('#checkEdidValid').css('border', '1px solid #ced4da');
        this.edidError = false;
      } else {
        this.edidError = true;
      }
    }
    if (this.ce_edid == undefined && this.ce_vendorId != undefined || this.ce_osd != undefined) {
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
    this.UpdateosdHeader = 'OSD String';
    this.EditosdHeader = 'OSD String';
    $('#osd_string').click();
    $('#String').click();
    this.regioncountrysubmitted = false;
    this.saveUpdateRegionData.reset();
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

      let selectedBrand = this.cec_brandName
      let filterBrand: any = this.edidBrands.filter(u =>
        (u.brandName.toUpperCase() == selectedBrand || u.brandName.toLowerCase() == selectedBrand));
      if (filterBrand.length > 0) {
        this.cec_brandcode = filterBrand[0]['brandCode'];
      } else {
        this.cec_brandName = '';
        this.cec_brandcode = '';
      }
    }
    if (this.editedcecBrandname != null) {
      let selectedBrand = this.editedcecBrandname
      let filterBrand: any = this.edidBrands.filter(u =>
        (u.brandName.toUpperCase() == selectedBrand || u.brandName.toLowerCase() == selectedBrand));
      if (filterBrand.length > 0) {
        this.editedcecBrandcode = filterBrand[0]['brandCode'];
      } else {
        this.editedcecBrandname = '';
        this.editedcecBrandcode = '';
      }
    }
  }
  /** Brand Code Generation if Brand is selected in autocomplete option in Add Brands end **/

  /** Brand Code Generation if Brand is selected in autocomplete option in Add BrandInfo Edid start **/
  brandEdidSelects() {
    if (this.edid_brandName != null) {
      let selectedEdidBrand = this.edid_brandName;
      let filterEdidBrand: any = this.edidBrands.filter(u =>
        (u.brandName.toUpperCase() == selectedEdidBrand || u.brandName.toLowerCase() == selectedEdidBrand));
      if (filterEdidBrand.length > 0) {
        this.edid_brandcode = filterEdidBrand[0]['brandCode'];
      } else {
        this.edid_brandName = '';
        this.edid_brandcode = '';
      }

    }
    if (this.editedEdidBrandname != null) {
      let selectedEdidBrand = this.editedEdidBrandname;
      let filterEdidBrand: any = this.edidBrands.filter(u =>
        (u.brandName.toUpperCase() == selectedEdidBrand || u.brandName.toLowerCase() == selectedEdidBrand));
      if (filterEdidBrand.length > 0) {
        this.editedEdidBrandcode = filterEdidBrand[0]['brandCode'];
      } else {
        this.editedEdidBrandname = '';
        this.editedEdidBrandcode = '';
      }

    }
  }
  /** Brand Code Generation if Brand is selected in autocomplete option in Add BrandInfo Edid end **/

  /** Brand Code Generation if Brand is selected in autocomplete option in Add BrandInfo CEC start **/

  brandCECSelect() {

    if (this.ce_brand != null) {
      let selectedBrand = this.ce_brand;
      let filterBrand: any = this.edidBrands.filter(u =>
        (u.brandName.toUpperCase() == selectedBrand || u.brandName.toLowerCase() == selectedBrand));
      if (filterBrand.length > 0) {
        this.ce_brandcode = filterBrand[0]['brandCode'];
      } else {
        this.ce_brand = '';
        this.ce_brandcode = '';
      }
    }
  }
  /** Brand Code Generation if Brand is selected in autocomplete option in Add BrandInfo CEC end **/

  BrandSelects() {
    if (this.component_brandName != null) {
      let selectedBrand = this.component_brandName
      let filterBrand: any = this.edidBrands.filter(u =>
        (u.brandName.toUpperCase() == selectedBrand || u.brandName.toLowerCase() == selectedBrand));
      if (filterBrand.length <= 0) {
        this.component_brandName = '';
      }
    }
    if (this.cr_brandName != null) {
      let selectedBrand = this.cr_brandName
      let filterBrand: any = this.edidBrands.filter(u =>
        (u.brandName.toUpperCase() == selectedBrand || u.brandName.toLowerCase() == selectedBrand));
      if (filterBrand.length <= 0) {
        this.cr_brandName = '';
      }
    }
    if (this.editedComponentBrandname != null) {
      let selectedBrand = this.editedComponentBrandname
      let filterBrand: any = this.edidBrands.filter(u =>
        (u.brandName.toUpperCase() == selectedBrand || u.brandName.toLowerCase() == selectedBrand));
      if (filterBrand.length <= 0) {
        this.editedComponentBrandname = '';
      }
    }
    if (this.editedCrossBrandname != null) {
      let selectedBrand = this.editedCrossBrandname
      let filterBrand: any = this.edidBrands.filter(u =>
        (u.brandName.toUpperCase() == selectedBrand || u.brandName.toLowerCase() == selectedBrand));
      if (filterBrand.length <= 0) {
        this.editedCrossBrandname = '';
      }
    }
  }
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

  showSpinner() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 3000);
  }

  newBrand() {
    this.SelectedBrand = "Brand"
    this.BrandModel = true;
    this.ComponentData = false;
    this.Codesets = false;
    this.Regioncountry = false;
  }

  newModel() {
    this.SelectedBrand = "Component Model"
    this.BrandModel = false;
    this.ComponentData = true;
    this.Codesets = false;
    this.Regioncountry = false;
  }

  newCodeset() {
    this.SelectedBrand = "Codesets"
    this.BrandModel = false;
    this.ComponentData = false;
    this.Codesets = true;
    this.Regioncountry = false;
  }

  newRegion() {
    this.SelectedBrand = "Region Country Code"
    this.BrandModel = false;
    this.ComponentData = false;
    this.Codesets = false;
    this.Regioncountry = true;
  }

  /** Save Functionality for Brand if new Brand is added using New Option start  **/
  onsaveBrandDataSubmit() {

    this.submitted = true;
    if (this.saveUpdateData.invalid) {
      return;
    }
    let brand = this.brand_name;
    let brandCode = this.brand_code;
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue);
    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = searchDbName[0]['embeddedDbVersion'];
    this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, null, this.brand_name, this.brand_code, null, null, null,
      null, null, null, null, null, null, null, null, null, null, 1, 1)
      .subscribe(value => {
        $("#DataModal .close").click()
        if (value.data === '0') {
          this.toastr.warning(value.message, '');
        } else {
          this.toastr.success(value.message, '');
          let userName = localStorage.getItem('userName'); let Datasection = 'Brands';
          let recordCount = 1; let Updateadddescription = '' + brand + ',' + brandCode + '';
          let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.getCodeSets();
          this.getDropdownValues();
        }
      });
  }
  /** Save Functionality for Brand if new Brand is added using New Option end  **/

  /** Save Functionality for Component data using New Option start  **/

  onsaveModelDataSubmit() {

    this.componentsubmitted = true;
    if (this.saveUpdateComponentData.invalid) {
      return;
    }
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);

    let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let Dbversion = this.version_list;
    let codesetFileName = this.componentFile; let codesetData = this.base64CompData; let Cschecksum = this.checksumCompData;
    let componentModel = this.component_model.toUpperCase(); let componentcountry = this.component_country;
    this.component_modelx = componentModel;
    if (componentModel != null && componentModel != undefined) {
      this.component_modelx = componentModel.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    }
    let model_x = this.component_modelx;
    let Device = this.component_device; let brand = this.component_brandName; let codeset = this.component_codeset;
    if (this.component_country === 'null') {
      componentcountry = null;
    } else {
      componentcountry = this.component_country;
    }
    this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, this.component_device, this.component_brandName, null, componentModel, model_x, this.component_codeset,
      null, null, null, null, componentcountry, null, null, null, null, null, 6, 1)
      .subscribe(value => {
        $("#DataModal .close").click()
        if (value.data === '0') {
          this.toastr.warning(value.message, '');
        } else {
          let userName = localStorage.getItem('userName'); let Datasection = 'Component Data';
          let recordCount = 1;
          let Updateadddescription = '' + Device + ',' + brand + ',' + model_x + ',' + codeset + ',' + componentcountry + '';
          let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.spinnerService.show();
          this.getCodeSets();
          this.getDropdownValues();
          this.spinnerService.hide();
          this.toastr.success(value.message, '');
        }
      });
  }
  /** Save Functionality for Component data using New Option end  **/

  /** Save functionality to save the Codeset in New Option start **/
  onsaveCodesetSubmit() {
    if (this.codesetFileName != undefined && this.codesetFileName != null) {
      this.submittedFile = false;
      let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);

      let Dbname = searchDbName[0]['dbinstance']; let Projectname = this.tabValue;
      if (Projectname.startsWith(Dbname + '_')) {
        Projectname = Projectname.replace(Dbname + '_', '')
      }
      let Dbversion = this.version_list;
      let codeset = this.codesetFile; let codesetData = this.codesetDataValue; let cschecksum = this.codesetChecksum;
      this.mainService.getSavebrandDetailsInfo(Dbname, Projectname, Dbversion, null, null, null, null, null, codeset, codesetData,
        cschecksum, null, null, null, null, null, null, null, null, 4, 1)
        .subscribe(value => {
          $("#DataModal .close").click()
          this.codesetFileName = null;
          $('#codeset-upload-file-info').html('');
          if (value.data === '1') {
            let userName = localStorage.getItem('userName'); let Datasection = 'Codesets';
            let recordCount = 1;
            let Updateadddescription = '' + codeset + ',' + codesetData + ',' + cschecksum + '';
            let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
            this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
              .subscribe(value => {

              });
            this.spinnerService.show();
            this.getCodeSets();
            this.getDropdownValues();
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

  /** Save Functionality for Region/country if new Region/Country is added using New Option start  **/
  onsaveRegionCountrySubmit() {

    this.regioncountrysubmitted = true;
    if (this.saveUpdateRegionData.invalid) {
      return;
    }
    if (this.Region == undefined) {
      this.Region = null;
    }
    if (this.Regioncode == undefined) {
      this.Regioncode = null;
    }
    if (this.Country == undefined) {
      this.Country = null;
    }
    if (this.Countrycode == undefined) {
      this.Countrycode = null;
    }
    let regioncountrydata = [];
    let region = this.Region; let regioncode = this.Regioncode; let country = this.Country; let countrycode = this.Countrycode;
    regioncountrydata.push({ "RowId": 1, "region": this.Region, "regioncode": this.Regioncode, "country": this.Country, "countrycode": this.Countrycode });
    let searchDbName: any = this.finalArray.filter(u => u.projectname == this.tabValue && u.embeddedDbVersion == this.version_list);
    let Dbname = searchDbName[0]['dbinstance'];
    let Dbversion = this.version_list; let Projectname = this.tabValue;
    if (Projectname.startsWith(Dbname + '_')) {
      Projectname = Projectname.replace(Dbname + '_', '')
    }
    let data = regioncountrydata;
    this.mainService.dataUploadLoadCountryCodeData(1, Dbname, data)
      .then(value => {
        $("#DataModal .close").click()

        if (value.data[0]['status'] === '1') {
          let userName = localStorage.getItem('userName'); let Datasection = 'Region Country Code';
          let recordCount = 1;
          let Updateadddescription = '' + region + ',' + regioncode + ',' + country + ',' + countrycode + '';
          let Updatestatus = 1; let Operation = "Create"; let ipaddress = this.ipAddress;
          this.mainService.DBUpdates(userName, Projectname, Dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus, Dbname)
            .subscribe(value => {

            });
          this.spinnerService.show();
          this.getCodeSets();
          this.getDropdownValues();
          this.spinnerService.hide();
          this.toastr.success(value.message, '');
        } else {
          this.toastr.warning(value.data[0]['message'], '');
        }
      });
  }
  /** Save Functionality for Region/country if new Region/Country is added using New Option End  **/


  onRowClicked(event: any) {
    // alert(`Selected Nodes:\n${JSON.stringify(event.data)}`)
    console.log(event.data);
  }

  onPageSizeChanged() {
    var value = (<HTMLInputElement>document.getElementById('page-size')).value;
    // this.paginationPageSize = Number(value);
    // this.viewdata();
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  methodFromParent(cell) {
    let values = Object.values(cell);
    // alert('Parent Component Method from ' + cell + '!');
    console.log(values)
    if (this.brand_list === 'Brand') {
      this.BrandView(values)
      $('#editBrand').click();
    }
    if (this.brand_list === 'Brand Info CEC') {
      this.CecView(values);
      $('#editBrandInfo').click();
    }
    if (this.brand_list === 'Brand Info EDID') {
      this.EdidView(values);
      $('#editBrandInfo').click();
    }
    if (this.brand_list === 'Component Data') {
      this.componentDataView(values);
      $('#editModel').click();
    }
    if (this.brand_list === 'Cross Reference By Brands') {
      this.crossReferenceBrandsView(values);
      $('#editXrefbybrands').click();
    }
    if (this.brand_list === 'Codesets') {
      this.codeSetsView(values);
      $('#editCodeset').click();
    }
    if (this.brand_list == 'CEC Only') {
      this.cecOnlyDataView(values);
      $('#editCecOnly').click();
    }
    if (this.brand_list == 'EDID Only') {
      this.edidOnlyDataView(values);
      $('#editEdidOnly').click();
    }
    if (this.brand_list == 'Region Country Code') {
      this.regionView(values);
      $('#editRegion').click();
    }
    if (this.brand_list === 'CEC-EDID Data') {
      this.cecedidDataView(values);
      $('#editcecedidData').click();
    }
  }

  methodFromParent_downloadcodeset(cell) {
    let values = Object.values(cell);
    if (this.brand_list === 'Codesets') {
      this.codesetdownload(values);
    }
  }

  methodFromParent_viewEdid(cell) {
    let values = Object.values(cell);
    console.log(values)
    if (this.brand_list === 'CEC-EDID Data') {
      this.ViewEdid(values);
    }
    if (this.brand_list === 'EDID Only') {
      this.ViewEdid128(values);
    }
  }

  onBtnExport() {
    let columndefs = this.gridApi.columnController.columnDefs; let columns = []; let filteredcolumns = [];
    columndefs.forEach(element => {
      columns.push(element['field'])
    });

    // for (let i = 0; i < columns.length - 1; i++) {
    //   filteredcolumns.push(columns[i])
    // }
    for (var i = columns.length - 1; i >= 0; --i) {
      if (columns[i] == "Action") {
        columns.splice(i, 1);
      }
    }
    // console.log(value.data);
    filteredcolumns = columns;
    var excelParams = {
      columnKeys: filteredcolumns,
      allColumns: false,
      fileName: '' + this.SelectedBrandName,
      skipHeader: false
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }


  viewdata() {
    this.spinnerService.show();
    this.searchValue = null
    if (this.brand_list === 'Brand') {
      this.columnDef = [
        { headerName: 'BrandName', field: "BrandName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'BrandCode', field: "BrandCode", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['BrandName', 'BrandCode'], 0)
    }
    if (this.brand_list === 'Brand Info CEC') {
      this.columnDef = [
        { headerName: 'Device', field: "Device", resizable: true, sortable: false, filter: 'agTextColumnFilter', floatingFilter: true, },
        { headerName: 'BrandName', field: "BrandName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Vendorid', field: "Vendorid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['Device', 'BrandName', 'Vendorid'], 0)
    }
    if (this.brand_list === 'Brand Info EDID') {
      this.columnDef = [
        { headerName: 'Device', field: "Device", resizable: true, sortable: false, filter: 'agTextColumnFilter', floatingFilter: true, },
        { headerName: 'BrandName', field: "BrandName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'EdidBrand', field: "EdidBrand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['Device', 'BrandName', 'EdidBrand'], 0)
    }
    if (this.brand_list === 'Component Data') {
      this.columnDef = [
        { headerName: 'Device', field: "Device", resizable: true, sortable: false, filter: 'agTextColumnFilter', floatingFilter: true, },
        { headerName: 'BrandName', field: "BrandName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Model', field: "Model", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Codeset', field: "Codeset", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Country', field: "Country", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['Device', 'BrandName', 'Model', 'Codeset', 'Country'], 0)
    }
    if (this.brand_list === 'Cross Reference By Brands') {
      this.columnDef = [
        { headerName: 'Device', field: "Device", resizable: true, sortable: false, filter: 'agTextColumnFilter', floatingFilter: true, },
        { headerName: 'BrandName', field: "BrandName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'BrandCode', field: "BrandCode", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Codeset', field: "Codeset", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Rank', field: "Rank", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['Device', 'BrandName', 'BrandCode', 'Codeset', 'Rank'], 0)
    }
    if (this.brand_list === 'Codesets') {
      this.columnDef = [
        { headerName: 'Codeset', field: "Codeset", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Binfile', field: "Bindata", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "codesetDownloadCellRenderer" },
        { headerName: 'Checksum', field: "Checksum", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['Codeset', 'Bindata', 'Checksum'], 0)
    }
    if (this.brand_list === 'CEC-EDID Data') {
      this.columnDef = [
        { headerName: 'Device', field: "Device", resizable: true, sortable: false, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Brand', field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Country', field: "Country", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Model', field: "Model", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'VendorId', field: "VendorId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'OSDString', field: "OSDString", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Edid128', field: "Edid128", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "edidviewCellRenderer" },
        { headerName: 'EdidBrand', field: "EdidBrand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Codeset', field: "Codeset", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['Device', 'Brand', 'Country', 'Model', 'VendorId', 'OSDString', 'Edid128', 'EdidBrand', 'Codeset'], 0)
    }
    if (this.brand_list == 'CEC Only') {
      this.columnDef = [
        { headerName: 'Device', field: "Device", resizable: true, sortable: false, filter: 'agTextColumnFilter', floatingFilter: true, },
        { headerName: 'Brand', field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Country', field: "Country", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Model', field: "Model", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'VendorId', field: "VendorId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'OSDString', field: "OSDString", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Codeset', field: "Codeset", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['Device', 'Brand', 'Country', 'Model', 'VendorId', 'OSDString', 'Codeset'], 0)
    }
    if (this.brand_list == 'EDID Only') {
      this.columnDef = [
        // { field: "Device", resizable: true, sortable: false, filter: 'agTextColumnFilter',floatingFilter: true,checkboxSelection: true,headerCheckboxSelection: true },
        { headerName: 'Device', field: "Device", resizable: true, sortable: false, filter: 'agTextColumnFilter', floatingFilter: true, },
        { headerName: 'Brand', field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Country', field: "Country", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Model', field: "Model", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Edid128', field: "Edid128", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "edidviewCellRenderer" },
        { headerName: 'EdidBrand', field: "EdidBrand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Codeset', field: "Codeset", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['Device', 'Brand', 'Country', 'Model', 'Edid128', 'EdidBrand', 'Codeset'], 0)
    }
    if (this.brand_list == 'Region Country Code') {
      this.columnDef = [
        { headerName: 'Region', field: "Region", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'RegionCode', field: "RegionCode", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'Country', field: "Country", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: 'CountryCode', field: "CountryCode", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        {
          headerName: 'Action', field: "Action", resizable: true,
          cellRenderer: "btnCellRenderer"
        }
      ];
      this.gridColumnApi.moveColumns(['Region', 'RegionCode', 'Country', 'CountryCode'], 0)
    }
    if (this.brand_list === 'Brand' || this.brand_list === 'Brand Info CEC' || this.brand_list === 'Brand Info EDID' || this.brand_list == 'Region Country Code') {
      this.defaultColDef = {
        flex: 1,
        minWidth: 100,
      };
    }
    if (this.brand_list === 'Component Data' || this.brand_list === 'Cross Reference By Brands' || this.brand_list === 'Codesets') {
      this.defaultColDef = {
        flex: 1,
        minWidth: 100,
      };
    }
    if (this.brand_list === 'CEC-EDID Data' || this.brand_list == 'CEC Only' || this.brand_list == 'EDID Only') {
      this.defaultColDef = {
        minWidth: 100,
      };
    }
    let arrData = [];
    for (var i = 0; i < this.columnDef.length; i++) {
      arrData.push({ item_id: i, item_text: this.columnDef[i]['headerName'] });
    }
    this.report_visiblity = arrData;
    this.columns_visible = arrData;
    this.columns = this.columnDef;
    this.columnvisiblity();
  }


  columnvisiblity() {
    let column = this.columns;
    this.report_visiblity = lodash.sortBy(this.report_visiblity, 'item_id');
    this.report_visiblity = lodash.uniqWith(this.report_visiblity, lodash.isEqual);
    let visible = []; let columnvisible = []; let moveColumn = [];
    for (let i = 0; i < this.report_visiblity.length; i++) {
      visible.push(column.filter(u => u.headerName === this.report_visiblity[i]['item_text']));
    }
    visible = visible.filter(u => u.length > 0);
    visible.forEach(element => {
      columnvisible.push(element[0]);
    })
    this.columnDefs = columnvisible;
    this.columnDefs.forEach(element => {
      moveColumn.push(element['field']);
    })
    this.gridColumnApi.moveColumns(moveColumn, 0);
    this.View();
  }

  changecolumns() {
    this.columnvisiblity();
  }

  onColumnSelect(e) {
    this.report_visiblity.push(e);
  }

  View() {
    let brandName = this.brand_list;
    let crudType = 7;
    this.mainService.getRoleModule(crudType, null, null, null, null)
      .then(value => {
        /** based on role get modules accessible checked or not checked*/
        let resultFetchArr: any = value.data.filter(u =>
          u.name == this.role);
        let fetchModule = [];
        let permission = resultFetchArr.filter(u => u.mainModule === this.module)
        if (permission[0]['readPermission'] === null) {
          permission[0]['readPermission'] = 0
        }
        if (permission[0]['downloadPermission'] === null) {
          permission[0]['downloadPermission'] = 0
        }
        if (permission[0]['writePermission'] === null) {
          permission[0]['writePermission'] = 0
        }
        if ((permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 0) ||
          (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 0)) {
          this.columnDefs = this.columnDefs.filter(u => u.field != 'Action');
          $('#single_download').hide();
          $('.newBtn').hide();
        }
        if ((permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0) ||
          (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0)) {
          this.columnDefs = this.columnDefs.filter(u => u.field != 'Action');
          $('#single_download').show();
          $('.newBtn').hide();
        }
        if ((permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1)) {
          this.columnDefs = this.columnDefs;
          $('#single_download').show();
          $('.newBtn').show();
        }
        if (this.brand_list === 'CEC Only' || this.brand_list === 'EDID Only') {
          $('.newBtn').css('display', 'none');
        }
        console.log(permission)
      })
    let dbName = this.parameters[0], projectName = this.parameters[1], dbVersion = this.parameters[2], start = this.parameters[3], temp = this.parameters[4], search = this.parameters[5], order = this.parameters[6], dataType = this.parameters[7]
    console.log(dbName, projectName, dbVersion, start, temp, search, order, dataType)
    this.mainService.getPaginatedRecords(dbName, projectName, dbVersion, start, temp, search, order, dataType)
      .subscribe(value => {
        if (value.data !== '0') {
          const newArray = [];
          for (let i = 0; i < value.data.length; i++) {
            const keys = Object.keys(value.data[i])
            const newObject = {};
            keys.forEach(key => {
              const newKey = key.charAt(0).toUpperCase() + key.slice(1);
              newObject[newKey] = value.data[i][key];
            })
            newArray.push(newObject);
          }
          let pushData = []; let temp;
          if (brandName === 'Brand') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ ID: newArray[i][0], BrandName: newArray[i][1], BrandCode: newArray[i][2] });
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }

          }
          if (brandName === 'Brand Info CEC') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ ID: newArray[i][0], Device: newArray[i][1], BrandName: newArray[i][2], BrandCode: newArray[i][3], Vendorid: newArray[i][4] })
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }
          }
          if (brandName === 'Brand Info EDID') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ ID: newArray[i][0], Device: newArray[i][1], BrandName: newArray[i][2], BrandCode: newArray[i][3], EdidBrand: newArray[i][4] })
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }


          }
          if (brandName === 'Component Data') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ ID: newArray[i][0], Device: newArray[i][1], BrandName: newArray[i][2], Model: newArray[i][3], Codeset: newArray[i][4], Region: newArray[i][5], Country: newArray[i][6] })
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }

          }
          if (brandName === 'Cross Reference By Brands') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ ID: newArray[i][0], Device: newArray[i][1], BrandName: newArray[i][2], BrandCode: newArray[i][3], Codeset: newArray[i][4], Rank: newArray[i][5] })
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }

          }
          if (brandName === 'Codesets') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ ID: newArray[i][0], Codeset: newArray[i][1], Bindata: newArray[i][2], Checksum: newArray[i][3] })
                // pushData.push({Codeset:newArray[i][1]})
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }

          }
          if (brandName === 'CEC-EDID Data') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ Device: newArray[i][0], Brand: newArray[i][1], Region: newArray[i][11], Country: newArray[i][2], Model: newArray[i][3], VendorId: newArray[i][4], OSDString: newArray[i][5], Edid128: newArray[i][6], EdidBrand: newArray[i][7], Codeset: newArray[i][8], CecRecordId: newArray[i][9], EdidRecordId: newArray[i][10] })
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }

          }
          if (brandName == 'CEC Only') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ ID: newArray[i][0], Device: newArray[i][1], Brand: newArray[i][2], Region: newArray[i][3], Country: newArray[i][4], Model: newArray[i][5], VendorId: newArray[i][6], OSDString: newArray[i][7], Codeset: newArray[i][8] })
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }

          }
          if (brandName == 'EDID Only') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ ID: newArray[i][0], Device: newArray[i][1], Brand: newArray[i][2], Region: newArray[i][3], Country: newArray[i][4], Model: newArray[i][5], Edid128: newArray[i][6], EdidBrand: newArray[i][7], Codeset: newArray[i][8] })
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }

          }
          if (brandName == 'Region Country Code') {
            if (newArray.length > 0) {
              for (let i = 0; i < newArray.length; i++) {
                pushData.push({ ID: newArray[i][0], Region: newArray[i][1], RegionCode: newArray[i][2], Country: newArray[i][3], CountryCode: newArray[i][4] })
                temp = pushData;
              }
            }
            else {
              this.rowData = [];
            }

          }
          if (newArray.length != 0) {
            this.arrayJsonData = temp;
          }
          this.rowData = this.arrayJsonData;
          this.spinnerService.hide();
          this.gridApi.setQuickFilter(this.searchValue)
        }
        else {
          this.rowData = [];
          this.spinnerService.hide();
          this.gridApi.setQuickFilter(this.searchValue)
        }
        if (this.rowData.length < 8) {
          this.setAutoHeight();
        }
        else {
          this.setFixedHeight();
        }

      });
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

  changeosd(ev) {
    this.UpdateosdHeader = ev.target.value;
    this.EditosdHeader = ev.target.value;
    let osd;
    if (this.brand_list == 'CEC-EDID Data') {
      if (this.EditosdHeader === 'OSD Hex') {
        this.osdhex = '';
        this.osdstring = this.editedceOSD;
        let ce_osd = this.osdstring;
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.osdstring.trim();
          osd = this.convertHexa(ce_osd);
          this.osdhex = osd;
        }
        this.editedceOSD = this.osdhex;
      }
      if (this.EditosdHeader === 'OSD String') {
        this.osdstring = '';
        this.osdhex = this.editedceOSD;
        let ce_osd = this.osdhex;
        var modOsdString; var str = '';
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.osdhex.trim();
          if (ce_osd == '') {
            ce_osd = '';
            modOsdString = '';
          } else {
            ce_osd = ce_osd.replace(/[^a-zA-Z0-9]/g, '');
            modOsdString = ce_osd;
            for (var i = 0; i < modOsdString.length; i += 2)
              str += String.fromCharCode(parseInt(modOsdString.substr(i, 2), 16));
          }
          this.osdstring = str;
        }
        this.editedceOSD = this.osdstring;
      }
      if (this.UpdateosdHeader === 'OSD Hex') {
        this.osdhex = '';
        this.osdstring = this.ce_osd;
        let ce_osd = this.osdstring;
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.osdstring.trim();
          osd = this.convertHexa(ce_osd);
          this.osdhex = osd;
        }
        this.ce_osd = this.osdhex;
      }
      if (this.UpdateosdHeader === 'OSD String') {
        this.osdstring = '';
        this.osdhex = this.ce_osd;
        let ce_osd = this.osdhex;
        var modOsdString; var str = '';
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.osdhex.trim();
          if (ce_osd == '') {
            ce_osd = '';
            modOsdString = '';
          } else {
            ce_osd = ce_osd.replace(/[^a-zA-Z0-9]/g, '');
            modOsdString = ce_osd;
            for (var i = 0; i < modOsdString.length; i += 2)
              str += String.fromCharCode(parseInt(modOsdString.substr(i, 2), 16));
          }
          this.osdstring = str;
        }
        this.ce_osd = this.osdstring;
      }
    }
    if (this.brand_list == 'CEC Only') {
      if (this.EditosdHeader === 'OSD Hex') {
        this.osdhex = '';
        this.osdstring = this.editedCeconly_OSD;
        let ce_osd = this.osdstring;
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.osdstring.trim();
          osd = this.convertHexa(ce_osd);
          this.osdhex = osd;
        }
        this.editedCeconly_OSD = this.osdhex;
      }
      if (this.EditosdHeader === 'OSD String') {
        this.osdstring = '';
        this.osdhex = this.editedCeconly_OSD;
        let ce_osd = this.osdhex;
        var modOsdString; var str = '';
        if (ce_osd != undefined && ce_osd != null) {
          ce_osd = this.osdhex.trim();
          if (ce_osd == '') {
            ce_osd = '';
            modOsdString = '';
          } else {
            ce_osd = ce_osd.replace(/[^a-zA-Z0-9]/g, '');
            modOsdString = ce_osd;
            for (var i = 0; i < modOsdString.length; i += 2)
              str += String.fromCharCode(parseInt(modOsdString.substr(i, 2), 16));
          }
          this.osdstring = str;
        }
        this.editedCeconly_OSD = this.osdstring;
      }
    }

  }
}
