import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainService } from '../services/main-service';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { Observable, Subject, merge, concat } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormControl } from '@angular/forms';
import { NgbTypeahead, NgbDatepickerConfig, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment.prod';
declare let alasql;
var BrandListData = [];

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
  isSearchDataVisible: Boolean = true;pushData=[];


  resultProjArr = []; Datatype: Number; brand_list: any = null;brands = [];bname:any=[];
  SelectedBrandName: any; dataMainArr = [];tabValue=[];changeVersionCount: any;
  oldValue: string; previous: any; selectPrev: any; count: any = 0; modalCount: any = 0;
  currentVal: any;  finalArray = [];recordId: any; ProjectList = [];
  switchRoute:any;
  isregisteredBoxId: Boolean = true;   ismodelSearch: Boolean = true;
  ismostSearchedBrand: Boolean = true;  isautoSearch: Boolean = true;
  isbinDownload: Boolean = true;  iszipDownload: Boolean = true;
  isfeedbackAPI: Boolean = true;  isgenericLog: Boolean = true;
  isRegisteredBoxId: Boolean = false;isModelSearch: Boolean = false;
  isMostSearchedBrand: Boolean = false;  isAutoSearch: Boolean = false;
  isBINDownload: Boolean = false;  isZIPDownload: Boolean = false;
  isFeedbackAPI: Boolean = false;  isGenericLog: Boolean = false;
  edidDataView: Boolean = false;edid128DataView: Boolean = false;EdidData: any;

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
    this.spinnerService.hide();
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
    this.switchRoute = localStorage.getItem('logSelected');
  /** list of selected projects in previous page **/
    var updateBrandsProjects = JSON.parse(localStorage.getItem('updatedBrandProjects'));
    var getClientProjects = JSON.parse(localStorage.getItem('configureAdminProjectNames'));
    var getReloadedProject = JSON.parse(localStorage.getItem('reloadedProjects'));
    // var getClientProjects = JSON.parse(localStorage.getItem('choosenAdminProjects'));
    
    if (getClientProjects != null) {
      this.projectNames = getClientProjects;
    }
    var getName = localStorage.getItem('selectedBrand');
    if (getName != '') {
      this.SelectedBrandName = getName;
    }
    this.selectModelView();
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
  $('#RegisteredBoxIdView').hide();
  $('#ModelSearchView').hide();
  $('#MostSearchedBrandView').hide();
  $('#AutoSearchView').hide();
  $('#BINDownloadView').hide();
  $('#ZIPDownloadView').hide();
  $('#FeedbackAPIView').hide();
  $('#GenericLogView').hide();
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
        
        let ProjectName;
        if (this.projectNames[0]['item_text'] != undefined) {
          ProjectName = this.projectNames[0]['item_text'];
        } else {
          ProjectName = this.projectNames[0]
        }
      let resultFetchArr: any = value.data.filter(u =>
        u.projectname == ProjectName);
      let Dbname = resultFetchArr[0]['dbPath']; 
        let arr=[];
  this.mainService.getSearchDetails(Dbname, null, null, null, 0)
    .then(value => {
      if(this.switchRoute=='SearchLog'){
        if (value.data.length != 0) {
          value.data = value.data.filter(function (obj) {
            return obj.dataType !== 2 && obj.dataType !== 6 && obj.dataType !== 10;
          });
        }
        for(let i=0;i<value.data.length;i++){
           arr.push({ticketName:value.data[i]['description'],description:value.data[i]['description']});
          }
          $('#all_download').show();
      }
      else if(this.switchRoute=='GenericLog'){
        if (value.data.length != 0) {
          value.data = value.data.filter(function (obj) {
            return obj.dataType == 10;
          });
        }
        for(let i=0;i<value.data.length;i++){
           arr.push({ticketName:value.data[i]['description'],description:value.data[i]['description']});
          }
          $('#all_download').hide();
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
        this.mainArr = value.data;
        let ProjectName;
        if (this.projectNames[0]['item_text'] != undefined) {
          ProjectName = this.projectNames[0]['item_text'];
        } else {
          ProjectName = this.projectNames[0]
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
          
          let resultFetchArr: any = this.mainArr.filter(u =>
            u.projectname == ProjectName);
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
          var brandName = this.brand_list;
          let dbname = this.resultProjArr[0]['dbPath'];
          let datasource=[];let datasource1=[];
          let projectname = this.resultProjArr[0]['projectname'];
          datatype=dataTypeSelection;
          this.excelFromDate = StartDate;
          this.excelToDate = EndDate;
          console.log(dbname,projectname,StartDate,EndDate,datatype)
          let search;let column;let dir;let regex;
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
                    url: `${environment.apiUrl}/api/Stats/GetPaginatedProductionDBStats`,
                    contentType: "application/json",
                    data: function (data) {
                      data.Dbname = dbname;
                      data.Projectname = projectname;
                      data.StartDate = StartDate;
                      data.EndDate = EndDate;
                      data.Datatype = datatype;
                      data.start=data.start+1;
                      data.length=data.length-1;
                      search=data.search['value'];
                      regex=data.search['regex'];
                      column=data.order[0]['column'];
                      dir=data.order[0]['dir'];
                      return JSON.stringify(data);
                    },
                    "dataSrc": function (json) {
                      let recordscount=parseInt(json.recordsTotal);
                      if (json.data != "0") {
                        const newArray =[];let temp=[];
                        for (var j = 0; j < json.data.length; j++) {
                          const keys =Object.keys(json.data[j])
                          const newObject={};
                          keys.forEach(key=>{ 
                            const newKey = key.charAt(0).toUpperCase() + key.slice(1);
                            newObject[newKey] = json.data[j][key];
                          })
                         newArray.push(newObject);
                          if (json.data[j]['createdDate'] != undefined) {
                            var d = new Date(json.data[j]['createdDate']);
                            var getT = (d.getUTCMonth() + 1) + '/' + d.getDate() + '/' + d.getUTCFullYear() + ' ' +
                              d.getUTCHours() + ':' + d.getUTCMinutes();
                            json.data[j]['createdDate'] = getT;
                          }
                        }
                        for(let i=0;i<newArray.length;i++){
                          temp.push( Object.values(newArray[i]));
                        }
                        datasource=temp;
                        datasource1=newArray;
                        self.download_filter(dbname,projectname,StartDate,EndDate,datatype,search,regex,column,dir,recordscount)
                
                        self.pushData=datasource1;
                        if ( self.pushData.length != 0) {
                          self.arrayJsonData =  self.pushData;
                          $('#single_download').show();
                        }
                        if (brandName === 'BIN Downloads') {
                          var temp1=[];let part1=[];let part2=[];let complete=[];
                          for(let i=0;i<datasource.length;i++){
                             part1.push(datasource[i].slice(0, 6));
                             part2.push(datasource[i].slice(7, 10)) ;
                          }
                          for(let i=0;i<datasource.length;i++){
                            temp1.push(complete.concat(part1[i],part2[i])); 
                           }
                           datasource=temp1
                          }
                          if (brandName === 'Zip Downloads') {
                            var temp1=[];let part1=[];let part2=[];let complete=[];
                            for(let i=0;i<datasource.length;i++){
                               part1.push(datasource[i].slice(0, 7));
                               part2.push(datasource[i].slice(8, 9)) ;
                            }
                            for(let i=0;i<datasource.length;i++){
                              temp1.push(complete.concat(part1[i],part2[i])); 
                             }
                             datasource=temp1
                            }
                        if (brandName === 'AutoSearch-Device Grouping') {
                          if (datasource.length > 0) {
                            for (var i = 0, ien = datasource.length; i < ien; i++) {
                              datasource[i][10] = '<button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-edid" value="' + datasource[i][10] + '"><i class="fa fa-eye" aria-hidden="true"></i></button>';
                             }
                          }
                        }
                        if (brandName === 'Feedback API') {
                          if (datasource.length > 0) {
                            for (var i = 0, ien = datasource.length; i < ien; i++) {
                              datasource[i][8] = '<button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-edid" value="' + datasource[i][8] + '"><i class="fa fa-eye" aria-hidden="true"></i></button>';
                             }
                          }
                        }
                        return datasource;
                      } else {
                        $('#single_download').hide();
                        return json;
                      }
        
                    },
                    
                    error: function (e) {
                    },
                  },
                  
                  autofill: true,
                  responsive: true
                });
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
      var self=this;
      $('#single_download').click(function(){
        self.SingleexcelDownload();
      })
      $('#loadView').on('click', '.btn-edid', function () {
        var setEdid = $(this).val();
        self.viewEdidData(setEdid);
      });
  }

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
      $('.hideData').css('display', 'none');
      $('.tabView').css('display', 'none');
      $('.col-lg-12').css('display','none');
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
    console.log(this.tabslist)
    if (this.projectNames.length == 0) {
      this.isSearchDataVisible = false;
      this.noData = true;
      $('.hideData').css('display', 'none');
      $('.tabView').css('display', 'none');
      $('.col-lg-12').css('display','none')
      $('#single_download').hide();
      $('#all_download').hide();
      this.toastr.warning('Please Select the Project to Activate the fields', '');
    }
    if (this.projectNames.length == 1) {
      this.noData = false;
      $('.hideData').css('display', 'block');
      $('.tabView').css('display', 'block');
      $('.col-lg-12').css('display','block');
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

      let datatype;let view;let datasource=[];let datasource1=[];
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
      datatype=dataTypeSelection;
      this.excelFromDate = StartDate;
      this.excelToDate = EndDate;
      view='#'+this.bname+'View';       
         var brandName = this.brand_list;

      console.log(dbname,projectname,StartDate,EndDate,datatype)
      let search;let column;let dir;let regex;
              $(view).DataTable({
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
            url: `${environment.apiUrl}/api/Stats/GetPaginatedProductionDBStats`,
            contentType: "application/json",
            data: function (data) {
              data.Dbname = dbname;
              data.Projectname = projectname;
              data.StartDate = StartDate;
              data.EndDate = EndDate;
              data.Datatype = datatype;
              data.start=data.start+1;
              data.length=data.length-1;
              search=data.search['value'];
              regex=data.search['regex'];
              column=data.order[0]['column'];
              dir=data.order[0]['dir'];
              return JSON.stringify(data);
            },
            "dataSrc": function (json) {
              let recordscount=parseInt(json.recordsTotal);
              if (json.data != "0") {
                const newArray =[];let temp=[];
                for (var j = 0; j < json.data.length; j++) {
                  const keys =Object.keys(json.data[j])
                  const newObject={};
                  keys.forEach(key=>{ 
                    const newKey = key.charAt(0).toUpperCase() + key.slice(1);
                    newObject[newKey] = json.data[j][key];
                  })
                 newArray.push(newObject);
                  if (json.data[j]['createdDate'] != undefined) {
                    var d = new Date(json.data[j]['createdDate']);
                    var getT = (d.getUTCMonth() + 1) + '/' + d.getDate() + '/' + d.getUTCFullYear() + ' ' +
                      d.getUTCHours() + ':' + d.getUTCMinutes();
                    json.data[j]['createdDate'] = getT;
                  }
                }
                for(let i=0;i<newArray.length;i++){
                  temp.push( Object.values(newArray[i]));
                }
                datasource=temp;
                datasource1=newArray;
                self.download_filter(dbname,projectname,StartDate,EndDate,datatype,search,regex,column,dir,recordscount)
                self.pushData=datasource1;
                if ( self.pushData.length != 0) {
                  self.arrayJsonData =  self.pushData;
                  $('#single_download').show();
                  
                }
                
                if (brandName === 'BIN Downloads') {
                  var temp1=[];let part1=[];let part2=[];let complete=[];
                  for(let i=0;i<datasource.length;i++){
                     part1.push(datasource[i].slice(0, 6));
                     part2.push(datasource[i].slice(7, 10)) ;
                  }
                  for(let i=0;i<datasource.length;i++){
                    temp1.push(complete.concat(part1[i],part2[i])); 
                   }
                   datasource=temp1
                }
                if (brandName === 'Zip Downloads') {
                    var temp1=[];let part1=[];let part2=[];let complete=[];
                    for(let i=0;i<datasource.length;i++){
                       part1.push(datasource[i].slice(0, 7));
                       part2.push(datasource[i].slice(8, 9)) ;
                    }
                    for(let i=0;i<datasource.length;i++){
                      temp1.push(complete.concat(part1[i],part2[i])); 
                     }
                     datasource=temp1
                }
                if (brandName === 'AutoSearch-Device Grouping') {
                  if (datasource.length > 0) {
                    for (var i = 0, ien = datasource.length; i < ien; i++) {
                      datasource[i][10] = '<button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-edid" value="' + datasource[i][10] + '"><i class="fa fa-eye" aria-hidden="true"></i></button>';
                     }
                  }
                }
                if (brandName === 'Feedback API') {
                  if (datasource.length > 0) {
                    for (var i = 0, ien = datasource.length; i < ien; i++) {
                      datasource[i][8] = '<button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-edid" value="' + datasource[i][8] + '"><i class="fa fa-eye" aria-hidden="true"></i></button>';
                     }
                  }
                }
                return datasource;
              } else {
                $('#single_download').hide();
                return json;
              }

            },
            
            error: function (e) {
            },
          },
          
          autofill: true,
          responsive: true
        });
        var self=this;
        $(view).on('click', '.btn-edid', function () {
          var setEdid = $(this).val();
          self.viewEdidData(setEdid);
        });
    }
  }

  download_filter(dbname,project,StartDate,EndDate,datatype,Search,Regex,Column,Dir,counter){
    if (this.tabsProject != undefined) {
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject);
      this.resultProjArr = resultFetchArrTabs;
    }
    project=this.resultProjArr[0]['projectname'];
    dbname=this.resultProjArr[0]['dbinstance'];
    // let brandName=this.brand_list;
    let start=1;
    let search= {
      "value": Search,
      "regex": Regex
  }
    let order=[
      {
          "column": Column,
          "dir": Dir
      }
  ];
    
    this.mainService.GetPaginatedProductionDBStats(dbname,project,StartDate,EndDate,start,counter,search,order, datatype)
    .subscribe(value =>{
      const newArray =[];let datasource1;
      for (let i = 0; i < value.data.length; i++) {
      const keys =Object.keys(value.data[i])
      const newObject={};
      keys.forEach(key=>{ 
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
          datasource1=newArray;
    if (newArray.length != 0) {
      console.log(datasource1);
      this.arrayJsonData = datasource1;
    }
    });
  }

  SingleexcelDownload() {

    if (this.arrayJsonData.length == 0) {
      this.arrayJsonData = [{}];
    }
    console.log( this.arrayJsonData)
    var data1 = this.arrayJsonData;
      var opts = [{ sheetid: this.SelectedBrandName, header: true }];
    var filename = ''+this.SelectedBrandName+'Stats_From_' + this.excelFromDate + ' To ' + this.excelToDate;
      var res = alasql('SELECT INTO XLSX("' + filename + '",?) FROM ?',
        [opts, [data1]]);
      this.spinnerService.hide();
  }

 async download(){
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
      let arr = [1, 3, 4, 5, 7, 8, 9];
      let pushData = [];
      this.excelFromDate = StartDate;
      this.excelToDate = EndDate;
      
      for (var i = 0; i < arr.length; i++) {
        datatype = arr[i];
       await this.mainService.getSearchDetails(dbname, projectname, StartDate, EndDate, datatype)
         .then(value => {
          const newArray =[];
          for (var j = 0; j < value.data.length; j++) {
            const keys =Object.keys(value.data[j])
            const newObject={};
            keys.forEach(key=>{ 
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
    if(this.switchRoute=='GenericLog'){
      if (this.arrayJsonData[0].length == 0) {
        this.arrayJsonData[0] = [{}];
      }
    }
    else if(this.switchRoute=='SearchLog'){
      
    if (this.arrayJsonData[0].length == 0) {
      this.arrayJsonData[0] = [{}];
    }  if (this.arrayJsonData[1].length == 0) {
      this.arrayJsonData[1] = [{}];
    }  if (this.arrayJsonData[2].length == 0) {
      this.arrayJsonData[2] = [{}];
    }  if (this.arrayJsonData[3].length == 0) {
      this.arrayJsonData[3] = [{}];
    }  if (this.arrayJsonData[4].length == 0) {
      this.arrayJsonData[4] = [{}];
    }  if (this.arrayJsonData[5].length == 0) {
      this.arrayJsonData[5] = [{}];
    }  if (this.arrayJsonData[6].length == 0) {
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
    var filename = ''+this.switchRoute+'Stats_From_' + this.excelFromDate + ' To ' + this.excelToDate;

    if(this.switchRoute=='SearchLog'){
      var opts = [{ sheetid: 'RegisteredBoxIds', header: true }, { sheetid: 'ModelSearch', header: false }, { sheetid: 'MostSearchedBrand', header: false },
      { sheetid: 'AutoSearchResults', header: false }, { sheetid: 'BINDownloads', header: false }, { sheetid: 'ZipDownloads', header: false },
      { sheetid: 'FeedbackResults', header: false }];
      var res = alasql('SELECT INTO XLSX("' + filename + '",?) FROM ?',
        [opts, [data1, data2, data3, data4, data5, data6, data7]]);
      this.spinnerService.hide();
   }
   else if(this.switchRoute=='GenericLog'){
    var opts =  [{ sheetid: 'GenericLogDetails', header: true }];
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
    this.bname='RegisteredBoxId';
    this.Datatype = 1;
    this.isregisteredBoxId = false;
    this.ismodelSearch = true; this.ismostSearchedBrand = true;
    this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
    this.isfeedbackAPI = true;this.isgenericLog = true;
  } 
  if(this.brand_list == 'Model Search') {
    this.bname='ModelSearch'
    this.Datatype = 3;
    this.isregisteredBoxId = true;
    this.ismodelSearch = false; this.ismostSearchedBrand = true;
    this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
    this.isfeedbackAPI = true;this.isgenericLog = true;
  } 
  if(this.brand_list == 'Most Searched Brand') {
    this.bname='MostSearchedBrand';
    this.Datatype = 4;
    this.isregisteredBoxId = true;
    this.ismodelSearch = true; this.ismostSearchedBrand = false;
    this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
    this.isfeedbackAPI = true;this.isgenericLog = true;
  } 
  if(this.brand_list == 'AutoSearch-Device Grouping') {
    this.bname='AutoSearch';
    this.Datatype = 5;
   this.isregisteredBoxId = true;
    this.ismodelSearch = true; this.ismostSearchedBrand = true;
    this.isautoSearch = false; this.isbinDownload = true; this.iszipDownload = true;
    this.isfeedbackAPI = true;this.isgenericLog = true;
  } 
  if(this.brand_list == 'BIN Downloads') {
    this.bname='BINDownload';
    this.Datatype = 7;
   this.isregisteredBoxId = true;
    this.ismodelSearch = true; this.ismostSearchedBrand = true;
    this.isautoSearch = true; this.isbinDownload = false; this.iszipDownload = true;
    this.isfeedbackAPI = true;this.isgenericLog = true;
  } 
  if(this.brand_list == 'Zip Downloads') {
    this.bname='ZIPDownload'
    this.Datatype = 8;
    this.isregisteredBoxId = true;
    this.ismodelSearch = true; this.ismostSearchedBrand = true;
    this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = false;
    this.isfeedbackAPI = true;this.isgenericLog = true;
  }
  if(this.brand_list == 'Feedback API') {
    this.bname='FeedbackAPI'
    this.Datatype = 9;
   this.isregisteredBoxId = true;
    this.ismodelSearch = true; this.ismostSearchedBrand = true;
    this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
    this.isfeedbackAPI = false;this.isgenericLog = true;
  }
  if(this.brand_list == 'Generic Log') {
    this.bname='GenericLog'
    this.Datatype = 10;
    this.isregisteredBoxId = true;
    this.ismodelSearch = true; this.ismostSearchedBrand = true;
    this.isautoSearch = true; this.isbinDownload = true; this.iszipDownload = true;
    this.isfeedbackAPI = true;this.isgenericLog = false;
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
      this.getViewResponse();
      this.getTabResponseData();
      this.selectModelView();
    }
  }


/** show and hide the data view based on user selected brand list start **/

  
selectModelView() {
  if (this.SelectedBrandName == 'Registered Box Ids') {
    this.isRegisteredBoxId = true;
    this.isModelSearch = false;
    this.isAutoSearch = false;
    this.isBINDownload = false;
    this.isFeedbackAPI = false;
    this.isGenericLog = false;
    this.isMostSearchedBrand = false;
    this.isZIPDownload = false;
  }
 
  if(this.SelectedBrandName == 'Model Search') {
    this.isModelSearch = true;
    this.isRegisteredBoxId = false;
    this.isAutoSearch = false;
    this.isBINDownload = false;
    this.isFeedbackAPI = false;
    this.isGenericLog = false;
    this.isMostSearchedBrand = false;
    this.isZIPDownload = false;
  }
  if(this.SelectedBrandName == 'AutoSearch-Device Grouping') {
    this.isAutoSearch = true;
    this.isRegisteredBoxId = false;
    this.isModelSearch = false;
    this.isBINDownload = false;
    this.isFeedbackAPI = false;
    this.isGenericLog = false;
    this.isMostSearchedBrand = false;
    this.isZIPDownload = false;
  }
  if(this.SelectedBrandName == 'Most Searched Brand') {
    this.isMostSearchedBrand = true;
    this.isRegisteredBoxId = false;
    this.isModelSearch = false;
    this.isAutoSearch = false;
    this.isBINDownload = false;
    this.isFeedbackAPI = false;
    this.isGenericLog = false;
    this.isZIPDownload = false;
  }
  if(this.SelectedBrandName == 'BIN Downloads') {
    this.isBINDownload = true;
    this.isRegisteredBoxId = false;
    this.isModelSearch = false;
    this.isAutoSearch = false;
    this.isFeedbackAPI = false;
    this.isGenericLog = false;
    this.isMostSearchedBrand = false;
    this.isZIPDownload = false;
  }
  if(this.SelectedBrandName == 'ZIP Downloads') {
    this.isZIPDownload = true;
    this.isRegisteredBoxId = false;
    this.isModelSearch = false;
    this.isAutoSearch = false;
    this.isBINDownload = false;
    this.isFeedbackAPI = false;
    this.isGenericLog = false;
    this.isMostSearchedBrand = false;
  }
  if(this.SelectedBrandName == 'Generic Log') {
    this.isGenericLog = true;
    this.isRegisteredBoxId = false;
    this.isModelSearch = false;
    this.isAutoSearch = false;
    this.isBINDownload = false;
    this.isFeedbackAPI = false;
    this.isMostSearchedBrand = false;
    this.isZIPDownload = false;
  }
  if(this.SelectedBrandName == 'Feedback API') {
    this.isFeedbackAPI = true;
    this.isRegisteredBoxId = false;
    this.isModelSearch = false;
    this.isAutoSearch = false;
    this.isBINDownload = false;
    this.isGenericLog = false;
    this.isMostSearchedBrand = false;
    this.isZIPDownload = false;
  }
}

/** show and hide the data view based on user selected brand list end **/


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
      this.getTabResponseData();
    }
    
  }

/** tab switching project data view end **/

/** version switching project data view start **/



/** version switching project data view end **/

/** based on selected tab get data view start **/

  getTabResponseData() {
    if (this.count == 1 && this.oldValue == undefined && this.modalCount != 1) {
      $('#loadView').dataTable().fnClearTable();
      $('#loadView').dataTable().fnDestroy();
      $('#loadView').hide();
    }if (this.SelectedBrandName == 'Registered Box Ids') {
      var Table1 = $('#RegisteredBoxIdView').DataTable();
      Table1.destroy();
      Table1.clear();
     // Table1.draw();
      this.SearchHistory();
      $('#RegisteredBoxIdView').show();
      $('#ModelSearchView').hide();
      $('#MostSearchedBrandView').hide();
      $('#AutoSearchView').hide();
      $('#BINDownloadView').hide();
      $('#ZIPDownloadView').hide();
      $('#FeedbackAPIView').hide();
      $('#GenericLogView').hide();
    }

    if (this.SelectedBrandName == 'Model Search') {
      var Table2 = $('#ModelSearchView').DataTable();
      Table2.destroy();
      Table2.clear();
     // Table2.draw();
      this.SearchHistory();
      $('#RegisteredBoxIdView').hide();
      $('#ModelSearchView').show();
      $('#MostSearchedBrandView').hide();
      $('#AutoSearchView').hide();
      $('#BINDownloadView').hide();
      $('#ZIPDownloadView').hide();
      $('#FeedbackAPIView').hide();
      $('#GenericLogView').hide();
    }
    if (this.SelectedBrandName == 'Most Searched Brand') {
      var Table3 = $('#ModelSearchView').DataTable();
      Table3.destroy();
      Table3.clear();
     // Table3.draw();
      this.SearchHistory();
      $('#RegisteredBoxIdView').hide();
      $('#ModelSearchView').hide();
      $('#MostSearchedBrandView').show();
      $('#AutoSearchView').hide();
      $('#BINDownloadView').hide();
      $('#ZIPDownloadView').hide();
      $('#FeedbackAPIView').hide();
      $('#GenericLogView').hide();
    }
    if (this.SelectedBrandName == 'AutoSearch-Device Grouping') {
      var Table4 = $('#AutoSearchView').DataTable();
      Table4.destroy();
      Table4.clear();
     // Table1.draw();
      this.SearchHistory();
      $('#RegisteredBoxIdView').hide();
      $('#ModelSearchView').hide();
      $('#MostSearchedBrandView').hide();
      $('#AutoSearchView').show();
      $('#BINDownloadView').hide();
      $('#ZIPDownloadView').hide();
      $('#FeedbackAPIView').hide();
      $('#GenericLogView').hide();
    }
    if (this.SelectedBrandName == 'BIN Downloads') {
      var Table5 = $('#BINDownloadView').DataTable();
      Table5.destroy();
      Table5.clear();
     // Table5.draw();
      this.SearchHistory();
      $('#RegisteredBoxIdView').hide();
      $('#ModelSearchView').hide();
      $('#MostSearchedBrandView').hide();
      $('#AutoSearchView').hide();
      $('#BINDownloadView').show();
      $('#ZIPDownloadView').hide();
      $('#FeedbackAPIView').hide();
      $('#GenericLogView').hide();
    }
    if (this.SelectedBrandName == 'Zip Downloads') {
      var Table6 = $('#ZIPDownloadView').DataTable();
      Table6.destroy();
      Table6.clear();
     // Table6.draw();
      this.SearchHistory();
      $('#RegisteredBoxIdView').hide();
      $('#ModelSearchView').hide();
      $('#MostSearchedBrandView').hide();
      $('#AutoSearchView').hide();
      $('#BINDownloadView').hide();
      $('#ZIPDownloadView').show();
      $('#FeedbackAPIView').hide();
      $('#GenericLogView').hide();
    }
    if (this.SelectedBrandName == 'Feedback API') {
      var Table7 = $('#FeedbackAPIView').DataTable();
      Table7.destroy();
      Table7.clear();
     // Table7.draw();
      this.SearchHistory();
      $('#RegisteredBoxIdView').hide();
      $('#ModelSearchView').hide();
      $('#MostSearchedBrandView').hide();
      $('#AutoSearchView').hide();
      $('#BINDownloadView').hide();
      $('#ZIPDownloadView').hide();
      $('#FeedbackAPIView').show();
      $('#GenericLogView').hide();
    }
    if (this.SelectedBrandName == 'Generic Log') {
      var Table8 = $('#GenericLogView').DataTable();
      Table8.destroy();
      Table8.clear();
     // Table8.draw();
      this.SearchHistory();
      $('#RegisteredBoxIdView').hide();
      $('#ModelSearchView').hide();
      $('#MostSearchedBrandView').hide();
      $('#AutoSearchView').hide();
      $('#BINDownloadView').hide();
      $('#ZIPDownloadView').hide();
      $('#FeedbackAPIView').hide();
      $('#GenericLogView').show();
    }
  }

/** based on selected tab get data view end **/

/** datatable resetting function to handle multiple selected datatable view start **/

getViewResponse() {
  if (this.oldValue == undefined || this.oldValue == "null" && this.previous != undefined) {
    this.selectPrev = this.previous;
      var Table = $('#loadView').DataTable();
      Table.destroy();
      $('#loadView').empty();
    this.modalCount = 1;
  }
  if (this.oldValue != null && this.oldValue != undefined) {
    this.selectPrev = this.oldValue;
  }
  if (this.selectPrev == 'Registered Box Ids') {
    var Table1 = $('#RegisteredBoxIdView').DataTable();
    Table1.destroy();
    Table1.clear();
   // Table1.draw();
  }
  if (this.selectPrev == 'Model Search') {
    var Table2 = $('#ModelSearchView').DataTable();
    Table2.destroy();
    Table2.clear();
   // Table2.draw();
  }
  if (this.selectPrev == 'Most Searched Brand') {
    var Table3 = $('#MostSearchedBrandView').DataTable();
    Table3.destroy();
    Table3.clear();
   // Table3.draw();
  }
  if (this.selectPrev == 'AutoSearch-Device Grouping') {
    var Table4 = $('#AutoSearchView').DataTable();
    Table4.destroy();
    Table4.clear();
   // Table4.draw();
  }
  if (this.selectPrev == 'BIN Downloads') {
    var Table5 = $('#BINDownloadView').DataTable();
    Table5.destroy();
    Table5.clear();
   // Table5.draw();
  }
  if (this.selectPrev == 'Zip Downloads') {
    var Table6 = $('#ZIPDownloadView').DataTable();
    Table6.destroy();
    Table6.clear();
   // Table6.draw();
  }
  if (this.selectPrev == 'Feedback API') {
    var Table7 = $('#FeedbackAPIView').DataTable();
    Table7.destroy();
    Table7.clear();
   // Table7.draw();
  }
  if (this.selectPrev == 'Generic Log') {
    var Table8 = $('#GenericLogView').DataTable();
    Table8.destroy();
    Table8.clear();
  }
  if (this.SelectedBrandName == 'Registered Box Ids') {
    this.SearchHistory();
    $('#RegisteredBoxIdView').show();
    $('#ModelSearchView').hide();
    $('#MostSearchedBrandView').hide();
    $('#AutoSearchView').hide();
    $('#BINDownloadView').hide();
    $('#ZIPDownloadView').hide();
    $('#FeedbackAPIView').hide();
    $('#GenericLogView').hide();
  }

  if (this.SelectedBrandName == 'Model Search') {
    this.SearchHistory();
    $('#RegisteredBoxIdView').hide();
    $('#ModelSearchView').show();
    $('#MostSearchedBrandView').hide();
    $('#AutoSearchView').hide();
    $('#BINDownloadView').hide();
    $('#ZIPDownloadView').hide();
    $('#FeedbackAPIView').hide();
    $('#GenericLogView').hide();
  }
  if (this.SelectedBrandName == 'Most Searched Brand') {
    this.SearchHistory();
    $('#RegisteredBoxIdView').hide();
    $('#ModelSearchView').hide();
    $('#MostSearchedBrandView').show();
    $('#AutoSearchView').hide();
    $('#BINDownloadView').hide();
    $('#ZIPDownloadView').hide();
    $('#FeedbackAPIView').hide();
    $('#GenericLogView').hide();
  }
  if (this.SelectedBrandName == 'AutoSearch-Device Grouping') {
    this.SearchHistory();
    $('#RegisteredBoxIdView').hide();
    $('#ModelSearchView').hide();
    $('#MostSearchedBrandView').hide();
    $('#AutoSearchView').show();
    $('#BINDownloadView').hide();
    $('#ZIPDownloadView').hide();
    $('#FeedbackAPIView').hide();
    $('#GenericLogView').hide();
  }
  if (this.SelectedBrandName == 'BIN Downloads') {
    this.SearchHistory();
    $('#RegisteredBoxIdView').hide();
    $('#ModelSearchView').hide();
    $('#MostSearchedBrandView').hide();
    $('#AutoSearchView').hide();
    $('#BINDownloadView').show();
    $('#ZIPDownloadView').hide();
    $('#FeedbackAPIView').hide();
    $('#GenericLogView').hide();
  }
  if (this.SelectedBrandName == 'Zip Downloads') {
    this.SearchHistory();
    $('#RegisteredBoxIdView').hide();
    $('#ModelSearchView').hide();
    $('#MostSearchedBrandView').hide();
    $('#AutoSearchView').hide();
    $('#BINDownloadView').hide();
    $('#ZIPDownloadView').show();
    $('#FeedbackAPIView').hide();
    $('#GenericLogView').hide();
  }
  if (this.SelectedBrandName == 'Feedback API') {
    this.SearchHistory();
    $('#RegisteredBoxIdView').hide();
    $('#ModelSearchView').hide();
    $('#MostSearchedBrandView').hide();
    $('#AutoSearchView').hide();
    $('#BINDownloadView').hide();
    $('#ZIPDownloadView').hide();
    $('#FeedbackAPIView').show();
    $('#GenericLogView').hide();
  }
  if (this.SelectedBrandName == 'Generic Log') {
    this.SearchHistory();
    $('#RegisteredBoxIdView').hide();
    $('#ModelSearchView').hide();
    $('#MostSearchedBrandView').hide();
    $('#AutoSearchView').hide();
    $('#BINDownloadView').hide();
    $('#ZIPDownloadView').hide();
    $('#FeedbackAPIView').hide();
    $('#GenericLogView').show();
  }
 
}

/** datatable resetting function to handle multiple selected datatable view end **/

/** Sending selected projects in Brand Library to Data Configuration page if its selected in breadcrumbs start  **/
dataConfig() {
  let projSelectedData = [];
  for (var i = 0; i < this.projectNames.length; i++) {
    projSelectedData.push(this.projectNames[i]['item_text']);
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
    projSelectedData.push(this.projectNames[i]['item_text']);
  }
  this.projectNames = projSelectedData;
  localStorage.setItem('BrandLibraryAdminProjects', JSON.stringify(this.projectNames));
  this.router.navigate(['/admin-clients'])
    .then(() => {
    location.reload();
  });
}

view() {
  localStorage.removeItem('logSelected')
  this.router.navigate(['/log-view']);
}


}
