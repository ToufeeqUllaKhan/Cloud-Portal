import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
declare var $: any;
var lodash = require('lodash');
@Component({
  selector: 'app-prod-cec-edid-history',
  templateUrl: './prod-cec-edid-history.component.html',
  styleUrls: ['./prod-cec-edid-history.component.css']
})
export class ProdCecEdidHistoryComponent implements OnInit {
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
  userid: any;
  users: any[];
  constructor(private mainService: MainService, private router: Router, private spinnerService: NgxSpinnerService) {
    this.paginationPageSize = 10;
    this.rowSelection = 'multiple';
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
    };
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
  }

  ngOnInit(): void {
    this.userid = null;
    let temp = [];
    this.mainService.Genericlog(2, this.userid, null)
      .then(value => {
        for (let i = 0; i < value.data.length; i++) {
          temp.push({ loginid: value.data[i]['fK_LoginId'], user: value.data[i]['username'] })
        }
        temp = lodash.uniqWith(temp, lodash.isEqual);
        this.users = temp
        this.viewdata(this.userid);
      })
    var self = this;
    $('#single_download').click(function () {
      self.onBtnExport();
    })
  }
  onPageSizeChanged() {
    var value = (<HTMLInputElement>document.getElementById('page-size')).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
      fileName: 'CEC-EDID Centralized data changehistory',
      skipHeader: false
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  viewdata(loginid) {
    this.spinnerService.hide()
    this.searchValue = null;
    this.columnDefs = [
      { headerName: "Username", field: "Username", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "Description", field: "LogDescription", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true },
      { headerName: "CreatedDate", field: "CreatedDate", resizable: true, sortable: true, filter: 'agTextColumnFilter', floatingFilter: true }
    ];
    this.mainService.Genericlog(2, loginid, null)
      .then(value => {
        let arr = []; const newArray = [];
        if (value.data != "0" || value.data.length != 0 || value.data != '[]') {
          for (let i = 0; i < value.data.length; i++) {
            const keys = Object.keys(value.data[i])
            const newObject = {};
            keys.forEach(key => {
              const newKey = key.charAt(0).toUpperCase() + key.slice(1);
              newObject[newKey] = value.data[i][key];
            })
            newArray.push(newObject);
          }
          this.rowData = newArray;
        }
        else {
          this.rowData = [];
        }

        this.gridApi.setQuickFilter(this.searchValue)
      })

  }

  search() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  onchangeid() {
    if (this.userid === 'null') {
      this.userid = null
    }
    this.viewdata(this.userid)
  }

  dashboard() {
    this.router.navigate(['/dashboard'])
      .then(() => {
        location.reload();
      });
  }

  refreshScreen() {
    this.viewdata(this.userid);
  }
}
