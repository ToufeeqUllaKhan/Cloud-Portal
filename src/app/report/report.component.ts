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
declare let alasql;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {


  searchForm: FormGroup;
  projects: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false;
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
    var getClientProjects = JSON.parse(localStorage.getItem('configureAdminProjectNames'));
    var getReloadedProject = JSON.parse(localStorage.getItem('reloadedProjects'));
    // var getClientProjects = JSON.parse(localStorage.getItem('choosenAdminProjects'));
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
        let filterProjectwithstatus2 = value.data.filter(u => u.statusFlag === 2);
        let filterProjectwithstatus = value.data.filter(u => u.statusFlag != 2);
        const unique = [...new Set(filterProjectwithstatus.map(item => item.projectname))];
        const unique1 = [...new Set(filterProjectwithstatus2.map(item => item.projectname))];
        let arrData = []; let arrData_1 = [];
        for (var i = 0; i < unique.length; i++) {
          arrData.push({ item_id: i, item_text: unique[i] });
        }
        for (var i = 0; i < unique1.length; i++) {
          arrData.push({ item_id: i, item_text: "PROD_" + unique1[i] });
        }
        for (var i = 0; i < arrData.length; i++) {
          arrData_1.push({ item_id: i, item_text: arrData[i]['item_text'] });
        }

        this.projects = arrData_1;
        // this.mainArr = value.data.filter(u =>
        //   (u.statusFlag === 2 || u.statusFlag === '2'));
        // const unique = [...new Set(this.mainArr.map(item => item.projectname))];

        // let arrData = [];
        // for (var i = 0; i < unique.length; i++) {
        //   arrData.push({ item_id: i, item_text: "PROD_"+unique[i] });
        // }
        // this.projects = arrData;
        if (this.projectNames != '') {
          for (var i = 0; i < this.projectNames.length; i++) {
            var setIndex = this.projects.findIndex(p => p.item_text == this.projectNames[i]);

            this.selectedItems.push({ item_id: setIndex, item_text: this.projectNames[i] });
          }
          this.projectNames = this.selectedItems;
        }
      });
    this.spinnerService.hide();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: this.ShowFilter
    };

    this.mainService.getProjectNames(null, null, null, null, null, 1)
      .subscribe(value => {
        let ProjectName; let resultFetchArr: any;
        if (this.projectNames[0]['item_text'] != undefined) {
          ProjectName = this.projectNames[0]['item_text'];
        } else {
          ProjectName = this.projectNames[0]
        }


        if (ProjectName.startsWith('PROD_')) {
          resultFetchArr = value.data.filter(u =>
            (u.projectname == ProjectName.replace("PROD_", "")) && (u.statusFlag === 2 || u.statusFlag === '2'));
        }
        else {
          resultFetchArr = value.data.filter(u =>
            (u.projectname == ProjectName) && (u.statusFlag != 2 || u.statusFlag != '2'));
        }
        // let ProjectName;
        // if (this.projectNames[0]['item_text'] != undefined) {
        //   ProjectName = this.projectNames[0]['item_text'];
        // } else {
        //   ProjectName = this.projectNames[0]
        // }
        // let resultFetchArr: any = value.data.filter(u =>
        //   (u.projectname == ProjectName.replace("PROD_", "")) && (u.statusFlag === 2 || u.statusFlag === '2'));
        let Dbname = resultFetchArr[0]['dbPath'];
        let arr = [];
        this.mainService.getSearchDetails(Dbname, null, null, null, 0)
          .then(value => {
            if (this.switchRoute == 'SearchLog') {
              if (value.data.length != 0) {
                value.data = value.data.filter(function (obj) {
                  return obj.dataType !== 2 && obj.dataType !== 6 && obj.dataType !== 10;
                });
              }
              for (let i = 0; i < value.data.length; i++) {
                arr.push({ ticketName: value.data[i]['description'], description: value.data[i]['description'] });
              }
              // $('#all_download').show();
            }
            else if (this.switchRoute == 'GenericLog') {
              if (value.data.length != 0) {
                value.data = value.data.filter(function (obj) {
                  return obj.dataType == 10;
                });
              }
              for (let i = 0; i < value.data.length; i++) {
                arr.push({ ticketName: value.data[i]['description'], description: value.data[i]['description'] });
              }
              // $('#all_download').hide();
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
        // this.mainArr = value.data;
        // let ProjectName;
        // if (this.projectNames[0]['item_text'] != undefined) {
        //   ProjectName = this.projectNames[0]['item_text'];
        // } else {
        //   ProjectName = this.projectNames[0]
        // }
        let ProjectName; let resultFetchArr: any;
        if (this.projectNames[0]['item_text'] != undefined) {
          ProjectName = this.projectNames[0]['item_text'];
        } else {
          ProjectName = this.projectNames[0]
        }

        if (ProjectName.startsWith('PROD_')) {
          resultFetchArr = value.data.filter(u =>
            (u.projectname == ProjectName.replace("PROD_", "")) && (u.statusFlag === 2 || u.statusFlag === '2'));
        }
        else {
          resultFetchArr = value.data.filter(u =>
            (u.projectname == ProjectName) && (u.statusFlag != 2 || u.statusFlag != '2'));
        }
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

          // let resultFetchArr: any = this.mainArr.filter(u =>
          //   (u.projectname == ProjectName.replace("PROD_", "")) && (u.statusFlag === 2 || u.statusFlag === '2'));
          this.resultProjArr = resultFetchArr;

          let datatype;
          let dataTypeSelection = 0;
          if (this.Datatype == 1) {
            dataTypeSelection = 1;
          }
          if (this.Datatype == 3) {
            dataTypeSelection = 3;
          }
          if (this.Datatype == 4) {
            dataTypeSelection = 4;
          }
          if (this.Datatype == 5) {
            dataTypeSelection = 5;
          }
          if (this.Datatype == 7) {
            dataTypeSelection = 7;
          }
          if (this.Datatype == 8) {
            dataTypeSelection = 8;
          }
          if (this.Datatype == 9) {
            dataTypeSelection = 9;
          }
          if (this.Datatype == 10) {
            dataTypeSelection = 10;
          }

          // let searchDbname: any = this.mainArr.filter(u => u.projectname == this.projectNames[0]['item_text']);
          // let dbame = searchDbname[0]['dbPath'];
          // let projectname = this.projectNames[0]['item_text'];
          let dbname = this.resultProjArr[0]['dbPath'];
          let projectname = this.resultProjArr[0]['projectname'];
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
          this.mainService.GetPaginatedProductionDBStats(dbname, projectname, StartDate, EndDate, 1, 10, search, order, datatype)
            .subscribe(value => {
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
    if (this.projectNames.length == 1) {
      this.isSearchDataVisible = true;
      this.device_list = [];
      this.versions = [];
      let projectSelectedList = [];
      let datatype = 1;
      await this.mainService.getProjectNamesWaitReq(null, null, null, null, null, datatype)
        .then(value => {
          for (var i = 0; i < this.projectNames.length; i++) {
            let ProjectName; let filterClient: any;
            if (this.projectNames[i]['item_text'] != undefined) {
              ProjectName = this.projectNames[i]['item_text'];
            } else {
              ProjectName = this.projectNames[i]
            }


            if (ProjectName.startsWith('PROD_')) {
              filterClient = value.data.filter(u =>
                (u.projectname == ProjectName.replace("PROD_", "")) && (u.statusFlag === 2 || u.statusFlag === '2'));
            }
            else {
              filterClient = value.data.filter(u =>
                (u.projectname == ProjectName) && (u.statusFlag != 2 || u.statusFlag != '2'));
            }
            // let filterClient: any = value.data.filter(u =>
            //   u.projectname == this.projectNames[i]['item_text']);
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
      this.toastr.warning('Please Select Single Project to proceed further');
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
    if (this.projectNames.length == 1) {
      this.noData = false;
      $('.hideData').css('display', 'block');
      $('.tabView').css('display', 'block');
      $('.col-lg-12').css('display', 'block');
      $('#single_download').show();
      $('#all_download').show();
      this.isSearchDataVisible = true;
      this.getTabName(this.projectNames[0]['item_text']);
      this.onProjectSelect(this.tabslist[0]);
    }
  }

  /** Search History Submit operation */
  SearchHistory() {
    this.spinnerService.hide();
    if (this.checked === true) {
      $('input[type="checkbox"]:not(:checked)').trigger('click');
    } else {
      $('input[type="checkbox"]:checked').trigger('click');
    }
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
      if (this.projectNames[0]['item_text'] != undefined) {
        ProjectName = this.projectNames[0]['item_text'];
      } else {
        ProjectName = this.projectNames[0]
      }


      if (ProjectName.startsWith('PROD_')) {
        searchDbname = this.mainArr.filter(u =>
          (u.projectname == ProjectName.replace("PROD_", "")) && (u.statusFlag === 2 || u.statusFlag === '2'));
      }
      else {
        searchDbname = this.mainArr.filter(u =>
          (u.projectname == ProjectName) && (u.statusFlag != 2 || u.statusFlag != '2'));
      }
      // let searchDbname: any = this.mainArr.filter(u => 
      //   (u.projectname == this.projectNames[0]['item_text'].replace("PROD_", "")) && (u.statusFlag === 2 || u.statusFlag === '2'));
      let dbname = searchDbname[0]['dbPath'];
      let projectname = searchDbname[0]['projectname'];

      let datatype;
      let dataTypeSelection = 0;
      if (this.Datatype == 1) {
        dataTypeSelection = 1;
      }
      if (this.Datatype == 3) {
        dataTypeSelection = 3;
      }
      if (this.Datatype == 4) {
        dataTypeSelection = 4;
      }
      if (this.Datatype == 5) {
        dataTypeSelection = 5;
      }
      if (this.Datatype == 7) {
        dataTypeSelection = 7;
      }
      if (this.Datatype == 8) {
        dataTypeSelection = 8;
      }
      if (this.Datatype == 9) {
        dataTypeSelection = 9;
      }
      if (this.Datatype == 10) {
        dataTypeSelection = 10;
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
      this.mainService.GetPaginatedProductionDBStats(dbname, projectname, StartDate, EndDate, 1, 10, search, order, datatype)
        .subscribe(value => {
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
      let searchDbname: any = this.mainArr.filter(u => u.projectname == this.projectNames[0]['item_text'].replace("PROD_", ''));
      let dbname = searchDbname[0]['dbPath'];
      let projectname = this.projectNames[0]['item_text'];
      let datatype;
      let arr = [1, 3, 4, 5, 7, 8, 9];
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
      console.log(pushData)
      if (pushData.length != 0) {
        this.arrayJsonData = pushData;
        this.excelDownload();
      }
    }
  }

  /** Excel Download Functionality */
  excelDownload() {
    if (this.switchRoute == 'GenericLog') {
      if (this.arrayJsonData[0].length == 0) {
        this.arrayJsonData[0] = [{}];
      }
    }
    else if (this.switchRoute == 'SearchLog') {

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
      }
    }
    var data1 = this.arrayJsonData[0];
    var data2 = this.arrayJsonData[1];
    var data3 = this.arrayJsonData[2];
    var data4 = this.arrayJsonData[3];
    var data5 = this.arrayJsonData[4];
    var data6 = this.arrayJsonData[5];
    var data7 = this.arrayJsonData[6];
    var filename = '' + this.switchRoute + 'Stats_From_' + this.excelFromDate + ' To ' + this.excelToDate;

    if (this.switchRoute == 'SearchLog') {
      var opts = [{ sheetid: 'RegisteredBoxIds', header: true }, { sheetid: 'ModelSearch', header: false }, { sheetid: 'MostSearchedBrand', header: false },
      { sheetid: 'AutoSearchResults', header: false }, { sheetid: 'BINDownloads', header: false }, { sheetid: 'ZipDownloads', header: false },
      { sheetid: 'FeedbackResults', header: false }];
      var res = alasql('SELECT INTO XLSX("' + filename + '",?) FROM ?',
        [opts, [data1, data2, data3, data4, data5, data6, data7]]);
      this.spinnerService.hide();
    }
    else if (this.switchRoute == 'GenericLog') {
      var opts = [{ sheetid: 'GenericLogDetails', header: true }];
      var res = alasql('SELECT INTO XLSX("' + filename + '",?) FROM ?',
        [opts, [data1]]);
      this.spinnerService.hide();
    }

  }


  /** Routing to admin-clients page */
  AdminClients() {
    let arrPush = [];
    for (var i = 0; i < this.projectNames.length; i++) {
      arrPush.push(this.projectNames[i]['item_text']);
    }
    localStorage.setItem('serachHistoryProj', JSON.stringify(arrPush));
    this.router.navigate(['/admin-clients'])
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
    if (this.brand_list == 'Model Search') {
      this.bname = 'ModelSearch'
      this.Datatype = 3;
      this.isregisteredBoxId = true;
      this.ismodelSearch = false; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'Most Searched Brand') {
      this.bname = 'MostSearchedBrand';
      this.Datatype = 4;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = false;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'AutoSearch-Device Grouping') {
      this.bname = 'AutoSearch';
      this.Datatype = 5;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = false; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'BIN Downloads') {
      this.bname = 'BINDownload';
      this.Datatype = 7;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = false; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'Zip Downloads') {
      this.bname = 'ZIPDownload'
      this.Datatype = 8;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = false;
      this.isfeedbackAPI = true; this.isgenericLog = true;
    }
    if (this.brand_list == 'Feedback API') {
      this.bname = 'FeedbackAPI'
      this.Datatype = 9;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = false; this.isgenericLog = true;
    }
    if (this.brand_list == 'Generic Log') {
      this.bname = 'GenericLog'
      this.Datatype = 10;
      this.isregisteredBoxId = true;
      this.ismodelSearch = true; this.ismostSearchedBrand = true;
      this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
      this.isfeedbackAPI = true; this.isgenericLog = false;
    }
    // return this.Datatype;
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
      projSelectedData.push(this.projectNames[i]['item_text'].replace("PROD_", ""));
    }
    this.projectNames = projSelectedData;
    localStorage.setItem('BrandLibraryAdminProjects', JSON.stringify(this.projectNames));
    this.router.navigate(['/Report-configuration-list']);
  }

  /** Sending selected projects in Brand Library to Data Configuration page if its selected in breadcrumbs end  **/

  clients() {
    localStorage.removeItem('fetchedAdminProj');
    let projSelectedData = [];
    for (var i = 0; i < this.projectNames.length; i++) {
      projSelectedData.push(this.projectNames[i]['item_text'].replace("PROD_", ""));
    }
    this.projectNames = projSelectedData;
    localStorage.setItem('BrandLibraryAdminProjects', JSON.stringify(this.projectNames));
    this.router.navigate(['/report-clients'])
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

  methodFromParent_viewEdid(cell) {
    let values = Object.values(cell);
    if (this.brand_list === 'AutoSearch-Device Grouping') {
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
    if (this.SelectedBrandName == 'Most Searched Brand') {
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
      this.columnDefs = [
        { field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SsuGuid", field: "Ssuguid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Region", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "RegionCode", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Country", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "CountryCode", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssuguid', 'Region', 'RegionCode', 'Country', 'CountryCode'], 0);
    }
    if (this.SelectedBrandName == 'Model Search') {
      this.columnDefs = [
        { field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SsuGuid", field: "Ssuguid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "ModelInput", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "TimeConsumed", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "ModelMatched", field: "ModelMatches", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "CodesetMatches", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "SearchResult", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssuguid', 'Device', 'Brand', 'ModelInput', 'TimeConsumed', 'ModelMatches', 'CodesetMatches', 'SearchResult'], 0)
    }
    if (this.SelectedBrandName == 'AutoSearch-Device Grouping') {
      this.columnDefs = [
        { field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SsuGuid", field: "Ssuguid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "ModelInput", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "VendorId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Osd", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Edid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "edidviewCellRenderer" },
        { field: "TimeConsumed", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "ModelMatched", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "CodesetMatches", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "SearchResult", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssuguid', 'Device', 'Brand', 'ModelInput', 'VendorId', 'Osd', 'Edid', 'TimeConsumed', 'ModelMatched', 'CodesetMatches', 'SearchResult'], 0)
    }
    if (this.SelectedBrandName == 'Most Searched Brand') {
      this.columnDefs = [
        { field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "BrandName", field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BrandCount", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = false;
      this.gridColumnApi.moveColumns(['Device', 'Brand', 'BrandCount'], 0)
    }
    if ((this.SelectedBrandName == 'BIN Downloads') || (this.SelectedBrandName == 'Bin Downloads')) {
      this.columnDefs = [
        { field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SsuGuid", field: "Ssuguid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "DownloadedDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BinId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssuguid', 'DownloadedDBVersion', 'BinId'], 0)
    }
    if ((this.SelectedBrandName == 'ZIP Downloads') || (this.SelectedBrandName == 'Zip Downloads')) {
      this.columnDefs = [
        { field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SsuGuid", field: "Ssuguid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "DownloadedDBVersion", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "ZipId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['ProjectName', 'BoxDBVersion', 'BoxSerialNo', 'BoxId', 'Ssuguid', 'DownloadedDBVersion', 'ZipId'], 0)
    }
    if (this.SelectedBrandName == 'Generic Log') {
      this.columnDefs = [
        { headerName: "APIName", field: "Apiname", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SsuGuid", field: "Ssuguid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Input", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Output", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Result", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = false;
      this.gridColumnApi.moveColumns(['Apiname', 'Ssuguid', 'Input', 'Output', 'Result'], 0)
    }
    if (this.SelectedBrandName == 'Feedback API') {
      this.columnDefs = [
        { field: "BoxSerialNo", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BoxId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { headerName: "SsuGuid", field: "Ssuguid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "BrandName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Model", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "VendorId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Osd", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Edid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "edidviewCellRenderer" },
        { field: "Codeset", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "SearchType", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "Message", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "StatusFlag", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
        { field: "TimeStamp", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
      ];
      this.portal = true;
      this.gridColumnApi.moveColumns(['BoxSerialNo', 'BoxId', 'Ssuguid', 'Device', 'BrandName', 'Model', 'VendorId', 'Osd', 'Edid', 'Codeset', 'SearchType', 'Message', 'StatusFlag'], 0)
    }
    let dbname = this.parameters[0], project = this.parameters[1], StartDate = this.parameters[2], EndDate = this.parameters[3], start = this.parameters[4], counter = this.parameters[5], search = this.parameters[6], order = this.parameters[7], datatype = this.parameters[8];
    this.mainService.GetPaginatedProductionDBStats(dbname, project, StartDate, EndDate, start, counter, search, order, datatype)
      .subscribe(value => {
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
              if(this.rowData.length===0){
                $('#single_download').hide();
              }
              else{
                $('#single_download').show();
              }
              if (this.switchRoute == 'SearchLog') {
                $('#all_download').show();
              }
              else if (this.switchRoute == 'GenericLog') {
                $('#all_download').hide();
              }
            }
            if ((permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1) ||
              (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
              (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
              (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1)) {
              this.columnDefs = this.columnDefs;
              if(this.rowData.length===0){
                $('#single_download').hide();
              }
              else{
                $('#single_download').show();
              }
              if (this.switchRoute == 'SearchLog') {
                $('#all_download').show();
              }
              else if (this.switchRoute == 'GenericLog') {
                $('#all_download').hide();
              }
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
    if (check == true) {
      this.rowData = this.datasource.filter(u => !u.BoxId.startsWith('Portal_'))
    }
    else {
      this.rowData = this.datasource
    }
  }
}
