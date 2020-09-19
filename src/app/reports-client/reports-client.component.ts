import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { Title } from '@angular/platform-browser';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reports-client',
  templateUrl: './reports-client.component.html',
  styleUrls: ['./reports-client.component.css']
})
export class ReportsClientComponent implements OnInit {


  arrayData = [];
  activeRegions = []; activeClients = [];
  projects = []; arrClients = [];
  checkboxValue: Boolean;
  selectedClients = [];
  finalArr = []; ProjectData = [];
  data = []; arr = [];
  in: number = 0;
  isNextVisible: Boolean = false;
  switchRoute: any;

  constructor(private router: Router, private mainService: MainService, private titleService: Title, private spinnerService: Ng4LoadingSpinnerService, private toastr: ToastrService) {
    this.titleService.setTitle("Admin Clients");
    this.checkboxValue = false;
  }

  ngOnInit() {
    this.switchRoute = localStorage.getItem('logSelected');
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel != 100) {
      this.zoomFunction();
    }
    $(document).ready(function () {
      $(document).on("click", "button.check i", function () {
        $(this).toggleClass('fa-green');
      });
      $(window).resize(function () {
        var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
        if (browserZoomLevel == 100) {
          $('.box-part').css('width', '100%');
          $('.col-lg-3').css('max-width', '20%');
          $('.h4-title').css('width', '158px');
          $('body').css('overflow-y', 'hidden');
        }
        if (browserZoomLevel > 100) {
          $('body').css('overflow-y', 'auto');
        }
        if (browserZoomLevel < 100) {
          $('.col-lg-3').css('max-width', '18%');
          $('.h4-title').css('width', '160px');
        }
        if (browserZoomLevel == 110) {
          $('.h4-title').css('width', '145px');
          $('.col-lg-3').css('max-width', '21%');
        }
        if (browserZoomLevel == 125) {
          $('.col-lg-3').css('max-width', '25%');
          $('.h4-title').css('width', '145px');
        }
        if (browserZoomLevel == 150) {
          $('.col-lg-3').css('max-width', '30%');
          $('.h4-title').css('width', '134px');
        }
        if (browserZoomLevel == 175) {
          $('.col-lg-3').css('max-width', '40%');
          $('.h4-title').css('width', '140px');
        }
        if (browserZoomLevel == 250) {
          $('.col-lg-3').css('max-width', '45%');
          $('.h4-title').css('width', '170px');
        }
        if (browserZoomLevel == 300) {
          $('.col-lg-3').css('max-width', '45%');
          $('.h4-title').css('width', '130px');
        }
        if (browserZoomLevel == 400) {
          $('.col-lg-3').css('max-width', '65%');
        }
        if (browserZoomLevel == 500) {
          $('.col-lg-3').css('max-width', '80%');
        }
        
      });
    });

  /** Region List based on clients, project list based on client and region */
    this.mainService.getRegionsperClient()
      .pipe()
      .subscribe(value => {
        /**mark active start */
        var getSelect = localStorage.getItem('fetchedAdminProj');
        var getBrandProjects = localStorage.getItem('BrandLibraryAdminProjects');
        if (getSelect != null || getSelect != undefined) {
          var array = getSelect;
        } if (getBrandProjects != null) {
          var array = getBrandProjects;
        }
        if (array != undefined) {
          if (array[0] != "") {
            this.arr = JSON.parse(array);
            console.log(this.arr);
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
        uniqueRegion.sort();
        this.activeRegions = uniqueRegion;
        let clientArr = [];
        for (var j = 0; j < this.activeRegions.length; j++) {
          let filterClient: any = value.data.filter(u =>
            u.clientRegion == this.activeRegions[j]);

          var uniqueArray1 = removeDuplicates(filterClient, "clientName");
          clientArr.push(uniqueArray1);
        }
        var result = [];
        for (var k = 0; k < clientArr.length; k++) {
          result = result.concat(clientArr[k]);
        }
        result.sort(this.sortOn("clientName"));
        console.log(result);
        this.arrClients = result;
        this.arrClients.forEach(item => item["background"] = this.getRandomColor());
        this.isNextVisible = true;

      });
    localStorage.removeItem('clientUpdated');
    localStorage.removeItem('choosenAdminProjects');
    localStorage.removeItem('fetchedAdminProj');
    localStorage.removeItem('BrandLibraryAdminProjects');
    localStorage.removeItem('updatedBrandProjects');
    localStorage.removeItem('versionSelects');
    localStorage.removeItem('reloadedProjects');
    localStorage.removeItem('dataConfigBinProjects');
    localStorage.removeItem('selectedBrand');
    localStorage.removeItem('updatebrandLibraryAdminProjects');
    localStorage.removeItem('configureAdminProjectNames');
  }

  zoomFunction() {
    setTimeout(function () {
      $(window).trigger('resize');
    }, 2000);
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel == 100) {
      $('.box-part').css('width', '100%');
      $('.col-lg-3').css('max-width', '20%');
      $('.h4-title').css('width', '158px');
      $('body').css('overflow-y', 'hidden');
    }
    if (browserZoomLevel > 100) {
      $('body').css('overflow-y', 'auto');
    }
    if (browserZoomLevel < 100) {
      $('.col-lg-3').css('max-width', '18%');
      $('.h4-title').css('width', '160px');
    }
    if (browserZoomLevel == 110) {
      $('.h4-title').css('width', '145px');
      $('.col-lg-3').css('max-width', '21%');
    }
    if (browserZoomLevel == 125) {
      $('.col-lg-3').css('max-width', '25%');
      $('.h4-title').css('width', '145px');
    }
    if (browserZoomLevel == 150) {
      $('.col-lg-3').css('max-width', '30%');
      $('.h4-title').css('width', '134px');
    }
    if (browserZoomLevel == 175) {
      $('.col-lg-3').css('max-width', '40%');
      $('.h4-title').css('width', '140px');
    }
    if (browserZoomLevel == 250) {
      $('.col-lg-3').css('max-width', '45%');
      $('.h4-title').css('width', '170px');
    }
    if (browserZoomLevel == 300) {
      $('.col-lg-3').css('max-width', '45%');
      $('.h4-title').css('width', '130px');
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
/** alphabetical order of clients sorting */
  sortOn(property) {
    return function (a, b) {
      if (a[property].toLowerCase() < b[property].toLowerCase()) return -1;
      if (a[property].toLowerCase() > b[property].toLowerCase()) return 1;
        return 0;
      }
  }
/** random colors generation for cards, right now this function is not in use, it itz required we can use it */
  getRandomColor2() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }


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

  dashboard() {
    this.router.navigate(['/dashboard'])
      .then(() => {
        window.location.reload();
      });
  }

/** Based on client selection  default project of the client will be traversed to next page  */

  selectSingleClient(clientName, regionName) {
    localStorage.removeItem('choosenAdminProjects');
    localStorage.removeItem('BrandLibraryAdminProjects');
    let dataType = 3;
    let clientArr = [];
    this.mainService.getProjectNames(clientName, regionName, null, null, null, dataType)
      .pipe()
      .subscribe(value => {
        clientArr.push(value.data[0]['projectname']);
        localStorage.setItem('choosenAdminProjects', JSON.stringify(clientArr));
        if (clientArr.length != 0) {
          if (this.switchRoute == 'SearchLog' ||this.switchRoute == 'GenericLog') {
            this.router.navigate(['/Report-configuration-list']);
          } 
          // if (this.switchRoute == 'SearchLog') {
          //   this.router.navigate(['/search-history']);
          // } if (this.switchRoute == 'GenericLog') {
          //   this.router.navigate(['/generic-logs']);
          // }
        }
      });

  }

}
