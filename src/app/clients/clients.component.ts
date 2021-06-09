import { Component, OnInit } from '@angular/core';
declare var $: any;
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ResizedEvent } from 'angular-resize-event';
import mainscroll from '../model/Scroll';


@Component({
  selector: 'app-projects',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  arrayData = [];
  activeRegions = []; activeClients = [];
  projects = []; arrClients = [];
  checkboxValue: Boolean;
  selectedClients = [];
  finalArr = []; ProjectData = [];
  data = []; arr = [];
  isNextVisible: Boolean = false;
  filterClients = []; clientArrList = [];
  clientsData = []; RolelevelProjects = [];
  activeRegionsList = []; getMenuItem: any; apiMenuList: any;
  checkedItems = []; mainProjects = []; checkedProj = [];
  width: number;
  height: number;
  moduleselected: string; switchRoute: string;
  cec_edidclients: Boolean; datamangementclients: Boolean; historyclients: Boolean; apiclients: Boolean; reportclients: Boolean;

  constructor(private router: Router, private mainService: MainService, private titleService: Title, private spinnerService: NgxSpinnerService, private toastr: ToastrService) {
    this.titleService.setTitle("Clients");
    this.checkboxValue = false;
  }

  ngOnInit() {
    this.moduleselected = localStorage.getItem('moduleselected');
    this.switchRoute = localStorage.getItem('TicketSelected');
    this.getMenuItem = localStorage.getItem('sideMenuItem');
    this.apiMenuList = localStorage.getItem('ApiMenuItem');
    if (this.moduleselected === 'Data Management Tool') {
      this.datamangementclients = true;
      this.cec_edidclients = false;
      this.historyclients = false;
      this.apiclients = false;
      this.reportclients = false;
    }
    if (this.moduleselected === 'Centralized CEC-EDID DB') {
      this.datamangementclients = false;
      this.cec_edidclients = true;
      this.historyclients = false;
      this.apiclients = false;
      this.reportclients = false;
    }
    if (this.moduleselected === 'admin-dashboard') {
      this.historyclients = true;
      this.datamangementclients = false;
      this.cec_edidclients = false;
      this.apiclients = false;
      this.reportclients = false;
    }
    if (this.moduleselected === 'Cloud API Search Tester') {
      this.historyclients = false;
      this.datamangementclients = false;
      this.cec_edidclients = false;
      this.apiclients = true;
      this.reportclients = false;
    }
    if (this.moduleselected === 'Analytics Report') {
      this.historyclients = false;
      this.datamangementclients = false;
      this.cec_edidclients = false;
      this.apiclients = false;
      this.reportclients = true;
    }
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel != 100) {
      this.zoomFunction();
    }
    $(document).ready(function () {
      /** added toggle class **/
      $(document).on("click", "button.check i", function () {
        $(this).toggleClass('fa-green');
      });
      /** added zoom in functionality page responsive **/
      $(window).resize(function () {
        var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
        if (browserZoomLevel == 100) {
          $('.box-part').css('width', '100%');
          $('.col-lg-3').css('max-width', '20%');
          $('.h4-title').css('width', '152px');
          $('body').css('overflow-y', 'hidden');
        }
        if (browserZoomLevel < 100) {
          $('.col-lg-3').css('max-width', '18%');
          $('.h4-title').css('width', '160px');
        }
        if (browserZoomLevel > 100) {
          $('body').css('overflow-y', 'auto');
        }
        if (browserZoomLevel == 110) {
          $('.col-lg-3').css('max-width', '21%');
          $('.h4-title').css('width', '135px');
        }
        if (browserZoomLevel == 125) {
          $('.col-lg-3').css('max-width', '25%');
          $('.h4-title').css('width', '138px');
        }
        if (browserZoomLevel == 150) {
          $('.col-lg-3').css('max-width', '30%');
          $('.h4-title').css('width', '126px');
        }
        if (browserZoomLevel == 175) {
          $('.col-lg-3').css('max-width', '40%');
        }
        if (browserZoomLevel == 250) {
          $('.col-lg-3').css('max-width', '45%');
          $('.h4-title').css('width', '160px');
        }
        if (browserZoomLevel == 300) {
          $('.col-lg-3').css('max-width', '45%');
          $('.h4-title').css('width', '120px');
        }
        if (browserZoomLevel == 400) {
          $('.col-lg-3').css('max-width', '65%');
        }
        if (browserZoomLevel == 500) {
          $('.col-lg-3').css('max-width', '80%');
        }
      });
    });
    /** client name, region, project list for dynamic cards **/
    this.mainService.getRegionsperClient()
      .pipe()
      .subscribe(value => {
        var getSelect = localStorage.getItem('fetchedProj');
        var getBrandProjects = localStorage.getItem('BrandLibraryProjects');
        if (getSelect != null || getSelect != undefined) {
          var array = getSelect;
        } if (getBrandProjects != null) {
          var array = getBrandProjects;
        }
        if (array != undefined) {
          if (array[0] != "") {
            this.arr = JSON.parse(array);
            this.selectedClients = this.arr;
            let selectClientArr = [];
            for (var a = 0; a < array.length; a++) {
              let getClient: any = value.data.filter(u =>
                u.name == array[a]);
              getClient.forEach(function (value) {
                selectClientArr.push(value['clientName']);
              });
            }
            this.data = selectClientArr;
          }
        }
        let regionArr = [];
        for (var i = 0; i < value.data.length; i++) {
          var regValue = value.data[i]['clientRegion'];
          regionArr.push(regValue);
        }
        function removeDuplicates(originalArray, prop) {
          var newArray = [];
          var lookupObject = {};

          for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
          }

          for (i in lookupObject) {
            newArray.push(lookupObject[i]);
          }
          return newArray;
        }

        var uniqueRegion = regionArr.filter((v, i, a) => a.indexOf(v) === i);
        this.activeRegions = uniqueRegion;
        let clientArr = [];
        for (var j = 0; j < this.activeRegions.length; j++) {
          let filterClient: any = value.data.filter(u =>
            (u.clientRegion == this.activeRegions[j]));
          this.clientsData.push(...filterClient);
          var uniqueArray1 = removeDuplicates(filterClient, "clientName");
          clientArr.push(uniqueArray1);
        }
        var result = [];
        for (var k = 0; k < clientArr.length; k++) {
          result = result.concat(clientArr[k]);
        }
        this.clientArrList = result;
        let regionData = [];
        let RoleLevel = localStorage.getItem('AccessRole');
        if (RoleLevel != 'Admin') {
          this.filterClients = this.clientsData;
          let userName = localStorage.getItem('userName');
          this.mainService.getRoleModule(8, null, null, userName, null)
            .then(value => {
              for (var m = 0; m < value.data.length; m++) {
                this.RolelevelProjects.push(value.data[m]['dbPath'] + '_' + value.data[m]['name']);
              }
              let filterProjects = [];
              for (var i = 0; i < value.data.length; i++) {
                let clientsArray: any = this.filterClients.filter(u =>
                  (u.name == value.data[i]['name']) && (u.dbPath == value.data[i]['dbPath']) && (u.statusFlag == value.data[i]['statusFlag']));
                filterProjects.push(...clientsArray);
              }
              let modClients = [];
              for (var j = 0; j < this.activeRegions.length; j++) {
                let filterClients: any = filterProjects.filter(u =>
                  u.clientRegion == this.activeRegions[j]);
                var uniqueArray1 = removeDuplicates(filterClients, "clientName");
                modClients.push(...uniqueArray1);
              }
              modClients.sort(this.sortOn("clientName"));
              this.arrClients = modClients;
              this.arrClients.forEach(item => item["background"] = this.getRandomColor());
              for (var m = 0; m < filterProjects.length; m++) {
                regionData.push(filterProjects[m]['clientRegion']);
              }
              let uniqueRegions = regionData.filter((v, i, a) => a.indexOf(v) === i);
              uniqueRegions.sort();
              this.activeRegionsList = uniqueRegions;
            });
        } else {
          this.clientArrList.sort(this.sortOn("clientName"));
          this.arrClients = this.clientArrList;
          this.arrClients.forEach(item => item["background"] = this.getRandomColor());
          for (var m = 0; m < this.clientArrList.length; m++) {
            regionData.push(this.clientArrList[m]['clientRegion']);
          }
          let uniqueRegions = regionData.filter((v, i, a) => a.indexOf(v) === i);
          uniqueRegions.sort();
          this.activeRegionsList = uniqueRegions;
        }

        this.isNextVisible = true;
      });

    localStorage.removeItem('clientUpdated');
    localStorage.removeItem('choosenProjects');
    localStorage.removeItem('fetchedProj');
    localStorage.removeItem('BrandLibraryProjects');
    localStorage.removeItem('updatedBrandProjects');
    localStorage.removeItem('versionSelects');
    localStorage.removeItem('reloadedProjects');
    localStorage.removeItem('dataConfigBinProjects');
    localStorage.removeItem('selectedBrand');
    localStorage.removeItem('updatebrandLibraryProjects');
    localStorage.removeItem('configureProjectNames');

  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
    $(window).trigger('resize');
  }

  zoomFunction() {
    $("*").hover(function () {
      $(window).trigger('resize');
    });
    setTimeout(function () {
      $(window).trigger('resize');
    }, 2000);
    $("*").click(function () {
      $(window).trigger('resize');
    });
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel == 100) {
      $('.box-part').css('width', '100%');
      $('.col-lg-3').css('max-width', '20%');
      $('.h4-title').css('width', '152px');
      $('body').css('overflow-y', 'hidden');
    }
    if (browserZoomLevel < 100) {
      $('.col-lg-3').css('max-width', '18%');
      $('.h4-title').css('width', '160px');
    }
    if (browserZoomLevel > 100) {
      $('body').css('overflow-y', 'auto');
    }
    if (browserZoomLevel == 110) {
      $('.col-lg-3').css('max-width', '21%');
      $('.h4-title').css('width', '135px');
    }
    if (browserZoomLevel == 125) {
      $('.col-lg-3').css('max-width', '25%');
      $('.h4-title').css('width', '138px');
    }
    if (browserZoomLevel == 150) {
      $('.col-lg-3').css('max-width', '30%');
      $('.h4-title').css('width', '126px');
    }
    if (browserZoomLevel == 175) {
      $('.col-lg-3').css('max-width', '40%');
    }
    if (browserZoomLevel == 250) {
      $('.col-lg-3').css('max-width', '45%');
      $('.h4-title').css('width', '160px');
    }
    if (browserZoomLevel == 300) {
      $('.col-lg-3').css('max-width', '45%');
      $('.h4-title').css('width', '120px');
    }
    if (browserZoomLevel == 400) {
      $('.col-lg-3').css('max-width', '65%');
    }
    if (browserZoomLevel == 500) {
      $('.col-lg-3').css('max-width', '80%');
    }
    this.loadZoom();
  }

  loadZoom() {
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel == 90) {
      $('#wrapper').css('margin', '0 auto');
      $('#wrapper').css('max-width', '1500px');
    }
    if (browserZoomLevel < 90) {
      $('#wrapper').css('margin', '0 auto');
      $('#wrapper').css('max-width', '1500px');
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
    mainscroll();
  }

  /** sorting cards in alphabetical order  */

  sortOn(property) {
    return function (a, b) {
      if (a[property].toLowerCase() < b[property].toLowerCase()) return -1;
      if (a[property].toLowerCase() > b[property].toLowerCase()) return 1;
      return 0;
    }
  }

  /** functionality to generate dynamic colors for cards  */

  getRandomColor2() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }

  /** functionality to generate dynamic colors for cards  */
  getRandomColor() {
    var color,
      letters = '0123456789ABCDEF'.split('')
    function AddDigitToColor(limit) {
      color += letters[Math.round(Math.random() * limit)]
    }
    color = '#'
    AddDigitToColor(5)
    for (var i = 0; i < 5; i++) {
      AddDigitToColor(15)
    }
    return color;
    //var color = Math.floor(0x1000000 * Math.random()).toString(16);
    //return '#' + ('000000' + color).slice(-6);
  }

  /** selection of clients (multiple selection)  */

  selectClient(project, clientname, region, event) {
    let projectCheckedData = [];
    this.mainService.getProjectNames(clientname, region, null, null, null, 3)
      .pipe()
      .subscribe(value => {
        if (!event.target.classList.contains('highlighted')) {
          event.target.classList.add('highlighted');
          if (value) {
            if (this.selectedClients.indexOf(value) === -1) {
              this.selectedClients.push(value);
              let filterProject: any = value.data;
              filterProject.forEach(element => {
                element['projectname'] = element['dbinstance'] + '_' + element['projectname']
              })
              for (var i = 0; i < filterProject.length; i++) {
                projectCheckedData.push(filterProject[i]['projectname']);
              }
              var result = this.checkedItems.filter(function (n) {
                return projectCheckedData.indexOf(n) > -1;
              });
              if (typeof this.selectedClients[(this.selectedClients.length - 2)] != 'object' && this.selectedClients[(this.selectedClients.length - 2)] != undefined) {
                this.mainProjects.push(this.selectedClients[(this.selectedClients.length - 2)]);
              }
              if (typeof this.selectedClients[this.selectedClients.length - 1] == 'object' && this.selectedClients[(this.selectedClients.length - 1)] != undefined) {
                this.mainProjects.push(this.selectedClients[this.selectedClients.length - 1].data[0]['projectname']);
              }
              this.mainProjects.filter((v, i, a) => a.indexOf(v) === i);
              const array3 = [...this.mainProjects, ...result];
              this.mainProjects = array3;
              const uniqueValues = this.mainProjects.filter((n, i) => this.mainProjects.indexOf(n) === i);
              this.mainProjects = uniqueValues;
            } else {
              let index = this.selectedClients.indexOf(value);
              this.selectedClients.splice(index, 1);
            }
          }
        } else {
          event.target.classList.remove('highlighted');
          let removeArr = [];
          let filterProject: any = value.data;
          filterProject.forEach(element => {
            element['projectname'] = element['dbinstance'] + '_' + element['projectname']
          })
          for (var i = 0; i < filterProject.length; i++) {
            removeArr.push(filterProject[i]['projectname']);
          }
          this.mainProjects = this.mainProjects.filter(function (el) {
            return removeArr.indexOf(el) < 0;
          });
          const uniqueValues = this.mainProjects.filter((n, i) => this.mainProjects.indexOf(n) === i);
          this.mainProjects = uniqueValues;
        }
      });

  }

  /** project selection and deselection of checkbox in onhover menulist   */

  pushpopcategory(value, evt, client, region) {
    if (evt.target.checked == false) {
      let index = this.mainProjects.indexOf(value);
      this.mainProjects.splice(index, 1);
    } else {
    }
    if (value) {
      if (this.checkedItems.indexOf(value) == -1) {
        this.checkedItems.push(value);
      } else {
        let index = this.checkedItems.indexOf(value);
        this.checkedItems.splice(index, 1);
      }
      const uniqueValues = this.checkedItems.filter((n, i) => this.checkedItems.indexOf(n) === i);
      this.checkedItems = uniqueValues;
    }
    this.selectClient(value, client, region, evt);
    var checkSelected = $('.icons-check').attr('class');
    if (value) {
      if (checkSelected != 'fa fa-check-circle icons-check zoom-img') {
        if (this.selectedClients.indexOf(value) === -1) {
          this.selectedClients.push(value);
        } else {
          let index = this.selectedClients.indexOf(value);
          this.selectedClients.splice(index, 1);
        }
      }
    }
  }

  /** displaying list if checked in onhover */

  toggleCheckBox(proj) {
    return (this.checkedItems.indexOf(proj) != -1) ? true : false;
  }

  /** displaying list of checked items in onhover menu */
  chooseClient(name, region) {
    this.projects = [];
    let clientName = name; let dataType = 3; let Region = region;
    this.mainService.getProjectNames(clientName, Region, null, null, null, dataType)
      .pipe()
      .subscribe(value => {
        this.finalArr = value.data;
        this.finalArr.forEach(element => {
          element['projectname'] = element['dbinstance'] + '_' + element['projectname']
        })
        let RoleLevel = localStorage.getItem('AccessRole');
        if (RoleLevel != 'Admin') {
          let projectArr = []; let diffArr = [];
          let filterProject: any = this.finalArr;
          for (var j = 0; j < filterProject.length; j++) {
            projectArr.push(filterProject[j]['projectname']);
            var uniqueProjects = projectArr.filter((v, i, a) => a.indexOf(v) === i);
            // this.projects = uniqueProjects.reverse();
          }
          this.RolelevelProjects.forEach(element => {
            diffArr.push(uniqueProjects.filter(x => x === element)[0]);
          })
          this.projects = diffArr.filter(u => u != undefined);
          this.checkedItems.push(this.projects[0]);
        } else {
          let projectArr = [];
          let filterProject: any = this.finalArr;
          for (var i = 0; i < filterProject.length; i++) {
            projectArr.push(filterProject[i]['projectname']);
          }
          var uniqueProjects = projectArr.filter((v, i, a) => a.indexOf(v) === i);
          // this.projects = uniqueProjects.reverse();
          this.projects = uniqueProjects;
          this.checkedItems.push(this.projects[0]);
        }
      });
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

  /** routing to another component based on project selection */

  nextBtn() {
    if (this.mainProjects.length > 0) {
      localStorage.removeItem('choosenProjects');
      localStorage.removeItem('BrandLibraryProjects');
      localStorage.setItem('choosenProjects', JSON.stringify(this.mainProjects));


      if (this.moduleselected === 'Data Management Tool') {
        if (this.getMenuItem != null && this.getMenuItem != undefined) {
          if (this.getMenuItem == 'Brand Model') {
            this.getMenuItem = 'Component Data';
          } if (this.getMenuItem == 'BrandInfoCEC') {
            this.getMenuItem = 'Brand Info CEC';
          } if (this.getMenuItem == 'BrandInfoEDID') {
            this.getMenuItem = 'Brand Info EDID';
          } if (this.getMenuItem == 'CEC-EDID') {
            this.getMenuItem = 'CEC-EDID Data';
          } if (this.getMenuItem == 'CrossReferenceBy Brands') {
            this.getMenuItem = 'Cross Reference By Brands';
          }
          localStorage.setItem('selectedBrand', this.getMenuItem);
          this.router.navigate(['/brand-library']);

        } else {
          this.router.navigate(['/data-configuration-list']);
        }
      }
      if (this.moduleselected === 'Centralized CEC-EDID DB') {
        if (this.switchRoute == 'CEC-EDID Data') {
          this.router.navigate(['/prod_CEC-EDID_data']);
        }
      }
      if (this.moduleselected === 'admin-dashboard') {
        if (this.switchRoute == 'Change History') {
          this.router.navigate(['/changeHistory']);
        }
      }
      if (this.moduleselected === 'Cloud API Search Tester') {
        if (this.mainProjects.length == 1) {
          let dataType = 1;
          this.mainService.getProjectNames(null, null, null, null, null, dataType)
            .subscribe(value => {
              let filterProject: any = value.data;
              filterProject.forEach(element => {
                element['projectname'] = element['dbinstance'] + '_' + element['projectname']
              })
              let resultFetchArr: any = filterProject.filter(u =>
                u.projectname == this.mainProjects[0]);
              let Dbname = resultFetchArr[0]['dbPath'];
              let arr = []; let Project = this.mainProjects[0].replace(Dbname + '_', ''); let sessionToken = null; let apis = []
              console.log(sessionToken, Dbname, Project);
              this.mainService.getAPIListData(sessionToken, Dbname, Project)
                .then(value => {
                  if (value.data.length != 0) {
                    value.data = value.data.filter(function (obj) {
                      return obj.statusFlag !== 0;
                    });
                    apis = value.data;
                    if (apis.length == 0) {
                      // this.toastr.warning(value.message);
                      console.log('No Api is assigned for this ' + Project)
                    }
                    for (let i = 0; i < apis.length; i++) {
                      arr.push(apis[i]['name'])
                    }
                  }
                  if (this.apiMenuList != null && this.apiMenuList != undefined) {
                    if (this.apiMenuList == 'Auto Search') {
                      this.apiMenuList = 'AUTOSEARCH';
                    }
                    if (this.apiMenuList == 'BIN Download') {
                      this.apiMenuList = 'DOWNLOAD BIN';
                    }
                    if (this.apiMenuList == 'Delta Search') {
                      this.apiMenuList = 'DELTASEARCH';
                    }
                    if (this.apiMenuList == 'Model Search') {
                      this.apiMenuList = 'MODELSEARCH';
                    }
                    if (this.apiMenuList == 'ZIP Download') {
                      this.apiMenuList = 'DOWNLOAD ZIP';
                    }
                    if (this.apiMenuList == 'Download DB Updates') {
                      this.apiMenuList = 'DOWNLOADDBUPDATES';
                    }
                    if (this.apiMenuList == 'FeedBack') {
                      this.apiMenuList = 'FEEDBACK';
                    }
                    if (this.apiMenuList == 'Latest DB Version') {
                      this.apiMenuList = 'LATESTDBVERSION';
                    }
                    if (this.apiMenuList == 'Current DB Version') {
                      this.apiMenuList = 'CURRENTDBVERSION';
                    }
                    if (this.apiMenuList == 'Login') {
                      this.apiMenuList = 'LOGIN';
                    }
                    if (this.apiMenuList == 'Register') {
                      this.apiMenuList = 'REGISTRATION';
                    }
                    if (this.apiMenuList == 'Generic Log') {
                      this.apiMenuList = 'GENERICLOG';
                    }
                    if (arr.includes(this.apiMenuList)) {
                      localStorage.setItem('CloudApiProjects', JSON.stringify(this.mainProjects));
                      localStorage.setItem('CloudApi', this.apiMenuList);
                      this.router.navigate(['/api-db-test']);
                    }
                    else {
                      this.toastr.warning(this.apiMenuList + ' Module is not assigned for Project ' + Project, '');
                    }

                  }
                  else {
                    this.router.navigate(['/cloud-api-modules']);
                  }
                });
            });
        }
        if (this.mainProjects.length > 1) {
          localStorage.removeItem('choosenProjects');
          localStorage.removeItem('BrandLibraryProjects');
          localStorage.setItem('choosenProjects', JSON.stringify(this.mainProjects));
          this.apiMenuList = localStorage.getItem('ApiMenuItem');
          if (this.apiMenuList != null && this.apiMenuList != undefined) {
            if (this.apiMenuList == 'Auto Search') {
              this.apiMenuList = 'AUTOSEARCH';
            }
            if (this.apiMenuList == 'BIN Download') {
              this.apiMenuList = 'DOWNLOAD BIN';
            }
            if (this.apiMenuList == 'Delta Search') {
              this.apiMenuList = 'DELTASEARCH';
            }
            if (this.apiMenuList == 'Model Search') {
              this.apiMenuList = 'MODELSEARCH';
            }
            if (this.apiMenuList == 'ZIP Download') {
              this.apiMenuList = 'DOWNLOAD ZIP';
            }
            if (this.apiMenuList == 'Download DB Updates') {
              this.apiMenuList = 'DOWNLOADDBUPDATES';
            }
            if (this.apiMenuList == 'FeedBack') {
              this.apiMenuList = 'FEEDBACK';
            }
            if (this.apiMenuList == 'Latest DB Version') {
              this.apiMenuList = 'LATESTDBVERSION';
            }
            if (this.apiMenuList == 'Current DB Version') {
              this.apiMenuList = 'CURRENTDBVERSION';
            }
            if (this.apiMenuList == 'Login') {
              this.apiMenuList = 'LOGIN';
            }
            if (this.apiMenuList == 'Register') {
              this.apiMenuList = 'REGISTRATION';
            }
            if (this.apiMenuList == 'Generic Log') {
              this.apiMenuList = 'GENERICLOG';
            }
            localStorage.setItem('CloudApi', this.apiMenuList);
            localStorage.setItem('CloudApiProjects', JSON.stringify(this.selectedClients));
            this.router.navigate(['/api-db-test']);

          } else {
            this.router.navigate(['/cloud-api-modules']);
          }
        }
      }
      if (this.moduleselected === 'Analytics Report') {
        this.router.navigate(['/Report-configuration-list']);
      }

    } else {
      this.toastr.warning('Please Select the Client to Proceed Further..', '');
    }
  }

  /** single client selection routing */

  selectSingleClient(clientName, regionName) {
    localStorage.removeItem('choosenProjects');
    let dataType = 3;
    let clientArr = [];
    this.mainService.getProjectNames(clientName, regionName, null, null, null, dataType)
      .pipe()
      .subscribe(value => {
        let filterProject: any = value.data;
        filterProject.forEach(element => {
          element['projectname'] = element['dbinstance'] + '_' + element['projectname']
        })
        clientArr.push(filterProject[0]['projectname']);
        localStorage.setItem('choosenProjects', JSON.stringify(clientArr));
        if (clientArr.length != 0) {
          if (this.moduleselected === 'Data Management Tool') {
            if (this.getMenuItem != null && this.getMenuItem != undefined) {
              if (this.getMenuItem == 'Brand Model') {
                this.getMenuItem = 'Component Data';
              } if (this.getMenuItem == 'BrandInfoCEC') {
                this.getMenuItem = 'Brand Info CEC';
              } if (this.getMenuItem == 'BrandInfoEDID') {
                this.getMenuItem = 'Brand Info EDID';
              } if (this.getMenuItem == 'CEC-EDID') {
                this.getMenuItem = 'CEC-EDID Data';
              } if (this.getMenuItem == 'CrossReferenceBy Brands') {
                this.getMenuItem = 'Cross Reference By Brands';
              }
              localStorage.setItem('selectedBrand', this.getMenuItem);
              this.router.navigate(['/brand-library']);
            } else {
              this.router.navigate(['/data-configuration-list']);
            }
          }
          if (this.moduleselected === 'Centralized CEC-EDID DB') {
            if (this.switchRoute == 'CEC-EDID Data') {
              this.router.navigate(['/prod_CEC-EDID_data']);
            }
          }
          if (this.moduleselected === 'admin-dashboard') {
            if (this.switchRoute == 'Change History') {
              this.router.navigate(['/changeHistory']);
            }
          }
          if (this.moduleselected === 'Cloud API Search Tester') {
            let Dbname = filterProject[0]['dbinstance']; let arr = [];
            let Project = clientArr[0].replace(Dbname + '_', ''); let sessionToken = null; let apis = []
            this.mainService.getAPIListData(sessionToken, Dbname, Project)
              .then(value => {
                if (value.data.length != 0) {
                  value.data = value.data.filter(function (obj) {
                    return obj.statusFlag !== 0;
                  });
                  apis = value.data;
                  if (apis.length == 0) {
                    // this.toastr.warning(value.message);
                    console.log('No Api is assigned for this ' + Project)
                  }
                  for (let i = 0; i < apis.length; i++) {
                    arr.push(apis[i]['name'])
                  }
                }
                if (clientArr.length != 0) {
                  if (this.apiMenuList != null && this.apiMenuList != undefined) {
                    if (this.apiMenuList == 'Auto Search') {
                      this.apiMenuList = 'AUTOSEARCH';
                    }
                    if (this.apiMenuList == 'BIN Download') {
                      this.apiMenuList = 'DOWNLOAD BIN';
                    }
                    if (this.apiMenuList == 'Delta Search') {
                      this.apiMenuList = 'DELTASEARCH';
                    }
                    if (this.apiMenuList == 'Model Search') {
                      this.apiMenuList = 'MODELSEARCH';
                    }
                    if (this.apiMenuList == 'ZIP Download') {
                      this.apiMenuList = 'DOWNLOAD ZIP';
                    }
                    if (this.apiMenuList == 'Download DB Updates') {
                      this.apiMenuList = 'DOWNLOADDBUPDATES';
                    }
                    if (this.apiMenuList == 'FeedBack') {
                      this.apiMenuList = 'FEEDBACK';
                    }
                    if (this.apiMenuList == 'Latest DB Version') {
                      this.apiMenuList = 'LATESTDBVERSION';
                    }
                    if (this.apiMenuList == 'Current DB Version') {
                      this.apiMenuList = 'CURRENTDBVERSION';
                    }
                    if (this.apiMenuList == 'Login') {
                      this.apiMenuList = 'LOGIN';
                    }
                    if (this.apiMenuList == 'Register') {
                      this.apiMenuList = 'REGISTRATION';
                    }
                    if (this.apiMenuList == 'Generic Log') {
                      this.apiMenuList = 'GENERICLOG';
                    }
                    if (arr.includes(this.apiMenuList)) {
                      localStorage.setItem('CloudApiProjects', JSON.stringify(clientArr));
                      localStorage.setItem('CloudApi', this.apiMenuList);
                      this.router.navigate(['/api-db-test']);
                    }
                    else {
                      this.toastr.warning(this.apiMenuList + ' Module is not assigned for ' + Project, '');
                    }

                  }
                  else {
                    this.router.navigate(['/cloud-api-modules']);
                  }
                }
              });
          }
          if (this.moduleselected === 'Analytics Report') {
            this.router.navigate(['/Report-configuration-list']);
          }
        }
      });
  }

}
