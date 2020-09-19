import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainService } from '../services/main-service';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { Observable, Subject, merge } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormControl } from '@angular/forms';
import { NgbTypeahead, NgbDatepickerConfig, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
declare let alasql;


@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.css']
})
export class SearchHistoryComponent implements OnInit {

  searchForm: FormGroup;
  projects: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false;
  limitSelection = false;
  projectNames: any; selectedItems: Array<any> = [];
  user: User = new User();
  api_list: any = null; device_list: any = null;
  tabsProject: any; tabslist = [];
  from_date: any; to_date: any;
  SearchData = []; mainArr = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  isTableVisible: Boolean = false; isRegistration: Boolean = false;
  isLogin: Boolean = false; isDownBin: Boolean = false; isDownZip: Boolean = false;
  isModelSearch: Boolean = false; isAutoSearch: Boolean = false; isDeltaSearch: Boolean = false;
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
  isSearchDataVisible: Boolean = true;

  constructor(private fb: FormBuilder, private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private config: NgbDatepickerConfig, private calender: NgbCalendar, private titleService: Title) {
    this.titleService.setTitle('Search History');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    /** To set month 1st date to today date */
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
    this.to_date = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    }
    this.spinnerService.show();
  }
 

  ngOnInit(): void {
  /** To set month 1st date to today date and validations to block future date */
    var d = new Date();
    var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    var monthF = firstDay.getMonth() + 1;
    var dayF = firstDay.getDate();

    this.from_date = firstDay.getFullYear() + '-' + (('' + monthF).length < 2 ? '0' : '') + monthF + '-' + (('' + dayF).length < 2 ? '0' : '') + dayF;
    this.startdate = this.from_date;
   
    this.minDates = {
      year: firstDay.getFullYear(),
      month: firstDay.getMonth() + 1,
      day: firstDay.getDate()
    };

    this.searchForm = this.fb.group({
      fromDate: ['', null],
      toDate:['',null]
    });
    
  /** List of selected projects in previous route */
    var getClientProjects = JSON.parse(localStorage.getItem('choosenAdminProjects'));
    
    if (getClientProjects != null) {
      this.projectNames = getClientProjects;
    }
  /** List of Projects */
    let dataType = 1;
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {
        this.mainArr = value.data;
        const unique = [...new Set(value.data.map(item => item.projectname))];

        let arrData = [];
        for (var i = 0; i < unique.length; i++) {
          arrData.push({ item_id: i, item_text: unique[i] });
        }
        this.projects = arrData;
        if (this.projectNames != '') {
          for (var i = 0; i < this.projectNames.length; i++) {
            var setIndex = this.projects.findIndex(p => p.item_text == this.projectNames[i]);

            this.selectedItems.push({ item_id: setIndex, item_text: this.projectNames[i] });
          }
          console.log(this.selectedItems);
          this.projectNames = this.selectedItems;
        }
      });
    this.spinnerService.hide();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: this.ShowFilter
    };
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
            let filterClient: any = value.data.filter(u =>
              u.projectname == this.projectNames[i]['item_text']);
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
    if (this.projectNames.length == 0) {
      this.isSearchDataVisible = false;
      this.toastr.warning('Please Select the Project to Activate the fields', '');
    }
    if (this.projectNames.length == 1) {
      this.isSearchDataVisible = true;
    }
  }

  /** Search History Submit operation */
  async onSearchHistorySubmit() {
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
      let searchDbname: any = this.mainArr.filter(u => u.projectname == this.projectNames[0]['item_text']);
      let dbname = searchDbname[0]['dbPath'];
      let projectname = this.projectNames[0]['item_text'];
      let datatype;
      let arr = [1, 3, 4, 6, 7, 8, 9];
      let pushData = [];
      this.excelFromDate = StartDate;
      this.excelToDate = EndDate;
      
      for (var i = 0; i < arr.length; i++) {
        datatype = arr[i];
       await this.mainService.getSearchDetails(dbname, projectname, StartDate, EndDate, datatype)
         .then(value => {
           console.log(value.data);
           // if (value.data.length != 0) {
              for (var j = 0; j < value.data.length; j++) {
                if (value.data[j]['createdDate'] != undefined) {
                  var d = new Date(value.data[j]['createdDate']);
                  var getT = (d.getUTCMonth() + 1) + '/' + d.getDate() + '/' + d.getUTCFullYear() + ' ' +
                    d.getUTCHours() + ':' + d.getUTCMinutes();
                  value.data[j]['createdDate'] = getT;
                }
              }
              pushData.push(value.data);
            //}
          });
      }
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
    }
    var data1 = this.arrayJsonData[0];
    var data2 = this.arrayJsonData[1];
    var data3 = this.arrayJsonData[2];
    var data4 = this.arrayJsonData[3];
    var data5 = this.arrayJsonData[4];
    var data6 = this.arrayJsonData[5];
    var data7 = this.arrayJsonData[6];
      var opts = [{ sheetid: 'RegisteredBoxIds', header: true }, { sheetid: 'ModelSearch', header: false }, { sheetid: 'MostSearchedBrand', header: false },
      { sheetid: 'AutoSearchResults', header: false }, { sheetid: 'BINDownloads', header: false }, { sheetid: 'ZipDownloads', header: false },
      { sheetid: 'FeedbackResults', header: false }];

    var filename = 'SearchLogStats_From_' + this.excelFromDate + ' To ' + this.excelToDate;

      var res = alasql('SELECT INTO XLSX("' + filename + '",?) FROM ?',
        [opts, [data1, data2, data3, data4, data5, data6, data7]]);
      this.spinnerService.hide();
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

}
