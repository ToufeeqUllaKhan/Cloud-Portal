import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from './services/main-service';
import { User } from '../app/model/user';
import { environment } from '../environments/environment';
import mainscroll from './model/Scroll';
declare var $: any;
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
  isDataUpload1: Boolean = false; isDataUpload2: Boolean = false; isDataUpload3: Boolean = false; isDataUpload4: Boolean = false;
  isCloudApi1: Boolean = false; isCloudApi2: Boolean = false; isCloudApi3: Boolean = false; isCloudApi4: Boolean = false;
  isReports1: Boolean = false; isReports2: Boolean = false; isReports3: Boolean = false; isReports4: Boolean = false;
  isCentralized1: Boolean = false; isCentralized2: Boolean = false; isCentralized3: Boolean = false; isCentralized4: Boolean = false;
  isMenu1: Boolean = false; isMenu2: Boolean = false; isMenu3: Boolean = false; isMenu4: Boolean = false
  notificationcount: any;
  message: string;
  notificationdetails: any;
  notificationlist: any = [];
  keys: any[];
  Values: unknown[];
  previewNotification: any;
  mainMenu4: any;
  centralized: any;

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
          this.mainService.getRoleModule(crudType, null, null, null, null)
            .then(value => {
              let resultFetchArr: any = value.data.filter(u =>
                u.name == this.role);
              let mainModules = [];
              for (var i = 0; i < resultFetchArr.length; i++) {
                mainModules.push(resultFetchArr[i]['mainModule']);
              }
              this.mainService.sidebarLists()
                .subscribe(value => {
                  if (value.data.length > 0) {
                    this.mainMenu1 = value.data[2]['mainmenu'];
                    this.datas = value.data[2]['submenu'];
                    this.mainMenu2 = value.data[1]['mainmenu'];
                    this.searchApi = value.data[1]['submenu'];
                    this.mainMenu3 = value.data[3]['mainmenu'];
                    this.searchReports = value.data[3]['submenu'];
                    this.mainMenu4 = value.data[0]['mainmenu'];
                    this.centralized = value.data[0]['submenu'];
                    if (mainModules.indexOf('Cloud API Search Tester') > -1) {
                      this.isCloudApi2 = true;
                      this.isDataUpload2 = false;
                      this.isReports2 = false;
                      this.isCentralized2 = false;
                      $('.menu2Data').css('display', 'block');
                      $('.menu2Data').click(function (e) {
                        localStorage.setItem('moduleselected', 'Cloud API Search Tester')
                      })

                    }
                    else {
                      $('.menu2Data').css('display', 'none');
                    }
                    if (mainModules.indexOf('Data Management Tool') > -1) {
                      this.isDataUpload1 = true;
                      this.isCloudApi1 = false;
                      this.isReports1 = false;
                      this.isCentralized1 = false;
                      $('.menu1Data').css('display', 'block');
                      $('.menu1Data').click(function (e) {
                        localStorage.setItem('moduleselected', 'Data Management Tool')
                      })
                    } else {
                      $('.menu1Data').css('display', 'none');
                    }
                    if (mainModules.indexOf('Analytics Report') > -1) {
                      this.isReports3 = true;
                      this.isDataUpload3 = false;
                      this.isCloudApi3 = false;
                      this.isCentralized3 = false;
                      $('.menu3Data').css('display', 'block');
                      $('.menu3Data').click(function (e) {
                        localStorage.setItem('moduleselected', 'Analytics Report')
                      })
                    }
                    else {
                      $('.menu3Data').css('display', 'none');
                    }
                    if (mainModules.indexOf('Centralized CEC-EDID DB') > -1) {
                      this.isCentralized4 = true;
                      this.isDataUpload4 = false;
                      this.isCloudApi4 = false;
                      this.isReports4 = false;
                      $('.menu4Data').css('display', 'block');
                      $('.menu4Data').click(function (e) {
                        localStorage.setItem('moduleselected', 'Centralized CEC-EDID DB')
                      })
                    }
                    else {
                      $('.menu4Data').css('display', 'none');
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
    let loginid = this.user['data'][0]['loginId'];
    this.mainService.Notifications(2, null, null, null, null, loginid, null, null, null)
      .then(value => {
        this.notificationcount = value.data.length;
        if (this.notificationcount === 0) {
          this.message = "No notifications to display."
          this.notificationdetails = [];
          $('#showall').css('display', 'none')
        }
        else {
          this.notificationdetails = value.data;
          $('#showall').css('display', 'none')
        }
      })
    this.mainService.Notifications(2, null, null, null, null, loginid, null, null, null)
      .then(value => {
        this.notificationcount = value.data.length;
        if (this.notificationcount === 0) {
          this.message = "No notifications to display."
          this.previewNotification = [];
          $('#showall').css('display', 'none')
        }
        else {
          let preview = [];
          preview = value.data;
          preview.forEach(element => {
            element['data'] = (JSON.parse(element.data))
          });
          this.previewNotification = preview
          this.previewNotification.forEach(element => {
            element['data'] = element.data['Datasection'] + ' Uploaded Successfully'
          });
          $('#showall').css('display', 'none')
        }
      })
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel != 100) {
      this.zoomFunction();
    }
    var getUrl = this.router.url;
    if ((getUrl != '/view_staging_data') && (getUrl != '/view_raw_capture')) {
      localStorage.removeItem('RawStatus')
      localStorage.removeItem('StagingStatus')
    }

    var self=this;
    $(document).ready(function () {
      $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $('#sidebar-wrapper').toggleClass('show');
        var checkMenuclass = $('#sidebar-wrapper').attr('class');
      });

      $(document).ready(function () {

        $(window).resize(function () {
          self.zoomFunction();
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
      $(window).resize(function () {
        self.zoomFunction();
      });
    });

  }

  zoomFunction() {
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
    if (browserZoomLevel == 125) {
      $('.navbar').css('padding', '.56rem 1rem');
    }
    mainscroll();
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
      this.router.navigate(['clients'])
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

  Notification(e) {
    let val = [];
    let filterdetails: any = this.notificationdetails.filter(u => u.notificationId === parseInt(e.target.id))
    filterdetails.forEach(element => {
      val = (JSON.parse(element.data));
    })
    let key = [];
    for (let i = 0; i < Object.keys(val).length; i++) {
      key.push(Object.keys(val)[i].charAt(0).toUpperCase() + Object.keys(val)[i].slice(1))
    }
    this.keys = key;
    this.Values = Object.values(val);
    this.markasreadNotifications(parseInt(e.target.id))
  }

  markasreadNotifications(id) {
    let loginid = this.user['data'][0]['loginId'];
    this.mainService.Notifications(4, null, null, null, null, loginid, null, null, id)
      .then(value => {
        let loginid = this.user['data'][0]['loginId'];
        this.mainService.Notifications(2, null, null, null, null, loginid, null, null, null)
          .then(value => {
            this.notificationcount = value.data.length;
            if (this.notificationcount === 0) {
              this.message = "No notifications to display."
              this.notificationdetails = [];
              $('#showall').css('display', 'none')
            }
            else {
              this.notificationdetails = value.data;
              $('#showall').css('display', 'none')
            }
          })
        this.mainService.Notifications(2, null, null, null, null, loginid, null, null, null)
          .then(value => {
            this.notificationcount = value.data.length;
            if (this.notificationcount === 0) {
              this.message = "No notifications to display."
              this.previewNotification = [];
              $('#showall').css('display', 'none')
            }
            else {
              let preview = [];
              preview = value.data;
              preview.forEach(element => {
                element['data'] = (JSON.parse(element.data))
              });
              this.previewNotification = preview
              this.previewNotification.forEach(element => {
                element['data'] = element.data['Datasection'] + ' Uploaded Successfully'
              });
              $('#showall').css('display', 'none')
            }
          })
      })
  }

  allasread() {
    let loginid = this.user['data'][0]['loginId'];
    let allasread = this.notificationdetails;
    let recordstodelete = []
    allasread.forEach(element => {
      recordstodelete.push(element.notificationId)
    });
    recordstodelete.forEach(element => {
      this.mainService.Notifications(4, null, null, null, null, loginid, null, null, element)
        .then(value => {

        })
    })
    this.mainService.Notifications(2, null, null, null, null, loginid, null, null, null)
      .then(value => {
        this.notificationcount = value.data.length;
        if (this.notificationcount === 0) {
          this.message = "Notifications are not available"
          this.notificationdetails = [];
          $('#showall').css('display', 'none')
        }
        else {
          this.notificationdetails = value.data;
          $('#showall').css('display', 'none')
        }
      })
    this.mainService.Notifications(2, null, null, null, null, loginid, null, null, null)
      .then(value => {
        this.notificationcount = value.data.length;
        if (this.notificationcount === 0) {
          this.message = "Notifications are not available"
          this.previewNotification = [];
          $('#showall').css('display', 'none')
        }
        else {
          let preview = [];
          preview = value.data;
          preview.forEach(element => {
            element['data'] = (JSON.parse(element.data))
          });
          this.previewNotification = preview
          this.previewNotification.forEach(element => {
            element['data'] = element.data['Datasection'] + ' Uploaded Successfully'
          });
          $('#showall').css('display', 'none')
        }
      })
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

  report() {
    this.router.navigate(['/reports-view']);
  }

  Centralized() {
    this.router.navigate(['/Centralized-DB-view']);
  }

  @HostListener("window:onbeforeunload", ["$event"])
  clearLocalStorage(event) {
    localStorage.clear();
  }

}
