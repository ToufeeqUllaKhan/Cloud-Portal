import { Component, OnInit} from '@angular/core';
import { MainService } from '../services/main-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-cloud-api-modules',
  templateUrl: './cloud-api-modules.component.html',
  styleUrls: ['./cloud-api-modules.component.css']
})
export class CloudApiModulesComponent implements OnInit {

  projectNames: any;
  projects: Array<any> = [];
  selectedItems: Array<any> = [];
  finalArray = []; limitSelection = false;
  dropdownSettings: any = {}; ShowFilter = false;
  versionArr = []; versions = [];
  dataTickets = []; mainArr = []; ProjectList: Array<any> = [];
  width: number;
  height: number;

  constructor(private mainService: MainService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    /** projects selected in client page */
    var getClientProjects = JSON.parse(localStorage.getItem('choosenProjects'));
    var getBrandProjects = JSON.parse(localStorage.getItem('BrandLibraryProjects'));
    if (getClientProjects != undefined) {
      this.projectNames = getClientProjects;
    }
    if (getBrandProjects != null) {
      this.projectNames = getBrandProjects;
    }
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel != 100) {
      this.zoomFunction();
    }
  /** Project list in multiselect dropdown start */
    let dataType = 1;
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {
        this.mainArr = value.data;
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
        let ProjectName;
        if (this.projectNames[0]['item_text'] != undefined) {
          ProjectName = this.projectNames[0]['item_text'];
        } else {
          ProjectName = this.projectNames[0]
        }
      /** List of Api Modules available for selected Project start default initial selection of project has been considered to view the modules */
          let resultFetchArr: any = value.data.filter(u =>
            u.projectname == ProjectName);
        let sessionToken = null; let Dbname = resultFetchArr[0]['dbPath']; let Project = ProjectName;
          this.mainService.getAPIList(sessionToken, Dbname, Project)
            .subscribe(value => {
              console.log(value.data);
              value.data = value.data.filter(function (obj) {
                return obj.statusFlag !== 0;
              });
              this.dataTickets = value.data;
              if (value.data.length == 0) {
                this.toastr.warning(value.message);
              }
            });
        
      /** List of Api Modules available for selected Project start */
      });
  /** Project list in multiselect dropdown end */

  /** Multiselect dropdown settings  */
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: this.ShowFilter
    };
    localStorage.removeItem('CloudApiProjects');
  /** Zoom in and out Functionality */
    $(document).ready(function () {
      $(window).resize(function () {
        var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
        if (browserZoomLevel <= 110) {
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

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
    $(window).trigger('resize');
  }

  zoomFunction() {
    setTimeout(function () {
      $(window).trigger('resize');
    }, 2000);
    $("*").hover(function () {
      $(window).trigger('resize');
    });
    $("*").click(function () {
      $(window).trigger('resize');
    });
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel <= 110) {
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
/** Multiselect dropdown functions start */
  onInstanceSelect(item: any) {
  }

  onSelectAll(items: any) {
    this.projectNames = items;
  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  onProjectSelect(e) {

  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }
/** Multiselect dropdown functions end */

/** based on project selection to get the list of api modules available for the selected project start */

  changeProject() {
    if (this.projectNames.length > 0) {
      let resultFetchArr: any = this.mainArr.filter(u =>
        u.projectname == this.projectNames[0]['item_text']);
      let sessionToken = null; let Dbname = resultFetchArr[0]['dbPath']; let Project = this.projectNames[0]['item_text'];
      this.mainService.getAPIList(sessionToken, Dbname, Project)
        .subscribe(value => {
          console.log(value.data);
          this.dataTickets = value.data;
          if (value.data.length == 0) {
            this.toastr.warning(value.message);
          }
        });
    } 
  }

/** based on project selection to get the list of api modules available for the selected project start */

  apiClients() {
    this.router.navigate(['/api-clients'])
      .then(() => {
        window.location.reload();
      });
  }

/** api module selection to traverse the selected module to next page start */

  selectedApiModule(selectedApi) {
    if (this.projectNames == undefined) {
      this.toastr.warning('Please Select the project', '');
    } else {
      let arrData = [];
      for (var j = 0; j < this.projectNames.length; j++) {
        arrData.push(this.projectNames[j]['item_text']);
      }
      this.projectNames = arrData;
      localStorage.removeItem('choosenProjects');
      localStorage.setItem('CloudApi', selectedApi);
      localStorage.setItem('CloudApiProjects', JSON.stringify(this.projectNames));
      this.router.navigate(['/api-db-test']);
    }
  }
/** api module selection to traverse the selected module to next page start */

}
