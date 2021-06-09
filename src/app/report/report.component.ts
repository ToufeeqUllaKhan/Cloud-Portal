import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainService } from '../services/main-service';
import { Router } from '@angular/router';
import { User } from '../model/user';
declare var $: any;
import 'datatables.net';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDatepickerConfig, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { EdidviewCellRenderer } from "../brand-library/edidview-cell-renderer.component";
import mainscroll from '../model/Scroll';
declare let alasql;
var lodash = require('lodash');

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {


  searchForm: FormGroup;
  projects: Array<any> = [];
  dropdownSettings: any = {}; columnSettings: any = {}; ShowFilter = false;
  limitSelection = false;
  projectNames: any = []; selectedItems: Array<any> = [];
  user: User = new User();
  api_list: any = null; device_list: any = null;
  tabsProject: any; tabslist = [];
  from_date: any; to_date: any;
  SearchData = []; mainArr = [];
  dtOptions: DataTables.Settings = {};
  isTableVisible: Boolean = false; isRegistration: Boolean = false;
  isLogin: Boolean = false; isDownBin: Boolean = false; isDownZip: Boolean = false;
  isDeltaSearch: Boolean = false;
  registerProjectName: any; registerDbversion: any; registerAuthkey: any;
  registerBoxid: any; loginsessionToken: any; binProjectName: any; binDbversion: any;
  binsignatureKey: any; binBoxid: any; binChecksum: any; zipProjectName: any; zipsignatureKey: any;
  zipDbversion: any; zipBoxid: any; zipChecksum: any; modelDevice: any; modelBrand: any; modelValue: any;
  modelEdid: any; autoDevice: any; autoVendorId: any; autoOSD: any; autoEdid: any;
  noData: Boolean = false; versions = []; versionArr = []; deviceArr = [];
  db_version: any = null; boxids = [];
  valuedate = new Date();
  startdate: any; projArr = []; dbPaths = [];
  maxDate: any; minDate: { year: number, month: number, day: number };
  minDates: any; setApiName: any; boxIdName: any; recordDate: any;
  arrayJsonData = []; excelFromDate: any; excelToDate: any;
  isSearchDataVisible: Boolean = true; pushData = [];


  resultProjArr = []; Datatype: Number; brand_list: any = null; brands = []; bname: any = [];
  SelectedBrandName: any; dataMainArr = []; tabValue = []; changeVersionCount: any;
  oldValue: string; previous: any; selectPrev: any; count: any = 0; modalCount: any = 0;
  currentVal: any; finalArray = []; recordId: any; ProjectList = [];
  switchRoute: any;
  isregisteredBoxId: Boolean = true; ismodelSearch: Boolean = true;
  ismostSearchedBrand: Boolean = true; isautoSearch: Boolean = true;
  isbinDownload: Boolean = true; iszipDownload: Boolean = true;
  isfeedbackAPI: Boolean = true; isgenericLog: Boolean = true;
  isRegisteredBoxId: Boolean = false; isModelSearch: Boolean = false;
  isMostSearchedBrand: Boolean = false; isAutoSearch: Boolean = false;
  isBINDownload: Boolean = false; isZIPDownload: Boolean = false;
  isFeedbackAPI: Boolean = false; isGenericLog: Boolean = false;
  edidDataView: Boolean = false; edid128DataView: Boolean = false; EdidData: any; parameters: any;

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
  datasource: any;
  checked: boolean;
  portal: Boolean;
  role: string;
  module: string;
  report_visiblity: any = [];
  columns_visible: any = [];
  columns: any = [];
  constructor(private fb: FormBuilder, private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private config: NgbDatepickerConfig, private calender: NgbCalendar, private titleService: Title) {
    this.titleService.setTitle('Reports');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.role = localStorage.getItem('AccessRole');
    this.module = localStorage.getItem('moduleselected')
    /** To set month 1st date to today date */
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.from_date = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: 1
    }
    this.to_date = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    }

    this.frameworkComponents = {
      edidviewCellRenderer: EdidviewCellRenderer

    };
    this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
    this.context = { componentParent: this };
    this.spinnerService.hide();
  }


  ngOnInit(): void {
    /** To set month 1st date to today date and validations to block future date */
    var d = new Date();
    var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    this.minDates = {
      year: firstDay.getFullYear(),
      month: firstDay.getMonth() + 1,
      day: firstDay.getDate()
    };

    this.searchForm = this.fb.group({
      fromDate: ['', null],
      toDate: ['', null]
    });

    /** List of selected projects in previous route */
    this.switchRoute = localStorage.getItem('logSelected');
    /** list of selected projects in previous page **/
    var updateBrandsProjects = JSON.parse(localStorage.getItem('updatedBrandProjects'));
    var getClientProjects = JSON.parse(localStorage.getItem('configureProjectNames'));
    var getReloadedProject = JSON.parse(localStorage.getItem('reloadedProjects'));
    // var getClientProjects = JSON.parse(localStorage.getItem('choosenProjects'));
    let projectNames: any;
    if (getClientProjects != null) {
      projectNames = getClientProjects;
    }
    // this.projectNames.push(projectNames)
    this.projectNames = projectNames;
    var getName = localStorage.getItem('selectedBrand');
    if (getName != '') {
      this.SelectedBrandName = getName;
    }
    /** List of Projects */
    let dataType = 1;
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {
        this.mainArr = value.data;
        this.mainArr.forEach(element => {
          element['projectname'] = element['dbinstance'] + '_' + element['projectname']
        })
        const unique = [...new Set(this.mainArr.map(item => item.projectname))];
        let arrData = []; let arrData_1 = [];
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
    this.spinnerService.hide();
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

    this.mainService.getProjectNames(null, null, null, null, null, 1)
      .subscribe(value => {
        let ProjectName; let resultFetchArr: any; let resultArray: any;
        resultArray = value.data;
        resultArray.forEach(element => {
          element['projectname'] = element['dbinstance'] + '_' + element['projectname']
        });
        if (this.projectNames[0]['item_text'] != undefined) {
          ProjectName = this.projectNames[0]['item_text'];
        } else {
          ProjectName = this.projectNames[0]
        }
        resultFetchArr = resultArray.filter(u => (u.projectname == ProjectName));
        let Dbname = resultFetchArr[0]['dbPath'];
        if (ProjectName.startsWith(Dbname + '_')) {
          ProjectName = ProjectName.replace(Dbname + '_', '')
        }
        let dataType = 0; let arr = [];
        this.mainService.getSearchDetails(Dbname, null, null, null, dataType)
          .then(value => {
            if (value.data.length != 0) {
              value.data = value.data.filter(function (obj) {
                return obj.dataType !== 5 && obj.dataType !== 9;
              });
            }
            for (let i = 0; i < value.data.length; i++) {
              arr.push({ ticketName: value.data[i]['description'], description: value.data[i]['description'] });
            }
            this.brands = arr;
          })
      });
    var searchBrand = localStorage.getItem('selectedBrand');
    if (searchBrand != undefined && searchBrand != '') {
      this.brand_list = searchBrand;
      this.previous = this.brand_list;
    }
    this.selectDatatype();
    let Projectname = this.projectNames;
    this.tabslist = Projectname;
    this.mainService.getProjectNames(null, null, null, null, null, 1)
      .subscribe(value => {
        let StartDate;
        let EndDate;
        if (this.from_date != null && this.to_date != null) {
          if (typeof this.from_date === 'string' || this.from_date instanceof String) {
            StartDate = this.from_date;
          } else {
            var modFromDate = this.from_date;
            var FromDate = modFromDate.year + '-' + modFromDate.month + '-' + modFromDate.day;
            StartDate = FromDate;
          }
          if (typeof this.to_date === 'string' || this.to_date instanceof String) {
            EndDate = this.to_date;
          } else {
            var modEndDate = this.to_date;
            var ModifiedEndDate = modEndDate.year + '-' + modEndDate.month + '-' + modEndDate.day;
            EndDate = ModifiedEndDate;
          }

          let ProjectName; let resultFetchArr: any; let resultArray: any;
          resultArray = value.data;
          resultArray.forEach(element => {
            element['projectname'] = element['dbinstance'] + '_' + element['projectname']
          });
          if (this.projectNames[0]['item_text'] != undefined) {
            ProjectName = this.projectNames[0]['item_text'];
          } else {
            ProjectName = this.projectNames[0]
          }
          resultFetchArr = resultArray.filter(u => (u.projectname == ProjectName));
          this.resultProjArr = resultFetchArr;

          let datatype;
          let dataTypeSelection = 0;
          if (this.Datatype == 1) {
            dataTypeSelection = 1;
          }
          if (this.Datatype == 2) {
            dataTypeSelection = 2;
          }
          if (this.Datatype == 3) {
            dataTypeSelection = 3;
          }
          if (this.Datatype == 4) {
            dataTypeSelection = 4;
          }
          if (this.Datatype == 6) {
            dataTypeSelection = 6;
          }
          if (this.Datatype == 7) {
            dataTypeSelection = 7;
          }
          if (this.Datatype == 8) {
            dataTypeSelection = 8;
          }
          if (this.Datatype == 10) {
            dataTypeSelection = 10;
          }
          if (this.Datatype == 11) {
            dataTypeSelection = 11;
          }

          // let searchDbname: any = this.mainArr.filter(u => u.projectname == this.projectNames[0]['item_text']);
          // let dbame = searchDbname[0]['dbPath'];
          // let projectname = this.projectNames[0]['item_text'];
          let dbname = this.resultProjArr[0]['dbPath'];
          let projectname = this.resultProjArr[0]['projectname'];
          if (projectname.startsWith(dbname + '_')) {
            projectname = projectname.replace(dbname + '_', '')
          }
          datatype = dataTypeSelection;
          this.excelFromDate = StartDate;
          this.excelToDate = EndDate;
          console.log(dbname, projectname, StartDate, EndDate, datatype)
          let search = {
            "value": '',
            "regex": false
          }
          let order = [
            {
              "column": 0,
              "dir": "asc"
            }
          ];
          this.mainService.getSearchDetails(dbname, projectname, StartDate, EndDate, datatype)
            .then(
              // this.mainService.GetPaginatedProductionDBStats(dbname, projectname, StartDate, EndDate, 1, 10, search, order, datatype)
              //   .subscribe
              value => {
                let temp = parseInt(value.recordsTotal);
                let parameter = [dbname, projectname, StartDate, EndDate, 1, temp, search, order, datatype]
                this.parameters = parameter;
                this.viewdata();
                this.refreshScreen();
              })
          if (this.SelectedBrandName != '') {
            $("select").prop("disabled", false);
            $("a").css('pointer-events', 'auto');
          } else {
            this.spinnerService.hide();
            $("select").prop("disabled", false);
            $("a").css('pointer-events', 'auto');
          }
        }
      })
    var self = this;
    $('#single_download').click(function () {
      self.onBtnExport();
    })
    $('#column_visible').click(function (e) {
      if (!($('.tab-content .dropdown-list').hasClass('hidden'))) {
        $('.tab-content .dropdown-list').css('width', 'auto')
      }
      self.columnvisiblity();
    })
    mainscroll();
  }

  ViewEdid(setEdid) {
    this.viewEdidData(setEdid);
  };

  viewEdidData(value) {
    this.edidDataView = true;
    this.edid128DataView = false;
    this.EdidData = value;
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

  /** Onclick of date validate for blocking future date  */
  setMinDate(event) {

    if (this.from_date instanceof Object) {
      this.minDates = this.from_date;
    }
  }

  onDateSelect(event) {
    if (event instanceof Object) {
      this.minDates = event;
    }
  }

  /** Project Selection */
  async onProjectSelect(e) {
    if (this.projectNames.length > 0) {
      this.isSearchDataVisible = true;
      this.device_list = [];
      this.versions = [];
      let projectSelectedList = [];
      let datatype = 1;
      await this.mainService.getProjectNamesWaitReq(null, null, null, null, null, datatype)
        .then(value => {
          let resultArray: any;
          resultArray = value.data;
          resultArray.forEach(element => {
            element['projectname'] = element['dbinstance'] + '_' + element['projectname']
          });
          for (var i = 0; i < this.projectNames.length; i++) {
            let ProjectName; let filterClient: any;
            if (this.projectNames[i]['item_text'] != undefined) {
              ProjectName = this.projectNames[i]['item_text'];
            } else {
              ProjectName = this.projectNames[i]
            }
            filterClient = resultArray.filter(u => (u.projectname == ProjectName));
            this.projArr.push(filterClient);
            projectSelectedList.push(this.projectNames[i]['item_text']);
          }
          this.tabslist = projectSelectedList;
          var resultproj = [];
          for (var j = 0; j < this.projArr.length; j++) {
            resultproj = resultproj.concat(this.projArr[j]);
          }
          this.projArr = resultproj;
        });
    } else {
      this.isSearchDataVisible = false;
      $('.hideData').css('display', 'none');
      $('.tabView').css('display', 'none');
      $('.col-lg-12').css('display', 'none');
      $('#single_download').hide();
      $('#all_download').hide();
      this.toastr.warning('Please Select Project to proceed further');
    }
  }

  dashboard() {
    this.router.navigate(['/dashboard'])
      .then(() => {
        location.reload();
      });
  }

  changeProject() {
    let pushArr = [];
    this.projectNames.forEach(function (value) {
      pushArr.push(value['item_text'])
    });
    this.tabslist = pushArr;
    if (this.projectNames.length == 0) {
      this.isSearchDataVisible = false;
      this.noData = true;
      $('.hideData').css('display', 'none');
      $('.tabView').css('display', 'none');
      $('.col-lg-12').css('display', 'none')
      $('#single_download').hide();
      $('#all_download').hide();
      this.toastr.warning('Please Select the Project to Activate the fields', '');
    }
    else {
      this.noData = false;
      $('.hideData').css('display', 'block');
      $('.tabView').css('display', 'block');
      $('.col-lg-12').css('display', 'block');
      $('#single_download').show();
      $('#all_download').show();
      $('.nav-item').removeClass('active');
      $('a#nav-home-tab0').addClass('active');
      this.isSearchDataVisible = true;
      this.getTabName(this.projectNames[0]['item_text']);
      this.onProjectSelect(this.tabslist[0]);
    }
  }

  /** Search History Submit operation */
  SearchHistory() {
    this.spinnerService.hide();
    // if (this.checked === true) {
    //   $('input[type="checkbox"]:not(:checked)').trigger('click');
    // } else {
    //   $('input[type="checkbox"]:checked').trigger('click');
    // }
    let StartDate;
    let EndDate;
    if (this.from_date != null && this.to_date != null) {
      if (typeof this.from_date === 'string' || this.from_date instanceof String) {
        StartDate = this.from_date;
      } else {
        var modFromDate = this.from_date;
        var FromDate = modFromDate.year + '-' + modFromDate.month + '-' + modFromDate.day;
        StartDate = FromDate;
      }
      if (typeof this.to_date === 'string' || this.to_date instanceof String) {
        EndDate = this.to_date;
      } else {
        var modEndDate = this.to_date;
        var ModifiedEndDate = modEndDate.year + '-' + modEndDate.month + '-' + modEndDate.day;
        EndDate = ModifiedEndDate;
      }
      let ProjectName; let searchDbname: any;
      ProjectName = this.tabsProject;
      searchDbname = this.mainArr.filter(u => (u.projectname == ProjectName));
      let dbname = searchDbname[0]['dbPath'];
      let projectname = searchDbname[0]['projectname'];
      if (projectname.startsWith(dbname + '_')) {
        projectname = projectname.replace(dbname + '_', '')
      }
      let datatype;
      let dataTypeSelection = 0;
      if (this.Datatype == 1) {
        dataTypeSelection = 1;
      }
      if (this.Datatype == 2) {
        dataTypeSelection = 2;
      }
      if (this.Datatype == 3) {
        dataTypeSelection = 3;
      }
      if (this.Datatype == 4) {
        dataTypeSelection = 4;
      }
      if (this.Datatype == 6) {
        dataTypeSelection = 6;
      }
      if (this.Datatype == 7) {
        dataTypeSelection = 7;
      }
      if (this.Datatype == 8) {
        dataTypeSelection = 8;
      }
      if (this.Datatype == 10) {
        dataTypeSelection = 10;
      }
      if (this.Datatype == 11) {
        dataTypeSelection = 11;
      }
      datatype = dataTypeSelection;
      this.excelFromDate = StartDate;
      this.excelToDate = EndDate;

      console.log(dbname, projectname, StartDate, EndDate, datatype)
      let search = {
        "value": '',
        "regex": false
      }
      let order = [
        {
          "column": 0,
          "dir": "asc"
        }
      ];
      this.mainService.getSearchDetails(dbname, projectname, StartDate, EndDate, datatype)
        .then(
          // this.mainService.GetPaginatedProductionDBStats(dbname, projectname, StartDate, EndDate, 1, 10, search, order, datatype)
          //   .subscribe(
          value => {
            let temp = parseInt(value.recordsTotal);
            let parameter = [dbname, projectname, StartDate, EndDate, 1, temp, search, order, datatype]
            this.parameters = parameter;
            this.viewdata();
          })
    }
  }

  async download() {
    this.spinnerService.show();
    let StartDate;
    let EndDate;
    if (this.from_date != null && this.to_date != null) {
      if (typeof this.from_date === 'string' || this.from_date instanceof String) {
        StartDate = this.from_date;
      } else {
        var modFromDate = this.from_date;
        var FromDate = modFromDate.year + '-' + modFromDate.month + '-' + modFromDate.day;
        StartDate = FromDate;
      }
      if (typeof this.to_date === 'string' || this.to_date instanceof String) {
        EndDate = this.to_date;
      } else {
        var modEndDate = this.to_date;
        var ModifiedEndDate = modEndDate.year + '-' + modEndDate.month + '-' + modEndDate.day;
        EndDate = ModifiedEndDate;
      }
      let ProjectName = this.projectNames[0]['item_text'];
      let searchDbname: any = this.mainArr.filter(u => (u.projectname == ProjectName));
      let dbname = searchDbname[0]['dbPath'];
      let projectname = searchDbname[0]['projectname'];
      if (projectname.startsWith(dbname + '_')) {
        projectname = projectname.replace(dbname + '_', '')
      }
      let datatype;
      let arr = [1, 2, 3, 4, 6, 7, 8, 10, 11];
      let pushData = [];
      this.excelFromDate = StartDate;
      this.excelToDate = EndDate;

      for (var i = 0; i < arr.length; i++) {
        datatype = arr[i];
        await this.mainService.getSearchDetails(dbname, projectname, StartDate, EndDate, datatype)
          .then(value => {
            const newArray = [];
            for (var j = 0; j < value.data.length; j++) {
              const keys = Object.keys(value.data[j])
              const newObject = {};
              keys.forEach(key => {
                const newKey = key.charAt(0).toUpperCase() + key.slice(1);
                newObject[newKey] = value.data[j][key];
              })
              newArray.push(newObject);
              if (value.data[j]['createdDate'] != undefined) {
                var d = new Date(value.data[j]['createdDate']);
                var getT = (d.getUTCMonth() + 1) + '/' + d.getDate() + '/' + d.getUTCFullYear() + ' ' +
                  d.getUTCHours() + ':' + d.getUTCMinutes();
                value.data[j]['createdDate'] = getT;
              }
            }
            pushData.push(newArray);
          });
      }
      // console.log(pushData)
      if (pushData.length != 0) {
        this.arrayJsonData = pushData;
        this.excelDownload();
      }
    }
  }

  /** Excel Download Functionality */
  excelDownload() {
    if (this.arrayJsonData[0].length == 0) {
      this.arrayJsonData[0] = [{}];
    } if (this.arrayJsonData[1].length == 0) {
      this.arrayJsonData[1] = [{}];
    } if (this.arrayJsonData[2].length == 0) {
      this.arrayJsonData[2] = [{}];
    } if (this.arrayJsonData[3].length == 0) {
      this.arrayJsonData[3] = [{}];
    } if (this.arrayJsonData[4].length == 0) {
      this.arrayJsonData[4] = [{}];
    } if (this.arrayJsonData[5].length == 0) {
      this.arrayJsonData[5] = [{}];
    } if (this.arrayJsonData[6].length == 0) {
      this.arrayJsonData[6] = [{}];
    } if (this.arrayJsonData[7].length == 0) {
      this.arrayJsonData[7] = [{}];
    } if (this.arrayJsonData[8].length == 0) {
      this.arrayJsonData[8] = [{}];
    }
    var data1 = this.arrayJsonData[0];
    var data2 = this.arrayJsonData[1];
    var data3 = this.arrayJsonData[2];
    var data4 = this.arrayJsonData[3];
    var data5 = this.arrayJsonData[4];
    var data6 = this.arrayJsonData[5];
    var data7 = this.arrayJsonData[6];
    var data8 = this.arrayJsonData[7];
    var data9 = this.arrayJsonData[8];
    var filename = 'Search History Stats_From_' + this.excelFromDate + ' To ' + this.excelToDate;
    var opts = [{ sheetid: 'RegisteredBoxIds', header: true }, { sheetid: 'BINDownloads', header: false }, { sheetid: 'ZipDownloads', header: false },
    { sheetid: 'AutoSearch', header: false }, { sheetid: 'ModelSearch', header: false }, { sheetid: 'MostSearchedBrand', header: false },
    { sheetid: 'MostSearchedModel', header: false }, { sheetid: 'FeedbackResults', header: false }, { sheetid: 'Generic Logs', header: false }];
    var res = alasql('SELECT INTO XLSX("' + filename + '",?) FROM ?',
      [opts, [data1, data2, data3, data4, data5, data6, data7, data8, data9]]);
    this.spinnerService.hide();

  }


  /** Routing to admin-clients page */
  AdminClients() {
    let arrPush = [];
    for (var i = 0; i < this.projectNames.length; i++) {
      arrPush.push(this.projectNames[i]['item_text']);
    }
    localStorage.setItem('serachHistoryProj', JSON.stringify(arrPush));
    this.router.navigate(['/clients'])
      .then(() => {
        window.location.reload();
      });
  }

  /** Multiselect project selection functions end **/


  keyPressHandler(e) {
    if (e.keyCode === 32 && !e.target.value.length) {
      return false;
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
    if (this.brand_list == 'Registered Box Ids') {
      this.bname = 'RegisteredBoxId';
      this.Datatype = 1;
      this.isregisteredBoxId = false;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'BIN Downloads') {
      this.bname = 'BINDownload';
      this.Datatype = 2;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = false; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'Zip Downloads') {
      this.bname = 'ZIPDownload'
      this.Datatype = 3;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = false;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'AutoSearch') {
      this.bname = 'AutoSearch';
      this.Datatype = 4;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = false; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'Model Search') {
      this.bname = 'ModelSearch'
      this.Datatype = 6;
      this.isregisteredBoxId = true;
      this.ismodelSearch = false; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'Most Searched Brand') {
      this.bname = 'MostSearchedBrand';
      this.Datatype = 7;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = false;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'Most Searched Model') {
      this.bname = 'MostSearchedModel';
      this.Datatype = 8;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = false;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'Feedback API') {
      this.bname = 'FeedbackAPI'
      this.Datatype = 10;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = false; this.isgenericLog = true;
    }
    if (this.brand_list == 'Generic Log') {
      this.bname = 'GenericLog'
      this.Datatype = 11;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = false;
    }
    return this.Datatype;
  }
  /** datatype selection based on selection of brands list start **/

  /** Project selection in multiselect dropdown to update the view of datatable start **/

  /** If Brand List drodown is changed to show version activation based on selection for needed brands **/

  changeTicket() {
    this.SelectedBrandName = this.brand_list;
    console.log(this.SelectedBrandName)
    if (this.brand_list == "null") {
      this.noData = true;
      $('.tabView').css('display', 'none');
    } else {
      this.noData = false;
      $('.tabView').css('display', 'block');
      this.selectDatatype();
      this.SearchHistory();
      this.refreshScreen();
    }
    if (this.checked) {
      $('input[type="checkbox"]:checked').trigger('click');
    }
  }

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
      this.SearchHistory();
    }

  }

  /** tab switching project data view end **/


  /** Sending selected projects in Brand Library to Data Configuration page if its selected in breadcrumbs start  **/
  dataConfig() {
    let projSelectedData = [];
    for (var i = 0; i < this.projectNames.length; i++) {
      projSelectedData.push(this.projectNames[i]['item_text']);
    }
    this.projectNames = projSelectedData;
    localStorage.setItem('BrandLibraryProjects', JSON.stringify(this.projectNames));
    this.router.navigate(['/Report-configuration-list']);
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

  view() {
    localStorage.removeItem('logSelected')
    this.router.navigate(['/log-view']);
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

  setAutoHeight() {
    this.gridApi.setDomLayout('autoHeight');
    (<HTMLInputElement>document.querySelector('#myGrid')).style.height = '';
  }

  setFixedHeight() {
    this.gridApi.setDomLayout('normal');
    (<HTMLInputElement>document.querySelector('#myGrid')).style.height = '500px';
  }

  methodFromParent_viewEdid(cell) {
    let values = Object.values(cell);
    if (this.brand_list === 'AutoSearch') {
      this.ViewEdid(values[10]);
    }
    if (this.brand_list === 'Feedback API') {
      this.ViewEdid(values[8]);
    }
  }

  onBtnExport() {
    let columndefs = this.gridApi.columnController.columnDefs; let columns = []; let filteredcolumns = [];
    columndefs.forEach(element => {
      columns.push(element['field'])
    });
    for (let i = 0; i < columns.length; i++) {
      filteredcolumns.push(columns[i])
    }
    var excelParams = {
      columnKeys: filteredcolumns,
      allColumns: false,
      fileName: '' + this.SelectedBrandName,
      skipHeader: false
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  viewdata() {
    this.searchValue = null
    this.spinnerService.show();
    if (this.SelectedBrandName == 'Most Searched Brand' || this.SelectedBrandName == 'Most Searched Model') {
      this.defaultColDef = {
        flex: 1,
        minWidth: 100,
      };
    }
    else {
      this.defaultColDef = {
        minWidth: 100,
      };
    }

    if (this.SelectedBrandName == 'Registered Box Ids') {
      this.columnDef = [
        { headerName: "ProjectName", field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxDBVersion", field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxSerialNo", field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxId", field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Ssu GUID", field: "Ssu GUID", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Region", field: "Region", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "RegionCode", field: "RegionCode", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Country", field: "Country", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "CountryCode", field: "CountryCode", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "TimeStamp", field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssu GUID', 'Region', 'RegionCode', 'Country', 'CountryCode'], 0);
    }
    if ((this.SelectedBrandName == 'BIN Downloads') || (this.SelectedBrandName == 'Bin Downloads')) {
      this.columnDef = [
        { headerName: "ProjectName", field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxDBVersion", field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxSerialNo", field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxId", field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Ssu GUID", field: "Ssu GUID", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "DownloadedDBVersion", field: "Downloaded DB Version", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BinId", field: "FK_BinId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "TimeStamp", field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssu GUID', 'Downloaded DB Version', 'FK_BinId'], 0)
    }
    if ((this.SelectedBrandName == 'ZIP Downloads') || (this.SelectedBrandName == 'Zip Downloads')) {
      this.columnDef = [
        { headerName: "ProjectName", field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxDBVersion", field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxSerialNo", field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxId", field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Ssu GUID", field: "Ssu GUID", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "DownloadedDBVersion", field: "Downloaded DB Version", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "ZipId", field: "FK_ZipId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "TimeStamp", field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssu GUID', 'Downloaded DB Version', 'FK_ZipId'], 0)
    }
    if (this.SelectedBrandName == 'AutoSearch') {
      this.columnDef = [
        { headerName: "ProjectName", field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxDBVersion", field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxSerialNo", field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxId", field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Ssu GUID", field: "Ssu GUID", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Device", field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "VendorId", field: "VendorId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Osd", field: "Osd", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Edid", field: "Edid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "edidviewCellRenderer" },
        { headerName: "TimeConsumed", field: "TimeConsumed", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BrandMatched", field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "CodesetMatches", field: "CodesetMatches", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SearchResult", field: "SearchResult", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "TimeStamp", field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssu GUID', 'Device', 'Brand', 'VendorId', 'Osd', 'Edid', 'TimeConsumed', 'CodesetMatches', 'SearchResult'], 0)
    }
    if (this.SelectedBrandName == 'Model Search') {
      this.columnDef = [
        { headerName: "ProjectName", field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxDBVersion", field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxSerialNo", field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxId", field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Ssu GUID", field: "Ssu GUID", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Device", field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Brand", field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "ModelInput", field: "ModelInput", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "TimeConsumed", field: "TimeConsumed", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Model Matched", field: "Model Matched", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "CodesetMatches", field: "CodesetMatches", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SearchResult", field: "SearchResult", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "TimeStamp", field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssu GUID', 'Device', 'Brand', 'ModelInput', 'TimeConsumed', 'Model Matched', 'CodesetMatches', 'SearchResult'], 0)
    }
    if (this.SelectedBrandName == 'Most Searched Brand') {
      this.columnDef = [
        { headerName: "Device", field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BrandName", field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BrandCount", field: "BrandCount", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = false;
      this.gridColumnApi.moveColumns(['Device', 'Brand', 'BrandCount'], 0)
    }
    if (this.SelectedBrandName == 'Most Searched Model') {
      this.columnDef = [
        { headerName: "Device", field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Model", field: "Model", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "ModelCount", field: "ModelCount", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = false;
      this.gridColumnApi.moveColumns(['Device', 'Model', 'ModelCount'], 0)
    }
    if (this.SelectedBrandName == 'Generic Log') {
      this.columnDef = [
        { headerName: "ProjectName", field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxDBVersion", field: "EmbeddedDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Apiname", field: "Apiname", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Ssu GUID", field: "Ssu GUID", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Input", field: "Input", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Output", field: "Output", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Result", field: "Result", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "TimeStamp", field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = false;
      this.gridColumnApi.moveColumns(['ProjectName', 'EmbeddedDBVersion', 'Apiname', 'Ssu GUID', 'Input', 'Output', 'Result'], 0)
    }
    if (this.SelectedBrandName == 'Feedback API') {
      this.columnDef = [
        { headerName: "ProjectName", field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxDBVersion", field: "EmbeddedDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxSerialNo", field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BoxId", field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "AuthKey", field: "AuthKey", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Device", field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BrandName", field: "BrandName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Model", field: "Model", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "VendorId", field: "VendorId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Osd", field: "Osd", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Edid", field: "Edid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "edidviewCellRenderer" },
        { headerName: "Codeset", field: "Codeset", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SearchType", field: "SearchType", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "Message", field: "Message", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "StatusFlag", field: "StatusFlag", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "TimeStamp", field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'EmbeddedDBVersion', 'BoxSerialNo', 'BoxId', 'AuthKey', 'Device', 'BrandName', 'Model', 'VendorId', 'Osd', 'Edid', 'Codeset', 'SearchType', 'Message', 'StatusFlag'], 0)
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
    let dbname = this.parameters[0], project = this.parameters[1], StartDate = this.parameters[2], EndDate = this.parameters[3], start = this.parameters[4], counter = this.parameters[5], search = this.parameters[6], order = this.parameters[7], datatype = this.parameters[8];
    this.mainService.getSearchDetails(dbname, project, StartDate, EndDate, datatype)
      .then(
        // this.mainService.GetPaginatedProductionDBStats(dbname, project, StartDate, EndDate, start, counter, search, order, datatype)
        //   .subscribe(
        value => {
          if (value.data !== '0') {
            this.spinnerService.hide();
            const newArray = []; let datasource1;
            for (let i = 0; i < value.data.length; i++) {
              const keys = Object.keys(value.data[i])
              const newObject = {};
              keys.forEach(key => {
                const newKey = key.charAt(0).toUpperCase() + key.slice(1);
                newObject[newKey] = value.data[i][key];
              })
              newArray.push(newObject);
              if (value.data[i]['createdDate'] != undefined) {
                var d = new Date(value.data[i]['createdDate']);
                var getT = (d.getUTCMonth() + 1) + '/' + d.getDate() + '/' + d.getUTCFullYear() + ' ' +
                  d.getUTCHours() + ':' + d.getUTCMinutes();
                value.data[i]['createdDate'] = getT;
              }
            }
            datasource1 = newArray;
            this.rowData = datasource1
            this.datasource = datasource1
            this.gridApi.setQuickFilter(this.searchValue)
          }
          else {
            this.rowData = [];
            $('#single_download').hide();
            this.gridApi.setQuickFilter(this.searchValue)
            this.spinnerService.hide();
          }
          if (this.rowData.length < 8) {
            this.setAutoHeight();
          }
          else {
            this.setFixedHeight();
          }
          let crudType = 7;
          this.mainService.getRoleModule(crudType, null, null, null, null)
            .then(value => {
              /** based on role get modules accessible checked or not checked*/
              let resultFetchArr: any = value.data.filter(u =>
                u.name == this.role);
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
                this.columnDefs = this.columnDefs;
                $('#single_download').hide();
                $('#all_download').hide();
              }
              if ((permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0) ||
                (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0)) {
                this.columnDefs = this.columnDefs;
                if (this.rowData.length === 0) {
                  $('#single_download').hide();
                }
                else {
                  $('#single_download').show();
                }
                $('#all_download').show();
              }
              if ((permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1) ||
                (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
                (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
                (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1)) {
                this.columnDefs = this.columnDefs;
                if (this.rowData.length === 0) {
                  $('#single_download').hide();
                }
                else {
                  $('#single_download').show();
                }
                $('#all_download').show();
              }
              console.log(permission)
            })
        });
  }

  search() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  check(e) {
    let check = e.target.checked;
    this.checked = check;
    if (check == true) {
      this.rowData = this.datasource.filter(u => !u.BoxId.startsWith('Portal_'))
    }
    else {
      this.rowData = this.datasource
    }
  }
}
