import { Component, HostListener  } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { MainService } from './services/main-service';
import { User } from '../app/model/user';
import { environment } from '../environments/environment';
import { contains } from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ssc-app-ver1';
  user: User = new User();
  usersName: String;
  selectedIndex: number = 0;
  mainMenu1: any; datas = []; mainMenu2: any; searchApi = [];
  mainMenu3: any; searchReports = [];
  isAdmin: Boolean = false; role: any;
  imagePath: any; profilePicture: any;
  public version: string;
  currentApplicationVersion = environment.appVersion;
  isDataUpload1: Boolean = false; isDataUpload2: Boolean = false; isDataUpload3: Boolean = false;
  isCloudApi1: Boolean = false; isCloudApi2: Boolean = false; isCloudApi3: Boolean = false;
  isReports1: Boolean = false; isReports2: Boolean = false; isReports3: Boolean = false;
  isMenu1: Boolean = false; isMenu2: Boolean = false; isMenu3: Boolean = false

  constructor(public router: Router, private mainService: MainService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.usersName = localStorage.getItem('userName');
    this.version = this.currentApplicationVersion;
  }

  ngOnInit() {
    let username = localStorage.getItem('userName');
    this.mainService.createUser(4, username, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        if (value.data.length > 0) {
          this.role = value.data[0]['roleName'];
          if (this.role == 'Admin') {
            this.isAdmin = true;
            $('.searchReports').css('display', 'block');
          } else {
            $('.searchReports').css('display', 'none');
          }
          let crudType = 7;
          this.mainService.getRoleModules(crudType, null, null, null, null)
            .subscribe(value => {
              let resultFetchArr: any = value.data.filter(u =>
                u.name == this.role);
              let mainModules = [];
              for (var i = 0; i < resultFetchArr.length; i++) {
                mainModules.push(resultFetchArr[i]['mainModule']);
              }
              this.mainService.sidebarLists()
              .subscribe(value => {
                if (value.data.length > 0) {
                  this.mainMenu1 = value.data[0]['mainmenu'];
                  this.datas = value.data[0]['submenu'];
                  this.mainMenu2 = value.data[1]['mainmenu'];
                  this.searchApi = value.data[1]['submenu'];
                  this.mainMenu3 = value.data[2]['mainmenu'];
                  this.searchReports = value.data[2]['submenu'];

                  console.log(mainModules.indexOf('Data Management Tool'),mainModules.indexOf('Cloud API Search Tester'),
                  mainModules.indexOf('Analytics Report'));
                  if (mainModules.indexOf('Cloud API Search Tester') > -1) {
                    this.isCloudApi2 = true;
                    this.isDataUpload2 = false;
                    this.isReports2 = false;
                    $('.menu2Data').css('display', 'block');
                  }
                  else{
                    $('.menu2Data').css('display', 'none');
                  }
                  if (mainModules.indexOf('Data Management Tool') > -1) {
                    this.isDataUpload1 = true;
                    this.isCloudApi1 = false;
                    this.isReports1 = false;
                    $('.menu1Data').css('display', 'block');
                  }else{
                    $('.menu1Data').css('display', 'none');
                  }
                  if (mainModules.indexOf('Analytics Report') > -1) {
                    this.isReports3 = true;
                    this.isDataUpload3 = false;
                    this.isCloudApi3 = false;
                    $('.menu3Data').css('display', 'block');
                  }
                  else{
                    $('.menu3Data').css('display', 'none');
                  }
                }
              });
            });
        }
      });
    let crudtype = 4;
    this.mainService.createUser(crudtype, username, null, null, null, null, null, null, null, null)
      .subscribe(value => {
        if (value.data.length > 0) {
          if (value.data[0]['profilePicture'] != null) {
            this.imagePath = value.data[0]['profilePicture'];
            this.profilePicture = 'data:image/jpg;base64,' + this.imagePath;
          } else {
            this.profilePicture = 'assets/images/logo_user.png';
          }
        }
      });
    
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel != 100) {
      this.zoomFunction();
    }
    
    $(document).ready(function () {
      //$("#menu-toggle").click(function (e) {
      //  e.preventDefault();
      //  $("#wrapper").toggleClass("toggled");
      //  var checkMenuclass = $('#wrapper').attr('class');
      //  if (checkMenuclass == 'd-flex toggled') {
      //    $('.sidebar-footer').css('position', 'relative');
      //  } else {
      //    $('.sidebar-footer').css('position', 'fixed');
      //  }
      //});
      $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $('#sidebar-wrapper').toggleClass('show');
        var checkMenuclass = $('#sidebar-wrapper').attr('class');
      });
      
      $(document).ready(function () {
       
        $(window).resize(function () {
          var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
          if (browserZoomLevel == 90) {
            $('#wrapper').css('margin', '0 auto');
            $('#wrapper').css('max-width', '1500px');
            $('.main-scroll').css('height', '650px');
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
        });
      });

      $('.list-group a').click(function () {
        $('.list-group-item .active').removeClass('active');
        $(this).parent().addClass('active');
      });

      var dropdown = document.getElementsByClassName("dropdown-btn");
      var i;

      for (i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function () {
          this.classList.toggle("active");
          var dropdownContent = this.nextElementSibling;
          if (dropdownContent != null) {
            if (dropdownContent.style.display === "block") {
              dropdownContent.style.display = "none";
            } else {
              dropdownContent.style.display = "block";
            }
          }
          
        });
      }

      $('#page-content-wrapper').on("click", function () {
        $('.dropdown-container').css('display', 'none');
      });
      var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
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

      $(window).resize(function () {
        var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
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
      });
    });
  }

  zoomFunction() {
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

  checkUrl() {
    this.router.navigate(['/dashboard']);
    var getUrl = this.router.url;
  /**  if (getUrl == '/dashboard') {
      $(".list-group a").first().removeClass('highlight');
    }
    if (getUrl == '/data-management') {
      $(".list-group a").first().addClass('highlight');
    }
    if (getUrl == '/clients') {
      $(".list-group a").first().addClass('highlight');
    }
    **/
  }

  create() {
    this.router.navigate(['create-new-client'])
      .then(() => {
        location.reload();
      });
  }

  clientsPage(list) {
    if (list == 'Auto Search' || list == 'BIN Download' || list == 'Current DB Version' || list == 'Delta Search' || list == 'Download DB Updates' ||
      list == 'FeedBack' || list == 'Generic Log' || list == 'Latest DB Version' || list == 'Login' || list == 'Model Search' || list == 'Register' || list == 'ZIP Download') {
      localStorage.setItem('ApiMenuItem', list);
      this.router.navigate(['api-clients'])
      .then(() => {
        location.reload();
      });
    }
    if (list == 'Brand' || list == 'Brand Model' || list == 'BrandInfoCEC' || list == 'BrandInfoEDID' || list == 'CEC Only' ||
      list == 'CEC-EDID' || list == 'Codesets' || list == 'CrossReferenceBy Brands' || list == 'EDID Only') {
      localStorage.setItem('sideMenuItem', list);
      this.router.navigate(['clients'])
        .then(() => {
          location.reload();
        });
    }
  }

  dashBoard() {
    this.router.navigate(['/dashboard']).then(() => {
      location.reload();
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.clear();
    window.localStorage.clear();
    this.router.navigate(['/login'])
      .then(() => {
        location.reload();
      });
  }

  @HostListener("window:onbeforeunload", ["$event"])
  clearLocalStorage(event) {
    localStorage.clear();
  }

}
