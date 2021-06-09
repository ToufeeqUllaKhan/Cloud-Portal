import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { Subject } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { BtnCellRenderer } from './btn-cell-renderer.component';
import { EdidviewCellRenderer } from '../brand-library/edidview-cell-renderer.component';
import { RemarksViewCellRenderer } from './remarksview-cell-renderer.component ';
import { SupportedRegionsViewCellRenderer } from './supportedregionsview-cell-renderer.component';
import mainscroll from '../model/Scroll';

@Component({
  selector: 'app-rawdata',
  templateUrl: './rawdata.component.html',
  styleUrls: ['./rawdata.component.css']
})
export class RawdataComponent implements OnInit {

  saveEditRawData: FormGroup;
  usersName: any;
  projectNames: any; selectedItems: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false; tabslist = []; count: any = 0; oldValue: string; modalCount: any = 0; currentVal: any;
  limitSelection = false; mainArr = [];
  clientDetails = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  resultProjArr: any = []; status: any; filter_Device: any; filter_Subdevice: any; filter_Status: any;
  rawdatacapture: any = []; device: any; subdevice: any;
  edidDataView: Boolean = false; DecodeedidDataView: Boolean = false;
  RemarksView: boolean = false;
  SupportedregionsView: boolean = false;
  EdidData: any;
  Metadata: any; CEC: any; EDID: any; Scandevice: any;
  Supportedregions: any; data: any = [];

  editedDevice: any; editedBrand: any; editedSubdevice: any; editedModel: any; editedVendor: any; editedOSD: any;
  recordId: any; editedEDID128: any; editedSupportedRegion: any; editedVendorstr: any; editedRegion: any; editedCountry: any;
  editYear: any; editcecPresent: any; editcecEnabled: any; editedCaptureCountry: any; editedCaptureRegion: any; editedRemoteModel: any;
  Rawdatasubmitted: Boolean = false;
  vendorError: Boolean = false; edidError: Boolean = false;
  editedCEC_Device: any;
  editedStatus: any;
  showbutton: boolean = false;
  sourcetype: any;
  sourcename: any;
  remarks: any;
  Values: any = [];
  keys: any = [];
  regionlist: any[];
  countrylist: any[];
  singleUid: any; multipleuid: any = [];
  successinsert = 0;

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
  rowselected: any;
  failedinsert = 0;
  loginid: any;
  role: string;
  module: string;

  constructor(private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private fb: FormBuilder) {
    localStorage.removeItem('StagingStatus')
    this.usersName = localStorage.getItem('userName');
    this.loginid = JSON.parse(localStorage.getItem('currentUser'));
    this.role = localStorage.getItem('AccessRole');
    this.module = localStorage.getItem('moduleselected');
    this.status = 1; this.device = null; this.subdevice = null;
    this.paginationPageSize = 10;
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
      edidviewCellRenderer: EdidviewCellRenderer,
      remarksviewCellRenderer: RemarksViewCellRenderer,
      regionsviewCellRenderer: SupportedRegionsViewCellRenderer
    };
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
    this.context = { componentParent: this };
  }

  ngOnInit() {
    let dataType = 5;
    let statusflag = this.status;
    let device = this.device;
    let subdevice = this.subdevice;
    this.mainService.getProjectNames(null, null, null, null, 'DBEU01001', 18)
      .subscribe(value => {
        let region = []; let a = []; let country = [];
        for (let i = 0; i < value.data.length; i++) {
          region.push(value.data[i]['region'])
        }
        region = region.filter(u => (u != null) && (u != 'NULL') && (u != ''));
        this.regionlist = region.filter((v, i, a) => a.indexOf(v) === i).sort();
        for (var j = 0; j < value.data.length; j++) {
          country.push(value.data[j]['country']);
        }
        country = country.filter(u => (u != null) && (u != 'NULL') && (u != ''));
        this.countrylist = country.filter((v, i, a) => a.indexOf(v) === i).sort();
      })
    this.rawdata(dataType, device, subdevice, statusflag);
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
      mainscroll();

    });
    var self = this;

    $('#button').click(function () {
      self.exporttostag(self.rowselected);
    })

    $('#single_download').click(function () {
      self.onBtnExport();
    })

    $('#add').click(function (e) {
      var model; var uid = []; let Regioncountrymodelconcat = []; let uidmodel = []; let region = []; let country = [];
      $('#model').each(function (i, elem) {
        model = ($(elem).val());
        if (model === '') {
          model = null
        }
      });

      $('#region').each(function (i, elem) {
        region = ($(elem).val());
      });
      $('#country').each(function (i, elem) {
        country = ($(elem).val());
      });
      if (region === null && model === null && country === null) {
        self.toastr.error('', 'Enter atleast Region or Country or Model');
      }
      else {
        Regioncountrymodelconcat.push(region + ' : ' + country + ' : ' + model + '; ');
        self.editedSupportedRegion = ((<HTMLInputElement>document.getElementById("myTextarea")).value + '\n' + Regioncountrymodelconcat).trim();
      }


    })

    $('#edit').click(function () {
      if ((<HTMLInputElement>document.getElementById("myTextarea")).disabled == true) {
        (<HTMLInputElement>document.getElementById("myTextarea")).disabled = false;
      }
      else {
        (<HTMLInputElement>document.getElementById("myTextarea")).disabled = true;
      }
    })

    this.saveEditRawData = this.fb.group({
      Device: ['', Validators.required],
      Subdevice: ['', Validators.required],
      Brand: ['', Validators.required],
      TargetModel: ['', Validators.required],
      TargetRegion: ['', null],
      TargetCountry: ['', null],
      RemoteModel: ['', null],
      CaptureCountry: ['', null],
      CaptureRegion: ['', null],
      CEC_Device: ['', null],
      VendorId: ['', null],
      Vendoridstring: ['', null],
      OSDString: ['', null],
      Edid: ['', null],
      Status: ['', null],
      Year: ['', null],
      Model: ['', null],
      Region: ['', null],
      Country: ['', null],
      Region_Country_Model: ['', null],
    });

  }

  edid(setEdid) {
    this.viewEdidData(setEdid['Edid']);
  };

  Remarks(setRemarks) {
    var ret = setRemarks['Remarks'].split(",")
    var str1 = ret[0];
    var str2 = ret[1];
    var str3 = ret[2];
    var str4 = ret[3];
    this.viewRemarks(str1, str2, str3, str4);
  };

  supportedregions(setregions) {
    this.viewSupportedregions(setregions['Supportedregions']);
  };


  RawdataView(ret) {
    let removespacetovendor = ret['Vendoridhex'].split(" ");
    let removespacetoosd = ret['Osdhex'].split(" ");
    let vendor = ''; let osd = '';

    for (let i = 0; i < removespacetovendor.length; i++) {
      vendor += removespacetovendor[i]
    }
    for (let i = 0; i < removespacetoosd.length; i++) {
      osd += removespacetoosd[i]
    }
    var str = ret['Detectionid'];
    var str1 = ret['Device'];
    var str2 = ret['Subdevice'];
    var str3 = ret['Brand'];
    var str4 = ret['Targetmodel'];
    var str5 = ret['TargetRegion'];
    var str6 = ret['TargetCountry'];
    var str7 = ret['Year'];
    var str8 = ret['Remotemodel'];
    var str9 = ret['Regionofcapture'];
    var str10 = ret['Countryofcapture'];
    var str11 = ret['CECDevice'];
    var str12 = ret['Cecpresent'];
    var str13 = ret['Cecenabled'];
    var str14 = vendor;
    var str15 = ret['Vendoridstring'];
    var str16 = ret['Osdstring'];
    var str17 = osd;
    var str18 = ret['Edid'];
    var str19 = ret['Sourcename'];
    var str20 = ret['Sourcetype'];
    var str21 = ret['Supportedregions'];
    var str22 = ret['Remarks'];
    var str23 = ret['Status'];
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
    if (str12 == 'Yes') {
      str12 = '1'
    }
    if (str12 == 'No') {
      str12 = '0'
    }
    if (str13 == 'Yes') {
      str13 = '1'
    }
    if (str13 == 'No') {
      str13 = '0'
    }
    if (str23 === 'Not Exported to Staging') {
      str23 = 1
    }
    if (str23 === 'Inactive') {
      str23 = 0
    }
    if (str23 === 'Exported to Staging') {
      str23 = 2
    }
    this.viewRawData(str, str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12, str13, str14, str15, str16, str17, str18, str19, str20, str21, str22, str23);

  }

  viewEdidData(value) {
    this.edidDataView = true;
    this.RemarksView = false;
    this.SupportedregionsView = false;
    this.EdidData = value;
  }

  viewDecodeEdidData(value, value1) {
    this.DecodeedidDataView = true;
    this.RemarksView = false;
    this.SupportedregionsView = false;
    this.keys = value;
    this.Values = value1;
  }

  viewRemarks(value1, value2, value3, value4) {
    this.RemarksView = true;
    this.edidDataView = false;
    this.SupportedregionsView = false;
    this.Metadata = value1;
    this.CEC = value2;
    this.EDID = value3;
    this.Scandevice = value4;

  }

  viewSupportedregions(value) {
    this.SupportedregionsView = true;
    this.RemarksView = false;
    this.edidDataView = false;
    this.Supportedregions = value;
  }

  viewRawData(value, value1, value2, value3, value4, value5, value6, value7, value8, value9, value10, value11, value12, value13, value14, value15, value16, value17, value18, value19, value20, value21, value22, value23) {
    this.editedDevice = value1;
    this.editedSubdevice = value2;
    this.editedBrand = value3;
    this.editedModel = value4;
    this.editedRegion = value5;
    this.editedCountry = value6;
    this.editedRemoteModel = value8;
    this.editedCaptureRegion = value9;
    this.editedCaptureCountry = value10;
    this.editYear = value7;
    this.editedCEC_Device = value11;
    this.editcecPresent = value12;
    this.editcecEnabled = value13;
    this.editedVendor = value14;
    this.editedVendorstr = value15;
    this.editedOSD = value16;
    this.editedEDID128 = value18;
    this.sourcetype = value20;
    this.sourcename = value19;
    this.editedSupportedRegion = value21;
    this.remarks = value22;
    this.editedStatus = value23;
    this.recordId = value;
  }

  getTabResponseData(device, subdevice, statusflag) {
    let dataType = 5;
    this.rawdata(dataType, device, subdevice, statusflag);

  }

  keyPressHandler(e) {
    if (e.keyCode === 32 && !e.target.value.length) {
      return false;
    }
  }

  modalClose() {
    this.Rawdatasubmitted = false;
    this.vendorError = false;
    this.edidError = false;
    this.saveEditRawData.reset();
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
    this.status = 1; this.device = null; this.subdevice = null;
    this.getTabResponseData(this.device, this.subdevice, this.status);
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

  rawdata(dataType, Device, Subdevice, statusflag) {
    this.mainService.RawToStaging(dataType, null, null, statusflag)
      .then(value => {
        let arr = []; let arr1 = []; let arr2 = []; let Remarks = []; let RegioncountryModel;
        let Region = [];
        if (value.data.length > 0 && value.data != '0' && value.data != null) {

          //convert  string to Object
          for (let i = 0, ien = value.data.length; i < ien; i++) {
            arr.push(JSON.parse(value.data[i]['sourceDataCapture']));
          }

          //Detectionid and Status
          for (let i = 0, ien = value.data.length; i < ien; i++) {
            arr1.push({ Detectionid: value.data[i]['detectionId'], Status: value.data[i]['statusFlag'] });
          }

          //Remarks
          for (let i = 0; i < arr.length; i++) {
            Remarks.push(arr[i]['Remarks']);
          }

          //Supported Region Country Model
          arr.forEach(element => {
            let RegionCountry = "";
            element.Supportedregions.forEach(element1 => {
              let Countries = element1.Countries;
              Countries.forEach(element3 => {
                RegionCountry += element1.Region + " : ";
                RegionCountry += element3.Country + " : "
                element3.Models.forEach(element4 => {
                  RegionCountry += element4 + ","
                });
                RegionCountry = RegionCountry.slice(0, -1)
                RegionCountry += " ; "
              });
              // RegionCountry=RegionCountry.slice(0,-1)
              // RegionCountry+=";"
            });

            // RegionCountry+=element.TargetRegion+" : "+element.TargetCountry+" : "+element.Targetmodel+" ;"
            RegionCountry = RegionCountry.trim().slice(0, -1)

            Region.push(RegionCountry)
          });


          for (let i = 0; i < arr1.length; i++) {
            if (arr[i]['Cecpresent'] === '1' || arr[i]['Cecpresent'] === 1) {
              arr[i]['Cecpresent'] = 'Yes'
            }
            if (arr[i]['Cecpresent'] === '0' || arr[i]['Cecpresent'] === 0) {
              arr[i]['Cecpresent'] = 'No'
            }
            if (arr[i]['Cecenabled'] === '1' || arr[i]['Cecenabled'] === 1) {
              arr[i]['Cecenabled'] = 'Yes'
            }
            if (arr[i]['Cecenabled'] === '0' || arr[i]['Cecenabled'] === 0) {
              arr[i]['Cecenabled'] = 'No'
            }
            if (arr1[i]['Status'] === '0' || arr1[i]['Status'] === 0) {
              arr1[i]['Status'] = 'Inactive'
            }
            if (arr1[i]['Status'] === '1' || arr1[i]['Status'] === 1) {
              arr1[i]['Status'] = 'Not Exported to Staging'
            }
            if (arr1[i]['Status'] === '2' || arr1[i]['Status'] === 2) {
              arr1[i]['Status'] = 'Exported to Staging'
            }
            arr2.push({
              Detectionid: arr1[i]['Detectionid'], Device: arr[i]['Device'].toUpperCase(), Subdevice: arr[i]['Subdevice'], Brand: arr[i]['Brand'], Targetmodel: arr[i]['Targetmodel'], TargetRegion: arr[i]['TargetRegion'], TargetCountry: arr[i]['TargetCountry'],
              Year: arr[i]['Year'], Remotemodel: arr[i]['Remotemodel'], Regionofcapture: arr[i]['Regionofcapture'], Countryofcapture: arr[i]['Countryofcapture'],
              CECDevice: arr[i]['CECDevice'], Cecpresent: arr[i]['Cecpresent'], Cecenabled: arr[i]['Cecenabled'], Vendoridhex: arr[i]['Vendoridhex'], Vendoridstring: arr[i]['Vendoridstring'], Osdstring: arr[i]['Osdstring'], Osdhex: arr[i]['Osdhex'], Edid: arr[i]['Edid'],
              Sourcename: arr[i]['Sourcename'], Sourcetype: arr[i]['Sourcetype'],
              Supportedregions: Region[i],
              Remarks: Remarks[i]['MetaData'] + "," + Remarks[i]['CEC'] + "," + Remarks[i]['EDID'] + "," + Remarks[i]['Scan Device'],
              Status: arr1[i]['Status']
            });
          }

          arr2.forEach(element => {
            let addspacetovendor = ''; let addspacetoosd = ''
            for (let i = 0; i < element['Vendoridhex'].length; i = i + 2) {
              addspacetovendor += element['Vendoridhex'].substr(i, 2) + " "
            }
            element['Vendoridhex'] = addspacetovendor.trim();
            for (let i = 0; i < element['Osdhex'].length; i = i + 2) {
              addspacetoosd += element['Osdhex'].substr(i, 2) + " "
            }
            element['Osdhex'] = addspacetoosd.trim();
          });

          let device = []; let subdevice = []; let Status = [];
          for (let i = 0; i < arr2.length; i++) {
            device.push(arr2[i]['Device']);
          }
          for (let i = 0; i < arr2.length; i++) {
            Status.push(arr2[i]['Status']);
          }
          this.filter_Device = device.filter((v, i, a) => a.indexOf(v) === i);
          this.filter_Status = Status.filter((v, i, a) => a.indexOf(v) === i);
          subdevice = arr2.filter(u => u.Device === Device)
          let subdevicefilter = [];
          for (let i = 0; i < subdevice.length; i++) {
            subdevicefilter.push(subdevice[i]['Subdevice']);
          }
          this.filter_Subdevice = subdevicefilter.filter((v, i, a) => a.indexOf(v) === i);

        }
        if (Device === null && Subdevice === null) {
          this.rawdatacapture = arr2;
        }
        else if (Device === null && Subdevice != null) {
          this.rawdatacapture = arr2.filter(u => u.Subdevice === Subdevice);
        }
        else if (Device != null && Subdevice === null) {
          this.rawdatacapture = arr2.filter(u => u.Device === Device);
        }
        else if (Device != null && Subdevice != null) {
          this.rawdatacapture = arr2.filter(u => u.Device === Device && u.Subdevice === Subdevice);
        }
        this.viewdata();

      });


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

  get m() { return this.saveEditRawData.controls; }
  onsaveEditRawSubmit() {
    this.Rawdatasubmitted = true;
    if (this.saveEditRawData.invalid) {
      return;
    }
    this.cecEdidValidate();
    // if ((this.editedVendor != undefined && this.editedVendor != '') || (this.editedOSD != undefined && this.editedOSD != '') || (this.editedEDID128 != undefined && this.editedEDID128 != '')) {
    //   var edid128 = this.editedEDID128;
    //   if (edid128 != null && edid128 != '' && edid128 != undefined) {
    //     let checkEdidData = ((edid128.startsWith('00 FF FF FF FF FF FF 00') || edid128.startsWith('00 ff ff ff ff ff ff 00')) && edid128.length >= 383);
    //     if (!checkEdidData) {
    //       this.edidError = true;
    //       this.Rawdatasubmitted = false;
    //     }
    //     else {
    //       $('#checkEdidValid').css('border', '1px solid #ced4da');
    //       this.edidError = false;
    //       
    //     }
    //   }
    //   else {
    //     $('#checkEdidValid').css('border', '1px solid #ced4da');
    //     this.edidError = false;
    //     this.cecEdidValidate();
    //   }

    // } else {
    //   this.toastr.error('', 'Enter Vendorid or OSD or EDID', { timeOut: 4000 })
    // }
  }

  /** Vendor Validation in CEC EDID add Option start **/
  vendorMod() {
    if (this.editedVendor != undefined && this.editedVendor != null) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if (this.editedOSD != undefined && this.editedOSD != null) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if (this.editedEDID128 != undefined && this.editedEDID128 != null) {
      this.vendorError = false;
      $('#checkInputValid').css('border', '1px solid #ced4da');
    }
    if (this.editedEDID128 != undefined) {
      let checkEdid = ((this.editedEDID128.includes('00 FF FF FF FF FF FF 00') || this.editedEDID128.includes('00 ff ff ff ff ff ff 00')) && this.editedEDID128.length >= 383);
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
    let device = this.editedDevice; let brand = this.editedBrand; let model = this.editedModel;
    let subdevice = this.editedSubdevice; let year = this.editYear;
    let id = parseInt(this.recordId); let Region = this.editedRegion; let Country = this.editedCountry;
    let Remotemodel = this.editedRemoteModel;
    let CaptureRegion = this.editedCaptureRegion; let CaptureCountry = this.editedCaptureCountry;
    let CEC_device = this.editedCEC_Device;
    let vendoridHex = this.editedVendor; let Vendoridstring = this.editedVendorstr;

    let status = parseInt(this.editedStatus); let Crudtype = 2;

    if (this.editedVendor != undefined || this.editedOSD != undefined || this.editedEDID128 != undefined) {
      let edid;
      if (this.editedEDID128 == undefined) {
        edid = null;
      } else {
        edid = this.editedEDID128;
      }

      let vendorid; let osdstr;
      if (this.editedVendor == undefined) {
        vendorid = null;
      } else {
        vendorid = this.editedVendor;
      }

      let iscecpresent = parseInt(this.editcecPresent);
      let iscecenabled = parseInt(this.editcecEnabled);
      let osd;
      if (this.editedOSD != undefined && this.editedOSD != null) {
        osd = this.convertHexa(this.editedOSD);
      } else {
        osd = null;
      }
      if (this.editedOSD == undefined || this.editedOSD == null) {
        osdstr = null;
      } else {
        osdstr = this.editedOSD;
      }


      let r = this.editedSupportedRegion;
      // let r1 = r.split(';').filter(u => u != " ");
      let r1 = r.split(';').filter(u => (u.trim() != " " && u.trim() != ""));
      let rcm2 = []; let rcm3 = []; let country1 = []; let Region1 = []; let Region2 = []; let Supportedregions = []; let reg = [];
      if (r1.length === 1 && r1[0] === '') {
        Supportedregions = [];
      }
      else {
        for (let i = 0; i < r1.length; i++) {
          rcm2.push(r1[i].split(':'));
        }
        for (let j = 0; j < rcm2.length; j++) {
          if (rcm2[j][0] === undefined || rcm2[j][0] === '  ') {
            Region1.push('');
          } else {
            Region1.push(rcm2[j][0].trim());
          }
        }
        Region2 = Region1.filter((v, i, a) => a.indexOf(v) === i);
        for (let j = 0; j < rcm2.length; j++) {
          if (rcm2[j][1] === undefined || rcm2[j][1] === '  ') {
            country1.push('');
          } else {
            country1.push(rcm2[j][1].trim());
          }
        }
        for (let j = 0; j < rcm2.length; j++) {
          if (rcm2[j][2] === undefined || rcm2[j][2] === '  ') {
            rcm3.push('');
          } else {
            rcm3.push(rcm2[j][2].trim().split(',').filter((v, i, a) => a.indexOf(v) === i));
          }
        }

        for (let i = 0; i < rcm2.length; i++) {
          // reg.push({Region:rcm2[i][0].trim(),Country:rcm2[i][1].trim(),Models:rcm3[i]})
          reg.push({ Region: rcm2[i][0].trim(), Country: country1[i], Models: rcm3[i] });
        }
        let groupBy = (array, key) => {
          return array.reduce((result, currentValue) => {
            (result[currentValue.Region] = result[currentValue.Region] || [])
              .push({ "Country": currentValue.Country, "Models": currentValue.Models });
            return result;
          }, {});
        };

        let personGroupedByColor = groupBy(reg, "Region");
        for (let i = 0; i < Region2.length; i++) {
          Supportedregions.push({ Region: Region2[i], Countries: personGroupedByColor[Region2[i]] })
        }
      }
      let Remarks = [];
      let remarksplit = this.remarks.split(',');
      Remarks.push({ MetaData: remarksplit[0], CEC: remarksplit[1], EDID: remarksplit[2], "Scan Device": remarksplit[3] })
      let Json = {
        "Device": device,
        "Subdevice": subdevice,
        "Brand": brand,
        "Targetmodel": model,
        "TargetRegion": Region,
        "TargetCountry": Country,
        "Year": year,
        "Remotemodel": Remotemodel,
        "Regionofcapture": CaptureRegion,
        "Countryofcapture": CaptureCountry,
        "Supportedregions": Supportedregions,
        "Remarks": Remarks[0],
        "CECDevice": CEC_device,
        "Cecpresent": iscecpresent,
        "Cecenabled": iscecenabled,
        "Vendoridhex": vendoridHex,
        "Vendoridstring": Vendoridstring,
        "Osdstring": osdstr,
        "Osdhex": osd,
        "Edid": this.editedEDID128,
        "Sourcename": this.sourcename,
        "Sourcetype": this.sourcetype
      };
      this.mainService.LoadDetectionInJSON(CEC_device, device, brand, model, Json, status, id, Crudtype)
        .then(value => {
          if (value.statusCode == "200" && value.status == "success") {
            this.toastr.success(value.message, '');
            $("#edidRawModal .close").click();
            let loginid = this.loginid['data'][0]['loginId'];
            let log = '' + JSON.stringify(Json) + ':- Record updated successfully (Raw Data Capture)'
            this.mainService.Genericlog(1, loginid, log).then(value => {

            })
            this.refreshScreen();
          } else {
            this.toastr.warning(value.message, '');
          }
        })
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

  onRowClicked() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    this.rowselected = selectedData;
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
    this.searchValue = null
    this.defaultColDef = {
      width: 100
    };
    this.columnDefs = [
      { headerName: "Device", field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Subdevice", field: "Subdevice", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Brand", field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Targetmodel", field: "Targetmodel", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "TargetRegion", field: "TargetRegion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "TargetCountry", field: "TargetCountry", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Year", field: "Year", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Remotemodel", field: "Remotemodel", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Regionofcapture", field: "Regionofcapture", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Countryofcapture", field: "Countryofcapture", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "CECDevice", field: "CECDevice", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Cecpresent", field: "Cecpresent", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Cecenabled", field: "Cecenabled", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Vendoridhex", field: "Vendoridhex", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Vendoridstring", field: "Vendoridstring", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Osdstring", field: "Osdstring", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Osdhex", field: "Osdhex", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Edid", field: "Edid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "edidviewCellRenderer" },
      { headerName: "Sourcename", field: "Sourcename", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Sourcetype", field: "Sourcetype", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Supportedregions", field: "Supportedregions", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "regionsviewCellRenderer" },
      { headerName: "Remarks", field: "Remarks", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "remarksviewCellRenderer" },
      { headerName: "Status", field: "Status", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Select All", field: "Select All", resizable: true, sortable: true, checkboxSelection: true, headerCheckboxSelection: true, minWidth: 130, headerCheckboxSelectionFilteredOnly: true },
      { headerName: "Action", field: "Status", resizable: true, cellRenderer: "btnCellRenderer", minWidth: 130 }
    ];
    this.rowData = this.rawdatacapture;
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
          this.columnDefs = this.columnDefs.filter(u => u.headerName != 'Select All' && u.headerName != 'Action');
          $('#single_download').hide();
          $('#button').hide();
        }
        if ((permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0) ||
          (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0)) {
          this.columnDefs = this.columnDefs.filter(u => u.headerName != 'Select All' && u.headerName != 'Action');
          $('#single_download').show();
          $('#button').hide();
        }
        if ((permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
          (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1)) {
          this.columnDefs = this.columnDefs;
          $('#single_download').show();
          $('#button').show();
        }
        console.log(permission)
      })

  }

  search() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  exporttostag(selectedrecords) {
    this.spinnerService.show();
    let RegioncountryModel; let Region = []; let arr2 = []; let split = [];
    if (selectedrecords === undefined || selectedrecords.length === 0) {
      this.spinnerService.hide();
      this.toastr.warning('', 'No records Selected');
    }
    else {
      let t1 = []; let stagingdatawithsingleuid: any;
      selectedrecords.forEach(element => {
        if (element['Cecpresent'] === 'Yes') {
          element['Cecpresent'] = 1
        }
        if (element['Cecpresent'] === 'No') {
          element['Cecpresent'] = 0
        }
        if (element['Cecenabled'] === 'Yes') {
          element['Cecenabled'] = 1
        }
        if (element['Cecenabled'] === 'No') {
          element['Cecenabled'] = 0
        }
        if (element['Status'] === 'Not Exported to Staging') {
          element['Status'] = 1
        }
        if (element['Status'] === 'Inactive') {
          element['Status'] = 0
        }
        if (element['Status'] === 'Exported to Staging') {
          element['Status'] = 2
        }
      });
      t1 = selectedrecords.filter(u => u['Status'] === 1);
      if (t1.length === 0) {
        this.spinnerService.hide();
        this.toastr.warning('', 'Select valid records');
        location.reload();
      }
      else {
        for (let i = 0; i < t1.length; i++) {
          RegioncountryModel = '';
          if (t1[i]["Supportedregions"].length === 0) {
            RegioncountryModel += t1[i].TargetRegion + " : " + t1[i].TargetCountry + " : " + t1[i].Targetmodel + " : " + t1[i].Detectionid + ";"
            RegioncountryModel = RegioncountryModel.slice(0, -1);
            Region.push(RegioncountryModel)
          }
          else {
            split = t1[i]["Supportedregions"].split(';');
            for (let j = 0; j < split.length; j++) {
              RegioncountryModel += split[j];
              RegioncountryModel += ' : ';
              RegioncountryModel += t1[i]['Detectionid'];
              RegioncountryModel += '; ';
            }
            // RegioncountryModel = RegioncountryModel.slice(0, -5);
            if (RegioncountryModel === undefined || RegioncountryModel === ' : ' + t1[i]['Detectionid'] + '; ') {
              RegioncountryModel = '' + ';';
            }
            RegioncountryModel = RegioncountryModel.slice(0, -1);
            RegioncountryModel += t1[i].TargetRegion + " : " + t1[i].TargetCountry + " : " + t1[i].Targetmodel + " : " + t1[i].Detectionid + ";"
            RegioncountryModel = RegioncountryModel.slice(0, -1);
            Region.push(RegioncountryModel)
          }
        }

        for (let i = 0; i < t1.length; i++) {
          arr2.push({
            Detectionid: t1[i]['Detectionid'], Device: t1[i]['Device'], Subdevice: t1[i]['Subdevice'], Brand: t1[i]['Brand'], Targetmodel: t1[i]['Targetmodel'], TargetRegion: t1[i]['TargetRegion'], TargetCountry: t1[i]['TargetCountry'],
            Year: t1[i]['Year'], Remotemodel: t1[i]['Remotemodel'], Regionofcapture: t1[i]['Regionofcapture'], Countryofcapture: t1[i]['Countryofcapture'],
            CECDevice: t1[i]['CECDevice'], Cecpresent: t1[i]['Cecpresent'], Cecenabled: t1[i]['Cecenabled'], Vendoridhex: t1[i]['Vendoridhex'], Vendoridstring: t1[i]['Vendoridstring'], Osdstring: t1[i]['Osdstring'], Osdhex: t1[i]['Osdhex'], Edid: t1[i]['Edid'],
            Sourcename: t1[i]['Sourcename'], Sourcetype: t1[i]['Sourcetype'],
            Supportedregions: Region[i], Status: t1[i]['Status']
          });
        }

        for (let i = 0; i < arr2.length; i++) {
          this.mainService.getRemoteUID(arr2[i]['Brand'], arr2[i]['Targetmodel'].toString(), arr2[i]['Device'])
            .subscribe(value => {
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
                this.singleUid = UpdatedUIDs.toString();
              }
              stagingdatawithsingleuid = {
                device: arr2[i]['Device'], subdevice: arr2[i]['Subdevice'], brand: arr2[i]['Brand'], model: arr2[i]['Targetmodel'],
                year: arr2[i]['Year'] + ':' + arr2[i]['Detectionid'], cecpresent: arr2[i]['Cecpresent'],
                cecenabled: arr2[i]['Cecenabled'], vendoridhex: arr2[i]['Vendoridhex'], vendorid: arr2[i]['Vendoridstring'],
                osdhex: arr2[i]['Osdhex'], osd: arr2[i]['Osdstring'], edid: arr2[i]['Edid'], regioncountrymodelref: arr2[i]['Supportedregions'],
                detectionid: arr2[i]['Detectionid'], stagingid: 0, uid: this.singleUid
              };
              let dataType = 1
              let jsondata = [];
              jsondata.push(stagingdatawithsingleuid)
              this.mainService.RawToStaging(dataType, jsondata, null, null)
                .then(value => {
                  if (value.message === 'SUCCESS' && value.data != '' && value.data != '0') {
                    this.successinsert++;
                  }
                  else {
                    this.failedinsert++;
                  }
                  let loginid = this.loginid['data'][0]['loginId'];
                  let log = '' + JSON.stringify(stagingdatawithsingleuid) + ':-' + ' Record inserted from Raw to Staging '
                  this.mainService.Genericlog(1, loginid, log).then(value => {
                  })
                  if (arr2.length === this.successinsert + this.failedinsert) {
                    this.spinnerService.hide();
                    if (this.successinsert != 0) {
                      this.toastr.success('', this.successinsert + ' ' + 'Records inserted Successfully');
                      this.toastr.error('', this.failedinsert + ' ' + 'Records failed to insert');
                      location.reload();
                    }
                  }
                });
            })

        }
      }



    }

  }

  methodFromParent(cell) {
    this.RawdataView(cell)
    $('#editRawdata').click();
  }

  methodFromParent_viewSupportedRegion(cell) {
    this.supportedregions(cell)
  }

  methodFromParent_viewRemarks(cell) {
    this.Remarks(cell);
  }

  methodFromParent_viewEdid(cell) {
    this.edid(cell);
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
      columnKeys: filteredcolumns,
      allColumns: false,
      fileName: "Raw Capture Data",
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
