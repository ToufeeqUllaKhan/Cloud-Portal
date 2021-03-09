import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
declare var $: any;
import 'datatables.net';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { EdidviewCellRenderer } from '../brand-library/edidview-cell-renderer.component';
@Component({
  selector: 'app-prod-cec-edid-data',
  templateUrl: './prod-cec-edid-data.component.html',
  styleUrls: ['./prod-cec-edid-data.component.css']
})
export class ProdCecEdidDataComponent implements OnInit {
  projectNames: any; selectedItems: Array<any> = [];
  projects: Array<any> = []; finalArray = []; ProjectList = [];
  dropdownSettings: any = {}; ShowFilter = false; tabslist = []; count: any = 0; switchRoute: any;
  limitSelection = false; mainArr = [];
  noData: boolean = false; projArr = []; tabsProject: any; tabValue: any; resultProjArr: any = [];
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
  filterProjects: any;
  proddatacec_edid: any;
  edidDataView: boolean;
  EdidData: any;
  DecodeedidDataView: boolean;
  keys: any;
  Values: any;
  role: string;
  module: string;
  constructor(private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private fb: FormBuilder, private http: HttpClient) {
    this.paginationPageSize = 10;
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      edidviewCellRenderer: EdidviewCellRenderer
    };
    this.defaultColDef = {
      minWidth: 100,
    };
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
    this.context = { componentParent: this };
  }

  ngOnInit(): void {
    var getClientProjects = JSON.parse(localStorage.getItem('choosenProjects'));
    this.role = localStorage.getItem('AccessRole');
    this.module = localStorage.getItem('moduleselected');
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
    let Projectname = this.projectNames;
    this.tabslist = Projectname;
    this.tabValue = this.projectNames[0];

    this.viewdata(2, this.tabValue)
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
    $('#single_download').click(function () {
      self.onBtnExport();
    })
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
          let projectname = this.projectNames[i]['item_text'];
          let filterClient: any = this.mainArr.filter(u =>
            (u.projectname == projectname));
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
    var projectName = this.resultProjArr[0]['projectname'];
    this.viewdata(2, projectName);
  }


  dashboard() {
    this.router.navigate(['/dashboard'])
      .then(() => {
        location.reload();
      });
  }

  onBtnExport() {
    let columndefs = this.gridApi.columnController.columnDefs; let columns = []; let filteredcolumns = [];
    columndefs.forEach(element => {
      columns.push(element['field'])
    });
    // for (let i = 0; i < columns.length - 2; i++) {
    //   filteredcolumns.push(columns[i])
    // }
    var excelParams = {
      columnKeys: columns,
      allColumns: false,
      fileName: "CEC-EDID Proddata",
      skipHeader: false
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  edid(setEdid) {
    this.viewEdidData(setEdid);
  };

  viewEdidData(value) {
    this.edidDataView = true;
    this.EdidData = value;
  }

  viewDecodeEdidData(value, value1) {
    this.DecodeedidDataView = true;
    this.keys = value;
    this.Values = value1;
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

  onPageSizeChanged() {
    var value = (<HTMLInputElement>document.getElementById('page-size')).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }


  viewdata(dataType, val) {
    this.spinnerService.hide()
    this.searchValue = null;
    this.columnDefs = [
      { headerName: "Serial Number", field: "Serial", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Device Type", field: "Device", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { field: "Subdevice", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { field: "Brand", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { field: "Model", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { field: "Region", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { field: "Country", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { field: "IsCecPresent", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { field: "IsCecEnabled", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Vendor ID", field: "VendorId", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "OSD Name", field: "Osd", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "EDID", field: "Edid", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true, cellRenderer: "edidviewCellRenderer" },
      { headerName: "Id", field: "Codeset", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
    ];
    let split = val.split('_');
    let projectNames = split[1];
    let dbinstance = split[0];
    this.mainService.StagingToProd(dataType, projectNames, null, null, null, null, null, null, null, null, null, null, null, null, null, dbinstance)
      .then(value => {
        let arr = []; const newArray = [];
        if ((value.data.length > 0 && value.data[0]['status'] === 0) || value.data === "0") {
          this.rowData = [];
        }
        else if (value.data != "0") {
          value.data.forEach(element => {
            element['Serial'] = null
          });
          for (let i = 0; i < value.data.length; i++) {
            if ((value.data[i]['isCecPresent'] === 1) || (value.data[i]['isCecPresent'] === '1')) {
              value.data[i]['isCecPresent'] = 'Y'
            }
            if ((value.data[i]['isCecPresent'] === 0) || (value.data[i]['isCecPresent'] === '0')) {
              value.data[i]['isCecPresent'] = 'N'
            }
            if ((value.data[i]['isCecEnabled'] === 1) || (value.data[i]['isCecEnabled'] === '1')) {
              value.data[i]['isCecEnabled'] = 'Y'
            }
            if ((value.data[i]['isCecEnabled'] === 0) || (value.data[i]['isCecEnabled'] === '0')) {
              value.data[i]['isCecEnabled'] = 'N'
            }
            value.data[i]['Serial'] = i + 1;
            arr.push(value.data[i])
          }
          for (let i = 0; i < arr.length; i++) {
            const keys = Object.keys(arr[i])
            const newObject = {};
            keys.forEach(key => {
              const newKey = key.charAt(0).toUpperCase() + key.slice(1);
              newObject[newKey] = arr[i][key];
            })
            newArray.push(newObject);
          }
          this.rowData = newArray;
        }
        else {
          this.rowData = [];
        }
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
              $('#single_download').hide();
            }
            if ((permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0) ||
              (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 0) ||
              (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1) ||
              (permission[0]['readPermission'] === 1 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
              (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 1 && permission[0]['writePermission'] === 1) ||
              (permission[0]['readPermission'] === 0 && permission[0]['downloadPermission'] === 0 && permission[0]['writePermission'] === 1)) {
              $('#single_download').show();
            }
            console.log(permission)
          })
      })

  }

  search() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  methodFromParent_viewEdid(cell) {
    let values = Object.values(cell);
    this.edid(values[11]);
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
