import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import mainscroll from '../model/Scroll';
declare var $: any;


@Component({
  selector: 'app-clear-default-box-id-logs',
  templateUrl: './clear-default-box-id-logs.component.html',
  styleUrls: ['./clear-default-box-id-logs.component.css']
})
export class ClearDefaultBoxIdLogsComponent implements OnInit {

  projectNames: any = null;
  projects = [];
  filterProjects = [];
  selectedItems: Array<any> = [];
  defaultboxid: any;
  updatedeviceidForm: any;
  updatedevice_id: string;
  versionlist: any[]; version: any[];
  selectedversion: any;
  ipAddress: any;
  loginid: any;
  constructor(private mainService: MainService, private fb: FormBuilder, private router: Router, private toastr: ToastrService, private spinnerService: NgxSpinnerService) {
    this.loginid = JSON.parse(localStorage.getItem('currentUser'))
  }

  ngOnInit() {
    var self = this;
    $.getJSON("https://api.ipify.org?format=json",
      function (data) {
        self.dataIpAddress(data.ip);
      });
    this.spinnerService.show();
    /** List of Projects */
    let dataType = 1; let versionarr = [];
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {
        this.filterProjects = value.data;
        this.filterProjects.forEach(element => {
          element['projectname'] = element['dbinstance'] + '_' + element['projectname']
        })
        const uniqueProjects = [...new Set(this.filterProjects.map(item => item.projectname))];
        this.projects = uniqueProjects;
        this.projectNames = this.projects[0];
        let filterProject: any = this.filterProjects.filter(u =>
          u.projectname == this.projects[0]);
        this.defaultboxid = filterProject[0]['defaultBoxId'];
        this.spinnerService.hide();
      });
    var self = this;
    $('#ModuleSubmit').click(function () {
      let projectname = self.projectNames;
      let filterProject: any = self.filterProjects.filter(u =>
        (u.projectname == projectname));
      let dbName = filterProject[0]['dbinstance'];
      self.mainService.ClearDefaultBoxIdLogs(dbName, self.defaultboxid)
        .then(value => {
          if ((value.data[0]['status'] === 1 || value.data[0]['status'] === "1") && value.statusCode === "200") {
            self.toastr.success('', value.data[0]['message']);
          }
          else {
            self.toastr.error('', value.data[0]['message']);
          }
          $('.close').click();
        });
    })
    this.updatedeviceidForm = this.fb.group({
      updatedeviceId: ['', Validators.required]
    });
    mainscroll();
  }

  /** Space Validation for Inputs */

  keyDownHandler(event) {
    if (event.keyCode === 32) {
      return false;
    }
  }

  /** change of project update Modules*/
  async changeProject() {
    if (this.projectNames == null || this.projectNames == "null" || this.projectNames == undefined) {
      this.toastr.warning('', 'Please Select the Project');
      this.defaultboxid = null
      $('#defaultboxid_update').css('display', 'none');
    } else {
      this.mainService.getProjectNames(null, null, null, null, null, 1)
        .subscribe(value => {
          this.filterProjects = value.data
          this.filterProjects.forEach(element => {
            element['projectname'] = element['dbinstance'] + '_' + element['projectname']
          })
        })
      let filterProject: any = this.filterProjects.filter(u =>
        u.projectname == this.projectNames);
      this.defaultboxid = filterProject[0]['defaultBoxId'];
      if (this.defaultboxid === null || this.defaultboxid === undefined) {
        this.defaultboxid = null;
      }
      else {
        this.defaultboxid = filterProject[0]['defaultBoxId'];
      }

      $('#defaultboxid_update').css('display', 'block');
    }
    // if (this.projectNames == null || this.projectNames == "null" || this.projectNames == undefined) {
    //   $('#defaultboxid_update').css('display', 'none');
    //   $('#defaultboxid_delete').css('display', 'none');
    // } else {
    //   $('#defaultboxid_update').css('display', 'block');
    //   $('#defaultboxid_delete').css('display', 'block');
    // }
  }

  updatedeviceid() {
    var deviceId = 'Portal_' + this.updatedevice_id;
    let BoxId = deviceId; let versionarr = [];
    let Projectname = this.projectNames;
    let filterProject: any = this.filterProjects.filter(u =>
      (u.projectname == Projectname));
    // var self=this;
    let Client = filterProject[0]['client']; let Region = filterProject[0]['region'];
    let Dbinstance = filterProject[0]['dbinstance'];
    let ProjectName = filterProject[0]['projectname'].replace(Dbinstance + '_', '');
    this.mainService.getProjectNames(Client, Region, ProjectName, null, Dbinstance, 21)
      .subscribe(value => {
        if (value.data.length != 0) {
          versionarr.push(value.data[0]['version']);
          this.versionlist = versionarr[0];
        }

        let crudType = 3; let dbversion = this.versionlist;
        let signaturekey = filterProject[0]['signatureKey']; let Dbname = filterProject[0]['dbPath'];
        let project = this.projectNames.replace(Dbname + '_', '');
        let userName = localStorage.getItem('userName'); let recordCount = 1; let ipaddress = this.ipAddress;

        if (this.updatedevice_id != undefined) {
          this.mainService.getBoxId(crudType, project, signaturekey, BoxId, Dbname, dbversion)
            .subscribe(boxIdData => {
              if (boxIdData.status === 'success' && boxIdData.statusCode === '200' && (boxIdData.data[0]["result"] === "1" || boxIdData.data[0]["result"] === 1)) {
                this.toastr.success('', boxIdData.data[0]["message"], { timeOut: 6000 });
                let Updateadddescription = 'Boxid: ' + BoxId + ' Updated successfully'; let Updatestatus = 100; let Operation = "Update"; let Datasection = 'Default Boxid Updation';
                let log = JSON.stringify({ userName, Dbname, project, dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus }) + '(Update DefaultBoxid)';
                let loginid = this.loginid['data'][0]['loginId'];
                this.mainService.Genericlog(1, loginid, log)
                  .then(value => {

                  });
              }
              else if (boxIdData.status === 'success' && boxIdData.statusCode === '200' && (boxIdData.data[0]["result"] === "3" || boxIdData.data[0]["result"] === 3)) {
                this.toastr.info('', boxIdData.data[0]["message"], { timeOut: 6000 });
              }
              else if (boxIdData.status === 'success' && boxIdData.statusCode === '200' && (boxIdData.data[0]["result"] === "2" || boxIdData.data[0]["result"] === 2)) {
                // this.toastr.info('', boxIdData.data[0]["message"]);
                // location.reload();
                this.mainService.getBoxId(1, project, signaturekey, BoxId, Dbname, dbversion)
                  .subscribe(value => {
                    if (value.status === 'success' && value.statusCode === '200' && (value.data[0]["result"] === "1" || value.data[0]["result"] === 1)) {
                      this.toastr.success('', value.data[0]["message"], { timeOut: 6000 });
                      let Updateadddescription = 'Boxid: ' + BoxId + ' Inserted Successfully'; let Updatestatus = 1; let Operation = "Insert"; let Datasection = 'Default Boxid Insertion';
                      let log = JSON.stringify({ userName, Dbname, project, dbversion, Datasection, recordCount, Updateadddescription, Operation, ipaddress, Updatestatus }) + '(Update DefaultBoxid)';
                      let loginid = this.loginid['data'][0]['loginId'];
                      this.mainService.Genericlog(1, loginid, log)
                        .then(value => {

                        });
                    }
                    else {
                      this.toastr.info('', value.data[0]["message"], { timeOut: 6000 });
                    }
                  })
              }
              else {
                this.toastr.warning('', boxIdData.data[0]["message"], { timeOut: 6000 });
              }
              $('.close').click();
              this.updatedevice_id = null;

              setTimeout(() => {
                location.reload();
              }, 2000)

            });

        }
        else {
          this.toastr.error('', 'Please Enter Device id', { timeOut: 2000 })
        }

      })

  }

  dataIpAddress(ipdata) {
    this.ipAddress = ipdata
  }

}
