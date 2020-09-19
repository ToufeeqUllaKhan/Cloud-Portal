import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-report-configuration-list',
  templateUrl: './report-configuration-list.component.html',
  styleUrls: ['./report-configuration-list.component.css']
})
export class ReportConfigurationListComponent implements OnInit {

  projects: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false;
  limitSelection = false;
  projectNames: any; selectedItems: Array<any> = [];
  dataTickets = []; ProjectList: Array<any> = [];
  switchRoute: any;

  constructor(private fb: FormBuilder, private router: Router, private mainService: MainService, private titleService: Title, private toastr: ToastrService) {
    this.titleService.setTitle("SearchReport Configuration");
    localStorage.removeItem('selectedBrand');
    localStorage.removeItem('updatebrandLibraryAdminProjects');
    localStorage.removeItem('dataConfigBinProjects');
  }

  ngOnInit(): void {
    var getBrandProjects = JSON.parse(localStorage.getItem('BrandLibraryAdminProjects'));
    var getClientProjects = JSON.parse(localStorage.getItem('choosenAdminProjects'));
    let zipUploadsProjects = JSON.parse(localStorage.getItem('dataConfigProjects'));
    
    this.switchRoute = localStorage.getItem('logSelected');
    if (getBrandProjects != null && getBrandProjects.length != 0) {
      this.projectNames = getBrandProjects;
    } else {
      this.projectNames = getClientProjects;
    }
    if (getBrandProjects == null && getClientProjects == null) {
      this.projectNames = zipUploadsProjects;
    }
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel != 100) {
      this.zoomFunction();
    }
   /** list of projects in multiselect dropdown */
    let dataType = 1;
    this.mainService.getProjectNames(null,null,null,null,null,dataType)
      .subscribe(value => {

        const unique = [...new Set(value.data.map(item => item.projectname))];

        let arrData = [];
        for (var i = 0; i < unique.length; i++) {
          arrData.push({ item_id: i, item_text: unique[i] });
        }
        this.ProjectList = arrData;

        let RoleLevel = localStorage.getItem('AccessRole');
        if (RoleLevel != 'Admin') {
          let userName = localStorage.getItem('userName');
          this.mainService.getRoleModulesAccess(8, null, null, userName, null)
            .then(value => {
              let filterProjects = [];
              for (var i = 0; i < value.data.length; i++) {
                let clientsArray: any = this.ProjectList.filter(u =>
                  u.item_text == value.data[i]['name']);
                filterProjects.push(...clientsArray);
              }
              let modifyItems = [];
              for (var j = 0; j < filterProjects.length; j++) {
                modifyItems.push({ item_id: j, item_text: filterProjects[j]['item_text'] });
              }
              this.projects = modifyItems;
              if (this.projectNames != '' && this.projectNames != undefined) {
                for (var k = 0; k < this.projectNames.length; k++) {
                  var setIndex = this.projects.findIndex(p => p.item_text == this.projectNames[k]);
                  this.selectedItems.push({ item_id: setIndex, item_text: this.projectNames[k] });
                }
                this.projectNames = this.selectedItems;
                
              }
            });
        } else {
          this.projects = arrData;
          if (this.projectNames != '' && this.projectNames != undefined) {
            for (var i = 0; i < this.projectNames.length; i++) {
              var setIndex = this.projects.findIndex(p => p.item_text == this.projectNames[i]);
              this.selectedItems.push({ item_id: setIndex, item_text: this.projectNames[i] });
            }
            this.projectNames = this.selectedItems;
          }
        }
        this.listofbrands();
      });

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: this.ShowFilter
    };
    /** Zoom in functionality for data config page **/
    $(document).ready(function () {
      $(window).resize(function () {
        var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
        
        if (browserZoomLevel == 100) {
          $('.dashboard-stats__item').css('width', '100%');
          $('.col-sm-3').css('max-width', '25%');
        }
        if (browserZoomLevel == 110) {
          $('.dashboard-stats__item').css('width', '244px');
          $('.col-sm-3').css('max-width', '30%');
        }
        if (browserZoomLevel == 125) {
          $('.dashboard-stats__item').css('width', '244px');
          $('.col-sm-3').css('max-width', '35%');
        }
        if (browserZoomLevel == 150) {
          $('.dashboard-stats__item').css('width', '265px');
          $('.col-sm-3').css('max-width', '45%');
        }
        if (browserZoomLevel == 175) {
          $('.dashboard-stats__item').css('width', '295px');
          $('.col-sm-3').css('max-width', '55%');
        }
        if (browserZoomLevel == 300) {
          $('.dashboard-stats__item').css('width', '360px');
          $('.col-sm-3').css('max-width', '55%');
        }
        if (browserZoomLevel == 400) {
          $('.dashboard-stats__item').css('width', '310px');
          $('.col-sm-3').css('max-width', '55%');
        }
        if (browserZoomLevel == 500) {
          $('.dashboard-stats__item').css('width', '325px');
          $('.col-sm-3').css('max-width', '55%');
        }
        
      });
    });
    
  }

  zoomFunction() {
    setTimeout(function () {
      $(window).trigger('resize');
    }, 2000);
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel == 100) {
      $('.dashboard-stats__item').css('width', '100%');
      $('.col-sm-3').css('max-width', '25%');
    }
    if (browserZoomLevel == 110) {
      $('.dashboard-stats__item').css('width', '244px');
      $('.col-sm-3').css('max-width', '30%');
    }
    if (browserZoomLevel == 125) {
      $('.dashboard-stats__item').css('width', '244px');
      $('.col-sm-3').css('max-width', '35%');
    }
    if (browserZoomLevel == 150) {
      $('.dashboard-stats__item').css('width', '265px');
      $('.col-sm-3').css('max-width', '45%');
    }
    if (browserZoomLevel == 175) {
      $('.dashboard-stats__item').css('width', '295px');
      $('.col-sm-3').css('max-width', '55%');
    }
    if (browserZoomLevel == 300) {
      $('.dashboard-stats__item').css('width', '360px');
      $('.col-sm-3').css('max-width', '55%');
    }
    if (browserZoomLevel == 400) {
      $('.dashboard-stats__item').css('width', '310px');
      $('.col-sm-3').css('max-width', '55%');
    }
    if (browserZoomLevel == 500) {
      $('.dashboard-stats__item').css('width', '325px');
      $('.col-sm-3').css('max-width', '55%');
    }
    this.loadZoom();
  }

  loadZoom() {
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel == 90) {
      $('#wrapper').css('margin', '0 auto');
      $('#wrapper').css('max-width', '1500px');
      $('.main-scroll').css('height', '650px');
    }
    if (browserZoomLevel < 90) {
      $('#wrapper').css('margin', '0 auto');
      $('#wrapper').css('max-width', '1500px');
    }
    if (browserZoomLevel == 80) {
      $('.main-scroll').css('height', '700px');
    }
    if (browserZoomLevel == 75) {
      $('.main-scroll').css('height', '750px');
    }
    if (browserZoomLevel == 67) {
      $('.main-scroll').css('height', '850px');
    }
    if (browserZoomLevel < 67) {
      $('.main-scroll').css('height', '1050px');
    }
    if (browserZoomLevel == 100) {
      $('.main-scroll').css('height', '600px');
    }
    if (browserZoomLevel >= 110) {
      $('body').css('overflow-y', 'auto');
    } else {
      $('body').css('overflow-y', 'hidden');
    }
    if (browserZoomLevel == 150) {
      $('.navbar').css('padding', '.3rem 1rem');
    }
    if (browserZoomLevel == 175) {
      $('.navbar').css('padding', '.5rem 1rem');
    }
    if (browserZoomLevel == 125) {
      $('.navbar').css('padding', '.56rem 1rem');
    }
    if (browserZoomLevel >= 110) {
      $('body').css('overflow-y', 'auto');
    } else {
      $('body').css('overflow-y', 'hidden');
    }
    if (browserZoomLevel == 150) {
      $('.navbar').css('padding', '.3rem 1rem');
    }
    if (browserZoomLevel == 175) {
      $('.navbar').css('padding', '.5rem 1rem');
    }
    if (browserZoomLevel == 100) {
      $('.navbar').css('padding', '.56rem 1rem');
    }
    if (browserZoomLevel == 125) {
      $('.navbar').css('padding', '.56rem 1rem');
    }
  }

  /** Multiselect dropdown setting functions start */
  onInstanceSelect(item: any) {
   // console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
   // console.log('onSelectAll', items);
    let arrData1 = [];
    for (var i = 0; i < items.length; i++) {
      arrData1.push(items[i]['item_text']);
    }
    this.projectNames = arrData1;
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

/** Multiselect dropdown setting functions end */

  onProjectSelect(e) {
   // console.log(this.projectNames);
  }

  
  changeProject() {
    if (this.projectNames.length == 0) {
      $('.scroll-x').css('display','none')
      this.toastr.warning('Please Select the Project to Activate the fields', '');
    }
    if (this.projectNames.length == 1) {
      this.listofbrands();
      $('.scroll-x').show();
    }
  }

  
  listofbrands(){
    let projArr=[];
    let projectSelectedList = [];
    let datatype = 1;
     this.mainService.getProjectNamesWaitReq(null, null, null, null, null, datatype)
      .then(value => {
        for (var i = 0; i < this.projectNames.length; i++) {
          let filterClient: any = value.data.filter(u =>
            u.projectname == this.projectNames[i]);
          projArr.push(filterClient);
        }
        var resultproj = [];
        for (var j = 0; j < projArr.length; j++) {
          resultproj = resultproj.concat(projArr[j]);
        }
        projArr = resultproj;
let ProjectName;
                if (this.projectNames[0]['item_text'] != undefined) {
                  ProjectName = this.projectNames[0]['item_text'];
                } else {
                  ProjectName = this.projectNames[0]
                }
              let resultFetchArr: any = value.data.filter(u =>
                u.projectname == ProjectName);
              let Dbname = resultFetchArr[0]['dbPath']; 
              let dataType=0; let arr=[];
          this.mainService.getSearchDetails(Dbname, null, null, null, dataType)
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
              }
                        this.dataTickets = arr;
                      })
      });
  }
  /** Select Ticket functionality to proceed further start */

  selectedBrand(name) {
    if (name != '') {
      let arrData2 = [];
      for (var j = 0; j < this.projectNames.length; j++) {
        arrData2.push(this.projectNames[j]['item_text']);
      }
      this.projectNames = arrData2;
      localStorage.removeItem('choosenAdminProjects');
      localStorage.setItem('configureAdminProjectNames', JSON.stringify(this.projectNames));

      if (name != '' && this.projectNames.length != 0) {
        localStorage.setItem('selectedBrand', name);
         this.router.navigate(['/history']);
      }
      if (this.projectNames.length == 0) {
        this.toastr.warning('Please Select the project', '');
      }
    }
    
  }

/** Select Ticket functionality to proceed further end */


  prev() {
    let projSelectedData = [];
    for (var i = 0; i < this.projectNames.length; i++) {
      projSelectedData.push(this.projectNames[i]['item_text']);
    }
    this.projectNames = projSelectedData;
    localStorage.setItem('fetchedAdminProj', JSON.stringify(this.projectNames));
    this.router.navigate(['/admin-clients'])
      .then(() => {
        location.reload();
      });
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

}
