import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var $: any;
import 'datatables.net';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-changehistory',
  templateUrl: './changehistory.component.html',
  styleUrls: ['./changehistory.component.css']
})
export class ChangehistoryComponent implements OnInit {
  usersName: any;
  projectNames: any; selectedItems: Array<any> = [];
  projects: Array<any> = [];finalArray = [];ProjectList = [];
  dropdownSettings: any = {}; ShowFilter = false; tabslist = [];
  limitSelection = false; mainArr = [];
  noData: boolean= false; projArr = [];tabsProject: any; tabValue: any; count: any = 0;oldValue: string; modalCount: any = 0;
//   submitted: Boolean = false;
  clientDetails = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  editedSignature: any;
  editSignatureData: FormGroup; signatureDetails = [];
  // projectNames: any; 
  resultProjArr: any =[];

  constructor(private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private fb: FormBuilder) { 
    this.usersName = localStorage.getItem('userName');
  }

  ngOnInit():void  {
   /** List of selected projects in previous route */
   var getClientProjects = JSON.parse(localStorage.getItem('choosenProjects'));
    
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
      let Projectname = this.projectNames;
    this.tabslist = Projectname;
    this.tabValue = this.projectNames[0];
  /** Datatable setting option to display default rows */
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      scrollY: '235px',
      scrollX: true,
      scrollCollapse: true,
      "order": [[ 11, "desc" ]]
    };
//   /** List of Client Details and Overall Projects available in the portal */
    this.mainService.ChangeHistory(Projectname[0], this.usersName)
      .subscribe(value => {
        this.clientDetails = value.data;
        this.dtTrigger.next();
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
        let filterClient: any = value.data.filter(u =>
          u.projectname == this.projectNames[i]['item_text']);
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

getTabResponseData(){
  if (this.count == 1 && this.oldValue == undefined && this.modalCount != 1) {
    $('#projectView').dataTable().fnClearTable();
      $('#projectView').dataTable().fnDestroy();
  }
  var Table1 = $('#projectView').DataTable();
      Table1.destroy();
      Table1.clear();
  if (this.tabsProject != undefined) {
    let resultFetchArrTabs: any = this.mainArr.filter(u =>
      u.projectname == this.tabsProject);
    this.resultProjArr = resultFetchArrTabs;
  }
  if (this.tabsProject === undefined) {
    if (this.projectNames[0] != null || this.projectNames[0] != undefined) {
      let resultFetchArr: any = this.mainArr.filter(u =>
        u.projectname == this.projectNames[0]['item_text']);
      this.resultProjArr = resultFetchArr;
    }
  }

  var projectName = this.resultProjArr[0]['projectname'];
  console.log(projectName, this.usersName)
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    scrollY: '235px',
    scrollX: true,
    scrollCollapse: true,
    "order": [[ 11, "desc" ]]
  };
  
      this.mainService.ChangeHistory(projectName, this.usersName)
      .subscribe(value => {
        this.clientDetails = value.data;
        this.dtTrigger.next();
      });
}

AdminClients(){
  this.router.navigate(['/admin-clients'])
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
}
