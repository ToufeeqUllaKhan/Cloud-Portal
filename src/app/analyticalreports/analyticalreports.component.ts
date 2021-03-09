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
var lodash = require('lodash');
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { ChartComponent } from "ng-apexcharts";

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   dataLabels: ApexDataLabels;
//   plotOptions: ApexPlotOptions;
//   xaxis: ApexXAxis;
//   yaxis: ApexYAxis;
//   title: ApexTitleSubtitle;
//   stroke: ApexStroke;
//   responsive: ApexResponsive[];
//   labels: any;
//   fill: ApexFill;
//   legend: ApexLegend;

// };
@Component({
  selector: 'app-analyticalreports',
  templateUrl: './analyticalreports.component.html',
  styleUrls: ['./analyticalreports.component.css']
})
export class AnalyticalreportsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;

  projects: Array<any> = []; projectNames: any = null; Project: any = [];
  user: User = new User(); tabslist = [];
  versions = []; db_version: any = null; Datatype: Number;
  brand_list: any = null; brands = []; bname: any = [];
  SelectedBrandName: any; tabValue = []; changeVersionCount: any;
  oldValue: string; previous: any; selectPrev: any; count: any = 0; modalCount: any = 0;
  currentVal: any; finalArray = []; records_CountrywiseReg: any = []; ProjectList = [];
  edidDataView: Boolean = false; edid128DataView: Boolean = false; EdidData: any; parameters: any;
  Countrywise: any[]; records_MonthwiseReg: any = []; records_MonthwiseReReg: any = [];
  graphreports: any = [];
  searchValue: any; datasource: any; checked: boolean; portal: Boolean; role: string; module: string; mainArr: any = [];
  successfulreg: number; successfulrereg: number; unSuccessfulreg: any;
  recordsModelSearchbasedonResulttype_result_type: any = []; recordsAutoSearchbasedonResulttype_result_type: any = [];
  records_AvgResponseTimeAutoSearch: any = []; records_AvgResponseTimeModelSearch: any = [];
  Device: any = null; DeviceList: any = []; records_TopSearchBrand: any = [];
  records_TopSearchModel: any = []; records_TopSearchVendorId: any = []; records_TopSearchOSD: any = [];
  records_MonthwiseAutoSearch: any = []; records_MonthwiseModelSearch: any = []; toprecords: any = 10;
  dbinstance: any = []; report_db_instance: any = null; summary_db_instance: any = null; showDevice: Boolean = true;
  showProjectsforAdmin: Boolean; showProjectsfornonAdmin: Boolean;
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

  // filterParams: { comparator: (filterLocalDateAtMidnight: any, cellValue: any) => 1 | 0 | -1; browserDatePicker: boolean; };
  filterParams = {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split('/');
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
    },
    browserDatePicker: true,
    minValidYear: 2000,
  };
  Countrywise_series: { name: string; data: any[]; }[];
  Countrywise_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  Countrywise_chart: { type: "bar"; height: number; };
  Countrywise_plotOptions: { bar: { horizontal: false; }; };
  Countrywise_dataLabels: { enabled: false; };
  Countrywise_xaxis: { type: "category"; title: { text: string; }; };
  Countrywise_yaxis: { title: { text: string; }; };
  Monthwise_Reg_series: { name: string; data: any[]; }[];
  Monthwise_Reg_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  Monthwise_Reg_chart: { type: "bar"; height: number; };
  Monthwise_Reg_plotOptions: { bar: { horizontal: false; }; };
  Monthwise_Reg_dataLabels: { enabled: false; };
  Monthwise_Reg_stroke: { show: boolean; width: number; colors: string[]; };
  Monthwise_Reg_xaxis: { type: "category"; title: { text: string; }; };
  Monthwise_Reg_yaxis: { title: { text: string; }; };
  TotalcountReg_series: any[];
  TotalcountReg_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  TotalcountReg_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  TotalcountReg_labels: string[];
  TotalcountReg_responsive: { breakpoint: number; options: { legend: { position: string; }; }; }[];
  TotalcountReg_color: string[];
  TotalcountSearch_series: any[];
  TotalcountSearch_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  TotalcountSearch_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  TotalcountSearch_labels: string[];
  TotalcountSearch_responsive: { breakpoint: number; options: { legend: { position: string; }; }; }[];
  TotalcountReg_fill: { type: "gradient"; };
  TotalcountReg_dataLabels: { enabled: false; };
  Monthwise_Search_series: { name: string; data: any[]; }[];
  Monthwise_Search_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  Monthwise_Search_chart: { type: "bar"; height: number; };
  Monthwise_Search_plotOptions: { bar: { horizontal: false; }; };
  Monthwise_Search_dataLabels: { enabled: false; };
  Monthwise_Search_stroke: { show: boolean; width: number; colors: string[]; };
  Monthwise_Search_xaxis: { type: "category"; title: { text: string; }; };
  Monthwise_Search_yaxis: { title: { text: string; }; };
  ModelSearchbasedonResulttype_series: any[];
  ModelSearchbasedonResulttype_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  ModelSearchbasedonResulttype_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  ModelSearchbasedonResulttype_labels: any[];
  ModelSearchbasedonResulttype_color: any[];
  TopSearchBrand_series: any[];
  TopSearchBrand_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  TopSearchBrand_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  TopSearchBrand_labels: any[];
  TopSearchModel_series: any[];
  TopSearchModel_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  TopSearchModel_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  TopSearchModel_labels: any[];
  TopSearchVendorID_series: any[];
  TopSearchVendorID_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  TopSearchVendorID_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  TopSearchVendorID_labels: any[];
  TopSearchOSD_series: any[];
  TopSearchOSD_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  TopSearchOSD_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  TopSearchOSD_labels: any[];
  Monthwise_Reg_fill: { colors: string[]; };
  Monthwise_Reg_color: string[];
  AutoSearchbasedonResulttype_series: any[];
  AutoSearchbasedonResulttype_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  AutoSearchbasedonResulttype_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  AutoSearchbasedonResulttype_labels: any[];
  AutoSearchbasedonResulttype_color: any[];
  AvgResponseTimeModelSearch_series: any[];
  AvgResponseTimeModelSearch_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  AvgResponseTimeModelSearch_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  AvgResponseTimeModelSearch_labels: any[];
  AvgResponseTimeModelSearch_color: any[];
  AvgResponseTimeAutoSearch_series: any[];
  AvgResponseTimeAutoSearch_title: { text: string; align: string; style: { fontSize: string; fontWeight: string; fontFamily: string; }; };
  AvgResponseTimeAutoSearch_chart: { height: number; type: "pie"; toolbar: { show: boolean; }; };
  AvgResponseTimeAutoSearch_labels: any[];
  AvgResponseTimeAutoSearch_color: any[];

  dropdownSettings: any = {}; ShowFilter = false;
  limitSelection = false;

  constructor(private fb: FormBuilder, private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: NgxSpinnerService, private config: NgbDatepickerConfig, private calender: NgbCalendar, private titleService: Title, CarouselConfig: NgbCarouselConfig) {
    this.titleService.setTitle('Reports');
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.role = localStorage.getItem('AccessRole');
    this.module = localStorage.getItem('moduleselected')
    this.frameworkComponents = {
      edidviewCellRenderer: EdidviewCellRenderer

    };
    this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
    this.context = { componentParent: this };
    CarouselConfig.keyboard = true;
    CarouselConfig.pauseOnHover = true;
    this.spinnerService.hide();
  }

  ngOnInit() {
    this.spinnerService.show();
    this.tabslist = ['Summary', 'Customised Reports'];
    this.brands = ['Registered Box Ids', 'Model Search', 'AutoSearch', 'BIN Downloads', 'Zip Downloads', 'Feedback API'];
    // $('.nav-item').removeClass('active');
    // $('a#nav-home-tab0').addClass('active');
    // $('#reportcontent').css('display', 'none');
    $('#summarycontent').css('display', 'block');
    let dataType = 1;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: this.ShowFilter
    };
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
                modifyItems.push(filterProjects[j]['item_text']);
              }
              let DbInstances = [];
              for (var j = 0; j < clientArray.length; j++) {
                DbInstances.push(clientArray[j]['dbPath']);
              }
              this.Project = modifyItems;
              this.dbinstance = lodash.uniqWith(DbInstances, lodash.isEqual);
              this.summary_db_instance = this.dbinstance[0];
              let temp = [];
              this.Project.forEach(element => {
                if (element.startsWith(this.summary_db_instance + '_')) {
                  temp.push(element)
                }
              })

              console.log(temp);
              this.projects = temp;
              this.showProjectsfornonAdmin = true;
              this.projectNames = this.projects[0];
              this.condition();
            });
        } else {
          let selectedItems = [];
          for (var i = 0; i < this.ProjectList.length; i++) {
            selectedItems.push(this.ProjectList[i]['item_text']);
          }
          this.mainService.getAllDbInstance(4, '', '', 1)
            .subscribe(value => {
              let instance = [];
              for (let i = 0; i < value.data.length; i++) {
                instance.push(value.data[i]['dbInstance'])
              }
              this.dbinstance = instance;
              this.summary_db_instance = this.dbinstance[0];
              this.Project = selectedItems;
              let temp = [];
              this.Project.forEach(element => {
                if (element.startsWith(this.summary_db_instance + '_')) {
                  temp.push(element)
                }
              })
              console.log(temp);
              this.projects = temp;
              this.showProjectsforAdmin = true;
              this.condition();
            });
        }
      })
    var self = this;
    if (this.role != 'Admin') {
      $('.carousel-control-prev').click(function () {
        self.Device = null;
        self.projectNames = self.projects[0];
        self.condition();
      });

      $('.carousel-control-next').click(function () {
        self.Device = null;
        self.projectNames = self.projects[0];
        self.condition();
      });
    }
    else {
      $('.carousel-control-prev').click(function () {
        self.Device = null;
        self.projectNames = null;
        self.condition();
      });

      $('.carousel-control-next').click(function () {
        self.Device = null;
        self.projectNames = null;
        self.condition();
      });
    }


  }

  dashboard() {
    this.router.navigate(['/dashboard'])
      .then(() => {
        location.reload();
      });
  }

  /** If Brand List drodown is changed to show version activation based on selection for needed brands **/

  changeProject() {
    let versionfilter = []; let Version = [];
    versionfilter = this.mainArr.filter(u => u.projectname === this.projectNames && u.dbinstance === this.summary_db_instance);
    versionfilter.forEach(element => {
      Version.push(element['embeddedDbVersion'])
    })
    this.versions = lodash.uniqWith(Version, lodash.isEqual);
    let project = this.projectNames;
    let dbname = this.summary_db_instance;
    if (project == null || project == 'null') {
      project == null;
    }
    else if (project.startsWith(dbname + '_')) {
      project = project.replace(dbname + '_', '')
    }
    this.Device = null;
    this.CountrywiseReg(project);
    this.MonthwiseReg(project);
    this.MonthwiseReReg(project);
    this.TotalcountReg(project);
    this.MonthwiseModelSearch(project);
    this.MonthwiseAutoSearch(project);
    this.ModelSearchbasedonResulttype(project);
    this.AutoSearchbasedonResulttype(project);
    this.AvgResponseTimeModelSearch(project);
    this.AvgResponseTimeAutoSearch(project);
    this.changeDevice();
  }

  changeDevice() {
    let project = this.projectNames;
    let dbname = this.summary_db_instance;
    if (project == null || project == 'null') {
      project == null;
    }
    else if (project.startsWith(dbname + '_')) {
      project = project.replace(dbname + '_', '')
    }

    this.TopSearchBrand(project);
    this.TopSearchModel(project);
    this.TopSearchVendorID(project);
    this.TopSearchOSD(project);
  }

  /** getting previous selected dropdown value to handle datatable view start **/
  onModelChange(event) {
    if (event) {
      this.oldValue = this.currentVal;
      this.currentVal = event;
    }
  }
  /** getting previous selected dropdown value to handle datatable view end **/

  summary() {
    $('#reportcontent').css('display', 'none');
    $('#summarycontent').css('display', 'block');
    this.spinnerService.hide();
    let datatype = 1;
    let dbname = this.summary_db_instance;
    let temp = [];
    this.Project.forEach(element => {
      if (element.startsWith(dbname + '_')) {
        temp.push(element)
      }
    })
    this.projects = temp;
    this.projectNames = this.projects[0];
    this.mainService.GetReports(dbname, datatype)
      .then(value => {
        this.graphreports = value.data;
        if (this.graphreports !== '0' && value.statusCode === "200") {
          $('#chart-carousel').css('display', 'block');
          let project = this.projectNames;
          if (project == null || project == 'null') {
            project == null;
          }
          else if (project.startsWith(dbname + '_')) {
            project = project.replace(dbname + '_', '')
          }
          this.CountrywiseReg(project);
          this.MonthwiseReg(project);
          this.MonthwiseReReg(project);
          this.TotalcountReg(project);
          this.MonthwiseModelSearch(project);
          this.MonthwiseAutoSearch(project);
          this.ModelSearchbasedonResulttype(project);
          this.AutoSearchbasedonResulttype(project);
          this.AvgResponseTimeModelSearch(project);
          this.AvgResponseTimeAutoSearch(project);
          this.TopSearchBrand(project);
          this.TopSearchModel(project);
          this.TopSearchVendorID(project);
          this.TopSearchOSD(project);
        }
        else {
          this.spinnerService.hide();
          $('#chart-carousel').css('display', 'none');
        }
      })
  }

  CountrywiseReg(projectName) {

    let countrywise = []; let Countries = []; let individualcountrywise = [];
    this.graphreports.table.forEach(element => {
      if (element['country'] === null) {
        element['country'] = "null"
      }
      countrywise.push({ Country: element['country'], Count: element['count'], ProjectName: element['projectName'], Version: element['embeddedDBVersion'] })
    });
    this.Countrywise = countrywise;
    //list of Countries and Project
    countrywise.forEach(element => {
      Countries.push(element['Country']);
    })

    Countries = lodash.uniqWith(Countries, lodash.isEqual)
    let groupbycountry = lodash.groupBy(countrywise, 'Country');
    let groupbyproject = lodash.groupBy(countrywise, 'ProjectName')

    let Version = this.db_version;
    if ((projectName === null || projectName === 'null') && (Version === null || Version === 'null')) {
      this.records_CountrywiseReg = [];
      for (let i = 0; i < Countries.length; i++) {
        let count = 0;
        for (let j = 0; j < groupbycountry[Countries[i]].length; j++) {
          count += groupbycountry[Countries[i]][j]['Count'];
          if (j + 1 == groupbycountry[Countries[i]].length) {
            individualcountrywise.push({ Country: Countries[i], Count: count })
            this.records_CountrywiseReg = individualcountrywise
          }
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version === null || Version === 'null')) {
      this.records_CountrywiseReg = [];
      Countries = [];
      this.Countrywise = countrywise;
      countrywise = countrywise.filter(u => u.ProjectName === projectName);
      //list of Countries
      countrywise.forEach(element => {
        Countries.push(element['Country']);
      })

      Countries = lodash.uniqWith(Countries, lodash.isEqual);
      let groupbyproject_Country = lodash.groupBy(groupbyproject[projectName], 'Country');
      for (let i = 0; i < Countries.length; i++) {
        let count = 0;
        if (groupbyproject_Country[Countries[i]] != undefined) {
          for (let j = 0; j < groupbyproject_Country[Countries[i]].length; j++) {
            count += groupbyproject_Country[Countries[i]][j]['Count'];
            if (j + 1 == groupbyproject_Country[Countries[i]].length) {
              individualcountrywise.push({ Country: Countries[i], Count: count })
              this.records_CountrywiseReg = individualcountrywise
            }
          }
        }
        else {
          this.records_CountrywiseReg = [];
        }

      }
    }

    if ((projectName != null && projectName != 'null') && (Version != null && Version != 'null')) {
      this.records_CountrywiseReg = [];
      let filter_countrywise = [];
      filter_countrywise = countrywise.filter(u => u.ProjectName === projectName && u.Version === Version)
      filter_countrywise.forEach(element => {
        individualcountrywise.push({ Country: element['Country'], Count: element['Count'] })
      })
      this.records_CountrywiseReg = individualcountrywise
    }
    // console.log(this.records_CountrywiseReg)
    let DataPoints = [];
    this.records_CountrywiseReg.forEach(element => {
      DataPoints.push({ x: element['Country'], y: element['Count'] })
    });

    this.Countrywise_series = [{
      name: "Country",
      data: DataPoints
    }]
    this.Countrywise_title = {
      text: 'Country Wise Registration Data',
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    }
    this.Countrywise_chart = {
      type: "bar",
      height: 350
    }
    this.Countrywise_plotOptions = {
      bar: {
        horizontal: false
      }
    }
    this.Countrywise_dataLabels = {
      enabled: false
    }
    this.Countrywise_xaxis = {
      type: 'category',
      title: {
        text: 'Country'
      },
    }
    this.Countrywise_yaxis = {
      title: {
        text: 'Count'
      },
    };
  }

  MonthwiseReg(projectName) {
    let MonthwiseReg = []; let Monthwise = []; let month_year = []; let individualmonth_year = [];
    Monthwise = this.graphreports.table1;

    Monthwise.forEach(element => {
      if (element['reportmonth'] === 1) {
        element['reportmonth'] = 'Jan'
      }
      if (element['reportmonth'] === 2) {
        element['reportmonth'] = 'Feb'
      }
      if (element['reportmonth'] === 3) {
        element['reportmonth'] = 'March'
      }
      if (element['reportmonth'] === 4) {
        element['reportmonth'] = 'April'
      }
      if (element['reportmonth'] === 5) {
        element['reportmonth'] = 'May'
      }
      if (element['reportmonth'] === 6) {
        element['reportmonth'] = 'June'
      }
      if (element['reportmonth'] === 7) {
        element['reportmonth'] = 'July'
      }
      if (element['reportmonth'] === 8) {
        element['reportmonth'] = 'Aug'
      }
      if (element['reportmonth'] === 9) {
        element['reportmonth'] = 'Sept'
      }
      if (element['reportmonth'] === 10) {
        element['reportmonth'] = 'Oct'
      }
      if (element['reportmonth'] === 11) {
        element['reportmonth'] = 'Nov'
      }
      if (element['reportmonth'] === 12) {
        element['reportmonth'] = 'Dec'
      }
    })
    for (let i = 0; i < Monthwise.length; i++) {
      MonthwiseReg.push({ 'Month-Year': Monthwise[i]['reportmonth'] + '-' + Monthwise[i]['reportyear'], Count: Monthwise[i]['count'], ProjectName: Monthwise[i]['projectName'], Version: Monthwise[i]['embeddedDBVersion'] })
    }
    MonthwiseReg.forEach(element => {
      month_year.push(element['Month-Year'])
    })
    month_year = lodash.uniqWith(month_year, lodash.isEqual)
    let groupbymonth_year = lodash.groupBy(MonthwiseReg, 'Month-Year');
    let groupbyproject = lodash.groupBy(MonthwiseReg, 'ProjectName')

    let Version = this.db_version;
    if ((projectName === null || projectName === 'null') && (Version === null || Version === 'null')) {
      this.records_MonthwiseReg = [];
      for (let i = 0; i < month_year.length; i++) {
        let count = 0;
        for (let j = 0; j < groupbymonth_year[month_year[i]].length; j++) {
          count += groupbymonth_year[month_year[i]][j]['Count'];
          if (j + 1 == groupbymonth_year[month_year[i]].length) {
            individualmonth_year.push({ 'Month-Year': month_year[i], Count: count })
            this.records_MonthwiseReg = individualmonth_year
          }
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version === null || Version === 'null')) {
      this.records_MonthwiseReg = [];
      month_year = [];
      MonthwiseReg = MonthwiseReg.filter(u => u.ProjectName === projectName);
      //list of Month-Year
      MonthwiseReg.forEach(element => {
        month_year.push(element['Month-Year']);
      })

      month_year = lodash.uniqWith(month_year, lodash.isEqual);
      let groupbyproject_month_year = lodash.groupBy(groupbyproject[projectName], 'Month-Year')
      for (let i = 0; i < month_year.length; i++) {
        let count = 0;
        if (groupbyproject_month_year[month_year[i]] != undefined) {
          for (let j = 0; j < groupbyproject_month_year[month_year[i]].length; j++) {
            count += groupbyproject_month_year[month_year[i]][j]['Count'];
            if (j + 1 == groupbyproject_month_year[month_year[i]].length) {
              individualmonth_year.push({ 'Month-Year': month_year[i], Count: count })
              this.records_MonthwiseReg = individualmonth_year
            }
          }
        }
        else {
          this.records_MonthwiseReg = [];
        }

      }
    }

    if ((projectName != null && projectName != 'null') && (Version != null && Version != 'null')) {
      this.records_MonthwiseReg = [];
      let filter_month_year = [];
      filter_month_year = month_year.filter(u => u.ProjectName === projectName && u.Version === Version)
      filter_month_year.forEach(element => {
        individualmonth_year.push({ 'Month-Year': element['Month-Year'], Count: element['Count'] })
      })
      this.records_MonthwiseReg = individualmonth_year
    }
    // console.log(this.records_MonthwiseReg)
    let DataPoints = [];
    this.records_MonthwiseReg.forEach(element => {
      DataPoints.push({ x: element['Month-Year'], y: element['Count'] })
    });
  }

  MonthwiseReReg(projectName) {
    let MonthwiseReReg = []; let Monthwise = []; let month_year = []; let individualmonth_year = [];
    Monthwise = this.graphreports.table2;

    Monthwise.forEach(element => {
      if (element['reportmonth'] === 1) {
        element['reportmonth'] = 'Jan'
      }
      if (element['reportmonth'] === 2) {
        element['reportmonth'] = 'Feb'
      }
      if (element['reportmonth'] === 3) {
        element['reportmonth'] = 'March'
      }
      if (element['reportmonth'] === 4) {
        element['reportmonth'] = 'April'
      }
      if (element['reportmonth'] === 5) {
        element['reportmonth'] = 'May'
      }
      if (element['reportmonth'] === 6) {
        element['reportmonth'] = 'June'
      }
      if (element['reportmonth'] === 7) {
        element['reportmonth'] = 'July'
      }
      if (element['reportmonth'] === 8) {
        element['reportmonth'] = 'Aug'
      }
      if (element['reportmonth'] === 9) {
        element['reportmonth'] = 'Sept'
      }
      if (element['reportmonth'] === 10) {
        element['reportmonth'] = 'Oct'
      }
      if (element['reportmonth'] === 11) {
        element['reportmonth'] = 'Nov'
      }
      if (element['reportmonth'] === 12) {
        element['reportmonth'] = 'Dec'
      }
    })
    for (let i = 0; i < Monthwise.length; i++) {
      MonthwiseReReg.push({ 'Month-Year': Monthwise[i]['reportmonth'] + '-' + Monthwise[i]['reportyear'], Count: Monthwise[i]['count'], ProjectName: Monthwise[i]['projectName'], Version: Monthwise[i]['embeddedDBVersion'] })
    }
    MonthwiseReReg.forEach(element => {
      month_year.push(element['Month-Year'])
    })
    month_year = lodash.uniqWith(month_year, lodash.isEqual)
    let groupbymonth_year = lodash.groupBy(MonthwiseReReg, 'Month-Year');
    let groupbyproject = lodash.groupBy(MonthwiseReReg, 'ProjectName')

    let Version = this.db_version;
    if ((projectName === null || projectName === 'null') && (Version === null || Version === 'null')) {
      this.records_MonthwiseReReg = [];
      for (let i = 0; i < month_year.length; i++) {
        let count = 0;
        for (let j = 0; j < groupbymonth_year[month_year[i]].length; j++) {
          count += groupbymonth_year[month_year[i]][j]['Count'];
          if (j + 1 == groupbymonth_year[month_year[i]].length) {
            individualmonth_year.push({ 'Month-Year': month_year[i], Count: count })
            this.records_MonthwiseReReg = individualmonth_year
          }
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version === null || Version === 'null')) {
      this.records_MonthwiseReReg = [];
      month_year = [];
      MonthwiseReReg = MonthwiseReReg.filter(u => u.ProjectName === projectName);
      //list of Month-Year
      MonthwiseReReg.forEach(element => {
        month_year.push(element['Month-Year']);
      })

      month_year = lodash.uniqWith(month_year, lodash.isEqual);
      let groupbyproject_month_year = lodash.groupBy(groupbyproject[projectName], 'Month-Year')
      for (let i = 0; i < month_year.length; i++) {
        let count = 0;
        if (groupbyproject_month_year[month_year[i]] != undefined) {
          for (let j = 0; j < groupbyproject_month_year[month_year[i]].length; j++) {
            count += groupbyproject_month_year[month_year[i]][j]['Count'];
            if (j + 1 == groupbyproject_month_year[month_year[i]].length) {
              individualmonth_year.push({ 'Month-Year': month_year[i], Count: count })
              this.records_MonthwiseReReg = individualmonth_year
            }
          }
        }
        else {
          this.records_MonthwiseReReg = [];
        }

      }
    }

    if ((projectName != null && projectName != 'null') && (Version != null && Version != 'null')) {
      let filter_month_year = [];
      filter_month_year = month_year.filter(u => u.ProjectName === projectName && u.Version === Version)
      filter_month_year.forEach(element => {
        individualmonth_year.push({ 'Month-Year': element['Month-Year'], Count: element['Count'] })
      })
      this.records_MonthwiseReReg = individualmonth_year
    }
    // console.log(this.records_MonthwiseReReg)
    let DataPoints = []; let DataPoints1 = [];
    this.records_MonthwiseReg.forEach(element => {
      DataPoints.push({ x: element['Month-Year'], y: element['Count'] })
    });
    this.records_MonthwiseReReg.forEach(element => {
      DataPoints1.push({ x: element['Month-Year'], y: element['Count'] })
    });

    this.Monthwise_Reg_series = [{
      name: "No. of Registrations",
      data: DataPoints
    },
      // {
      //   name: "No. of Re-Registrations",
      //   data: DataPoints1
      // },
    ],
      this.Monthwise_Reg_title = {
        // text: 'Month Wise Reg. and Re-Reg. Data',
        text: 'Month Wise Reg. Data',
        align: 'center',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          fontFamily: 'none'
        }
      },
      this.Monthwise_Reg_chart = {
        type: "bar",
        height: 350
      },
      this.Monthwise_Reg_plotOptions = {
        bar: {
          horizontal: false
        }
      },
      this.Monthwise_Reg_dataLabels = {
        enabled: false
      },
      this.Monthwise_Reg_stroke = {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      this.Monthwise_Reg_xaxis = {
        type: 'category',
        title: {
          text: 'Month-year'
        },
      },
      this.Monthwise_Reg_yaxis = {
        title: {
          text: 'Count'
        },
      };
    this.Monthwise_Reg_color = ['#008FFB', '#E91E63'];
    this.spinnerService.hide();
  }

  TotalcountReg(projectName) {
    let UnSuccessfulreg; let Successfulreg; let Successfulrereg;
    Successfulreg = this.graphreports.table3;
    Successfulrereg = this.graphreports.table4;
    UnSuccessfulreg = this.graphreports.table5;
    let groupbyproject_Successfulreg = lodash.groupBy(Successfulreg, 'projectName');
    let groupbyproject_Successfulrereg = lodash.groupBy(Successfulrereg, 'projectName');
    let Version = this.db_version;
    if ((projectName === null || projectName === 'null') && (Version === null || Version === 'null')) {
      this.successfulreg = 0; this.successfulrereg = 0; this.unSuccessfulreg = 0;
      let count = 0;
      for (let j = 0; j < Successfulreg.length; j++) {
        count += Successfulreg[j]['registrationApiCount_Successful'];
        if (j + 1 == Successfulreg.length) {
          this.successfulreg = count;
          count = 0;
        }
      }
      for (let j = 0; j < Successfulrereg.length; j++) {
        count += Successfulrereg[j]['registrationApiCount_Successful'];
        if (j + 1 == Successfulrereg.length) {
          this.successfulrereg = count;
          count = 0;
        }
      }
      for (let j = 0; j < UnSuccessfulreg.length; j++) {
        count += UnSuccessfulreg[j]['registrationApiCount_Failed'];
        if (j + 1 == UnSuccessfulreg.length) {
          this.unSuccessfulreg = count;
          count = 0;
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version === null || Version === 'null')) {
      this.successfulreg = 0; this.successfulrereg = 0; this.unSuccessfulreg = 0;
      let count = 0;
      if (groupbyproject_Successfulreg[projectName] != undefined) {
        for (let j = 0; j < groupbyproject_Successfulreg[projectName].length; j++) {
          count += groupbyproject_Successfulreg[projectName][j]['registrationApiCount_Successful'];
          if (j + 1 == groupbyproject_Successfulreg[projectName].length) {
            this.successfulreg = count;
            count = 0;
          }
        }
      }
      else {
        this.successfulreg = 0;
      }
      if (groupbyproject_Successfulrereg[projectName] != undefined) {
        for (let j = 0; j < groupbyproject_Successfulrereg[projectName].length; j++) {
          count += groupbyproject_Successfulrereg[projectName][j]['registrationApiCount_Successful'];
          if (j + 1 == groupbyproject_Successfulrereg[projectName].length) {
            this.successfulrereg = count;
            count = 0;
          }
        }
      }
      else {
        this.successfulrereg = 0;
      }

      this.unSuccessfulreg = this.graphreports.table5[0]['registrationApiCount_Failed'];
    }

    if ((projectName != null && projectName != 'null') && (Version != null && Version != 'null')) {
      let filter_Successfulreg = []; let filter_Successfulrereg = [];
      filter_Successfulreg = Successfulreg.filter(u => u.projectName === projectName && u.embeddedDBVersion === Version)
      this.successfulreg = filter_Successfulreg[0]['registrationApiCount_Successful'];
      filter_Successfulrereg = Successfulrereg.filter(u => u.projectName === projectName && u.embeddedDBVersion === Version)
      this.successfulrereg = filter_Successfulrereg[0]['registrationApiCount_Successful'];
      this.unSuccessfulreg = this.graphreports.table5[0]['registrationApiCount_Failed'];
    }
    // console.log(this.successfulreg, this.successfulrereg, this.unSuccessfulreg);

    this.TotalcountReg_series = [this.successfulreg, this.successfulrereg, this.unSuccessfulreg];
    this.TotalcountReg_title = {
      text: 'Total Registration Count',
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    },
      this.TotalcountReg_chart = {
        height: 350,
        type: "pie",
        toolbar: {
          show: true
        }
      },
      this.TotalcountReg_labels = ["Successful Registration Count", "Successful Re-Registration Count", "Unsuccessful Registration Count (Project Independent)"]
    this.TotalcountReg_color = ['#00E396', '#008FFB', '#FEB019'];

    this.spinnerService.hide();
  }

  MonthwiseModelSearch(projectName) {
    let MonthwiseModelSearch = []; let Monthwise = []; let month_year = []; let individualmonth_year = [];
    Monthwise = this.graphreports.table6;

    Monthwise.forEach(element => {
      if (element['reportmonth'] === 1) {
        element['reportmonth'] = 'Jan'
      }
      if (element['reportmonth'] === 2) {
        element['reportmonth'] = 'Feb'
      }
      if (element['reportmonth'] === 3) {
        element['reportmonth'] = 'March'
      }
      if (element['reportmonth'] === 4) {
        element['reportmonth'] = 'April'
      }
      if (element['reportmonth'] === 5) {
        element['reportmonth'] = 'May'
      }
      if (element['reportmonth'] === 6) {
        element['reportmonth'] = 'June'
      }
      if (element['reportmonth'] === 7) {
        element['reportmonth'] = 'July'
      }
      if (element['reportmonth'] === 8) {
        element['reportmonth'] = 'Aug'
      }
      if (element['reportmonth'] === 9) {
        element['reportmonth'] = 'Sept'
      }
      if (element['reportmonth'] === 10) {
        element['reportmonth'] = 'Oct'
      }
      if (element['reportmonth'] === 11) {
        element['reportmonth'] = 'Nov'
      }
      if (element['reportmonth'] === 12) {
        element['reportmonth'] = 'Dec'
      }
    })
    for (let i = 0; i < Monthwise.length; i++) {
      MonthwiseModelSearch.push({ 'Month-Year': Monthwise[i]['reportmonth'] + '-' + Monthwise[i]['reportyear'], Count: Monthwise[i]['count'], BoxId: Monthwise[i]['boxId'], ProjectName: Monthwise[i]['projectName'], Version: Monthwise[i]['embeddedDBVersion'] })
    }
    MonthwiseModelSearch.forEach(element => {
      month_year.push(element['Month-Year'])
    })
    month_year = lodash.uniqWith(month_year, lodash.isEqual)
    let groupbymonth_year = lodash.groupBy(MonthwiseModelSearch, 'Month-Year');
    let groupbyproject = lodash.groupBy(MonthwiseModelSearch, 'ProjectName');
    let Version = this.db_version;
    if ((projectName === null || projectName === 'null') && (Version === null || Version === 'null')) {
      this.records_MonthwiseModelSearch = [];
      for (let i = 0; i < month_year.length; i++) {
        let count = 0; let boxid;
        for (let j = 0; j < groupbymonth_year[month_year[i]].length; j++) {
          count += groupbymonth_year[month_year[i]][j]['Count'];
          if (j + 1 == groupbymonth_year[month_year[i]].length) {
            individualmonth_year.push({ 'Month-Year': month_year[i], Count: count })
            this.records_MonthwiseModelSearch = individualmonth_year
          }
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version === null || Version === 'null')) {
      this.records_MonthwiseModelSearch = [];
      month_year = [];
      MonthwiseModelSearch = MonthwiseModelSearch.filter(u => u.ProjectName === projectName);
      //list of Month-Year
      MonthwiseModelSearch.forEach(element => {
        month_year.push(element['Month-Year']);
      })
      month_year = lodash.uniqWith(month_year, lodash.isEqual);
      let groupbyproject_month_year = lodash.groupBy(groupbyproject[projectName], 'Month-Year')
      for (let i = 0; i < month_year.length; i++) {
        let count = 0;
        if (groupbyproject_month_year[month_year[i]] != undefined) {
          for (let j = 0; j < groupbyproject_month_year[month_year[i]].length; j++) {
            count += groupbyproject_month_year[month_year[i]][j]['Count'];
            if (j + 1 == groupbyproject_month_year[month_year[i]].length) {
              individualmonth_year.push({ 'Month-Year': month_year[i], Count: count })
              this.records_MonthwiseModelSearch = individualmonth_year
            }
          }
        }
        else {
          this.records_MonthwiseModelSearch = [];
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version != null && Version != 'null')) {
      this.records_MonthwiseModelSearch = [];
      let filter_month_year = [];
      filter_month_year = month_year.filter(u => u.ProjectName === projectName && u.Version === Version)
      filter_month_year.forEach(element => {
        individualmonth_year.push({ 'Month-Year': element['Month-Year'], Count: element['Count'] })
      })
      this.records_MonthwiseModelSearch = individualmonth_year
    }
    // console.log(this.records_MonthwiseModelSearch)
    this.spinnerService.hide();
  }

  MonthwiseAutoSearch(projectName) {
    let MonthwiseAutoSearch = []; let Monthwise = []; let month_year = []; let individualmonth_year = [];
    Monthwise = this.graphreports.table11;

    Monthwise.forEach(element => {
      if (element['reportmonth'] === 1) {
        element['reportmonth'] = 'Jan'
      }
      if (element['reportmonth'] === 2) {
        element['reportmonth'] = 'Feb'
      }
      if (element['reportmonth'] === 3) {
        element['reportmonth'] = 'March'
      }
      if (element['reportmonth'] === 4) {
        element['reportmonth'] = 'April'
      }
      if (element['reportmonth'] === 5) {
        element['reportmonth'] = 'May'
      }
      if (element['reportmonth'] === 6) {
        element['reportmonth'] = 'June'
      }
      if (element['reportmonth'] === 7) {
        element['reportmonth'] = 'July'
      }
      if (element['reportmonth'] === 8) {
        element['reportmonth'] = 'Aug'
      }
      if (element['reportmonth'] === 9) {
        element['reportmonth'] = 'Sept'
      }
      if (element['reportmonth'] === 10) {
        element['reportmonth'] = 'Oct'
      }
      if (element['reportmonth'] === 11) {
        element['reportmonth'] = 'Nov'
      }
      if (element['reportmonth'] === 12) {
        element['reportmonth'] = 'Dec'
      }
    })
    for (let i = 0; i < Monthwise.length; i++) {
      MonthwiseAutoSearch.push({ 'Month-Year': Monthwise[i]['reportmonth'] + '-' + Monthwise[i]['reportyear'], Count: Monthwise[i]['count'], BoxId: Monthwise[i]['boxId'], ProjectName: Monthwise[i]['projectName'], Version: Monthwise[i]['embeddedDBVersion'] })
    }
    MonthwiseAutoSearch.forEach(element => {
      month_year.push(element['Month-Year'])
    })
    month_year = lodash.uniqWith(month_year, lodash.isEqual)
    let groupbymonth_year = lodash.groupBy(MonthwiseAutoSearch, 'Month-Year');
    let groupbyproject = lodash.groupBy(MonthwiseAutoSearch, 'ProjectName');
    let Version = this.db_version;
    if ((projectName === null || projectName === 'null') && (Version === null || Version === 'null')) {
      this.records_MonthwiseAutoSearch = [];
      for (let i = 0; i < month_year.length; i++) {
        let count = 0; let boxid;
        for (let j = 0; j < groupbymonth_year[month_year[i]].length; j++) {
          count += groupbymonth_year[month_year[i]][j]['Count'];
          if (j + 1 == groupbymonth_year[month_year[i]].length) {
            individualmonth_year.push({ 'Month-Year': month_year[i], Count: count })
            this.records_MonthwiseAutoSearch = individualmonth_year
          }
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version === null || Version === 'null')) {
      this.records_MonthwiseAutoSearch = [];
      month_year = [];
      MonthwiseAutoSearch = MonthwiseAutoSearch.filter(u => u.ProjectName === projectName);
      //list of Month-Year
      MonthwiseAutoSearch.forEach(element => {
        month_year.push(element['Month-Year']);
      })
      month_year = lodash.uniqWith(month_year, lodash.isEqual);
      let groupbyproject_month_year = lodash.groupBy(groupbyproject[projectName], 'Month-Year')
      for (let i = 0; i < month_year.length; i++) {
        let count = 0;
        if (groupbyproject_month_year[month_year[i]] != undefined) {
          for (let j = 0; j < groupbyproject_month_year[month_year[i]].length; j++) {
            count += groupbyproject_month_year[month_year[i]][j]['Count'];
            if (j + 1 == groupbyproject_month_year[month_year[i]].length) {
              individualmonth_year.push({ 'Month-Year': month_year[i], Count: count })
              this.records_MonthwiseAutoSearch = individualmonth_year
            }
          }
        }
        else {
          this.records_MonthwiseAutoSearch = [];
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version != null && Version != 'null')) {
      this.records_MonthwiseAutoSearch = [];
      let filter_month_year = [];
      filter_month_year = month_year.filter(u => u.ProjectName === projectName && u.Version === Version)
      filter_month_year.forEach(element => {
        individualmonth_year.push({ 'Month-Year': element['Month-Year'], Count: element['Count'] })
      })
      this.records_MonthwiseAutoSearch = individualmonth_year
    }
    // console.log(this.records_MonthwiseAutoSearch)
    let DataPoints = []; let DataPoints1 = [];
    this.records_MonthwiseModelSearch.forEach(element => {
      DataPoints.push({ x: element['Month-Year'], y: element['Count'] })
    });
    this.records_MonthwiseAutoSearch.forEach(element => {
      DataPoints1.push({ x: element['Month-Year'], y: element['Count'] })
    });

    this.Monthwise_Search_series = [{
      name: "No. of Model Search",
      data: DataPoints
    },
    {
      name: "No. of Auto Search",
      data: DataPoints1
    },
    ],
      this.Monthwise_Search_title = {
        text: 'Month Wise Model Search and Auto Search',
        align: 'center',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          fontFamily: 'none'
        }
      },
      this.Monthwise_Search_chart = {
        type: "bar",
        height: 350
      },
      this.Monthwise_Search_plotOptions = {
        bar: {
          horizontal: false
        }
      },
      this.Monthwise_Search_dataLabels = {
        enabled: false
      },
      this.Monthwise_Search_stroke = {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      this.Monthwise_Search_xaxis = {
        type: 'category',
        title: {
          text: 'Month-year'
        },
      },
      this.Monthwise_Search_yaxis = {
        title: {
          text: 'Count'
        },
      };
    this.spinnerService.hide();
  }

  ModelSearchbasedonResulttype(projectName) {
    let ModelSearchbasedonResulttype = []; let Resultwise = []; let result_type = []; let individualresult_type = [];
    Resultwise = this.graphreports.table7;

    for (let i = 0; i < Resultwise.length; i++) {
      ModelSearchbasedonResulttype.push({ 'Result': Resultwise[i]['resultType'], Count: Resultwise[i]['count'], BoxId: Resultwise[i]['boxId'], ProjectName: Resultwise[i]['projectName'], Version: Resultwise[i]['embeddedDBVersion'] })
    }
    ModelSearchbasedonResulttype.forEach(element => {
      result_type.push(element['Result']);
    })
    result_type = lodash.uniqWith(result_type, lodash.isEqual);
    let groupbyresult_type = lodash.groupBy(ModelSearchbasedonResulttype, 'Result');
    let groupbyproject = lodash.groupBy(ModelSearchbasedonResulttype, 'ProjectName');
    let Version = this.db_version;
    if ((projectName === null || projectName === 'null') && (Version === null || Version === 'null')) {
      this.recordsModelSearchbasedonResulttype_result_type = [];
      for (let i = 0; i < result_type.length; i++) {
        let count = 0;
        for (let j = 0; j < groupbyresult_type[result_type[i]].length; j++) {
          count += groupbyresult_type[result_type[i]][j]['Count'];
          if (j + 1 == groupbyresult_type[result_type[i]].length) {
            individualresult_type.push({ 'Result': result_type[i], Count: count })
            this.recordsModelSearchbasedonResulttype_result_type = individualresult_type
          }
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version === null || Version === 'null')) {
      this.recordsModelSearchbasedonResulttype_result_type = [];
      result_type = [];
      ModelSearchbasedonResulttype = ModelSearchbasedonResulttype.filter(u => u.ProjectName === projectName);
      ModelSearchbasedonResulttype.forEach(element => {
        result_type.push(element['Result']);
      })
      result_type = lodash.uniqWith(result_type, lodash.isEqual);
      let groupbyproject_result_type = lodash.groupBy(groupbyproject[projectName], 'Result')
      for (let i = 0; i < result_type.length; i++) {
        let count = 0;
        if (groupbyproject_result_type[result_type[i]] != undefined) {
          for (let j = 0; j < groupbyproject_result_type[result_type[i]].length; j++) {
            count += groupbyproject_result_type[result_type[i]][j]['Count'];
            if (j + 1 == groupbyproject_result_type[result_type[i]].length) {
              individualresult_type.push({ 'Result': result_type[i], Count: count })
              this.recordsModelSearchbasedonResulttype_result_type = individualresult_type
            }
          }
        }
        else {
          this.recordsModelSearchbasedonResulttype_result_type = [];
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version != null && Version != 'null')) {
      this.recordsModelSearchbasedonResulttype_result_type = [];
      let filter_month_year = [];
      filter_month_year = ModelSearchbasedonResulttype.filter(u => u.ProjectName === projectName && u.Version === Version)
      let groupbyproject = lodash.groupBy(filter_month_year, 'ProjectName');
      let groupbyproject_result_type = lodash.groupBy(groupbyproject[projectName], 'Result')
      for (let i = 0; i < result_type.length; i++) {
        let count = 0;
        if (groupbyproject_result_type[result_type[i]] != undefined) {
          for (let j = 0; j < groupbyproject_result_type[result_type[i]].length; j++) {
            count += groupbyproject_result_type[result_type[i]][j]['Count'];
            if (j + 1 == groupbyproject_result_type[result_type[i]].length) {
              individualresult_type.push({ 'Result': result_type[i], Count: count })
              this.recordsModelSearchbasedonResulttype_result_type = individualresult_type
            }
          }
        }

      }
    }
    this.recordsModelSearchbasedonResulttype_result_type.forEach(element => {
      if (element['Result'] === 1 || element['Result'] === '1') {
        element['Result'] = 'SearchResult 1'
        element['color'] = '#00E396'
      }
      if (element['Result'] === 2 || element['Result'] === '2') {
        element['Result'] = 'SearchResult 2'
        element['color'] = '#008FFB'
      }
      if (element['Result'] === 3 || element['Result'] === '3') {
        element['Result'] = 'SearchResult 3'
        element['color'] = '#FEB019'
      }
    });
    this.recordsModelSearchbasedonResulttype_result_type = lodash.sortBy(this.recordsModelSearchbasedonResulttype_result_type, ['Result'])
    console.log(this.recordsModelSearchbasedonResulttype_result_type)
    // this.recordsModelSearchbasedonResulttype_result_type = individualresult_type
    let labels = []; let series = []; let colors = [];
    for (let i = 0; i < this.recordsModelSearchbasedonResulttype_result_type.length; i++) {
      labels.push(Object.values(this.recordsModelSearchbasedonResulttype_result_type[i])[0])
      series.push(Object.values(this.recordsModelSearchbasedonResulttype_result_type[i])[1])
      colors.push(Object.values(this.recordsModelSearchbasedonResulttype_result_type[i])[2])
    }
    this.ModelSearchbasedonResulttype_series = series;
    this.ModelSearchbasedonResulttype_title = {
      text: 'Model Search Stats',
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    },
      this.ModelSearchbasedonResulttype_chart = {
        height: 350,
        type: "pie",
        toolbar: {
          show: true
        }
      },
      this.ModelSearchbasedonResulttype_labels = labels
    this.ModelSearchbasedonResulttype_color = colors;
    this.spinnerService.hide();
  }

  AutoSearchbasedonResulttype(projectName) {
    let AutoSearchbasedonResulttype = []; let Resultwise = []; let result_type = []; let individualresult_type = [];
    Resultwise = this.graphreports.table12;

    for (let i = 0; i < Resultwise.length; i++) {
      AutoSearchbasedonResulttype.push({ 'Result': Resultwise[i]['resultType'], Count: Resultwise[i]['count'], BoxId: Resultwise[i]['boxId'], ProjectName: Resultwise[i]['projectName'], Version: Resultwise[i]['embeddedDBVersion'] })
    }
    AutoSearchbasedonResulttype.forEach(element => {
      result_type.push(element['Result'])
    })
    result_type = lodash.uniqWith(result_type, lodash.isEqual)
    let groupbyresult_type = lodash.groupBy(AutoSearchbasedonResulttype, 'Result');
    let groupbyproject = lodash.groupBy(AutoSearchbasedonResulttype, 'ProjectName');
    let Version = this.db_version;
    if ((projectName === null || projectName === 'null') && (Version === null || Version === 'null')) {
      this.recordsAutoSearchbasedonResulttype_result_type = [];
      for (let i = 0; i < result_type.length; i++) {
        let count = 0;
        for (let j = 0; j < groupbyresult_type[result_type[i]].length; j++) {
          count += groupbyresult_type[result_type[i]][j]['Count'];
          if (j + 1 == groupbyresult_type[result_type[i]].length) {
            individualresult_type.push({ 'Result': result_type[i], Count: count })
            this.recordsAutoSearchbasedonResulttype_result_type = individualresult_type
          }
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version === null || Version === 'null')) {
      this.recordsAutoSearchbasedonResulttype_result_type = [];
      result_type = [];
      AutoSearchbasedonResulttype = AutoSearchbasedonResulttype.filter(u => u.ProjectName === projectName);
      AutoSearchbasedonResulttype.forEach(element => {
        result_type.push(element['Result']);
      })
      result_type = lodash.uniqWith(result_type, lodash.isEqual);
      let groupbyproject_result_type = lodash.groupBy(groupbyproject[projectName], 'Result')
      for (let i = 0; i < result_type.length; i++) {
        let count = 0;
        if (groupbyproject_result_type[result_type[i]] != undefined) {
          for (let j = 0; j < groupbyproject_result_type[result_type[i]].length; j++) {
            count += groupbyproject_result_type[result_type[i]][j]['Count'];
            if (j + 1 == groupbyproject_result_type[result_type[i]].length) {
              individualresult_type.push({ 'Result': result_type[i], Count: count })
              this.recordsAutoSearchbasedonResulttype_result_type = individualresult_type
            }
          }
        }
        else {
          this.recordsModelSearchbasedonResulttype_result_type = [];
        }
      }
    }

    if ((projectName != null && projectName != 'null') && (Version != null && Version != 'null')) {
      this.recordsAutoSearchbasedonResulttype_result_type = [];
      let filter_month_year = [];
      filter_month_year = AutoSearchbasedonResulttype.filter(u => u.ProjectName === projectName && u.Version === Version)
      let groupbyproject = lodash.groupBy(filter_month_year, 'ProjectName');
      let groupbyproject_result_type = lodash.groupBy(groupbyproject[projectName], 'Result')
      for (let i = 0; i < result_type.length; i++) {
        let count = 0;
        if (groupbyproject_result_type[result_type[i]] != undefined) {
          for (let j = 0; j < groupbyproject_result_type[result_type[i]].length; j++) {
            count += groupbyproject_result_type[result_type[i]][j]['Count'];
            if (j + 1 == groupbyproject_result_type[result_type[i]].length) {
              individualresult_type.push({ 'Result': result_type[i], Count: count })
              this.recordsAutoSearchbasedonResulttype_result_type = individualresult_type
            }
          }
        }
        else {
          this.recordsModelSearchbasedonResulttype_result_type = []
        }
      }
    }
    this.recordsAutoSearchbasedonResulttype_result_type.forEach(element => {
      if (element['Result'] === 1 || element['Result'] === '1') {
        element['Result'] = 'SearchResult 1'
        element['color'] = '#00E396'
      }
      if (element['Result'] === 2 || element['Result'] === '2') {
        element['Result'] = 'SearchResult 2'
        element['color'] = '#008FFB'
      }
      if (element['Result'] === 3 || element['Result'] === '3') {
        element['Result'] = 'SearchResult 3'
        element['color'] = '#FEB019'
      }
    });

    this.recordsAutoSearchbasedonResulttype_result_type = lodash.sortBy(this.recordsAutoSearchbasedonResulttype_result_type, ['Result']);
    // console.log(this.recordsAutoSearchbasedonResulttype_result_type);
    // this.recordsAutoSearchbasedonResulttype_result_type = individualresult_type
    let labels = []; let series = []; let colors = [];
    for (let i = 0; i < this.recordsAutoSearchbasedonResulttype_result_type.length; i++) {
      labels.push(Object.values(this.recordsAutoSearchbasedonResulttype_result_type[i])[0])
      series.push(Object.values(this.recordsAutoSearchbasedonResulttype_result_type[i])[1])
      colors.push(Object.values(this.recordsAutoSearchbasedonResulttype_result_type[i])[2])
    }
    // console.log(labels,series)
    this.AutoSearchbasedonResulttype_series = series;
    this.AutoSearchbasedonResulttype_title = {
      text: 'Auto Search Stats',
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    },
      this.AutoSearchbasedonResulttype_chart = {
        height: 350,
        type: "pie",
        toolbar: {
          show: true
        }
      },
      this.AutoSearchbasedonResulttype_labels = labels
    this.AutoSearchbasedonResulttype_color = colors
    this.spinnerService.hide();
  }

  TopSearchBrand(projectname) {
    let TopSearchBrand = []; let Devicelist = []; let individualDevice = []; let brand = [];
    this.graphreports.table10.forEach(element => {
      if (element['brand'] === null || element['brand'] === '') {
        element['brand'] = "null"
      }
      TopSearchBrand.push({ Device: element['device'].toUpperCase(), Brand: element['brand'].toUpperCase(), Count: element['count'], ProjectName: element['projectName'], Version: element['embeddedDBVersion'] })
    });

    //list of Devices and Brands
    TopSearchBrand.forEach(element => {
      brand.push(element['Brand'])
      Devicelist.push(element['Device']);
    })
    Devicelist = lodash.uniqWith(Devicelist, lodash.isEqual);
    brand = lodash.uniqWith(brand, lodash.isEqual);
    this.DeviceList = Devicelist
    let device = this.Device;
    let Version = this.db_version;
    let groupbybrand = lodash.groupBy(TopSearchBrand, 'Brand');
    if ((projectname != null && projectname != 'null')) {
      if ((Version === null || Version === 'null') && (device === null || device === 'null')) {
        this.records_TopSearchBrand = [];
        brand = [];
        TopSearchBrand = TopSearchBrand.filter(u => u.ProjectName === projectname);
        TopSearchBrand.forEach(element => {
          brand.push(element['Brand'])
        })
        brand = lodash.uniqWith(brand, lodash.isEqual);
        let groupbybrand = lodash.groupBy(TopSearchBrand, 'Brand');
        for (let i = 0; i < brand.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbybrand[brand[i]].length; j++) {
            count += groupbybrand[brand[i]][j]['Count'];
            if (j + 1 == groupbybrand[brand[i]].length) {
              individualDevice.push({ Brand: brand[i], Count: count })
              this.records_TopSearchBrand = individualDevice
            }
          }
        }
      }

      if ((Version === null || Version === 'null') && (device != null && device != 'null')) {
        this.records_TopSearchBrand = [];
        brand = [];
        TopSearchBrand = TopSearchBrand.filter(u => u.ProjectName === projectname && u.Device === device);
        TopSearchBrand.forEach(element => {
          brand.push(element['Brand'])
        })
        brand = lodash.uniqWith(brand, lodash.isEqual);
        let groupbybrand = lodash.groupBy(TopSearchBrand, 'Brand');
        for (let i = 0; i < brand.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbybrand[brand[i]].length; j++) {
            count += groupbybrand[brand[i]][j]['Count'];
            if (j + 1 == groupbybrand[brand[i]].length) {
              individualDevice.push({ Brand: brand[i], Count: count })
              this.records_TopSearchBrand = individualDevice
            }
          }
        }
      }

      if ((Version != null && Version != 'null') && (device === null || device === 'null')) {
        this.records_TopSearchBrand = [];
        brand = [];
        TopSearchBrand = TopSearchBrand.filter(u => u.ProjectName === projectname && u.Version === Version);
        TopSearchBrand.forEach(element => {
          brand.push(element['Brand'])
        })
        brand = lodash.uniqWith(brand, lodash.isEqual);
        let groupbybrand = lodash.groupBy(TopSearchBrand, 'Brand');
        for (let i = 0; i < brand.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbybrand[brand[i]].length; j++) {
            count += groupbybrand[brand[i]][j]['Count'];
            if (j + 1 == groupbybrand[brand[i]].length) {
              individualDevice.push({ Brand: brand[i], Count: count })
              this.records_TopSearchBrand = individualDevice
            }
          }
        }
      }
      if ((Version != null && Version != 'null') && (device != null && device != 'null')) {
        this.records_TopSearchBrand = [];
        brand = [];
        TopSearchBrand = TopSearchBrand.filter(u => u.ProjectName === projectname && u.Version === Version && u.Device === device);
        TopSearchBrand.forEach(element => {
          brand.push(element['Brand'])
        })
        brand = lodash.uniqWith(brand, lodash.isEqual);
        let groupbybrand = lodash.groupBy(TopSearchBrand, 'Brand');
        for (let i = 0; i < brand.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbybrand[brand[i]].length; j++) {
            count += groupbybrand[brand[i]][j]['Count'];
            if (j + 1 == groupbybrand[brand[i]].length) {
              individualDevice.push({ Brand: brand[i], Count: count })
              this.records_TopSearchBrand = individualDevice
            }
          }
        }
      }
    }
    if ((projectname === null || projectname === 'null')) {
      if (device === null || device === 'null') {
        this.records_TopSearchBrand = [];
        for (let i = 0; i < brand.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbybrand[brand[i]].length; j++) {
            count += groupbybrand[brand[i]][j]['Count'];
            if (j + 1 == groupbybrand[brand[i]].length) {
              individualDevice.push({ Brand: brand[i], Count: count })
              this.records_TopSearchBrand = individualDevice
            }
          }
        }
      }
      if (device != null && device != 'null') {
        this.records_TopSearchBrand = [];
        brand = [];
        TopSearchBrand = TopSearchBrand.filter(u => u.Device === this.Device);
        TopSearchBrand.forEach(element => {
          brand.push(element['Brand'])
        })
        brand = lodash.uniqWith(brand, lodash.isEqual);
        let groupbybrand = lodash.groupBy(TopSearchBrand, 'Brand');
        for (let i = 0; i < brand.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbybrand[brand[i]].length; j++) {
            count += groupbybrand[brand[i]][j]['Count'];
            if (j + 1 == groupbybrand[brand[i]].length) {
              individualDevice.push({ Brand: brand[i], Count: count })
              this.records_TopSearchBrand = individualDevice
            }
          }
        }
      }
    }
    this.records_TopSearchBrand = lodash.orderBy(this.records_TopSearchBrand, ['Count'], ['desc']).slice(0, this.toprecords)
    let labels = []; let series = [];
    for (let i = 0; i < this.records_TopSearchBrand.length; i++) {
      labels.push(Object.values(this.records_TopSearchBrand[i])[0])
      series.push(Object.values(this.records_TopSearchBrand[i])[1])
    }
    this.TopSearchBrand_series = series;
    this.TopSearchBrand_title = {
      text: 'Top Searched Brands',
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    },
      this.TopSearchBrand_chart = {
        height: 350,
        type: "pie",
        toolbar: {
          show: true
        }
      },
      this.TopSearchBrand_labels = labels
    this.spinnerService.hide();
  }

  TopSearchModel(projectname) {
    let TopSearchModel = []; let individualDevice = []; let model = [];
    this.graphreports.table9.forEach(element => {
      if (element['model'] === null || element['model'] === '') {
        element['model'] = "null"
      }
      TopSearchModel.push({ Device: element['device'].toUpperCase(), Model: element['model'], Count: element['count'], ProjectName: element['projectName'], Version: element['embeddedDBVersion'] })
    });

    //list of Models
    TopSearchModel.forEach(element => {
      model.push(element['Model'])
    })

    model = lodash.uniqWith(model, lodash.isEqual);
    let device = this.Device;
    let Version = this.db_version;
    let groupbymodel = lodash.groupBy(TopSearchModel, 'Model');
    if ((projectname != null && projectname != 'null')) {
      if ((Version === null || Version === 'null') && (device === null || device === 'null')) {
        this.records_TopSearchModel = [];
        model = [];
        TopSearchModel = TopSearchModel.filter(u => u.ProjectName === projectname);
        TopSearchModel.forEach(element => {
          model.push(element['Model']);
        })
        model = lodash.uniqWith(model, lodash.isEqual);
        let groupbymodel = lodash.groupBy(TopSearchModel, 'Model');
        for (let i = 0; i < model.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbymodel[model[i]].length; j++) {
            count += groupbymodel[model[i]][j]['Count'];
            if (j + 1 == groupbymodel[model[i]].length) {
              individualDevice.push({ Model: model[i], Count: count })
              this.records_TopSearchModel = individualDevice
            }
          }
        }
      }

      if ((Version === null || Version === 'null') && (device != null && device != 'null')) {
        this.records_TopSearchModel = [];
        model = [];
        TopSearchModel = TopSearchModel.filter(u => u.ProjectName === projectname && u.Device === device);
        TopSearchModel.forEach(element => {
          model.push(element['Model']);
        })
        model = lodash.uniqWith(model, lodash.isEqual);
        let groupbymodel = lodash.groupBy(TopSearchModel, 'Model');
        for (let i = 0; i < model.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbymodel[model[i]].length; j++) {
            count += groupbymodel[model[i]][j]['Count'];
            if (j + 1 == groupbymodel[model[i]].length) {
              individualDevice.push({ Model: model[i], Count: count })
              this.records_TopSearchModel = individualDevice
            }
          }
        }
      }

      if ((Version != null && Version != 'null') && (device === null || device === 'null')) {
        this.records_TopSearchModel = [];
        model = [];
        TopSearchModel = TopSearchModel.filter(u => u.ProjectName === projectname && u.Version === Version);
        TopSearchModel.forEach(element => {
          model.push(element['Model']);
        })
        model = lodash.uniqWith(model, lodash.isEqual);
        let groupbymodel = lodash.groupBy(TopSearchModel, 'Model');
        for (let i = 0; i < model.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbymodel[model[i]].length; j++) {
            count += groupbymodel[model[i]][j]['Count'];
            if (j + 1 == groupbymodel[model[i]].length) {
              individualDevice.push({ Model: model[i], Count: count })
              this.records_TopSearchModel = individualDevice
            }
          }
        }
      }

      if ((Version != null && Version != 'null') && (device != null && device != 'null')) {
        this.records_TopSearchModel = [];
        model = [];
        TopSearchModel = TopSearchModel.filter(u => u.ProjectName === projectname && u.Version === Version && u.Device === device);
        TopSearchModel.forEach(element => {
          model.push(element['Model']);
        })
        model = lodash.uniqWith(model, lodash.isEqual);
        let groupbymodel = lodash.groupBy(TopSearchModel, 'Model');
        for (let i = 0; i < model.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbymodel[model[i]].length; j++) {
            count += groupbymodel[model[i]][j]['Count'];
            if (j + 1 == groupbymodel[model[i]].length) {
              individualDevice.push({ Model: model[i], Count: count })
              this.records_TopSearchModel = individualDevice
            }
          }
        }
      }
    }

    if ((projectname === null || projectname === 'null')) {
      if (device === null || device === 'null') {
        this.records_TopSearchModel = [];
        for (let i = 0; i < model.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbymodel[model[i]].length; j++) {
            count += groupbymodel[model[i]][j]['Count'];
            if (j + 1 == groupbymodel[model[i]].length) {
              individualDevice.push({ Model: model[i], Count: count })
              this.records_TopSearchModel = individualDevice
            }
          }
        }
      }
      if (device != null && device != 'null') {
        this.records_TopSearchModel = [];
        model = [];
        TopSearchModel = TopSearchModel.filter(u => u.Device === this.Device);
        TopSearchModel.forEach(element => {
          model.push(element['Model'])
        })
        model = lodash.uniqWith(model, lodash.isEqual);
        let groupbymodel = lodash.groupBy(TopSearchModel, 'Model');
        for (let i = 0; i < model.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbymodel[model[i]].length; j++) {
            count += groupbymodel[model[i]][j]['Count'];
            if (j + 1 == groupbymodel[model[i]].length) {
              individualDevice.push({ Model: model[i], Count: count })
              this.records_TopSearchModel = individualDevice
            }
          }
        }
      }
    }
    this.records_TopSearchModel = lodash.orderBy(this.records_TopSearchModel, ['Count'], ['desc']).slice(0, this.toprecords)
    let labels = []; let series = [];
    for (let i = 0; i < this.records_TopSearchModel.length; i++) {
      labels.push(Object.values(this.records_TopSearchModel[i])[0])
      series.push(Object.values(this.records_TopSearchModel[i])[1])
    }
    this.TopSearchModel_series = series;
    this.TopSearchModel_title = {
      text: 'Top Searched Models',
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    },
      this.TopSearchModel_chart = {
        height: 350,
        type: "pie",
        toolbar: {
          show: true
        }
      },
      this.TopSearchModel_labels = labels
    this.spinnerService.hide();
  }

  TopSearchVendorID(projectname) {
    let TopSearchVendorId = []; let individualDevice = []; let vendorId = [];
    this.graphreports.table15.forEach(element => {
      if (element['vendorId'] === null || element['vendorId'] === '') {
        element['vendorId'] = "null"
      }
      TopSearchVendorId.push({ Device: element['device'].toUpperCase(), VendorId: element['vendorId'], Count: element['count'], ProjectName: element['projectName'], Version: element['embeddedDBVersion'] })
    });

    //list of VendorId
    TopSearchVendorId.forEach(element => {
      vendorId.push(element['VendorId'])
    })
    vendorId = lodash.uniqWith(vendorId, lodash.isEqual);
    let device = this.Device;
    let Version = this.db_version;
    let groupbyvendorId = lodash.groupBy(TopSearchVendorId, 'VendorId');
    if ((projectname != null && projectname != 'null')) {
      if ((Version === null || Version === 'null') && (device === null || device === 'null')) {
        this.records_TopSearchVendorId = [];
        vendorId = [];
        TopSearchVendorId = TopSearchVendorId.filter(u => u.ProjectName === projectname);
        TopSearchVendorId.forEach(element => {
          vendorId.push(element['VendorId']);
        })
        vendorId = lodash.uniqWith(vendorId, lodash.isEqual);
        let groupbyvendorId = lodash.groupBy(TopSearchVendorId, 'VendorId');
        for (let i = 0; i < vendorId.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyvendorId[vendorId[i]].length; j++) {
            count += groupbyvendorId[vendorId[i]][j]['Count'];
            if (j + 1 == groupbyvendorId[vendorId[i]].length) {
              individualDevice.push({ VendorId: vendorId[i], Count: count })
              this.records_TopSearchVendorId = individualDevice
            }
          }
        }
      }

      if ((Version === null || Version === 'null') && (device != null && device != 'null')) {
        this.records_TopSearchVendorId = [];
        vendorId = [];
        TopSearchVendorId = TopSearchVendorId.filter(u => u.ProjectName === projectname && u.Device === device);
        TopSearchVendorId.forEach(element => {
          vendorId.push(element['VendorId']);
        })
        vendorId = lodash.uniqWith(vendorId, lodash.isEqual);
        let groupbyvendorId = lodash.groupBy(TopSearchVendorId, 'VendorId');
        for (let i = 0; i < vendorId.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyvendorId[vendorId[i]].length; j++) {
            count += groupbyvendorId[vendorId[i]][j]['Count'];
            if (j + 1 == groupbyvendorId[vendorId[i]].length) {
              individualDevice.push({ VendorId: vendorId[i], Count: count })
              this.records_TopSearchVendorId = individualDevice
            }
          }
        }
      }

      if ((Version != null && Version != 'null') && (device === null || device === 'null')) {
        this.records_TopSearchVendorId = [];
        vendorId = [];
        TopSearchVendorId = TopSearchVendorId.filter(u => u.ProjectName === projectname && u.Version === Version);
        TopSearchVendorId.forEach(element => {
          vendorId.push(element['VendorId']);
        })
        vendorId = lodash.uniqWith(vendorId, lodash.isEqual);
        let groupbyvendorId = lodash.groupBy(TopSearchVendorId, 'VendorId');
        for (let i = 0; i < vendorId.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyvendorId[vendorId[i]].length; j++) {
            count += groupbyvendorId[vendorId[i]][j]['Count'];
            if (j + 1 == groupbyvendorId[vendorId[i]].length) {
              individualDevice.push({ VendorId: vendorId[i], Count: count })
              this.records_TopSearchVendorId = individualDevice
            }
          }
        }
      }

      if ((Version != null && Version != 'null') && (device != null && device != 'null')) {
        this.records_TopSearchVendorId = [];
        vendorId = [];
        TopSearchVendorId = TopSearchVendorId.filter(u => u.ProjectName === projectname && u.Version === Version && u.Device === device);
        TopSearchVendorId.forEach(element => {
          vendorId.push(element['VendorId']);
        })
        vendorId = lodash.uniqWith(vendorId, lodash.isEqual);
        let groupbyvendorId = lodash.groupBy(TopSearchVendorId, 'VendorId');
        for (let i = 0; i < vendorId.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyvendorId[vendorId[i]].length; j++) {
            count += groupbyvendorId[vendorId[i]][j]['Count'];
            if (j + 1 == groupbyvendorId[vendorId[i]].length) {
              individualDevice.push({ VendorId: vendorId[i], Count: count })
              this.records_TopSearchVendorId = individualDevice
            }
          }
        }
      }
    }

    if ((projectname === null || projectname === 'null')) {
      if (device === null || device === 'null') {
        this.records_TopSearchVendorId = [];
        for (let i = 0; i < vendorId.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyvendorId[vendorId[i]].length; j++) {
            count += groupbyvendorId[vendorId[i]][j]['Count'];
            if (j + 1 == groupbyvendorId[vendorId[i]].length) {
              individualDevice.push({ VendorId: vendorId[i], Count: count })
              this.records_TopSearchVendorId = individualDevice
            }
          }
        }
      }
      if (device != null && device != 'null') {
        this.records_TopSearchVendorId = [];
        vendorId = [];
        TopSearchVendorId = TopSearchVendorId.filter(u => u.Device === this.Device);
        TopSearchVendorId.forEach(element => {
          vendorId.push(element['VendorId'])
        })
        vendorId = lodash.uniqWith(vendorId, lodash.isEqual);
        let groupbyvendorId = lodash.groupBy(TopSearchVendorId, 'VendorId');
        for (let i = 0; i < vendorId.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyvendorId[vendorId[i]].length; j++) {
            count += groupbyvendorId[vendorId[i]][j]['Count'];
            if (j + 1 == groupbyvendorId[vendorId[i]].length) {
              individualDevice.push({ VendorId: vendorId[i], Count: count })
              this.records_TopSearchVendorId = individualDevice
            }
          }
        }
      }
    }
    this.records_TopSearchVendorId = lodash.orderBy(this.records_TopSearchVendorId, ['Count'], ['desc']).slice(0, this.toprecords)
    let labels = []; let series = [];
    for (let i = 0; i < this.records_TopSearchVendorId.length; i++) {
      labels.push(Object.values(this.records_TopSearchVendorId[i])[0])
      series.push(Object.values(this.records_TopSearchVendorId[i])[1])
    }
    this.TopSearchVendorID_series = series;
    this.TopSearchVendorID_title = {
      text: "Top Searched VendorId's",
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    },
      this.TopSearchVendorID_chart = {
        height: 350,
        type: "pie",
        toolbar: {
          show: true
        }
      },
      this.TopSearchVendorID_labels = labels
    this.spinnerService.hide();
  }

  TopSearchOSD(projectname) {
    let TopSearchOSD = []; let individualDevice = []; let osd = [];
    this.graphreports.table16.forEach(element => {
      if (element['osd'] === null || element['osd'] === '') {
        element['osd'] = "null"
      }
      TopSearchOSD.push({ Device: element['device'].toUpperCase(), OSD: element['osd'], Count: element['count'], ProjectName: element['projectName'], Version: element['embeddedDBVersion'] })
    });

    //list of OSD
    TopSearchOSD.forEach(element => {
      osd.push(element['OSD'])
    })

    osd = lodash.uniqWith(osd, lodash.isEqual);
    let device = this.Device;
    let Version = this.db_version;
    let groupbyosd = lodash.groupBy(TopSearchOSD, 'OSD');
    if ((projectname != null && projectname != 'null')) {
      if ((Version === null || Version === 'null') && (device === null || device === 'null')) {
        this.records_TopSearchOSD = [];
        osd = [];
        TopSearchOSD = TopSearchOSD.filter(u => u.ProjectName === projectname);
        TopSearchOSD.forEach(element => {
          osd.push(element['OSD']);
        })
        osd = lodash.uniqWith(osd, lodash.isEqual);
        let groupbyosd = lodash.groupBy(TopSearchOSD, 'OSD');
        for (let i = 0; i < osd.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyosd[osd[i]].length; j++) {
            count += groupbyosd[osd[i]][j]['Count'];
            if (j + 1 == groupbyosd[osd[i]].length) {
              individualDevice.push({ OSD: osd[i], Count: count })
              this.records_TopSearchOSD = individualDevice
            }
          }
        }
      }

      if ((Version === null || Version === 'null') && (device != null && device != 'null')) {
        this.records_TopSearchOSD = [];
        osd = [];
        TopSearchOSD = TopSearchOSD.filter(u => u.ProjectName === projectname && u.Device === device);
        TopSearchOSD.forEach(element => {
          osd.push(element['OSD']);
        })
        osd = lodash.uniqWith(osd, lodash.isEqual);
        let groupbyosd = lodash.groupBy(TopSearchOSD, 'OSD');
        for (let i = 0; i < osd.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyosd[osd[i]].length; j++) {
            count += groupbyosd[osd[i]][j]['Count'];
            if (j + 1 == groupbyosd[osd[i]].length) {
              individualDevice.push({ OSD: osd[i], Count: count })
              this.records_TopSearchOSD = individualDevice
            }
          }
        }
      }

      if ((Version != null && Version != 'null') && (device === null || device === 'null')) {
        this.records_TopSearchOSD = [];
        osd = [];
        TopSearchOSD = TopSearchOSD.filter(u => u.ProjectName === projectname && u.Version === Version);
        TopSearchOSD.forEach(element => {
          osd.push(element['OSD']);
        })
        osd = lodash.uniqWith(osd, lodash.isEqual);
        let groupbyosd = lodash.groupBy(TopSearchOSD, 'OSD');
        for (let i = 0; i < osd.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyosd[osd[i]].length; j++) {
            count += groupbyosd[osd[i]][j]['Count'];
            if (j + 1 == groupbyosd[osd[i]].length) {
              individualDevice.push({ OSD: osd[i], Count: count })
              this.records_TopSearchOSD = individualDevice
            }
          }
        }
      }

      if ((Version != null && Version != 'null') && (device != null && device != 'null')) {
        this.records_TopSearchOSD = [];
        osd = [];
        TopSearchOSD = TopSearchOSD.filter(u => u.ProjectName === projectname && u.Version === Version && u.Device === device);
        TopSearchOSD.forEach(element => {
          osd.push(element['OSD']);
        })
        osd = lodash.uniqWith(osd, lodash.isEqual);
        let groupbyosd = lodash.groupBy(TopSearchOSD, 'OSD');
        for (let i = 0; i < osd.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyosd[osd[i]].length; j++) {
            count += groupbyosd[osd[i]][j]['Count'];
            if (j + 1 == groupbyosd[osd[i]].length) {
              individualDevice.push({ OSD: osd[i], Count: count })
              this.records_TopSearchOSD = individualDevice
            }
          }
        }
      }
    }

    if ((projectname === null || projectname === 'null')) {
      if (device === null || device === 'null') {
        this.records_TopSearchOSD = [];
        for (let i = 0; i < osd.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyosd[osd[i]].length; j++) {
            count += groupbyosd[osd[i]][j]['Count'];
            if (j + 1 == groupbyosd[osd[i]].length) {
              individualDevice.push({ OSD: osd[i], Count: count })
              this.records_TopSearchOSD = individualDevice
            }
          }
        }
      }
      if (device != null && device != 'null') {
        this.records_TopSearchOSD = [];
        osd = [];
        TopSearchOSD = TopSearchOSD.filter(u => u.Device === this.Device);
        TopSearchOSD.forEach(element => {
          osd.push(element['OSD'])
        })
        osd = lodash.uniqWith(osd, lodash.isEqual);
        let groupbyosd = lodash.groupBy(TopSearchOSD, 'OSD');
        for (let i = 0; i < osd.length; i++) {
          let count = 0;
          for (let j = 0; j < groupbyosd[osd[i]].length; j++) {
            count += groupbyosd[osd[i]][j]['Count'];
            if (j + 1 == groupbyosd[osd[i]].length) {
              individualDevice.push({ OSD: osd[i], Count: count })
              this.records_TopSearchOSD = individualDevice
            }
          }
        }
      }
    }

    this.records_TopSearchOSD = lodash.orderBy(this.records_TopSearchOSD, ['Count'], ['desc']).slice(0, this.toprecords)
    let labels = []; let series = [];
    for (let i = 0; i < this.records_TopSearchOSD.length; i++) {
      labels.push(Object.values(this.records_TopSearchOSD[i])[0])
      series.push(Object.values(this.records_TopSearchOSD[i])[1])
    }
    this.TopSearchOSD_series = series;
    this.TopSearchOSD_title = {
      text: "Top Searched OSD's",
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    },
      this.TopSearchOSD_chart = {
        height: 350,
        type: "pie",
        toolbar: {
          show: true
        }
      },
      this.TopSearchOSD_labels = labels
    this.spinnerService.hide();
  }

  AvgResponseTimeModelSearch(projectname) {
    let AvgResponseTimeModelSearch = []; let Devicelist = []; let individualDevice = [];
    this.graphreports.table8.forEach(element => {
      AvgResponseTimeModelSearch.push({ Sum: element['sumOfTimeConsumed'], Count: element['countOfTimeConsumed'], Min: element['mintime'], Max: element['maxtime'], Avg: element['averageResponseTime'], ProjectName: element['projectName'], Version: element['embeddedDBVersion'] })
    });
    let mintime = []; let maxtime = []; let Avg = [];
    let Version = this.db_version;
    if ((projectname != null && projectname != 'null')) {
      if ((Version === null || Version === 'null')) {
        let sum = 0; let count = 0;
        this.records_AvgResponseTimeModelSearch = [];
        AvgResponseTimeModelSearch = AvgResponseTimeModelSearch.filter(u => u.ProjectName === projectname);
        if (AvgResponseTimeModelSearch.length > 0) {
          AvgResponseTimeModelSearch.forEach(element => {
            mintime.push(element['Min']);
            maxtime.push(element['Max']);
            sum += element['Sum'];
            count += element['Count'];
          })
          Avg.push(sum / count);
          individualDevice.push({ "MinTime (in ms)": lodash.min(mintime), "MaxTime (in ms)": lodash.max(maxtime), "Avg.ResponeTime (in ms)": Avg[0] });
          this.records_AvgResponseTimeModelSearch = individualDevice
        }
        else {
          this.records_AvgResponseTimeModelSearch = [];
        }
      }

      if ((Version != null && Version != 'null')) {
        let sum = 0; let count = 0;
        this.records_AvgResponseTimeModelSearch = [];
        AvgResponseTimeModelSearch = AvgResponseTimeModelSearch.filter(u => u.ProjectName === projectname && u.Version === Version);
        if (AvgResponseTimeModelSearch.length > 0) {
          AvgResponseTimeModelSearch.forEach(element => {
            mintime.push(element['Min']);
            maxtime.push(element['Max']);
            sum += element['Sum'];
            count += element['Count'];
          })
          Avg.push(sum / count);
          individualDevice.push({ "MinTime (in ms)": lodash.min(mintime), "MaxTime (in ms)": lodash.max(maxtime), "Avg.ResponeTime (in ms)": Avg[0] });
          this.records_AvgResponseTimeModelSearch = individualDevice
        }
        else {
          this.records_AvgResponseTimeModelSearch = [];
        }
      }
    }
    if ((projectname === null || projectname === 'null')) {
      let sum = 0; let count = 0;
      this.records_AvgResponseTimeModelSearch = [];
      if (AvgResponseTimeModelSearch.length > 0) {
        AvgResponseTimeModelSearch.forEach(element => {
          mintime.push(element['Min']);
          maxtime.push(element['Max']);
          sum += element['Sum'];
          count += element['Count'];
        })
        Avg.push(sum / count);
        individualDevice.push({ "MinTime (in ms)": lodash.min(mintime), "MaxTime (in ms)": lodash.max(maxtime), "Avg.ResponeTime (in ms)": Avg[0] });
        this.records_AvgResponseTimeModelSearch = individualDevice
      }
      else {
        this.records_AvgResponseTimeModelSearch = [];
      }
    }
    // console.log(this.records_AvgResponseTimeModelSearch);
    let labels = []; let series = [];
    if (this.records_AvgResponseTimeModelSearch.length > 0) {
      for (let i = 0; i < this.records_AvgResponseTimeModelSearch.length; i++) {
        labels.push(Object.keys(this.records_AvgResponseTimeModelSearch[i]))
        series.push(Object.values(this.records_AvgResponseTimeModelSearch[i]))
      }
      labels = labels[0];
      series = series[0];
    }
    // console.log(labels,series);
    this.AvgResponseTimeModelSearch_series = series;
    this.AvgResponseTimeModelSearch_title = {
      text: 'Min, Max and Average Response Time of Model Search',
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    },
      this.AvgResponseTimeModelSearch_chart = {
        height: 350,
        type: "pie",
        toolbar: {
          show: true
        }
      },
      this.AvgResponseTimeModelSearch_labels = labels;
    this.AvgResponseTimeModelSearch_color = ['#00E396', '#008FFB', '#FEB019'];
    this.spinnerService.hide();
  }

  AvgResponseTimeAutoSearch(projectname) {
    let AvgResponseTimeAutoSearch = []; let individualDevice = [];
    this.graphreports.table13.forEach(element => {
      AvgResponseTimeAutoSearch.push({ Sum: element['sumOfTimeConsumed'], Count: element['countOfTimeConsumed'], Min: element['mintime'], Max: element['maxtime'], Avg: element['averageResponseTime'], ProjectName: element['projectName'], Version: element['embeddedDBVersion'] })
    });
    let mintime = []; let maxtime = []; let Avg = [];
    let Version = this.db_version;
    if ((projectname != null && projectname != 'null')) {
      if ((Version === null || Version === 'null')) {
        let sum = 0; let count = 0;
        this.records_AvgResponseTimeAutoSearch = [];
        AvgResponseTimeAutoSearch = AvgResponseTimeAutoSearch.filter(u => u.ProjectName === projectname);
        if (AvgResponseTimeAutoSearch.length > 0) {
          AvgResponseTimeAutoSearch.forEach(element => {
            mintime.push(element['Min']);
            maxtime.push(element['Max']);
            sum += element['Sum'];
            count += element['Count'];
          })
          Avg.push(sum / count);
          individualDevice.push({ "MinTime (in ms)": lodash.min(mintime), "MaxTime (in ms)": lodash.max(maxtime), "Avg.ResponeTime (in ms)": Avg[0] });
          this.records_AvgResponseTimeAutoSearch = individualDevice
        }
        else {
          this.records_AvgResponseTimeAutoSearch = [];
        }

      }

      if ((Version != null && Version != 'null')) {
        let sum = 0; let count = 0;
        this.records_AvgResponseTimeAutoSearch = [];
        AvgResponseTimeAutoSearch = AvgResponseTimeAutoSearch.filter(u => u.ProjectName === projectname && u.Version === Version);
        if (AvgResponseTimeAutoSearch.length > 0) {
          AvgResponseTimeAutoSearch.forEach(element => {
            mintime.push(element['Min']);
            maxtime.push(element['Max']);
            sum += element['Sum'];
            count += element['Count'];
          })
          Avg.push(sum / count);
          individualDevice.push({ "MinTime (in ms)": lodash.min(mintime), "MaxTime (in ms)": lodash.max(maxtime), "Avg.ResponeTime (in ms)": Avg[0] });
          this.records_AvgResponseTimeAutoSearch = individualDevice
        }
        else {
          this.records_AvgResponseTimeAutoSearch = [];
        }
      }
    }
    if ((projectname === null || projectname === 'null')) {
      let sum = 0; let count = 0;
      this.records_AvgResponseTimeAutoSearch = [];
      if (AvgResponseTimeAutoSearch.length > 0) {
        AvgResponseTimeAutoSearch.forEach(element => {
          mintime.push(element['Min']);
          maxtime.push(element['Max']);
          sum += element['Sum'];
          count += element['Count'];
        })
        Avg.push(sum / count);
        individualDevice.push({ "MinTime (in ms)": lodash.min(mintime), "MaxTime (in ms)": lodash.max(maxtime), "Avg.ResponeTime (in ms)": Avg[0] });
        this.records_AvgResponseTimeAutoSearch = individualDevice
      }
      else {
        this.records_AvgResponseTimeAutoSearch = [];
      }
    }
    // console.log(this.records_AvgResponseTimeAutoSearch);
    let labels = []; let series = [];
    if (this.records_AvgResponseTimeAutoSearch.length > 0) {
      for (let i = 0; i < this.records_AvgResponseTimeAutoSearch.length; i++) {
        labels.push(Object.keys(this.records_AvgResponseTimeAutoSearch[i]))
        series.push(Object.values(this.records_AvgResponseTimeAutoSearch[i]))
      }
      labels = labels[0];
      series = series[0];
    }
    // console.log(labels,series);
    this.AvgResponseTimeAutoSearch_series = series;
    this.AvgResponseTimeAutoSearch_title = {
      text: 'Min, Max and Average Response Time of Auto Search',
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'none'
      }
    },
      this.AvgResponseTimeAutoSearch_chart = {
        height: 350,
        type: "pie",
        toolbar: {
          show: true
        }
      },
      this.AvgResponseTimeAutoSearch_labels = labels;
    this.AvgResponseTimeAutoSearch_color = ['#00E396', '#008FFB', '#FEB019'];;
    this.spinnerService.hide();
  }

  condition() {
    this.summary();
    let item = []; let id;
    item = $(".carousel-inner .carousel-item");
    setTimeout(() => {
      for (let i = 0; i < item.length; i++) {
        if (item[i]['className'] === 'carousel-item active') {
          id = item[i]['id'];
        }
      }
      switch (id) {
        case "TopSearchBrand":
          this.showDevice = true;
          break;
        case "TopSearchModel":
          this.showDevice = true;
          break;
        case "TopSearchVendorID":
          this.showDevice = true;
          break;
        case "TopSearchOSD":
          this.showDevice = true;
          break;

        default:
          this.showDevice = false;
          break;
        //the id is none of the above
      }
    }, 1000);

  }

}