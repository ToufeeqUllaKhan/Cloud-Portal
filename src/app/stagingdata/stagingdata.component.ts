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
  constructor(private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private fb: FormBuilder, private http: HttpClient) {
    localStorage.removeItem('RawStatus')
    this.usersName = localStorage.getItem('userName');
    this.loginid = JSON.parse(localStorage.getItem('currentUser'));
    this.role = localStorage.getItem('AccessRole');
    this.module = localStorage.getItem('moduleselected');
    this.status = null; this.device = null; this.subdevice = null;
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
    let device = this.device;
    let subdevice = this.subdevice;
    this.stagingdata(dataType, device, subdevice, statusflag);
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
  }

  unlink(setStagingdata) {
    var setStagingdata0 = setStagingdata[0];
    var setStagingdata1 = setStagingdata[16];
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
    this.viewEdidData(setEdid);
  };

  supportedregions(setEdid) {
    this.viewSupportedregions(setEdid);
  };

  StagingdataView(ret) {
    let removespacetovendor = ret[11].split(" ");
    let removespacetoosd = ret[14].split(" ");
    let vendor = ''; let osd = '';

    for (let i = 0; i < removespacetovendor.length; i++) {
      vendor += removespacetovendor[i]
    }
    for (let i = 0; i < removespacetoosd.length; i++) {
      osd += removespacetoosd[i]
    }
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
    var str11 = vendor;
    var str12 = ret[12];
    var str13 = ret[13];
    var str14 = osd;
    var str15 = ret[15];
    var str16 = ret[16];
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
    console.log(value, value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11, value12, value13, value14, value15, value16)
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

  getTabResponseData(device, subdevice, statusflag) {

    let dataType = 6;
    this.stagingdata(dataType, device, subdevice, statusflag);

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
    this.projectNames = "null";
    this.xmlDataResult = [];
  }

  onchangestatus() {
    let statusflag = this.status;
    let device = this.device;
    let subdevice = this.subdevice;
    if (statusflag == null || statusflag == 'null') {
      statusflag = null;
    }
    else {
      statusflag = parseInt(this.status);
    }
    if (device == null || device == 'null') {
      device = null;
    }
    else {
      device = this.device;
    }
    if (subdevice == null || subdevice == 'null') {
      subdevice = null;
    }
    else {
      subdevice = this.subdevice;
    }
    this.getTabResponseData(device, subdevice, statusflag);
  }

  onchangedevice() {
    let statusflag = this.status;
    let device = this.device;
    this.getTabResponseData(device, null, statusflag);
  }

  refreshScreen() {
    this.status = null; this.device = null; this.subdevice = null;
    this.getTabResponseData(this.device, this.subdevice, this.status);
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

  stagingdata(dataType, Device, Subdevice, statusflag) {
    this.mainService.RawToStaging(dataType, null, null, statusflag)
      .then(value => {
        let arr = [];
        if (value.data.length > 0 && value.data != '0' && value.data != null) {
          for (let i = 0; i < value.data.length; i++) {
            if (value.data[i]['cecPresent'] === 1) {
              value.data[i]['cecPresent'] = 'Yes'
            }
            if (value.data[i]['cecPresent'] === 0) {
              value.data[i]['cecPresent'] = 'No'
            }
            if (value.data[i]['cecEnabled'] === 1) {
              value.data[i]['cecEnabled'] = 'Yes'
            }
            if (value.data[i]['cecEnabled'] === 0) {
              value.data[i]['cecEnabled'] = 'No'
            }
            if (value.data[i]['statusFlag'] === 1 || value.data[i]['statusFlag'] === '1') {
              value.data[i]['statusFlag'] = 'Imported from Raw'
            }
            if (value.data[i]['statusFlag'] === 2 || value.data[i]['statusFlag'] === '2') {
              value.data[i]['statusFlag'] = 'Imported from Excel'
            }
            arr.push({
              Id: value.data[i]['stagingId'], Detectionid: value.data[i]['fK_DetectionId'], Device: value.data[i]['device'].toUpperCase(),
              Subdevice: value.data[i]['subdevice'], Brand: value.data[i]['brand'], Model: value.data[i]['model'],
              Supportedregions: value.data[i]['supportedRegionCountry'], UID: value.data[i]['uid'],
              Year: value.data[i]['year'], Cecpresent: value.data[i]['cecPresent'], Cecenabled: value.data[i]['cecEnabled'],
              Vendoridhex: value.data[i]['vendorIdHex'], Vendoridstring: value.data[i]['vendorIdString'],
              Osdstring: value.data[i]['osdString'], Osdhex: value.data[i]['osdHex'], Edid: value.data[i]['edidData'],
              Status: value.data[i]['statusFlag']
            });

          }
          let uidsize = [];
          // arr.forEach(element => {
          //   if (element['UID'].includes(';')) {
          //     uidsize = element['UID'].split(';').filter(u => u != '')
          //     if (uidsize.length > 1) {
          //       element['UID'] = '';
          //     }
          //     else {
          //       element['UID'] = element['UID']
          //     }
          //   }
          // });
          let device = []; let subdevice = []; let Status = [];
          for (let i = 0; i < arr.length; i++) {
            device.push(arr[i]['Device']);
          }
          for (let i = 0; i < arr.length; i++) {
            Status.push(arr[i]['Status']);
          }
          this.filter_Status = Status.filter((v, i, a) => a.indexOf(v) === i);
          this.filter_Device = device.filter((v, i, a) => a.indexOf(v) === i);
          subdevice = arr.filter(u => u.Device === Device)
          let subdevicefilter = [];
          for (let i = 0; i < subdevice.length; i++) {
            subdevicefilter.push(subdevice[i]['Subdevice']);
          }
          this.filter_Subdevice = subdevicefilter.filter((v, i, a) => a.indexOf(v) === i);
        }
        if (Device === null && Subdevice === null) {
          this.stagingdatacapture = arr;
        }
        else if (Device === null && Subdevice != null) {
          this.stagingdatacapture = arr.filter(u => u.Subdevice === Subdevice);
        }
        else if (Device != null && Subdevice === null) {
          this.stagingdatacapture = arr.filter(u => u.Device === Device);
        }
        else if (Device != null && Subdevice != null) {
          this.stagingdatacapture = arr.filter(u => u.Device === Device && u.Subdevice === Subdevice);
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
      minWidth: 100,
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
      { headerName: "Status", field: "Status", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Select All", field: "Select All", resizable: true, sortable: true, checkboxSelection: true, headerCheckboxSelection: true, minWidth: 130 },
      { headerName: "Action", field: "Status", resizable: true, cellRenderer: "btnCellRenderer", minWidth: 130 }
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
          $('.card').hide();
          $('#download').hide();
        }
        if ((permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0) ||
          (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0)) {
          this.columnDefs = this.columnDefs.filter(u => u.field != 'Select All' && u.headerName != 'Action');
          $('.card').hide();
          $('#download').show();
        }
        if ((permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1)) {
          this.columnDefs = this.columnDefs;
          this.mainService.getProjectNames(null, null, null, null, null, 1)
            .subscribe(value => {
              this.spinnerService.show();
              this.filterProjects = value.data;
              this.filterProjects.forEach(element => {
                element['projectname'] = element['dbinstance'] + '_' + element['projectname']
              })
              const uniqueProjects = [...new Set(this.filterProjects.map(item => item.projectname))];
              this.projects = uniqueProjects;
              this.projectNames = null;
              // let ProjectName = this.projectNames.split('_');
              // this.projectNames = filterProject[0]['projectname'];
              // let formData = new FormData();
              // formData.append("filepath", this.fileselected);
              // formData.append("crudtype", "2");
              // formData.append("projectname", ProjectName[1]);
              // formData.append("statusflag", "1");
              // formData.append("recordid", "");
              // formData.append("dbinstance", ProjectName[0]);
              // this.http.post<any>(`${environment.apiUrl}/api/Detection/UpdateCodesetIncludes`, formData)
              //   .subscribe(val => {
              //     if (val.data != '0' && val.data != 0) {
              //       let fileselected = val.data[0]['filePath'].toString();
              //       this.fileselected = fileselected.replace(';', '');
              //       const docFile = new XMLHttpRequest();
              //       docFile.open('GET', this.fileselected, true);
              //       docFile.send();
              //       docFile.onreadystatechange = () => {
              //         if (docFile.readyState === 4 && docFile.status === 200) {
              //           this.convertxml(docFile.response);
              //         }
              //       };
              //     }
              //     else {
              this.spinnerService.hide();
              //       this.toastr.error('', 'Earlier No Codesetinclude.xml file uploaded to the selected project', { timeOut: 3000 })
              //     }
              //   })
            });
          $('#Projectname').show();
          $('#Codesetinclude').show();
          $('#button').show();
          $('#single_download').show();
          $('#direct').show();
          $('#download').hide();
        }
        console.log(permission)
      })
  }

  search() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  methodFromParent_edituid(cell) {
    let values = Object.values(cell);
    this.StagingdataView(values)
    $('#showeditUIDbutton').click();
  }

  methodFromParent_edit(cell) {
    let values = Object.values(cell);
    this.StagingdataView(values)
    $('#showeditbutton').click();
  }

  methodFromParent_unlink(cell) {
    let values = Object.values(cell);
    this.unlink(values)
  }

  methodFromParent_viewSupportedRegion(cell) {
    let values = Object.values(cell);
    this.supportedregions(values[6])
  }

  methodFromParent_viewEdid(cell) {
    let values = Object.values(cell);
    this.edid(values[15]);
  }


  /** change of project update Modules*/
  async changeProject() {
    this.spinnerService.show();
    if (this.projectNames == null || this.projectNames == "null" || this.projectNames == undefined) {
      this.spinnerService.hide();
      this.toastr.warning('', 'Please Select the Project');
      $('#upload').css('display', 'none');
    } else {
      let filterProject: any = this.filterProjects.filter(u =>
        u.projectname == this.projectNames);
      this.projectNames = filterProject[0]['projectname'];
      let ProjectName = this.projectNames.split('_');
      $('#upload').css('display', 'block');
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

  assigncodesettouid() {
    this.spinnerService.show();
    for (let i = 0; i < this.singlecodesetassigned.length; i++) {
      if (this.singlecodesetassigned[i]['iscecpresent'] === 'Yes') {
        this.singlecodesetassigned[i]['iscecpresent'] = 1
      }
      if (this.singlecodesetassigned[i]['iscecpresent'] === 'No') {
        this.singlecodesetassigned[i]['iscecpresent'] = 0
      }
      if (this.singlecodesetassigned[i]['iscecenabled'] === 'Yes') {
        this.singlecodesetassigned[i]['iscecenabled'] = 1
      }
      if (this.singlecodesetassigned[i]['iscecenabled'] === 'No') {
        this.singlecodesetassigned[i]['iscecenabled'] = 0
      }
      let projectname = this.projectNames.split('_');
      let Projectname = projectname[1].trim();
      let instance = projectname[0].trim();
      let crudtype = 1;
      this.mainService.StagingToProd(crudtype, Projectname, this.singlecodesetassigned[i]['device'],
        this.singlecodesetassigned[i]['subdevice'], this.singlecodesetassigned[i]['brand'], this.singlecodesetassigned[i]['model'],
        this.singlecodesetassigned[i]['region'], this.singlecodesetassigned[i]['country'],
        this.singlecodesetassigned[i]['iscecpresent'], this.singlecodesetassigned[i]['iscecenabled'], this.singlecodesetassigned[i]['vendorid'],
        this.singlecodesetassigned[i]['osd'], this.singlecodesetassigned[i]['edid'], this.singlecodesetassigned[i]['codeset'], null, instance)
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

          if (i + 1 == this.singlecodesetassigned.length) {
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
      "Vendoridstring": "",
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

  exporttoProd(datacapture) {
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
      let RegioncountryModel; let proddata = []; let Singlecodesetassigned: any = [];
      let Multiplecodesetassigned: any = []; let nocodesetassigned: any = [];
      let rcm2 = []; let Regions = []; let Supportedregions = []; let reg = []; let arr2 = []; let StagingID = [];
      for (let i = 0; i < datacapture.length; i++) {
        RegioncountryModel = '';
        let r = datacapture[i]["Supportedregions"];
        let r1 = r.split(';').filter(u => (u.trim() != " " && u.trim() != ""));

        if (r1.length === 1 && r1[0] === '') {
          Supportedregions = [];
        }
        else {
          for (let j = 0; j < r1.length; j++) {
            rcm2.push(r1[j].split(':'), datacapture[i]['Id']);
          }
        }
      }

      for (let j = 1; j < rcm2.length; j = j + 2) {
        StagingID.push(rcm2[j])
      }
      for (let i = 0; i < rcm2.length; i = i + 2) {
        reg.push({ Region: rcm2[i][0], Country: rcm2[i][1], Models: rcm2[i][2].trim().split(',').filter((v, i, a) => a.indexOf(v) === i) })
      }
      for (let i = 0; i < reg.length; i++) {
        for (let j = 0; j < reg[i]['Models'].length; j++) {
          Regions.push({ Region: reg[i]['Region'], Country: reg[i]['Country'], Models: reg[i]['Models'][j], Id: StagingID[i] })
        }
      }
      let Ids = StagingID.filter((v, i, a) => a.indexOf(v) === i);
      for (let i = 0; i < datacapture.length; i++) {
        let Region = Regions.filter(u => u.Id === Ids[i])
        for (let j = 0; j < Region.length; j++) {
          arr2.push({
            Id: Region[j]['Id'], Device: datacapture[i]['Device'].toUpperCase(), Subdevice: datacapture[i]['Subdevice'], Brand: datacapture[i]['Brand'],
            Model: Region[j]['Models'], Region: Region[j]['Region'], Country: Region[j]['Country'], Uid: datacapture[i]['UID'],
            Year: datacapture[i]['Year'], Cecpresent: datacapture[i]['Cecpresent'], Cecenabled: datacapture[i]['Cecenabled'],
            Vendorid: datacapture[i]['Vendoridhex'], Osd: datacapture[i]['Osdhex'], Edid: datacapture[i]['Edid']
          });
        }
      }
      arr2 = lodash.uniqWith(arr2, lodash.isEqual);
      arr2.forEach(element => {
        proddata.push(element)
      });
      let uidsize = [];
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

        if (element['Uid'].includes(';')) {
          uidsize = element['Uid'].split(';').filter(u => u != '')
          if (uidsize.length > 1) {
            element['Uid'] = element['Uid'];
          }
          else {
            element['Uid'] = uidsize[0]
          }
        }
      });
      for (let i = 0; i < proddata.length; i++) {
        this.mainService.getRemoteUID(proddata[i]['Brand'], proddata[i]['Model'].toString(), proddata[i]['Device'])
          .subscribe(value => {
            let UpdatedUID = []; let UpdatedUIDs = '';
            if (value.data != [] || value.data != '[]') {

              let Uid = JSON.parse(value.data);
              Uid.forEach(element => {
                UpdatedUID.push({ RemoteModel: element.remoteModel, UID: element.UID })
              });
              UpdatedUID = UpdatedUID.filter((v, i, a) => a.indexOf(v) === i);
              if (UpdatedUID.length > 1 || UpdatedUID.length < 1) {
                for (let n = 0; n < UpdatedUID.length; n++) {
                  UpdatedUIDs += UpdatedUID[n]['UID'] + ';'
                }
                this.Uid = UpdatedUIDs.slice(0, -1)
              }
              else {
                if (proddata[i]['Uid'].length > 0) {
                  this.Uid = proddata[i]['Uid']
                }
                else {
                  this.Uid = UpdatedUID[0]['UID'].toString();
                }
              }
            }
            let codesets = this.xmlDataResult.filter(u => (u.uid === this.Uid) && (u.device === proddata[i]['Device']))
            if (codesets.length > 1) {
              let UpdatedCodesets = ''
              this.Uid = UpdatedUIDs.slice(0, -1)
              codesets.forEach(element => {
                UpdatedCodesets += element['codeset'] + ';'
              });
              Multiplecodesetassigned.push({
                Device: proddata[i]['Device'], Subdevice: proddata[i]['Subdevice'], Brand: proddata[i]['Brand'],
                Model: proddata[i]['Model'], Region: proddata[i]['Region'], Country: proddata[i]['Country'],
                Cecpresent: proddata[i]['Cecpresent'], Cecenabled: proddata[i]['Cecenabled'], Vendorid: proddata[i]['Vendorid'], Osd: proddata[i]['Osd'], Edid: proddata[i]['Edid'], UID: this.Uid, codeset: UpdatedCodesets
              })
            }
            if (codesets.length === 1) {
              Singlecodesetassigned.push({
                device: proddata[i]['Device'], subdevice: proddata[i]['Subdevice'], brand: proddata[i]['Brand'],
                model: proddata[i]['Model'], region: proddata[i]['Region'].trim(), country: proddata[i]['Country'].trim(),
                iscecpresent: proddata[i]['Cecpresent'], iscecenabled: proddata[i]['Cecenabled'], vendorid: proddata[i]['Vendorid'], osd: proddata[i]['Osd'], edid: proddata[i]['Edid'],
                uid: this.Uid, codeset: codesets[0]['codeset']
              })
            }
            if (codesets.length < 1) {
              nocodesetassigned.push({
                Device: proddata[i]['Device'], Subdevice: proddata[i]['Subdevice'], Brand: proddata[i]['Brand'],
                Model: proddata[i]['Model'], Region: proddata[i]['Region'], Country: proddata[i]['Country'],
                Cecpresent: proddata[i]['Cecpresent'], Cecenabled: proddata[i]['Cecenabled'], Vendorid: proddata[i]['Vendorid'], Osd: proddata[i]['Osd'], Edid: proddata[i]['Edid'], UID: this.Uid, codeset: ''
              })
            }
            this.singlecodesetassigned = Singlecodesetassigned;
            this.multiplecodesetassigned = Multiplecodesetassigned;
            this.nocodesetassigned = nocodesetassigned;
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

            console.log(this.singlecodesetassigned);
            console.log(this.multiplecodesetassigned);
            console.log(this.nocodesetassigned);
            if (this.singlecodesetassigned.length > 0) {
              $('#table').css('display', 'block');
              this.show = true;
            }
            else {
              $('#table').css('display', 'none');
              this.show = false;
            }
            let count = this.singlecodesetassigned.length + this.multiplecodesetassigned.length + this.nocodesetassigned.length;
            if (proddata.length === count) {
              this.spinnerService.hide();
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
