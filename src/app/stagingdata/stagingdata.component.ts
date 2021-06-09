import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
declare var $: any;
import 'datatables.net';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import * as xml2js from 'xml2js';
import { BtnCellRenderer } from './btn-cell-renderer.component';
import { EdidviewCellRenderer } from '../brand-library/edidview-cell-renderer.component';
import { SupportedRegionsViewCellRenderer } from '../rawdata/supportedregionsview-cell-renderer.component';
import mainscroll from '../model/Scroll';
var lodash = require('lodash');
declare let alasql;
@Component({
  selector: 'app-stagingdata',
  templateUrl: './stagingdata.component.html',
  styleUrls: ['./stagingdata.component.css']
})
export class StagingdataComponent implements OnInit {

  saveEditStagingData: FormGroup; saveEditStagingData_1: FormGroup; saveUpdateStagingData: FormGroup;
  usersName: any;
  projectNames: any; selectedItems: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false; tabslist = []; count: any = 0; oldValue: string; modalCount: any = 0; currentVal: any;
  limitSelection = false; mainArr = [];
  clientDetails = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  resultProjArr: any = []; status: any; filter_Device: any; filter_Subdevice: any; filter_Status: any;
  stagingdatacapture: any = []; device: any; subdevice: any;
  edidDataView: Boolean = false;
  SupportedregionsView: boolean = false;
  EdidData: any;
  Metadata: any; CEC: any; EDID: any; Scandevice: any;
  Supportedregions: any; data: any = [];
  editedDevice: any; editedBrand: any; editedSubdevice: any; editedModel: any; editedVendor: any; editedOSD: any;
  recordId: any; editedEDID128: any; editedSupportedRegion: any; editedVendorstr: any;
  editYear: any; editcecPresent: any; editcecEnabled: any; editedUid: any; editedStatus: any; stagingdatasubmitted: Boolean = false; stagingdatasubmitted_1: Boolean = false; stagingdatasubmitted_2: Boolean = false;
  vendorError: Boolean = false; edidError: Boolean = false;
  Detectionid: any; rows: any = []; ModelList: any = []; clicker: any; uidmodels = []; Uid: any = [];
  successunlink: any = 0; successinsert: any = 0; successupdate: any = 0;
  failedunlink: any = 0; failedinsert: any = 0; failedupdate: any = 0;
  showeditUIDbutton: boolean = false; showeditbutton: boolean = false;
  showunlinkbutton: boolean = false;
  keys: any = [];
  Values: any = [];
  DecodeedidDataView: boolean = false;
  UpdatedDevice: any;
  UpdatedBrand: any;
  UpdatedModel: any;
  UpdatedSubdevice: any;
  UpdatedUid: any;
  UpdatedYear: any;
  UpdatedSupportedRegion: any;
  UpdatedVendor: any;
  UpdatedOSD: any;
  UpdatedEDID128: any;
  UpdatedVendorstr: any;
  UpdatedcecPresent: any = null;
  UpdatedcecEnabled: any = null;
  UpdatedTCountry: string;
  UpdatedTRegion: string;
  filterProjects: any;
  projects: any = [];
  _objectParse: any;
  fileselected: any;
  _brand: any;
  increment: any = 0;
  xmlDataResult: any[];
  singlecodesetassigned: any = []; multiplecodesetassigned: any = [];
  multiplecodeset: boolean = false;
  nocodesetassigned: any = [];
  message: string; multipleuidreport: any = [];

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
  rowId: any;
  setStagingdata0: any;
  setStagingdata1: any;
  rows_selected: any;
  loginid: any;
  show: boolean = false;
  role: string;
  module: string;
  allcodesetassigned: any = [];
  recordstatus: any = null;
  constructor(private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private fb: FormBuilder, private http: HttpClient) {
    localStorage.removeItem('RawStatus')
    this.usersName = localStorage.getItem('userName');
    this.loginid = JSON.parse(localStorage.getItem('currentUser'));
    this.role = localStorage.getItem('AccessRole');
    this.module = localStorage.getItem('moduleselected');
    this.status = null; this.recordstatus = null; this.projectNames = null;
    this.paginationPageSize = 10;
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
      edidviewCellRenderer: EdidviewCellRenderer,
      regionsviewCellRenderer: SupportedRegionsViewCellRenderer
    };
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
    this.context = { componentParent: this };
    this.UpdatedcecPresent = 1;
    this.UpdatedcecEnabled = 1;
  }

  ngOnInit() {
    // var self=this;
    let dataType = 6;
    let statusflag = this.status;
    let recordstatus = this.recordstatus;
    let projectName = this.projectNames;
    this.mainService.getProjectNames(null, null, null, null, null, 1)
      .subscribe(value => {
        this.filterProjects = value.data;
        this.filterProjects.forEach(element => {
          element['projectname'] = element['dbinstance'] + '_' + element['projectname']
        })
        const uniqueProjects = [...new Set(this.filterProjects.map(item => item.projectname))];
        this.projects = uniqueProjects;
        this.stagingdata(dataType, projectName, recordstatus, statusflag);
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

    this.saveEditStagingData = this.fb.group({
      // Model: ['', Validators.required],
      Uid: ['', Validators.required],
      // Uids: ['', null]
    });

    this.saveEditStagingData_1 = this.fb.group({
      Device: ['', Validators.required],
      Subdevice: ['', Validators.required],
      Brand: ['', Validators.required],
      Model_1: ['', Validators.required],
      CecPresent: ['', null],
      CecEnabled: ['', null],
      VendorId: ['', null],
      Vendoridstring: ['', null],
      OSDString: ['', null],
      Edid: ['', null],
      Uid_1: ['', null],
      // Uids_1: ['', null],
      Year: ['', null],
      Region_Country_Model: ['', null],
    });

    this.saveUpdateStagingData = this.fb.group({
      UDevice: ['', Validators.required],
      USubdevice: ['', Validators.required],
      UBrand: ['', Validators.required],
      URegion_1: ['', Validators.required],
      UCountry_1: ['', Validators.required],
      UModel_1: ['', Validators.required],
      UCecPresent: ['', Validators.required],
      UCecEnabled: ['', Validators.required],
      UVendorId: ['', null],
      UVendoridstring: ['', null],
      UOSDString: ['', null],
      UEdid: ['', null],
      // UUid_1: ['', null],
      // UUids_1: ['', null],
      UYear: ['', null],
      URegion_Country_Model: ['', null],
    });
    var self = this;

    $('#button').click(function () {
      self.exporttoProd(self.rows_selected);
    })

    $('#ModuleSubmit_1').click(function () {
      self.deletion(self.setStagingdata0, self.setStagingdata1);
      $('#deleteconfirmation_1 .close').click();
    });

    $('#ModuleSubmit').click(function () {
      self.multipledeletion(self.rowId);
      $('#deleteconfirmation .close').click();
    })

    $('#add').click(function (e) {
      self.stagingdatasubmitted = true;
      if (self.saveEditStagingData.invalid) {
        return;
      }
      var model = []; var uid = []; let uidmodelconcat = []; let uidmodel = [];
      $('#uid').each(function (i, elem) {
        uid = ($(elem).val());
      });

      $('#model').each(function (i, elem) {
        model = ($(elem).val());
      });
      uidmodelconcat.push(model + ' : ' + uid + '; ');

      self.Uid = ((<HTMLInputElement>document.getElementById("myTextarea")).value + '\n' + uidmodelconcat).trim();

    })

    $('#edit').click(function () {
      if ((<HTMLInputElement>document.getElementById("myTextarea")).disabled == true) {
        (<HTMLInputElement>document.getElementById("myTextarea")).disabled = false;
      }
      else {
        (<HTMLInputElement>document.getElementById("myTextarea")).disabled = true;
      }
    })

    $('#add1').click(function (e) {
      self.stagingdatasubmitted_1 = true;
      if (self.saveEditStagingData_1.invalid) {
        return;
      }
      var model = []; var uid = []; let uidmodelconcat = []; let uidmodel = [];
      $('input[name="Uid_1"]').each(function (i, elem) {
        uid = ($(elem).val());
      });
      $('#model_1').each(function (i, elem) {
        model = ($(elem).val());
      });
      uidmodelconcat.push(model + ' : ' + uid + '; ');

      self.Uid = ((<HTMLInputElement>document.getElementById("myTextarea_1")).value + '\n' + uidmodelconcat).trim();

    })

    $('#edit1').click(function () {
      if ((<HTMLInputElement>document.getElementById("myTextarea_1")).disabled == true) {
        (<HTMLInputElement>document.getElementById("myTextarea_1")).disabled = false;
      }
      else {
        (<HTMLInputElement>document.getElementById("myTextarea_1")).disabled = true;
      }
    })

    $('button[type="submit"]').click(function () {
      $('#myTextarea').each(function (i, elem) {
        let value = ($(elem).val());
        self.Uid = value;
      });
    })

    $('#single_download').click(function () {
      self.onBtnExport();
    })

    $('#s_download').click(function () {
      self.onBtnExport();
    })
    $('#t_download').click(function () {
      self.ontExport();
    })
    mainscroll();
  }

  unlink(setStagingdata) {
    var setStagingdata0 = setStagingdata['Id'];
    var setStagingdata1 = setStagingdata['Status'];
    if (setStagingdata1 === 'Imported from Raw') {
      setStagingdata1 = 1;
    }
    if (setStagingdata1 === 'Imported from Excel') {
      setStagingdata1 = 2;
    }
    this.setStagingdata0 = setStagingdata0;
    this.setStagingdata1 = setStagingdata1;
    $('#unlink').click();
  };

  edid(setEdid) {
    this.viewEdidData(setEdid['Edid']);
  };

  supportedregions(setregions) {
    this.viewSupportedregions(setregions['Supportedregions']);
  };

  StagingdataView(ret) {
    let removespacetovendor = ret['Vendoridhex'].split(" ");
    let removespacetoosd = ret['Osdhex'].split(" ");
    let vendor = ''; let osd = '';

    for (let i = 0; i < removespacetovendor.length; i++) {
      vendor += removespacetovendor[i]
    }
    for (let i = 0; i < removespacetoosd.length; i++) {
      osd += removespacetoosd[i]
    }
    var str = ret['Id'];
    var str1 = ret['Detectionid'];
    var str2 = ret['Device'];
    var str3 = ret['Subdevice'];
    var str4 = ret['Brand'];
    var str5 = ret['Model'];
    var str6 = ret['Supportedregions'];
    var str7 = ret['UID'];
    var str8 = ret['Year'];
    var str9 = ret['Cecpresent'];
    var str10 = ret['Cecenabled'];
    var str11 = vendor;
    var str12 = ret['Vendoridstring'];
    var str13 = ret['Osdstring'];
    var str14 = osd;
    var str15 = ret['Edid'];
    var str16 = ret['Status'];
    if (str == 'null') {
      str = ''
    }
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
    if (str12 == 'null') {
      str12 = ''
    }
    if (str13 == 'null') {
      str13 = ''
    }
    if (str14 == 'null') {
      str14 = ''
    }
    if (str15 == 'null') {
      str15 = ''
    }
    if (str10 == 'Yes') {
      str10 = 1
    }
    if (str10 == 'No') {
      str10 = 0
    }
    if (str9 == 'Yes') {
      str9 = 1
    }
    if (str9 == 'No') {
      str9 = 0
    }
    this.viewstagingData(str, str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12, str13, str14, str15, str16);
  };

  viewEdidData(value) {
    this.edidDataView = true;
    this.SupportedregionsView = false;
    this.EdidData = value;
  }

  viewSupportedregions(value) {
    this.SupportedregionsView = true;
    this.edidDataView = false;
    this.Supportedregions = value;
  }

  viewDecodeEdidData(value, value1) {
    this.DecodeedidDataView = true;
    this.SupportedregionsView = false;
    this.keys = value;
    this.Values = value1;
  }

  viewstagingData(value, value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11, value12, value13, value14, value15, value16) {
    this.Detectionid = value1;
    this.editedDevice = value2;
    this.editedSubdevice = value3;
    this.editedBrand = value4;
    this.editedModel = value5;
    this.editedSupportedRegion = value6;
    this.editYear = value8;
    this.editcecPresent = value9;
    this.editcecEnabled = value10;
    this.editedVendor = value11;
    this.editedVendorstr = value12;
    this.editedOSD = value13;
    this.editedEDID128 = value15;
    this.editedUid = value7;
    this.editedStatus = value16;
    this.recordId = value;
    let RCM = this.editedSupportedRegion;
    let rcm1 = RCM.split(';');
    let rcm2 = []; let rcm3 = []; let models = []
    for (let i = 0; i < rcm1.length; i++) {
      rcm2.push(rcm1[i].split(':'));
    }
    for (let j = 0; j < rcm2.length; j++) {
      if (rcm2[j][2] === undefined || rcm2[j][2] === '  ') {
        rcm3.push('');
      } else {
        rcm3.push(rcm2[j][2].split(','));
      }
    }
    for (let i = 0; i < rcm3.length; i++) {
      for (let j = 0; j < rcm3[i].length; j++) {
        models.push(rcm3[i][j].trim())
      }
    }
    let Modellist = models;
    this.ModelList = Modellist.filter((v, i, a) => a.indexOf(v) === i)

  }

  getTabResponseData(project, recordstatus, statusflag) {
    let dataType = 6;
    this.stagingdata(dataType, project, recordstatus, statusflag);

  }

  decodeedid() {
    var edid = this.EdidData;
    let key = [];
    this.mainService.DecodeUrl(edid).then(value => {
      for (let i = 0; i < Object.keys(value).length; i++) {
        key.push(Object.keys(value)[i].charAt(0).toUpperCase() + Object.keys(value)[i].slice(1))
      }
      this.keys = key;
      this.Values = Object.values(value);
      this.viewDecodeEdidData(this.keys, this.Values);
    });
  }

  modalClose() {
    this.stagingdatasubmitted = false;
    this.saveEditStagingData.reset();
    this.stagingdatasubmitted_1 = false;
    this.saveEditStagingData_1.reset();
    this.stagingdatasubmitted_2 = false;
    this.saveUpdateStagingData.reset();
    this.vendorError = false;
    this.edidError = false;
    this.xmlDataResult = [];
  }

  refreshScreen() {
    if (this.projectNames == null || this.projectNames == "null" || this.projectNames == undefined) {
      this.projectNames = null
      this.recordstatus = null;
    } else {
      this.recordstatus = "Not Present";
    }
    this.status = null;
    this.getTabResponseData(this.projectNames, this.recordstatus, this.status);
    this.UpdatedcecPresent = 1;
    this.UpdatedcecEnabled = 1;
  }

  keyPressHandler(e) {
    if (e.keyCode === 32 && !e.target.value.length) {
      return false;
    }
  }

  onModelChange(event) {
    if (event) {
      this.oldValue = this.currentVal;
      this.currentVal = event;
    }
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

  async stagingdata(dataType, projectName, Recordstatus, statusflag) {
    this.spinnerService.show();
    await this.mainService.RawToStaging(dataType, null, null, statusflag)
      .then(value => {
        let arr = [];
        if (value.data.length > 0 && value.data != '0' && value.data != null) {
          for (let i = 0; i < value.data.length; i++) {
            if (value.data[i]['cecpresent'] === 1) {
              value.data[i]['cecpresent'] = 'Yes'
            }
            if (value.data[i]['cecpresent'] === 0) {
              value.data[i]['cecpresent'] = 'No'
            }
            if (value.data[i]['cecenabled'] === 1) {
              value.data[i]['cecenabled'] = 'Yes'
            }
            if (value.data[i]['cecenabled'] === 0) {
              value.data[i]['cecenabled'] = 'No'
            }
            if (value.data[i]['statusflag'] === 1 || value.data[i]['statusflag'] === '1') {
              value.data[i]['statusflag'] = 'Imported from Raw'
            }
            if (value.data[i]['statusflag'] === 2 || value.data[i]['statusflag'] === '2') {
              value.data[i]['statusflag'] = 'Imported from Excel'
            }
            arr.push({
              Id: value.data[i]['stagingid'], Detectionid: value.data[i]['detectionid'], Device: value.data[i]['device'].toUpperCase(),
              Subdevice: value.data[i]['subdevice'], Brand: value.data[i]['brand'], Model: value.data[i]['model'],
              Supportedregions: value.data[i]['regioncountry'], UID: value.data[i]['uid'],
              Year: value.data[i]['year'], Cecpresent: value.data[i]['cecpresent'], Cecenabled: value.data[i]['cecenabled'],
              Vendoridhex: value.data[i]['vendoridhex'], Vendoridstring: value.data[i]['vendoridstring'],
              Osdstring: value.data[i]['osdstring'], Osdhex: value.data[i]['osdhex'], Edid: value.data[i]['edid'],
              Status: value.data[i]['statusflag'], Project: value.data[i]['dbinstance'] + '_' + value.data[i]['projectname'], Recordstatus: value.data[i]['recordstatus']
            });

          }
        }
        if ((this.projectNames === null) && ((this.recordstatus === null) || (this.recordstatus != null))) {
          this.stagingdatacapture = arr.filter(u => u.Project == "_" && u.Recordstatus == "");
          this.spinnerService.hide();
        }
        else if ((this.projectNames != null) && (this.recordstatus === null)) {
          this.stagingdatacapture = arr.filter(u => u.Project == "_" && u.Recordstatus == "");
          this.spinnerService.hide();
        }
        else if ((this.projectNames != null) && (this.recordstatus != null)) {
          this.stagingdatacapture = arr.filter(u => u.Project == this.projectNames && u.Recordstatus == this.recordstatus);
          this.spinnerService.hide();
        }
        this.viewdata();
      });

    $('.multiple_unlink').css('display', 'none');
    this.multiplecodeset = false;
  }


  deletion(id, status) {
    let loginid = this.loginid['data'][0]['loginId'];
    this.mainService.RawToStaging(2, null, id, status)
      .then(value => {
        if (value.statusCode == '200' && value.data != '' && value.data != '0') {
          this.toastr.success('', 'Records Unlink Successfully');
        }
        else {
          this.toastr.info(value.data[0]['description']);
        }
        if (status === 2 || status === '2') {
          let log = 'StagingId:' + id + ' ' + ':-Record Unlink Successfully from Direct to Staging'
          this.mainService.Genericlog(1, loginid, log).then(value => {

          })
        }
        else {
          let log = 'StagingId:' + id + ' ' + ':-Record Unlink Successfully from Staging data capture'
          this.mainService.Genericlog(1, loginid, log).then(value => {

          })
        }
        this.refreshScreen();
      });
  }

  directtostaging() {
    let data = [];
    let ce_osd; let osd; let ce_vendorid;
    if (this.clicker != undefined) {
      this.spinnerService.show();
      this.clicker.forEach(element => {
        if (element['brand'] === undefined) {
          element['brand'] = ''
        }
        if (element['cecenabled'] === undefined) {
          element['cecenabled'] = ''
        }
        if (element['cecpresent'] === undefined) {
          element['cecpresent'] = ''
        }
        if ((element['cecenabled'] === 'Yes') || (element['cecenabled'] === 'Y')) {
          element['cecenabled'] = 1
        }
        if ((element['cecenabled'] === 'No') || (element['cecenabled'] === 'N')) {
          element['cecenabled'] = 0
        }
        if ((element['cecpresent'] === 'Yes') || (element['cecpresent'] === 'Y')) {
          element['cecpresent'] = 1
        }
        if ((element['cecpresent'] === 'No') || (element['cecpresent'] === 'N')) {
          element['cecpresent'] = 0
        }
        if (element['device'] === undefined) {
          element['device'] = ''
        }
        if (element['edid'] === undefined) {
          element['edid'] = ''
        }
        if (element['targetmodel'] === undefined) {
          element['targetmodel'] = ''
        }
        if (((element['osdstring'] === undefined) || (element['osdstring'] === null)) && ((element['osdhex'] === undefined) || (element['osdhex'] === null))) {
          element['osdstring'] = ''
          element['osdhex'] = ''
        }
        else if ((element['osdstring'] === '') && (element['osdhex'] != '')) {
          ce_osd = element['osdhex'];
          var modOsdString; var str = ''; let type = typeof (ce_osd);
          if (type == 'number') {
            ce_osd = ce_osd.toString();
          }
          else if (type == 'string') {
            ce_osd = ce_osd.toString();
          }
          if (ce_osd != '') {
            ce_osd = ce_osd.trim();
            ce_osd = ce_osd.replace(/[^a-zA-Z0-9]/g, '');
            modOsdString = ce_osd;
            for (var i = 0; i < modOsdString.length; i += 2)
              str += String.fromCharCode(parseInt(modOsdString.substr(i, 2), 16));
          }
          element['osdstring'] = str;
          element['osdhex'] = ce_osd;
        }
        else if ((element['osdstring'] != '') && (element['osdhex'] === '')) {
          ce_osd = element['osdstring'];
          if (ce_osd != '') {
            ce_osd = ce_osd.trim();
            osd = this.convertHexa(ce_osd);
          }
          element['osdstring'] = ce_osd;
          element['osdhex'] = osd;
        }
        if (element['supportedregions'] === undefined) {
          element['supportedregions'] = ''
        }
        if (element['targetregion'] === undefined) {
          element['targetregion'] = ''
        }
        if (element['targetcountry'] === undefined) {
          element['targetcountry'] = ''
        }
        if (element['subdevice'] === undefined) {
          element['subdevice'] = ''
        }
        if (element['vendoridstring'] === undefined) {
          element['vendoridstring'] = ''
        }
        if (element['vendoridhex'] === undefined) {
          element['vendoridhex'] = ''
        }
        else if (element['vendoridhex'] != '') {
          ce_vendorid = element['vendoridhex'];
          var modOsdString; var str = ''; let type = typeof (ce_vendorid);
          if (type == 'number') {
            ce_vendorid = ce_vendorid.toString();
          }
          else if (type == 'string') {
            ce_vendorid = ce_vendorid.toString();
          }
          if (ce_vendorid != '') {
            ce_vendorid = ce_vendorid.trim();
            ce_vendorid = ce_vendorid.replace(/[^a-zA-Z0-9]/g, '');
          }
          element['vendoridhex'] = ce_vendorid;
        }
        if (element['year'] === undefined) {
          element['year'] = ''
        }
        if (element['uid'] === undefined || element['uid'] === null) {
          element['uid'] = ''
        }
        if (element['stagingid'] === undefined) {
          element['stagingid'] = 0
        }
        data.push({
          brand: element['brand'],
          cecenabled: parseInt(element['cecenabled']),
          cecpresent: parseInt(element['cecpresent']),
          device: element['device'],
          edid: element['edid'],
          model: element['targetmodel'],
          osd: element['osdstring'],
          osdhex: element['osdhex'],
          regioncountrymodelref: (element['supportedregions'] + ';' + element['targetregion'] + ' : ' + element['targetcountry'] + ' : ' + element['targetmodel']),
          subdevice: element['subdevice'],
          vendorid: element['vendoridstring'],
          vendoridhex: element['vendoridhex'],
          year: element['year'].toString(),
          uid: element['uid'].toString(),
          stagingid: element['stagingid']
        })
      })
      data.forEach(element => {
        let addspacetovendor = ''; let addspacetoosd = ''
        for (let i = 0; i < element['vendoridhex'].length; i = i + 2) {
          addspacetovendor += element['vendoridhex'].substr(i, 2) + " "
        }
        element['vendoridhex'] = addspacetovendor.trim();
        for (let i = 0; i < element['osdhex'].length; i = i + 2) {
          addspacetoosd += element['osdhex'].substr(i, 2) + " "
        }
        element['osdhex'] = addspacetoosd.trim();
      });
      this.mainService.RawToStaging(3, data, null, null)
        .then(value => {
          if (value.statusCode == "200" && value.status == "success") {
            for (var j = 0; j < value.data.length; j++) {
              if ((value.data[j]['status'] == '1' || value.data[j]['status'] == 1) && value.data != '' && value.data != '0') {
                this.successinsert++;
              }
              else if ((value.data[j]['status'] == '2' || value.data[j]['status'] == 2) && value.data != '' && value.data != '0') {
                this.successupdate++;
              }
              else if ((value.data[j]['status'] == '3' || value.data[j]['status'] == 3) && value.data != '' && value.data != '0') {
                this.failedinsert++;
              }
              if (j + 1 == value.data.length) {
                this.spinnerService.hide();
                if (this.successinsert != 0) {
                  this.toastr.success('', this.successinsert + ' ' + 'Records inserted Successfully', { timeOut: 4000 });
                  let loginid = this.loginid['data'][0]['loginId'];
                  let log = this.successinsert + ' ' + 'Records inserted Successfully(Direct to Staging)'
                  this.mainService.Genericlog(1, loginid, log).then(value => {
                  })
                }
                if (this.successupdate != 0) {
                  this.toastr.success('', this.successupdate + ' ' + 'Records updated Successfully', { timeOut: 4000 });
                  let loginid = this.loginid['data'][0]['loginId'];
                  let log = this.successupdate + ' ' + 'Records updated Successfully(Direct to Staging)'
                  this.mainService.Genericlog(1, loginid, log).then(value => {
                  })
                }
                if (this.failedinsert != 0) {
                  this.toastr.success('', this.failedinsert + ' ' + 'Records already exist', { timeOut: 4000 });
                  let loginid = this.loginid['data'][0]['loginId'];
                  let log = this.failedinsert + ' ' + 'Records already exist(Direct to Staging)'
                  this.mainService.Genericlog(1, loginid, log).then(value => {
                  })
                }
                setTimeout(() => {
                  location.reload();
                }, 3000);
                (<HTMLInputElement>document.getElementById("file-upload")).value = null;
              }
            }
          } else {
            this.toastr.warning('', 'Please select valid file which contains valid data');
          }
        });
      this.successinsert = 0;
      this.failedinsert = 0;
    }
    else {
      this.toastr.error('Please select the valid file...')
    }

  }

  async multipledeletion(id) {
    let loginid = this.loginid['data'][0]['loginId'];
    this.spinnerService.show();
    this.successunlink = 0; let stat;
    for (var j = 0; j < id.length; j++) {
      let filt = (this.stagingdatacapture.filter(u => u.Id === id[j]))[0]['Status'];
      if (filt === 'Imported from Raw') {
        stat = 1;
      }
      if (filt === 'Imported from Excel') {
        stat = 2;
      }
      await this.mainService.RawToStaging(2, null, id[j], stat)
        .then(value => {
          if (value.statusCode == '200' && (value.data[0]['status'] == '1' || value.data[0]['status'] == 1) && value.data != '' && value.data != '0') {
            this.successunlink++;
          }
        });
      if (j + 1 == id.length) {
        if (this.successunlink != 0) {
          this.spinnerService.hide();
          this.toastr.success('', this.successunlink + ' ' + 'Records Unlink Successfully');
          let log = '' + this.successunlink + ' ' + ':-Record Unlink Successfully(Staging data Capture)'
          this.mainService.Genericlog(1, loginid, log).then(value => {
          })
          location.reload();
        }
      }
    }
  }

  get m() { return this.saveEditStagingData.controls; }
  onsaveEditStagingSubmit() {
    this.stagingdatasubmitted = true;
    if (this.saveEditStagingData.invalid) {
      return;
    }
    let status = this.editedStatus;
    // localStorage.setItem('StagingStatus', this.status)
    if (status === "1" || status === 1 || status === 'Imported from Raw') {
      this.cecEdidValidate();
    }
    else if (status === "2" || status === 2 || status === 'Imported from Excel') {
      if ((this.editedVendor != undefined && this.editedVendor != '') || (this.editedOSD != undefined && this.editedOSD != '') || (this.editedEDID128 != undefined && this.editedEDID128 != '')) {
        var edid128 = this.editedEDID128;
        if (edid128 != null && edid128 != '' && edid128 != undefined) {
          let checkEdidData = ((edid128.startsWith('00 FF FF FF FF FF FF 00') || edid128.startsWith('00 ff ff ff ff ff ff 00')) && edid128.length >= 383);
          if (!checkEdidData) {
            this.edidError = true;
            this.stagingdatasubmitted = false;
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

  }

  get n() { return this.saveEditStagingData_1.controls; }
  onsaveEditStagingSubmit_1() {
    this.stagingdatasubmitted_1 = true;
    if (this.saveEditStagingData_1.invalid) {
      return;
    }
    if ((this.editedVendor != undefined && this.editedVendor != '') || (this.editedOSD != undefined && this.editedOSD != '') || (this.editedEDID128 != undefined && this.editedEDID128 != '')) {
      var edid128 = this.editedEDID128;
      if (edid128 != null && edid128 != '' && edid128 != undefined) {
        let checkEdidData = ((edid128.startsWith('00 FF FF FF FF FF FF 00') || edid128.startsWith('00 ff ff ff ff ff ff 00')) && edid128.length >= 383);
        if (!checkEdidData) {
          this.edidError = true;
          this.stagingdatasubmitted_1 = false;
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

  get o() { return this.saveUpdateStagingData.controls; }
  onsaveEditStagingSubmit_2() {
    this.stagingdatasubmitted_2 = true;
    if (this.saveUpdateStagingData.invalid) {
      return;
    }
    if ((this.UpdatedVendor != undefined && this.UpdatedVendor != '') || (this.UpdatedOSD != undefined && this.UpdatedOSD != '') || (this.UpdatedEDID128 != undefined && this.editedEDID128 != '')) {
      var edid128 = this.UpdatedEDID128;
      if (edid128 != null && edid128 != '' && edid128 != undefined) {
        let checkEdidData = ((edid128.startsWith('00 FF FF FF FF FF FF 00') || edid128.startsWith('00 ff ff ff ff ff ff 00')) && edid128.length >= 383);
        if (!checkEdidData) {
          this.edidError = true;
          this.stagingdatasubmitted_2 = false;
        }
        else {
          $('#checkEdidValid').css('border', '1px solid #ced4da');
          this.edidError = false;
          this.cecEdidValidate_1();
        }
      }
      else {
        $('#checkEdidValid').css('border', '1px solid #ced4da');
        this.edidError = false;
        this.cecEdidValidate_1();
      }

    } else {
      this.toastr.error('', 'Enter Vendorid or OSD or EDID', { timeOut: 4000 })
    }

  }
  /** Vendor Validation in CEC EDID add Option start **/
  vendorMod() {
    if ((this.editedVendor != undefined && this.editedVendor != null) || (this.UpdatedVendor != undefined && this.UpdatedVendor != null)) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if ((this.editedOSD != undefined && this.editedOSD != null) || (this.UpdatedOSD != undefined && this.UpdatedOSD != null)) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if ((this.editedEDID128 != undefined && this.editedEDID128 != null) || (this.UpdatedEDID128 != undefined && this.UpdatedEDID128 != null)) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if ((this.editedEDID128 != undefined) || (this.UpdatedEDID128 != undefined)) {
      let checkEdid = (((this.editedEDID128.includes('00 FF FF FF FF FF FF 00') || this.editedEDID128.includes('00 ff ff ff ff ff ff 00')) && this.editedEDID128.length >= 383) || ((this.UpdatedEDID128.includes('00 FF FF FF FF FF FF 00') || this.UpdatedEDID128.includes('00 ff ff ff ff ff ff 00')) && this.UpdatedEDID128.length >= 383));
      if (checkEdid == true) {
        $('#checkEdidValid').css('border', '1px solid #ced4da');
        this.edidError = false;
      } else {
        this.edidError = true;
      }
    }
    if (this.editedEDID128 == undefined && this.editedVendor != undefined || this.editedOSD != undefined) {
      this.edidError = false;
    }
  }
  /** Vendor Validation in CEC EDID add Option end **/

  cecEdidValidate() {
    let Device = this.editedDevice; let Brand = this.editedBrand; let Model = this.editedModel;
    let Subdevice = this.editedSubdevice; let Uid = this.editedUid; let Year = this.editYear; let status = this.editedStatus.trim();
    let Detectionid = this.Detectionid; let Regioncountry = this.editedSupportedRegion; let id = parseInt(this.recordId);
    if (this.editedVendor != undefined || this.editedOSD != undefined || this.editedEDID128 != undefined) {
      let edid;
      if (this.editedEDID128 == undefined) {
        edid = null;
      } else {
        edid = this.editedEDID128;
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

      let vendorid; let osdstr;
      if (this.editedVendor == undefined) {
        vendorid = null;
      } else {
        vendorid = this.editedVendor.toUpperCase();
      }
      let iscecpresent = this.editcecPresent;
      let iscecenabled = this.editcecEnabled;
      let osd;

      if (this.editedOSD != undefined && this.editedOSD != null) {
        osd = this.convertHexa(this.editedOSD);
      } else {
        osd = null;
      }
      if (this.editedOSD == undefined || this.editedOSD == null) {
        osdstr = null;
      } else {
        osdstr = this.editedOSD.toUpperCase();
      }
      let directtostag = []; let stag = [];
      // this.mainService.getRemoteUID(Brand, Model, Device)
      //   .subscribe(value => {

      //     if (value.data != [] || value.data != '[]') {
      //       let UpdatedUid = ''; let UpdatedUID = [];
      //       let Uid = JSON.parse(value.data);
      //       Uid.forEach(element => {
      //         UpdatedUID.push(element.UID)
      //       });
      //       UpdatedUID = UpdatedUID.filter((v, i, a) => a.indexOf(v) === i);
      //       UpdatedUID.forEach(element1 => {
      //         UpdatedUid += element1 + ',';
      //       })
      //       this.Uid = UpdatedUid.slice(0, -1);
      //     }


      //   })
      directtostag.push({
        "device": Device,
        "subdevice": Subdevice,
        "brand": Brand,
        "model": Model,
        "year": Year,
        "cecpresent": parseInt(iscecpresent),
        "cecenabled": parseInt(iscecenabled),
        "vendoridhex": vendorid,
        "vendorid": this.editedVendorstr,
        "osdhex": osd,
        "osd": osdstr,
        "edid": this.editedEDID128,
        "regioncountrymodelref": Regioncountry,
        "uid": Uid,
        "stagingid": 0
      })
      stag.push({
        "device": Device,
        "subdevice": Subdevice,
        "brand": Brand,
        "model": Model,
        "year": Year,
        "cecpresent": parseInt(iscecpresent),
        "cecenabled": parseInt(iscecenabled),
        "vendoridhex": vendorid,
        "vendorid": this.editedVendorstr,
        "osdhex": osd,
        "osd": osdstr,
        "edid": this.editedEDID128,
        "regioncountrymodelref": Regioncountry,
        "uid": Uid,
        "detectionid": Detectionid,
        "stagingid": id
      })
      if (status === "1" || status === 1 || status === 'Imported from Raw') {
        this.mainService.RawToStaging(11, stag, null, null)
          .then(value => {
            if (value.statusCode == "200" && value.message == "SUCCESS" && value.data[0]['status'] != "0") {
              this.toastr.success(value.data[0]['description'], '');
              let loginid = this.loginid['data'][0]['loginId'];
              let log = JSON.stringify(stag) + ':- ' + value.data[0]['description'] + '(Imported from Raw)'
              this.mainService.Genericlog(1, loginid, log).then(value => {
              })
              location.reload();
            } else {
              this.toastr.warning(value.data[0]['description'], '');
            }
          })
      }
      if (status === "2" || status === 2 || status === 'Imported from Excel') {
        status = 2;
        if (Regioncountry.includes(Model)) {
          this.mainService.RawToStaging(2, null, id, status)
            .then(value1 => {
              this.mainService.RawToStaging(3, directtostag, null, null)
                .then(value => {
                  if (value.statusCode == "200" && value.status == "success") {
                    for (var j = 0; j < value.data.length; j++) {
                      if ((value.data[j]['status'] == '1' || value.data[j]['status'] == 1) && value.data != '' && value.data != '0') {
                        this.successinsert++;
                      }
                      else if ((value.data[j]['status'] == '2' || value.data[j]['status'] == 2) && value.data != '' && value.data != '0') {
                        this.successupdate++;
                      }
                      else if ((value.data[j]['status'] == '3' || value.data[j]['status'] == 3) && value.data != '' && value.data != '0') {
                        this.failedinsert++;
                      }
                      if (j + 1 == value.data.length) {
                        if (this.successinsert != 0) {
                          this.toastr.success('' + 'Records inserted Successfully');
                          let loginid = this.loginid['data'][0]['loginId'];
                          let log = JSON.stringify(directtostag) + ':- Records inserted Successfully(Imported from Excel)'
                          this.mainService.Genericlog(1, loginid, log).then(value => {
                          })
                        }
                        if (this.successupdate != 0) {
                          this.toastr.success('' + 'Records updated Successfully');
                          let loginid = this.loginid['data'][0]['loginId'];
                          let log = JSON.stringify(directtostag) + ':- Records updated Successfully(Imported from Excel)'
                          this.mainService.Genericlog(1, loginid, log).then(value => {
                          })
                        }
                        if (this.failedinsert != 0) {
                          this.toastr.success('' + 'Records already exist');
                          let loginid = this.loginid['data'][0]['loginId'];
                          let log = JSON.stringify(directtostag) + ':- Records already exist(Imported from Excel)'
                          this.mainService.Genericlog(1, loginid, log).then(value => {
                          })
                        }
                      }
                    }
                    $('#edidStagingModal_1 .close').click();
                    location.reload();
                  }


                  // if (value.statusCode == "200" && value.message == "SUCCESS" && value.data[0]['status'] != "0") {
                  //   this.toastr.success(value.data[0]['description'], '');
                  //   // location.reload();
                  // } else {
                  //   this.toastr.warning(value.data[0]['description'], '');
                  // }
                })
            })
        }
        else {
          // this.editedSupportedRegion.errors=true;
          this.toastr.error('Please Update Target Model in Region Country Model')
        }

      }

    } else {
      $('#checkInputValid').css('border', '1px solid #bb2a38');
      this.vendorError = true;
    }
  }

  cecEdidValidate_1() {
    let Device = this.UpdatedDevice; let Brand = this.UpdatedBrand; let Model = this.UpdatedModel;
    let Subdevice = this.UpdatedSubdevice; let Year = this.UpdatedYear;
    let Regioncountry = this.UpdatedTRegion + ':' + this.UpdatedTCountry + ':' + this.UpdatedModel + ';'
    if (this.UpdatedVendor != undefined || this.UpdatedOSD != undefined || this.UpdatedEDID128 != undefined) {
      let edid;
      if (this.UpdatedEDID128 == undefined) {
        edid = null;
      } else {
        edid = this.UpdatedEDID128;
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

      let vendorid; let osdstr;
      if (this.UpdatedVendor == undefined) {
        vendorid = null;
      } else {
        vendorid = this.UpdatedVendor;
      }
      let iscecpresent = parseInt(this.UpdatedcecPresent);
      let iscecenabled = parseInt(this.UpdatedcecEnabled);
      let osd;

      if (this.UpdatedOSD != undefined && this.UpdatedOSD != null) {
        osd = this.convertHexa(this.UpdatedOSD);
      } else {
        osd = null;
      }
      if (this.UpdatedOSD == undefined || this.UpdatedOSD == null) {
        osdstr = null;
      } else {
        osdstr = this.UpdatedOSD;
      }
      let directtostag = [];

      this.mainService.getRemoteUID(Brand, Model.toString(), Device)
        .subscribe(value => {
          if (value.data != [] || value.data != '[]') {
            let UpdatedUid = ''; let UpdatedUID = [];
            let Uid = JSON.parse(value.data);
            Uid.forEach(element => {
              UpdatedUID.push(element.UID)
            });
            UpdatedUID = UpdatedUID.filter((v, i, a) => a.indexOf(v) === i);
            UpdatedUID.forEach(element1 => {
              UpdatedUid += element1 + ',';
            })
            this.UpdatedUid = UpdatedUid.slice(0, -1);
          }
          directtostag.push({
            "device": Device,
            "subdevice": Subdevice,
            "brand": Brand,
            "model": Model,
            "year": Year,
            "cecpresent": iscecpresent,
            "cecenabled": iscecenabled,
            "vendoridhex": vendorid,
            "vendorid": this.UpdatedVendorstr,
            "osdhex": osd,
            "osd": osdstr,
            "edid": this.UpdatedEDID128,
            "regioncountrymodelref": Regioncountry,
            "uid": this.UpdatedUid,
            "stagingid": 0
          })
          directtostag.forEach(element => {
            if (element['brand'] === undefined || element['brand'] === null) {
              element['brand'] = ''
            }
            if (element['cecenabled'] === undefined || element['cecenabled'] === null) {
              element['cecenabled'] = ''
            }
            if (element['cecpresent'] === undefined || element['cecenabled'] === null) {
              element['cecpresent'] = ''
            }
            if (element['device'] === undefined || element['device'] === null) {
              element['device'] = ''
            }
            if (element['edid'] === undefined || element['edid'] === null) {
              element['edid'] = ''
            }
            if (element['model'] === undefined || element['model'] === null) {
              element['model'] = ''
            }
            if (element['osd'] === undefined || element['osd'] === null) {
              element['osd'] = ''
            }
            if (element['osdhex'] === undefined || element['osdhex'] === null) {
              element['osdhex'] = ''
            }
            if (element['regioncountrymodelref'] === undefined || element['regioncountrymodelref'] === null) {
              element['regioncountrymodelref'] = ''
            }
            if (element['subdevice'] === undefined || element['subdevice'] === null) {
              element['subdevice'] = ''
            }
            if (element['vendorid'] === undefined || element['vendorid'] === null) {
              element['vendorid'] = ''
            }
            if (element['vendoridhex'] === undefined || element['vendoridhex'] === null) {
              element['vendoridhex'] = ''
            }
            if (element['year'] === undefined || element['year'] === null) {
              element['year'] = ''
            }
            if (element['uid'] === undefined || element['uid'] === null) {
              element['uid'] = ''
            }
            if (element['stagingid'] === undefined || element['stagingid'] === null) {
              element['stagingid'] = 0
            }
          })
          // if (Regioncountry.contains(Model)) {
          this.mainService.RawToStaging(3, directtostag, null, null)
            .then(value => {
              if (value.statusCode == "200" && value.status == "success") {
                for (var j = 0; j < value.data.length; j++) {
                  if ((value.data[j]['status'] == '1' || value.data[j]['status'] == 1) && value.data != '' && value.data != '0') {
                    this.successinsert++;
                  }
                  else if ((value.data[j]['status'] == '2' || value.data[j]['status'] == 2) && value.data != '' && value.data != '0') {
                    this.successupdate++;
                  }
                  else if ((value.data[j]['status'] == '3' || value.data[j]['status'] == 3) && value.data != '' && value.data != '0') {
                    this.failedinsert++;
                  }
                  if (j + 1 == value.data.length) {
                    if (this.successinsert != 0) {
                      this.toastr.success('' + 'Records inserted Successfully');
                      let loginid = this.loginid['data'][0]['loginId'];
                      let log = JSON.stringify(directtostag) + ':- Records inserted Successfully(Imported from Excel)'
                      this.mainService.Genericlog(1, loginid, log).then(value => {
                      })
                    }
                    if (this.successupdate != 0) {
                      this.toastr.success('' + 'Records updated Successfully');
                      let loginid = this.loginid['data'][0]['loginId'];
                      let log = JSON.stringify(directtostag) + ':- Records updated Successfully(Imported from Excel)'
                      this.mainService.Genericlog(1, loginid, log).then(value => {
                      })
                    }
                    if (this.failedinsert != 0) {
                      this.toastr.success('' + 'Records already exist');
                      let loginid = this.loginid['data'][0]['loginId'];
                      let log = JSON.stringify(directtostag) + ':- Records already exist(Imported from Excel)'
                      this.mainService.Genericlog(1, loginid, log).then(value => {
                      })
                    }
                  }
                }
                $('#StagingModal_1 .close').click();
                location.reload();
              }
            })
        })

      // }
      // else {
      //   // this.editedSupportedRegion.errors=true;
      //   this.toastr.error('Please Update Target Model in Region Country Model')
      // }


    } else {
      $('#checkInputValid').css('border', '1px solid #bb2a38');
      this.vendorError = true;
    }
  }
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

  onFileChange(ev) {
    var self = this;
    let workBook = null;
    let jsonData = null;
    let reader = new FileReader();
    let file = ev.target.files[0];
    if (ev.target.files.length != 0) {
      if (file != undefined) {
        reader.onload = (event) => {
          let data = reader.result;
          self.spinnerService.show();
          workBook = XLSX.read(data, { type: 'binary' });
          jsonData = workBook.SheetNames.reduce((initial, name) => {
            let sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            return initial[name];
          }, {});
          const newArray = []; let count = 0;
          for (var j = 0; j < jsonData.length; j++) {
            const keys = Object.keys(jsonData[j]);
            const newObject = {};
            keys.forEach(key => {
              const newKey = key.toLowerCase();
              newObject[newKey] = jsonData[j][key];
            })
            newArray.push(newObject);
          }
          newArray.forEach(element => {

            if (element['brand'] === undefined) {
              element['brand'] = ''
            }
            if (element['cecenabled'] === undefined) {
              element['cecenabled'] = ''
            }
            if (element['cecpresent'] === undefined) {
              element['cecpresent'] = ''
            }
            if (element['device'] === undefined) {
              element['device'] = ''
            }
            if (element['edid'] === undefined) {
              element['edid'] = ''
            }
            if (element['targetmodel'] === undefined) {
              element['targetmodel'] = ''
            }
            if (element['osdstring'] === undefined) {
              element['osdstring'] = ''
            }
            if (element['osdhex'] === undefined) {
              element['osdhex'] = ''
            }
            if (element['supportedregions'] === undefined) {
              element['supportedregions'] = ''
            }
            if (element['targetregion'] === undefined) {
              element['targetregion'] = ''
            }
            if (element['targetcountry'] === undefined) {
              element['targetcountry'] = ''
            }
            if (element['subdevice'] === undefined) {
              element['subdevice'] = ''
            }
            if (element['vendoridstring'] === undefined) {
              element['vendoridstring'] = ''
            }
            if (element['vendoridhex'] === undefined) {
              element['vendoridhex'] = ''
            }
            if (element['year'] === undefined) {
              element['year'] = ''
            }
            if (element['uid'] === undefined || element['uid'] != undefined) {
              element['uid'] = ''
            }
            this.mainService.getRemoteUID(element['brand'], (element['targetmodel']).toString(), element['device'])
              .subscribe(value => {
                count++;
                let UpdatedUID = []; let UpdatedUIDs = '';
                if (value.data != [] || value.data != '[]') {

                  let Uid = JSON.parse(value.data);
                  Uid.forEach(element => {
                    UpdatedUID.push({ RemoteModel: element.remoteModel, UID: element.UID })
                  });
                  UpdatedUID = UpdatedUID.filter((v, i, a) => a.indexOf(v) === i);
                  for (let n = 0; n < UpdatedUID.length; n++) {
                    UpdatedUIDs += UpdatedUID[n]['UID'] + ';'
                  }
                  self.Uid = UpdatedUIDs.toString();
                }
                else {
                  self.Uid = '';
                }
                element['uid'] = self.Uid;
                if (count === newArray.length) {
                  self.spinnerService.hide();
                }
              })
          });
          self.clicker = newArray;
        }
        reader.readAsBinaryString(file);
      }
      else {
        self.clicker = [];
      }
    }
    else {
      self.clicker = undefined;
    }


  }


  onRowClicked() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    let selectedId = [];
    this.rows_selected = selectedData;
    for (let i = 0; i < selectedData.length; i++) {
      selectedId.push(selectedData[i]['Id'])
    }
    this.rowId = selectedId;
    if (this.rowId.length > 0) {
      $('.multiple_unlink').css('display', 'Block');
    }
    else if (this.rowId.length === 0) {
      $('.multiple_unlink').css('display', 'none');
    }
    // this.exporttoProd(this.rows_selected)
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


  viewdata() {
    this.searchValue = null;
    this.defaultColDef = {
      // minWidth: 100,
      width: 140,
    };
    this.columnDefs = [
      { headerName: "Device", field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Subdevice", field: "Subdevice", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Brand", field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Model", field: "Model", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Supportedregions", field: "Supportedregions", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "regionsviewCellRenderer" },
      { headerName: "UID", field: "UID", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Year", field: "Year", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Cecpresent", field: "Cecpresent", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Cecenabled", field: "Cecenabled", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Vendoridhex", field: "Vendoridhex", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Vendoridstring", field: "Vendoridstring", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Osdstring", field: "Osdstring", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Osdhex", field: "Osdhex", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Edid", field: "Edid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "edidviewCellRenderer" },
      { headerName: "Status", field: "Status", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, minWidth: 170 },
      { headerName: "Select All", field: "Select All", resizable: true, sortable: true, checkboxSelection: true, headerCheckboxSelection: true, minWidth: 130, headerCheckboxSelectionFilteredOnly: true },
      { headerName: "Action", field: "Status", resizable: true, cellRenderer: "btnCellRenderer", minWidth: 170 }
    ];
    this.rowData = this.stagingdatacapture;
    if (this.rowData.length < 8) {
      this.setAutoHeight();
    }
    else {
      this.setFixedHeight();
    }
    this.gridApi.setQuickFilter(this.searchValue)
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
          this.columnDefs = this.columnDefs.filter(u => u.field != 'Select All' && u.headerName != 'Action');
          $('.newBtn').hide();
          $('#direct').hide();
          $('#ExporttoProd').hide();
          $('#single_download').hide();
        }
        if ((permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0) ||
          (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0)) {
          this.columnDefs = this.columnDefs.filter(u => u.field != 'Select All' && u.headerName != 'Action');
          $('.newBtn').hide();
          $('#direct').hide();
          $('#ExporttoProd').hide();
          $('#single_download').show();
        }
        if ((permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1)) {
          this.columnDefs = this.columnDefs;
          // $('#Projectname').show();
          // $('#Codesetinclude').show();
          // $('#button').show();
          $('.newBtn').show();
          $('#ExporttoProd').show();
          $('#single_download').show();
          $('#direct').show();
        }
      })
  }

  search() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  methodFromParent_edituid(cell) {
    this.StagingdataView(cell)
    $('#showeditUIDbutton').click();
  }

  methodFromParent_edit(cell) {
    this.StagingdataView(cell)
    $('#showeditbutton').click();
  }

  methodFromParent_unlink(cell) {
    this.unlink(cell)
  }

  methodFromParent_viewSupportedRegion(cell) {
    this.supportedregions(cell)
  }

  methodFromParent_viewEdid(cell) {
    this.edid(cell);
  }


  /** change of project update Modules*/
  async changeProject() {
    this.spinnerService.show();
    if (this.projectNames == null || this.projectNames == "null" || this.projectNames == undefined) {
      this.spinnerService.hide();
      this.toastr.error('', 'Please Select the Project');
      $('#upload').css('display', 'none');
      $('#Codesetinclude').hide();
      $('#button').hide();
    } else {
      $('#Export').click();
      let filterProject: any = this.filterProjects.filter(u =>
        u.projectname == this.projectNames);
      this.projectNames = filterProject[0]['projectname'];
      let ProjectName = this.projectNames.split('_');
      $('#upload').css('display', 'block');
      $('#Codesetinclude').show();
      $('#button').show();
      this.xmlDataResult = [];
      let formData = new FormData();
      formData.append("filepath", this.fileselected);
      formData.append("crudtype", "2");
      formData.append("projectname", ProjectName[1]);
      formData.append("statusflag", "1");
      formData.append("recordid", "");
      formData.append("dbinstance", ProjectName[0]);
      this.http.post<any>(`${environment.apiUrl}/api/Detection/UpdateCodesetIncludes`, formData
      ).subscribe((val) => {
        if (val.data != '0') {
          let fileselected = val.data[0]['filePath'].toString();
          this.fileselected = fileselected.replace(';', '');
          const docFile = new XMLHttpRequest();
          docFile.open('GET', this.fileselected, true);
          docFile.send();
          docFile.onreadystatechange = () => {
            if (docFile.readyState === 4 && docFile.status === 200) {
              this.convertxml(docFile.response);
            }
          };
        }
        else {
          this.spinnerService.hide();
          (<HTMLInputElement>document.getElementById("upload")).value = null;
          this.toastr.error('', 'Earlier No Codesetinclude.xml file uploaded to the selected project', { timeOut: 3000 });
        }

      })
    }
  }

  changeProjectname() {
    if (this.projectNames == null || this.projectNames == "null" || this.projectNames == undefined) {
      this.recordstatus = null;
    } else {
      this.recordstatus = "Not Present";
    }

    this.getTabResponseData(this.projectNames, this.recordstatus, null);
  }

  changeRecordstatus() {
    if ((this.recordstatus === null) || (this.recordstatus === "null") || (this.recordstatus === undefined)) {
      this.recordstatus = null;
      this.getTabResponseData(this.projectNames, null, null);
    }
    else {
      let projectName = this.projectNames; let recordstatus = "Present";
      this.getTabResponseData(projectName, recordstatus, null);
    }
  }

  Upload(ev) {
    let file = (<HTMLInputElement>document.getElementById('upload')).files[0];
    let fileName = (<HTMLInputElement>document.getElementById('upload')).files[0].name.toUpperCase();
    if (!(/\.(xml)$/i).test(fileName)) {
      this.toastr.error('warning', 'Please Select XML file to Upload');
    }
    else {
      if (fileName != 'CODESETINCLUDES.XML') {
        this.toastr.error('warning', 'Please Select codesetincludes.xml file');
      }
      else {
        try {
          this.spinnerService.show();
          this.fileselected = file;
          this.onFileupload(ev);
        } catch (error) {
          this.toastr.error('error', error);
        }
      }


    }

  }

  onFileupload(ev) {
    if ($('#upload').val() === '' || $('#projectname').val() === null) {
      this.toastr.error('Select Projectname and Upload a valid file')
    }
    else {
      this.spinnerService.show();
      let formData = new FormData();
      let ProjectName = this.projectNames.split('_');
      formData.append("filepath", this.fileselected);
      formData.append("crudtype", "1");
      formData.append("projectname", ProjectName[1]);
      formData.append("statusflag", "1");
      formData.append("recordid", "");
      formData.append("dbinstance", ProjectName[0]);
      this.http.post<any>(`${environment.apiUrl}/api/Detection/UpdateCodesetIncludes`, formData
      ).subscribe(val => {
        if (val.data[0]['status'] != 0 && val.data[0]['status'] != '0') {
          this.toastr.success('', val.data[0]['message']);
          let reader = new FileReader();
          let file = ev.target.files[0];
          if (ev.target.files.length != 0) {
            if (file != undefined) {
              reader.onload = (event) => {
                this.convertxml(reader.result);
              }
              reader.readAsBinaryString(file);
            }
          }
          (<HTMLInputElement>document.getElementById("upload")).value = null;
        }
        else {
          let formData = new FormData();
          let ProjectName = this.projectNames.split('_');
          formData.append("filepath", this.fileselected);
          formData.append("crudtype", "3");
          formData.append("projectname", ProjectName[1]);
          formData.append("statusflag", "1");
          formData.append("recordid", "");
          formData.append("dbinstance", ProjectName[0]);
          this.http.post<any>(`${environment.apiUrl}/api/Detection/UpdateCodesetIncludes`, formData
          ).subscribe(val => {
            if (val.data[0]['status'] != 0 && val.data[0]['status'] != '0') {
              let reader = new FileReader();
              let file = ev.target.files[0];
              if (ev.target.files.length != 0) {
                if (file != undefined) {
                  reader.onload = (event) => {
                    this.convertxml(reader.result);
                  }
                  reader.readAsBinaryString(file);
                }
              }
              this.toastr.success('', val.data[0]['message']);
            }
            else {
              this.toastr.info('', val.data[0]['message']);
              this.spinnerService.hide();
            }
            (<HTMLInputElement>document.getElementById("upload")).value = null;
          })

        }
      })
    }

  }

  convertxml(val) {
    let data = (val).toString();
    var xmlData;
    xmlData = data.replace(/\ï»¿/g, '');

    let obj = {};
    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(xmlData, (err, result) => {
      obj = result;
    });
    this._objectParse = obj['CODESETINCLUDES']['DEVICECATEGORY'];

    let codeSet = [];
    let diviceArrayForm = [];
    let dataval = {
      "RowId": 0,
      "device": "",
      "codeset": "",
      "uid": ""
    };
    let UID: any;
    for (let i = 0; i < this._objectParse.length; i++) {
      this._brand = this._objectParse[i]['CODESET'];
      for (let j = 0; j < this._brand.length; j++) {

        dataval['device'] = this._objectParse[i]['$']['NAME'];
        codeSet = this._brand[j]['ID'][0];

        if (typeof codeSet === 'string') {
          codeSet = Array(codeSet);
        }
        UID = this._brand[j]['INCLUDES'][0]['INCLUDE']
        for (let k = 0; k < UID.length; k++) {
          dataval['device'] = this._objectParse[i]['$']['NAME'];
          dataval['codeset'] = this._brand[j]['ID'][0];
          dataval['uid'] = UID[k]['$']['BRAND'];
          const setValue = {
            "RowId": this.increment++,
            "device": dataval['device'].toUpperCase(),
            "codeset": dataval['codeset'],
            "uid": dataval['uid']
          };
          diviceArrayForm.push(setValue);
        }
      }

    }
    this.xmlDataResult = diviceArrayForm;
    this.spinnerService.hide();
    console.log(this.xmlDataResult)
  }

  async assigncodesettouid() {
    this.spinnerService.show();
    for (let i = 0; i < this.allcodesetassigned.length; i++) {
      if (this.allcodesetassigned[i]['iscecpresent'] === 'Yes') {
        this.allcodesetassigned[i]['iscecpresent'] = 1
      }
      if (this.allcodesetassigned[i]['iscecpresent'] === 'No') {
        this.allcodesetassigned[i]['iscecpresent'] = 0
      }
      if (this.allcodesetassigned[i]['iscecenabled'] === 'Yes') {
        this.allcodesetassigned[i]['iscecenabled'] = 1
      }
      if (this.allcodesetassigned[i]['iscecenabled'] === 'No') {
        this.allcodesetassigned[i]['iscecenabled'] = 0
      }
      let projectname = this.projectNames.split('_');
      let Projectname = projectname[1].trim();
      let instance = projectname[0].trim();
      let crudtype = 1;
      await this.mainService.StagingToProd(crudtype, Projectname, this.allcodesetassigned[i]['device'],
        this.allcodesetassigned[i]['subdevice'], this.allcodesetassigned[i]['brand'], this.allcodesetassigned[i]['model'],
        this.allcodesetassigned[i]['region'], this.allcodesetassigned[i]['country'],
        this.allcodesetassigned[i]['iscecpresent'], this.allcodesetassigned[i]['iscecenabled'], this.allcodesetassigned[i]['vendorid'],
        this.allcodesetassigned[i]['osd'], this.allcodesetassigned[i]['edid'], this.allcodesetassigned[i]['codeset'], null, instance, this.allcodesetassigned[i]['stagingid'], this.allcodesetassigned[i]['statusflag'])
        .then(value => {
          if (value.data != '' && value.data != '0') {
            if (value.message === 'SUCCESS' && (value.data[0]['status'] == '1' || value.data[0]['status'] == 1)) {
              this.successinsert++;
            }
            else {
              this.failedinsert++;
            }
          }
          else {
            this.failedupdate++;
          }

          if (i + 1 == this.allcodesetassigned.length) {
            this.spinnerService.hide();
            if (this.successinsert != 0) {
              this.toastr.success('', ' ' + 'Records inserted/updated successfully', { timeOut: 4000 });
              let loginid = this.loginid['data'][0]['loginId'];
              let log = ' ' + 'Records inserted/updated successfully(Staging to Prod)'
              this.mainService.Genericlog(1, loginid, log).then(value => {
              })
            }
            if (this.failedinsert != 0) {
              this.toastr.success('', ' ' + 'Records already exist', { timeOut: 4000 });
              let loginid = this.loginid['data'][0]['loginId'];
              let log = ' ' + 'Records already exist(Staging to Prod)'
              this.mainService.Genericlog(1, loginid, log).then(value => {
              })
            }
            if (this.failedupdate != 0) {
              this.toastr.info('', ' ' + 'Some Records are not getting Inserted/Updated', { timeOut: 4000 });
              let loginid = this.loginid['data'][0]['loginId'];
              let log = ' ' + 'Some Records are not getting Inserted/Updated(Staging to Prod)'
              this.mainService.Genericlog(1, loginid, log).then(value => {
              })
            }
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
          $('#edidproductionModal .close').click();
        })
    }
  }

  SingleexcelDownload() {

    if (this.multiplecodesetassigned.length == 0) {
      this.multiplecodesetassigned = [{}];
    }
    if (this.nocodesetassigned.length == 0) {
      this.nocodesetassigned = [{}];
    }
    if (this.singlecodesetassigned.length == 0) {
      this.singlecodesetassigned = [{}];
    }
    var data1 = this.nocodesetassigned;
    var data2 = this.singlecodesetassigned;
    var data3 = this.multiplecodesetassigned;
    var opts = [{ sheetid: 'no_codesets_assigned', header: true }, { sheetid: 'single_codesets_assigned', header: false }, { sheetid: 'multiple_codesets_assigned', header: false }];
    var filename = 'CEC_EDID';
    var res = alasql('SELECT INTO XLSX("' + filename + '",?) FROM ?',
      [opts, [data1, data2, data3]]);
    this.spinnerService.hide();
  }

  ontExport() {
    var data1 = [{
      "Device": "",
      "Subdevice": "",
      "Brand": "",
      "Targetmodel": "",
      "TargetRegion": "",
      "TargetCountry": "",
      "Cecpresent": "",
      "Cecenabled": "",
      "Vendoridhex": "",
      "Osdstring": "",
      "Osdhex": "",
      "Edid": "",
      "Year": "",
      "Supportedregions": "",
    }];
    var opts = [{ sheetid: 'Template', header: true }];
    var filename = 'Import to Staging Data Capture Template';
    var res = alasql('SELECT INTO XLSX("' + filename + '",?) FROM ?',
      [opts, [data1]]);
  }

  async exporttoProd(datacapture) {
    this.singlecodesetassigned = [];
    this.multiplecodesetassigned = [];
    this.nocodesetassigned = [];
    if (this.projectNames == null || this.projectNames == "null" || this.projectNames == undefined) {
      $('#table').css('display', 'none');
      this.message = 'Please Select the Project'
      this.multiplecodeset = false;
      this.show = false;
    }
    else if ((datacapture === undefined || datacapture.length === 0) && (this.xmlDataResult === undefined || this.xmlDataResult === null || this.xmlDataResult.length === 0)) {
      $('#table').css('display', 'none');
      this.message = 'please upload codesetincludes.xml file and then select the records'
      this.multiplecodeset = false;
      this.show = false;
    }
    else if (this.xmlDataResult === undefined || this.xmlDataResult === null || this.xmlDataResult.length === 0) {
      $('#table').css('display', 'none');
      this.message = 'please upload codesetincludes.xml file'
      this.multiplecodeset = false;
      this.show = false;
    }
    else if (datacapture === undefined || datacapture.length === 0) {
      $('#table').css('display', 'none');
      $('.multiple_unlink').css('display', 'none');
      this.multiplecodeset = false;
      this.message = 'No Records selected';
      this.show = false;
    }
    else {
      this.spinnerService.show();
      let proddata = []; let Singlecodesetassigned: any = [];
      let Multiplecodesetassigned: any = []; let nocodesetassigned: any = []; let Allcodesetassigned: any = [];
      let rcm2 = []; let Regions = []; let Supportedregions = []; let reg = []; let arr2 = [];
      for (let i = 0; i < datacapture.length; i++) {
        let r = datacapture[i]["Supportedregions"];
        let r1 = r.split(';').filter(u => (u.trim() != " " && u.trim() != ""));

        if (r1.length === 1 && r1[0] === '') {
          Supportedregions = [];
        }
        else {
          for (let j = 0; j < r1.length; j++) {
            rcm2.push(r1[j].split(':'), datacapture[i]['Id'], datacapture[i]['Detectionid'], datacapture[i]['Device'].toUpperCase(), datacapture[i]['Subdevice'], datacapture[i]['Brand'], datacapture[i]['UID'], datacapture[i]['Year'], datacapture[i]['Cecpresent'], datacapture[i]['Cecenabled'], datacapture[i]['Vendoridhex'], datacapture[i]['Osdhex'], datacapture[i]['Edid'], datacapture[i]['Status']);
          }
        }
      }
      for (let i = 0; i < rcm2.length; i = i + 14) {
        reg.push({ Region: rcm2[i][0], Country: rcm2[i][1], Models: rcm2[i][2].trim().split(',').filter((v, i, a) => a.indexOf(v) === i), ID: rcm2[i + 1], Detectionid: rcm2[i + 2], Device: rcm2[i + 3], Subdevice: rcm2[i + 4], Brand: rcm2[i + 5], Uid: rcm2[i + 6], Year: rcm2[i + 7], Cecpresent: rcm2[i + 8], Cecenabled: rcm2[i + 9], Vendorid: rcm2[i + 10], Osd: rcm2[i + 11], Edid: rcm2[i + 12], Status: rcm2[i + 13] })
      }
      for (let i = 0; i < reg.length; i++) {
        for (let j = 0; j < reg[i]['Models'].length; j++) {
          Regions.push({ Id: reg[i]['ID'], Detectionid: reg[i]['Detectionid'], Device: reg[i]['Device'], Subdevice: reg[i]['Subdevice'], Brand: reg[i]['Brand'], Model: reg[i]['Models'][j], Region: reg[i]['Region'], Country: reg[i]['Country'], Uid: reg[i]['Uid'], Year: reg[i]['Year'], Cecpresent: reg[i]['Cecpresent'], Cecenabled: reg[i]['Cecenabled'], Vendorid: reg[i]['Vendorid'], Osd: reg[i]['Osd'], Edid: reg[i]['Edid'], Status: reg[i]['Status'] })
        }
      }
      arr2 = Regions;
      arr2 = lodash.uniqWith(arr2, lodash.isEqual);
      arr2.forEach(element => {
        proddata.push(element)
      });
      proddata.forEach(element => {
        let removespacetovendor = element['Vendorid'].split(" ");
        let removespacetoosd = element['Osd'].split(" ");
        let vendor = ''; let osd = '';

        for (let i = 0; i < removespacetovendor.length; i++) {
          vendor += removespacetovendor[i]
        }
        for (let i = 0; i < removespacetoosd.length; i++) {
          osd += removespacetoosd[i]
        }
        element['Vendorid'] = vendor;
        element['Osd'] = osd;
      })
      proddata.forEach(element => {
        let addspacetovendor = ''; let addspacetoosd = ''
        for (let i = 0; i < element['Vendorid'].length; i = i + 2) {
          addspacetovendor += element['Vendorid'].substr(i, 2) + " "
        }
        element['Vendorid'] = addspacetovendor.trim();
        for (let i = 0; i < element['Osd'].length; i = i + 2) {
          addspacetoosd += element['Osd'].substr(i, 2) + " "
        }
        element['Osd'] = addspacetoosd.trim();
        element['Uid'] = element['Uid'].slice(0, -1);
      });
      for (let i = 0; i < proddata.length; i++) {
        await this.mainService.getRemoteUID(proddata[i]['Brand'], proddata[i]['Model'].toString(), proddata[i]['Device'])
          .subscribe(value => {
            let UpdatedUID = []; let UpdatedUIDs = '';
            if (value.data != [] || value.data != '[]') {

              let Uid = JSON.parse(value.data);
              Uid.forEach(element => {
                UpdatedUID.push({ RemoteModel: element.remoteModel, UID: element.UID })
              });
              UpdatedUID = UpdatedUID.filter((v, i, a) => a.indexOf(v) === i);

            }
            for (let n = 0; n < UpdatedUID.length; n++) {
              UpdatedUIDs += UpdatedUID[n]['UID'] + ';'
            }
            UpdatedUIDs = UpdatedUIDs.slice(0, -1)
            if (proddata[i]['Uid'].length > 0) {
              this.Uid = proddata[i]['Uid']
            }
            else {
              this.Uid = UpdatedUIDs;
            }

            let codesets = this.xmlDataResult.filter(u => (u.uid === this.Uid) && (u.device === proddata[i]['Device']))
            let UpdatedCodesets = '';
            codesets.forEach(element => {
              UpdatedCodesets += element['codeset'] + ';'
            });
            UpdatedCodesets = UpdatedCodesets.slice(0, -1);
            if (codesets.length > 1) {
              Multiplecodesetassigned.push({
                Serial: null, Device: proddata[i]['Device'], Subdevice: proddata[i]['Subdevice'], Brand: proddata[i]['Brand'],
                Model: proddata[i]['Model'], Region: proddata[i]['Region'], Country: proddata[i]['Country'],
                Cecpresent: proddata[i]['Cecpresent'], Cecenabled: proddata[i]['Cecenabled'], Vendorid: proddata[i]['Vendorid'], Osd: proddata[i]['Osd'], Edid: proddata[i]['Edid'], UID: this.Uid, codeset: UpdatedCodesets, Remarks: ''
              })
            }
            if (codesets.length === 1) {
              Singlecodesetassigned.push({
                device: proddata[i]['Device'], subdevice: proddata[i]['Subdevice'], brand: proddata[i]['Brand'],
                model: proddata[i]['Model'], region: proddata[i]['Region'].trim(), country: proddata[i]['Country'].trim(),
                iscecpresent: proddata[i]['Cecpresent'], iscecenabled: proddata[i]['Cecenabled'], vendorid: proddata[i]['Vendorid'], osd: proddata[i]['Osd'], edid: proddata[i]['Edid'],
                uid: this.Uid, codeset: UpdatedCodesets
              })
            }
            if (codesets.length < 1) {
              nocodesetassigned.push({
                Serial: null, Device: proddata[i]['Device'], Subdevice: proddata[i]['Subdevice'], Brand: proddata[i]['Brand'],
                Model: proddata[i]['Model'], Region: proddata[i]['Region'], Country: proddata[i]['Country'],
                Cecpresent: proddata[i]['Cecpresent'], Cecenabled: proddata[i]['Cecenabled'], Vendorid: proddata[i]['Vendorid'], Osd: proddata[i]['Osd'], Edid: proddata[i]['Edid'], UID: this.Uid, codeset: UpdatedCodesets, Remarks: ''
              })
            }
            Allcodesetassigned.push({
              device: proddata[i]['Device'], subdevice: proddata[i]['Subdevice'], brand: proddata[i]['Brand'],
              model: proddata[i]['Model'], region: proddata[i]['Region'].trim(), country: proddata[i]['Country'].trim(),
              iscecpresent: proddata[i]['Cecpresent'], iscecenabled: proddata[i]['Cecenabled'], vendorid: proddata[i]['Vendorid'], osd: proddata[i]['Osd'], edid: proddata[i]['Edid'],
              uid: this.Uid, codeset: UpdatedCodesets, stagingid: proddata[i]['Id'], statusflag: proddata[i]['Status']
            })
            Allcodesetassigned.forEach(element => {
              if (element['statusflag'] === 'Imported from Raw') {
                element['statusflag'] = 1
              }
              if (element['statusflag'] === 'Imported from Excel') {
                element['statusflag'] = 2
              }
            });
            this.singlecodesetassigned = Singlecodesetassigned;
            this.multiplecodesetassigned = Multiplecodesetassigned;
            this.nocodesetassigned = nocodesetassigned;
            this.allcodesetassigned = Allcodesetassigned;
            let mc = 0; let nc = 0;
            this.multiplecodesetassigned.forEach(element => {
              element['Serial'] = mc;
              mc++;
            });
            this.nocodesetassigned.forEach(element => {
              element['Serial'] = nc;
              nc++;
            });
            this.message = '';
            // $('.multiple_unlink').css('display', 'Block');
            if ((this.multiplecodesetassigned.length > 0 && this.nocodesetassigned.length > 0) || (this.multiplecodesetassigned.length > 0 && this.nocodesetassigned.length == 0)) {
              this.multiplecodeset = true;
              // $('.multiple_unlink').css('display', 'Block');
            }
            else if (this.multiplecodesetassigned.length == 0 && this.nocodesetassigned.length > 0) {
              this.multiplecodeset = true;
              // $('.multiple_unlink').css('display', 'Block');
            }
            else {
              this.multiplecodeset = false;
              // $('.multiple_unlink').css('display', 'none');
            }
            if (this.nocodesetassigned.length >= 0 && this.multiplecodesetassigned.length < 1 && this.singlecodesetassigned.length < 1) {
              $('#table').css('display', 'none');
              this.multiplecodeset = true;
              this.message = 'No codesets assigned to selected records';
              this.show = false;
            }
            if (this.nocodesetassigned.length >= 0 && this.multiplecodesetassigned.length > 0 && this.singlecodesetassigned.length < 1) {
              $('#table').css('display', 'none');
              this.multiplecodeset = true;
              this.message = 'Multiple codesets assigned to selected records';
              this.show = false;
            }
            if (this.allcodesetassigned.length > 0) {
              $('#table').css('display', 'block');
              this.show = true;
              this.multiplecodeset = true;
              this.message = '';
            }
            else {
              $('#table').css('display', 'none');
              this.show = false;
              this.multiplecodeset = true;
            }
            let count = this.singlecodesetassigned.length + this.multiplecodesetassigned.length + this.nocodesetassigned.length;
            if (proddata.length === count) {
              let ProjectName = this.projectNames.split('_');
              let temp = []; let temp_1 = []; let temp1 = []; let temp1_1 = []; let temp2 = []; let temp2_1 = []; let nocodeset_alreadyassigned = []; let nocodeset_notassigned = []; let multiplecodeset_alreadyassigned = []; let multiplecodeset_notassigned = [];
              this.mainService.StagingToProd(2, ProjectName[1], null, null, null, null, null, null, null, null, null, null, null, null, null, ProjectName[0], null, null)
                .then(value => {
                  if ((value.data.length > 0 && value.data[0]['status'] === 0) || value.data === "0") {
                    this.spinnerService.hide();
                  }
                  else if (value.data != "0") {
                    let prdata = value.data.filter(u => ((u.codeset != '') && (!u.codeset.includes(';'))));
                    for (let j = 0; j < prdata.length; j++) {
                      if ((prdata[j]['isCecPresent'] === 1)) {
                        prdata[j]['isCecPresent'] = 'Yes'
                      }
                      if ((prdata[j]['isCecPresent'] === 0)) {
                        prdata[j]['isCecPresent'] = 'No'
                      }
                      if ((prdata[j]['isCecEnabled'] === 1)) {
                        prdata[j]['isCecEnabled'] = 'Yes'
                      }
                      if ((prdata[j]['isCecEnabled'] === 0)) {
                        prdata[j]['isCecEnabled'] = 'No'
                      }
                      temp.push(this.nocodesetassigned.filter(u => ((u.Device.trim() === prdata[j]['device'].trim()) && (u.Subdevice.trim() === prdata[j]['subdevice'].trim()) && (u.Brand.trim() === prdata[j]['brand'].trim()) && (u.Model.trim() === prdata[j]['model'].trim()) && (u.Region.trim() === prdata[j]['region'].trim()) && (u.Country.trim() === prdata[j]['country'].trim()) && (u.Cecpresent.trim() === prdata[j]['isCecPresent'].trim()) && (u.Cecenabled.trim() === prdata[j]['isCecEnabled'].trim()) && (u.Vendorid.trim() === prdata[j]['vendorId'].trim()) && (u.Osd.trim() === prdata[j]['osd'].trim()) && (u.Edid.trim() === prdata[j]['edid'].trim()))));
                      temp_1.push(this.multiplecodesetassigned.filter(u => (u.Device.trim() === prdata[j]['device'].trim() && u.Subdevice.trim() === prdata[j]['subdevice'].trim() && u.Brand.trim() === prdata[j]['brand'].trim() && u.Model.trim() === prdata[j]['model'].trim() && u.Region.trim() === prdata[j]['region'].trim() && u.Country.trim() === prdata[j]['country'].trim() && u.Cecpresent.trim() === prdata[j]['isCecPresent'].trim() && u.Cecenabled.trim() === prdata[j]['isCecEnabled'].trim() && u.Vendorid.trim() === prdata[j]['vendorId'].trim() && u.Osd.trim() === prdata[j]['osd'].trim() && u.Edid.trim() === prdata[j]['edid'].trim())));
                    }
                    for (let i = 0; i < temp.length; i++) {
                      if (temp[i].length > 0) {
                        for (let j = 0; j < temp[i].length; j++) {
                          temp1.push(temp[i][j]);
                          this.nocodesetassigned = this.nocodesetassigned.filter(u => (u.Serial !== temp[i][j]['Serial']));
                        }
                      }
                    }

                    for (let i = 0; i < temp_1.length; i++) {
                      if (temp_1[i].length > 0) {
                        for (let j = 0; j < temp_1[i].length; j++) {
                          temp1_1.push(temp_1[i][j]);
                          this.multiplecodesetassigned = this.multiplecodesetassigned.filter(u => (u.Serial !== temp_1[i][j]['Serial']));
                        }
                      }
                    }
                    temp1.forEach(element => {
                      element['Remarks'] = "Single Codeset is already assigned in Prod"
                    })
                    temp1_1.forEach(element => {
                      element['Remarks'] = "Single Codeset is already assigned in Prod"
                    })
                    nocodeset_alreadyassigned = lodash.uniqWith(temp1, lodash.isEqual);
                    nocodeset_alreadyassigned = lodash.sortBy(nocodeset_alreadyassigned, 'Serial')
                    nocodeset_notassigned = this.nocodesetassigned;
                    this.nocodesetassigned = [];
                    nocodeset_alreadyassigned.forEach(element => {
                      temp2.push(element)
                    })
                    nocodeset_notassigned.forEach(element => {
                      temp2.push(element)
                    })
                    this.nocodesetassigned = lodash.sortBy(temp2, 'Serial');
                    multiplecodeset_alreadyassigned = lodash.uniqWith(temp1_1, lodash.isEqual);
                    multiplecodeset_alreadyassigned = lodash.sortBy(multiplecodeset_alreadyassigned, 'Serial')
                    multiplecodeset_notassigned = this.multiplecodesetassigned;
                    this.multiplecodesetassigned = [];
                    multiplecodeset_alreadyassigned.forEach(element => {
                      temp2_1.push(element)
                    })
                    multiplecodeset_notassigned.forEach(element => {
                      temp2_1.push(element)
                    })
                    this.multiplecodesetassigned = lodash.sortBy(temp2_1, 'Serial');
                    if (proddata.length === count) {
                      this.spinnerService.hide();
                    }
                  }
                  else {
                    this.spinnerService.hide();
                  }

                })
            }
          })


      }
    }
  }

  onBtnExport() {
    let columndefs = this.gridApi.columnController.columnDefs; let columns = []; let filteredcolumns = [];
    columndefs = columndefs.filter(u => u.headerName != 'Select All' && u.headerName != 'Action');
    columndefs.forEach(element => {
      columns.push(element['headerName'])
    });
    for (let i = 0; i < columns.length; i++) {
      filteredcolumns.push(columns[i])
    }
    var excelParams = {
      columnKeys: filteredcolumns.filter(u => u != "Osdhex"),
      allColumns: false,
      fileName: "Staging Data Capture",
      skipHeader: false
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  setAutoHeight() {
    this.gridApi.setDomLayout('autoHeight');
    (<HTMLInputElement>document.querySelector('#myGrid')).style.height = '';
  }

  setFixedHeight() {
    this.gridApi.setDomLayout('normal');
    (<HTMLInputElement>document.querySelector('#myGrid')).style.height = '500px';
  }
}
