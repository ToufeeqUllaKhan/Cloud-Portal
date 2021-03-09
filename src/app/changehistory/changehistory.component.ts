import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
var lodash = require('lodash');

@Component({
  selector: 'app-changehistory',
  templateUrl: './changehistory.component.html',
  styleUrls: ['./changehistory.component.css']
})
export class ChangehistoryComponent implements OnInit {
  usersName: any;
  projectNames: any; selectedItems: Array<any> = [];
  projects: Array<any> = []; finalArray = []; ProjectList = [];
  dropdownSettings: any = {}; columnSettings: any = {}; ShowFilter = false; tabslist = [];
  limitSelection = false; mainArr = []; switchRoute: any;
  noData: boolean = false; projArr = []; tabsProject: any; tabValue: any; count: any = 0; oldValue: string; modalCount: any = 0;
  //   submitted: Boolean = false;
  clientDetails = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  editedSignature: any;
  editSignatureData: FormGroup; signatureDetails = []; parameters: any;
  resultProjArr: any = [];
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

  constructor(private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private fb: FormBuilder) {
    this.usersName = localStorage.getItem('userName');
    this.paginationPageSize = 10;
    this.defaultColDef = {
      minWidth: 100,
    };
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
  }

  ngOnInit(): void {
    /** List of selected projects in previous route */
    var getClientProjects = JSON.parse(localStorage.getItem('choosenProjects'));
    this.switchRoute = localStorage.getItem('TicketSelected');
    if (getClientProjects != null) {
      this.projectNames = getClientProjects;
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
    this.columnSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: this.ShowFilter
    };
    let Projectname = this.projectNames;
    this.tabslist = Projectname;
    this.tabValue = this.projectNames[0].split('_');
    this.mainService.ChangeHistory(this.tabValue[1], null, this.tabValue[0])
      .subscribe(value => {
        let parameter = [this.tabValue]
        this.parameters = parameter;
        this.viewdata();
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
    var self = this;
    $('#column_visible').click(function (e) {
      if (!($('.tab-content .dropdown-list').hasClass('hidden'))) {
        $('.tab-content .dropdown-list').css('width', 'auto')
      }
      self.columnvisiblity();
    })


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

  refreshScreen() {
    let project;
    if (this.tabsProject != undefined) {
      project = this.tabsProject;
    } else {
      project = this.projectNames[0]['item_text']
    }
    this.getTabName(project);
  }

  async onProjectSelect(e) {

    let projectSelectedList = [];
    let datatype = 1;
    await this.mainService.getProjectNamesWaitReq(null, null, null, null, null, datatype)
      .then(value => {
        for (var i = 0; i < this.projectNames.length; i++) {
          let filterClient: any = value.data.filter(u =>
            (u.projectname == this.projectNames[i]['item_text']) && (u.statusFlag != 2 || u.statusFlag != '2'));
          this.projArr.push(filterClient);
          projectSelectedList.push(this.projectNames[i]['item_text']);
        }
        this.tabslist = projectSelectedList;
        var resultproj = [];
        for (var k = 0; k < this.projArr.length; k++) {
          resultproj = resultproj.concat(this.projArr[k]);
        }

        this.projArr = resultproj;
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
    }
  }

  getTabName(name) {
    if (name != undefined && name != '') {
      this.count++;
      this.tabsProject = name;
      this.tabValue = name;
      let versionArray: any = this.mainArr.filter(u =>
        u.projectname == name);

      if (versionArray.length != 0) {
        this.tabsProject = name;
        this.tabValue = name;
        this.noData = false;
        // $('.tab-content').css('display', 'block');
        this.spinnerService.show();
        this.getTabResponseData();
      } else {
        this.count--;
        this.noData = true;
        // $('.tab-content').css('display', 'none');
      }
    }

  }

  getTabResponseData() {
    if (this.tabsProject != undefined) {
      let resultFetchArrTabs: any = this.mainArr.filter(u =>
        u.projectname == this.tabsProject);
      this.resultProjArr = resultFetchArrTabs;
    }
    if (this.tabsProject === undefined) {
      if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
        let resultFetchArr: any = this.mainArr.filter(u =>
          (u.projectname == this.projectNames[0]['item_text']) && (u.statusFlag != 2 || u.statusFlag != '2'));
        this.resultProjArr = resultFetchArr;
      }
    }
    var projectName = this.resultProjArr[0]['projectname'].split('_');
    this.mainService.ChangeHistory(projectName[1], null, projectName[0])
      .subscribe(value => {
        let parameter = [projectName]
        this.parameters = parameter;
        this.viewdata();
      });
  }

  Clients() {
    this.router.navigate(['/clients'])
      .then(() => {
        window.location.reload();
      });
  }

  dashboard() {
    this.router.navigate(['/dashboard'])
      .then(() => {
        location.reload();
      });
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
    this.spinnerService.show();
    this.columnDef = [
      { headerName: "DataHistoryId", field: "DataHistoryId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Username", field: "Username", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "ProjectName", field: "ProjectName", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "DataSection", field: "DataSection", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Operation", field: "Operation", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "TotalFailedRecord", field: "TotalFailedRecord", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "TotalInsertedRecord", field: "TotalInsertedRecord", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "TotalUpdatedRecord", field: "TotalUpdatedRecord", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "UpdateDescription", field: "UpdateDescription", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "RecordCount", field: "RecordCount", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "IPaddress", field: "IPaddress", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Remarks", field: "Remarks", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "TimeStamp", field: "CreatedDate", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
    ];
    this.gridColumnApi.moveColumns(['DataHistoryId', 'Username', 'ProjectName', 'DataSection', 'Operation', 'TotalFailedRecord', 'TotalInsertedRecord', 'TotalUpdatedRecord', 'UpdateDescription', 'RecordCount', 'IPaddress', 'Remarks', 'CreatedDate'], 0)
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
    let projectName = this.parameters[0];
    this.mainService.ChangeHistory(projectName[1], null, projectName[0])
      .subscribe(value => {
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
        if (this.rowData.length < 8) {
          this.setAutoHeight();
        }
        else {
          this.setFixedHeight();
        }
        this.gridApi.setQuickFilter(this.searchValue)
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
}