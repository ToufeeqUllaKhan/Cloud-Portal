import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MainService } from '../services/main-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;


@Component({
  selector: 'app-edit-api',
  templateUrl: './edit-api.component.html',
  styleUrls: ['./edit-api.component.css']
})
export class EditApiComponent implements OnInit {

  projectNames: any = null;
  projects = [];
  apimodulesList = []; arr = [];
  checkedArr = []; filterProjects = [];
  isApiModules: Boolean = false;
  NoData: Boolean = false; apimodules = [];
  isModulesVisible: Boolean = false;
  addModules: FormGroup; editApiData: FormGroup;
  editAddressData: FormGroup;
  addrsubmitted: Boolean = false;
  submitted: Boolean = false; address: any;
  noModules: Boolean = false;
  editsubmitted: Boolean = false;
  selectedItems: Array<any> = [];
  editArray: Array<any> = [];
  uncheckedArr: Array<any> = [];
  upd_addr: any; updatedUrl: any;
  invalidUrl: Boolean = false;
  editinvalidUrl: Boolean = false;
  modulesAvailability: Boolean = false;
  recheckItems = [];
  successData = []; failedData = [];
  public failCount = 0; public successCount = 0;
  arrModules = []; checkValidUrl = [];
  showMyClass: Boolean = true;

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;

  constructor(private mainService: MainService, private fb: FormBuilder, private router: Router, private toastr: ToastrService, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    /** List of Projects */
    let dataType = 1;
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {
        this.filterProjects = value.data;
        const uniqueProjects = [...new Set(value.data.map(item => item.projectname))];
        this.projects = uniqueProjects;
        this.projectNames = this.projects[0];
        let filterProject: any = value.data.filter(u =>
          u.projectname == this.projects[0]);
        let project = this.projects[0]; let signaturekey = filterProject[0]['signatureKey'];
        let dbName = filterProject[0]['dbinstance']; let fetchModule = [];
        /** List of Api Modules */
        this.mainService.crudApiList(dbName, 2, project, signaturekey, null, null, null, null, 1, null)
          .then(apiList => {
            this.apimodulesList = apiList.data;
            if (apiList.data.length > 0) {
              this.address = apiList.data[0]['address'];
              this.isApiModules = true;
              this.modulesAvailability = true;
              this.NoData = false;
            } else {
              this.modulesAvailability = false;
              this.NoData = true;
              this.isApiModules = false;
            }
            for (var i = 0; i < apiList.data.length; i++) {
              fetchModule.push(apiList.data[i]['name']);
            }
            this.arrModules = apiList.data;
            this.arr = fetchModule;
          });
        this.spinnerService.hide();
      });
    /** Form Validations */
    this.addModules = this.fb.group({
      Address: ['', Validators.required]
    });
    this.editApiData = this.fb.group({
      urlUpdate: ['', Validators.required]
    });
    this.editAddressData = this.fb.group({
      updatedAddress: ['', Validators.required]
    });
  }

  /** Space Validation for Inputs */

  keyDownHandler(event) {
    if (event.keyCode === 32) {
      return false;
    }
  }

  /** checking all checked input Url is filled or not before submit in add modules */

  checkPathValidation() {
    this.checkValidUrl = [];
    for (var j = 0; j < this.selectedItems.length; j++) {
      if (this.selectedItems[j].key == 'REGISTRATION') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'LOGIN') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'CURRENTDBVERSION') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'LATESTDBVERSION') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'DOWNLOAD BIN') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'DOWNLOAD ZIP') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'AUTOSEARCH') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'MODELSEARCH') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'DELTASEARCH') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'FEEDBACK') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'DOWNLOADDBUPDATES') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
      if (this.selectedItems[j].key == 'GENERICLOG') {
        if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
          this.checkValidUrl.push('true');
        }
      }
    }
  }

  get f() { return this.addModules.controls; }
  get g() { return this.editApiData.controls; }
  get h() { return this.editAddressData.controls; }

  /** Add Modules save functionality */

  async onsaveModules() {
    this.successData = [];
    this.failedData = [];
    this.failCount = 0; this.successCount = 0;
    this.submitted = true;
    if (this.addModules.invalid) {
      return;
    }
    this.checkPathValidation();
    this.addressValid();
    this.checkUrlValidation();
    if (this.invalidUrl == false && this.address != '' && this.address != undefined) {
      this.spinnerService.show();
      if (this.selectedItems.length == 0) {
        this.spinnerService.hide();
        this.toastr.warning('', 'Please select one or more modules to proceed further');
      } else {
        let crudType = 1;
        let filterProject: any = this.filterProjects.filter(u =>
          u.projectname == this.projectNames);
        let project = this.projectNames; let signaturekey = filterProject[0]['signatureKey'];
        let dbName = filterProject[0]['dbinstance']; let status = 1; let pid = null;
        let apiAddress = this.address; let apiName;
        let uri; let description;

        for (var j = 0; j < this.selectedItems.length; j++) {
          if ($('#isIndex' + this.selectedItems[j]['indexInp'] + 'Url').attr('class') == 'invalid-feedback disabled') {
            console.log(this.selectedItems.length);
            console.log(this.checkValidUrl);
            console.log(this.checkValidUrl.length);
            if (this.selectedItems.length == this.checkValidUrl.length) {
              if (this.selectedItems[j].key == 'REGISTRATION') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'LOGIN') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'CURRENTDBVERSION') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'LATESTDBVERSION') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'DOWNLOAD BIN') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'DOWNLOAD ZIP') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'AUTOSEARCH') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'MODELSEARCH') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'DELTASEARCH') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'FEEDBACK') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'DOWNLOADDBUPDATES') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems[j].key == 'GENERICLOG') {
                apiName = this.selectedItems[j].key;
                uri = $('#input_' + this.selectedItems[j].indexInp + '').val();
                description = this.selectedItems[j].value;
                await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
                  .then(value => {
                    if (value.data.length > 0) {
                      if (value.data[0]['result'] == "0") {
                        this.failedData.push(value.data[0]['message']);
                        this.failCount++;
                      } else {
                        this.successData.push(value.data[0]['message']);
                        this.successCount++;
                      }
                    }
                  });
              }
              if (this.selectedItems.length == j + 1) {
                if (this.successData.length > 0) {
                  this.toastr.success('', this.successCount + ' ' + this.successData[0]);
                }
                if (this.failedData.length > 0) {
                  this.toastr.warning('', this.failCount + ' ' + this.failedData[0]);
                }
                $("#editDataModal .close").click();
                let filterProject: any = this.filterProjects.filter(u =>
                  u.projectname == this.projectNames);
                let project = this.projectNames; let signaturekey = filterProject[0]['signatureKey'];
                let dbName = filterProject[0]['dbinstance']; let fetchModule = [];
                this.mainService.crudApiList(dbName, 2, project, signaturekey, null, null, null, null, 1, null)
                  .then(apiList => {
                    this.apimodulesList = apiList.data;
                    if (apiList.data.length > 0) {
                      this.isApiModules = true;
                      this.NoData = false;
                    } else {
                      this.NoData = true;
                      this.isApiModules = false;
                    }
                    for (var i = 0; i < apiList.data.length; i++) {
                      fetchModule.push(apiList.data[i]['name']);
                    }
                    this.arr = fetchModule;
                  });
              }
            }
          }
        }
        this.spinnerService.hide();
      }
    }
  }

  /** Edit API Path */
  editApi(apiId, api, description, address, url, status) {
    $('#editApis').click();
    this.upd_addr = address;
    this.updatedUrl = url;
    this.editArray = [];
    this.editArray.push({ id: apiId, name: api, desc: description, statusFlag: status });
  }

  /** Path Updation Submit Operation */
  onsaveUpdateApiSubmit() {
    this.editsubmitted = true;
    if (this.editApiData.invalid) {
      return;
    }
    let filterProject: any = this.filterProjects.filter(u =>
      u.projectname == this.projectNames);
    let crudType = 3; let project = this.projectNames; let signaturekey = filterProject[0]['signatureKey'];
    let dbName = filterProject[0]['dbinstance']; let status = this.editArray[0]['statusFlag'];
    let apiName = this.editArray[0]['name']; let apiAddress = this.address; let uri = this.updatedUrl; let description = this.editArray[0]['desc']; let pid = this.editArray[0]['id'];
    this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
      .then(value => {
        if (value.data.length > 0) {
          if (value.data[0]['result'] == "1") {
            this.toastr.success('', value.data[0]['message']);
          } else {
            this.toastr.warning('', value.data[0]['message']);
          }
        }
        $("#editApiModal .close").click();
        this.changeProject();
      });
  }

  /** change of project update Modules*/
  changeProject() {
    if (this.projectNames == null || this.projectNames == "null" || this.projectNames == undefined) {
      this.toastr.warning('', 'Please Select the Project');
      this.address = '';
      this.modulesAvailability = false;
      this.NoData = true;
      this.isApiModules = false;
      $('#btn_id').css('pointer-events', 'none');
    } else {
      $('#btn_id').css('pointer-events', 'auto');
      this.spinnerService.show();
      this.recheckItems = [];
      this.selectedItems = [];
      this.checkedArr = [];
      this.uncheckedArr = [];
      this.apimodulesList = [];
      let filterProject: any = this.filterProjects.filter(u =>
        u.projectname == this.projectNames);
      let crudType = 2; let project = this.projectNames; let signaturekey = filterProject[0]['signatureKey'];
      let dbName = filterProject[0]['dbinstance']; let fetchModule = [];
      /** List of Api Modules **/
      this.mainService.crudApiList(dbName, crudType, project, signaturekey, null, null, null, null, 1, null)
        .then(apiList => {
          this.apimodulesList = apiList.data;
          if (apiList.data.length > 0) {
            this.address = this.apimodulesList[0]['address'];
            this.editaddressValid();
            this.isApiModules = true;
            this.modulesAvailability = true;
            this.NoData = false;
          } else {
            this.address = '';
            this.modulesAvailability = false;
            this.NoData = true;
            this.isApiModules = false;
          }
          for (var i = 0; i < apiList.data.length; i++) {
            fetchModule.push(apiList.data[i]['name']);
          }
          this.arrModules = apiList.data;
          this.arr = fetchModule;
          this.spinnerService.hide();
        });
    }
  }
  /** Path Validation */
  addressValid() {
    if (this.address != '') {
      if (/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(this.address)) {
        this.invalidUrl = false;
      } else {
        this.invalidUrl = true;
      }
    }
  }
  /** Path Validation */
  editaddressValid() {
    if (this.upd_addr != '') {
      if (/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(this.upd_addr)) {
        this.editinvalidUrl = false;
      } else {
        this.editinvalidUrl = true;
      }
    }
  }
  /** removed Check List items */
  removedItems(value, status: boolean, description, address, uri, apiId) {
    if (this.uncheckedArr.indexOf(value) === -1 && status == false) {
      this.uncheckedArr.push({ key: value, value: description, addr: address, url: uri, id: apiId });
    } else {
      this.uncheckedArr = this.uncheckedArr.filter(function (obj) {
        return obj.key !== value;
      });
    }
    if (status == true) {
      if (this.arrModules.find(x => x.name === value && x.statusFlag == 0)) {
        this.recheckItems.push({ key: value, value: description, addr: address, url: uri, id: apiId })
      }
    }
  }

  /** Default check login if register is checked and vice versa */

  checkRegisterLogin(value) {
    let registerCheck = $('#check_0').prop('checked');
    let loginCheck = $('#check_1').prop('checked');
    if (value == 'REGISTRATION' && registerCheck == true && loginCheck == false) {
      $("#check_1").prop('checked', true);
      this.checkedItems('LOGIN', true, 'Login API. Returns JWT that should be used in all subsequent calls', 2);
    }
    if (value == 'LOGIN' && loginCheck == true && registerCheck == false) {
      $("#check_0").prop('checked', true);
      this.checkedItems('REGISTRATION', true, 'Registration API', 1);
    }
  }

  /** default uncheck login if register is unchecked and vice versa */

  uncheckRegisterLogin(value) {
    let registerCheck = $('#check_0').prop('checked');
    let loginCheck = $('#check_1').prop('checked');
    if (value == 'REGISTRATION' && registerCheck == false && loginCheck == true) {
      $("#check_1").prop('checked', false);
      this.checkedItems('LOGIN', false, 'Login API. Returns JWT that should be used in all subsequent calls', 2);
    }
    if (value == 'LOGIN' && loginCheck == false && registerCheck == true) {
      $("#check_0").prop('checked', false);
      this.checkedItems('REGISTRATION', false, 'Registration API', 1);
    }
  }

  /** Checked List Items */
  checkedItems(value, status: boolean, description, idata) {
    this.checkRegisterLogin(value);
    if (value == 'REGISTRATION' && status == false || value == 'LOGIN' && status == false) {
      this.uncheckRegisterLogin(value);
    }
    if (this.checkedArr.indexOf(value) === -1 && status) {
      this.checkedArr.push(value);
      this.selectedItems.push({ key: value, value: description, indexInp: idata });
    }
    else if (!status) {
      let index = this.checkedArr.indexOf(value, description);
      this.checkedArr.splice(index, 1);
      this.selectedItems.splice(index, 1);
    }
    if (status == false) {
      if (value == 'REGISTRATION') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'LOGIN') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'CURRENTDBVERSION') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'LATESTDBVERSION') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'DOWNLOAD BIN') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'DOWNLOAD ZIP') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'AUTOSEARCH') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'MODELSEARCH') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'DELTASEARCH') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'FEEDBACK') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'DOWNLOADDBUPDATES') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
      if (value == 'GENERICLOG') {
        $('#isIndex' + idata + 'Url').addClass('disabled');
        $('#input_' + idata + '').val('');
      }
    }
    this.checkUrlValidation();
  }

  /** Reset checkboxes */
  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  /** Url Required Validation in add Modules */

  checkUrlValidation() {
    for (var i = 0; i < this.selectedItems.length; i++) {
      if (this.selectedItems[i].key == 'REGISTRATION') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'LOGIN') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'CURRENTDBVERSION') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'LATESTDBVERSION') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'DOWNLOAD BIN') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'DOWNLOAD ZIP') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'AUTOSEARCH') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'MODELSEARCH') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'DELTASEARCH') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'FEEDBACK') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'DOWNLOADDBUPDATES') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
      if (this.selectedItems[i].key == 'GENERICLOG') {
        if ($('#input_' + this.selectedItems[i].indexInp + '').val() == '') {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').removeClass('disabled');
        } else {
          $('#isIndex' + this.selectedItems[i].indexInp + 'Url').addClass('disabled');
        }
      }
    }
  }

  /** Add Modules Popup and list of Api Modules  */

  AddModules() {
    this.spinnerService.show();
    $('#btn-active').click();
    this.address = '';
    let crudType = 5;
    this.mainService.crudApiList(null, crudType, null, null, null, null, null, null, null, null)
      .then(value => {
        this.apimodules = value.data;
        if (this.apimodulesList.length > 0) {
          this.showMyClass = true;
          this.address = this.apimodulesList[0]['address'];
          for (var i = 0; i < this.apimodulesList.length; i++) {
            let data1 = this.apimodulesList[i]['name'];
            this.apimodules.splice(this.apimodules.findIndex(function (i) {
              return i.name === data1;
            }), 1);
          }
        } else {
          this.showMyClass = false;
        }
        if (this.apimodules.length == 0) {
          this.isModulesVisible = false;
          this.noModules = true;
        } else {
          this.isModulesVisible = true;
          this.noModules = false;
        }
        this.spinnerService.hide();
      });

  }

  /** Edit API Modules status flag checks   */

  async ModuleSubmit() {
    this.successData = [];
    this.failedData = [];
    this.successCount = 0;
    this.failCount = 0;
    //this.spinnerService.show();
    let crudType = 3;
    let filterProject: any = this.filterProjects.filter(u =>
      u.projectname == this.projectNames);
    let project = this.projectNames; let signaturekey = filterProject[0]['signatureKey'];
    let dbName = filterProject[0]['dbinstance']; let status; let pid;
    let apiName; let apiAddress;
    let uri; let description;
    if (this.recheckItems.length > 0) {
      status = 1;
      for (var j = 0; j < this.recheckItems.length; j++) {
        if (this.recheckItems[j].key == 'REGISTRATION') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'LOGIN') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'CURRENTDBVERSION') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'LATESTDBVERSION') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'DOWNLOAD BIN') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'DOWNLOAD ZIP') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'AUTOSEARCH') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'MODELSEARCH') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'DELTASEARCH') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'FEEDBACK') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'DOWNLOADDBUPDATES') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems[j].key == 'GENERICLOG') {
          apiName = this.recheckItems[j].key;
          uri = this.recheckItems[j].url;
          description = this.recheckItems[j].value;
          apiAddress = this.recheckItems[j].addr;
          pid = this.recheckItems[j].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.recheckItems.length == j + 1) {
          if (this.successData.length > 0) {
            this.toastr.success('', this.successCount + ' ' + this.successData[0]);
          }
          if (this.failedData.length > 0) {
            this.toastr.warning('', this.failCount + ' ' + this.successData[0]);
          }
          this.recheckItems = [];
        }
      }
    }
    if (this.uncheckedArr.length > 0) {
      status = 0;
      this.successData = []; this.failedData = [];
      this.successCount = 0; this.failCount = 0;
      for (var i = 0; i < this.uncheckedArr.length; i++) {
        if (this.uncheckedArr[i].key == 'REGISTRATION') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'LOGIN') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'CURRENTDBVERSION') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'LATESTDBVERSION') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'DOWNLOAD BIN') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'DOWNLOAD ZIP') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'AUTOSEARCH') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'MODELSEARCH') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'DELTASEARCH') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'FEEDBACK') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'DOWNLOADDBUPDATES') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr[i].key == 'GENERICLOG') {
          apiName = this.uncheckedArr[i].key;
          uri = this.uncheckedArr[i].url;
          description = this.uncheckedArr[i].value;
          apiAddress = this.uncheckedArr[i].addr;
          pid = this.uncheckedArr[i].id;
          await this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
                if (value.data[0]['result'] == "0") {
                  this.failedData.push(value.data[0]['message']);
                  this.failCount++;
                } else {
                  this.successData.push(value.data[0]['message']);
                  this.successCount++;
                }
              }
            });
        }
        if (this.uncheckedArr.length == i + 1) {
          if (this.successData.length > 0) {
            this.toastr.success('', this.successCount + ' ' + this.successData[0]);
          }
          if (this.failedData.length > 0) {
            this.toastr.warning('', this.failCount + ' ' + this.successData[0]);
          }
          this.uncheckedArr = [];
        }
      }
    }
    this.changeProject();
    // this.spinnerService.hide();
  }

  /** Edit Path popup */
  editAddress() {
    $('#editAddressData').click();
    this.upd_addr = this.address;
    this.editaddressValid();
  }

  /** Modal Close popup */
  modalClose() {
    $("#editDataModal .close").click();
    $("#editApiModal .close").click();
    $('#editAddressModal .close').click();
    $('input.addModulesChecklist:checkbox').removeAttr('checked');
    this.selectedItems.length = 0;
    this.checkedArr.length = 0;
  }

  /** Update Path Submit Operation */
  onsaveUpdateAddressSubmit() {
    this.spinnerService.show();
    this.addrsubmitted = true;
    if (this.editAddressData.invalid) {
      return;
    }
    this.editaddressValid();
    if (this.editinvalidUrl == false) {
      if (this.apimodulesList.length > 0) {
        let filterProject: any = this.filterProjects.filter(u =>
          u.projectname == this.projectNames);
        let dbName = filterProject[0]['dbinstance']; let crudType = 3; let project = this.projectNames;
        let signaturekey = filterProject[0]['signatureKey']; let apiAddress = this.upd_addr;
        let apiName; let uri; let description;
        let status; let pid;
        for (var i = 0; i < this.apimodulesList.length; i++) {
          apiName = this.apimodulesList[i]['name'];
          uri = this.apimodulesList[i]['uri'];
          description = this.apimodulesList[i]['description'];
          status = this.apimodulesList[i]['statusFlag']; pid = this.apimodulesList[i]['apiId'];
          this.mainService.crudApiList(dbName, crudType, project, signaturekey, apiName, apiAddress, uri, description, status, pid)
            .then(value => {
              if (value.data.length > 0) {
              }
            });
          if (this.apimodulesList.length == i + 1) {
            $("#editAddressModal .close").click();
            this.toastr.success('', 'Url Updated Successfully');
            this.address = this.upd_addr;
            this.changeProject();
          }
        }
      } else {
        $("#editAddressModal .close").click();
        this.toastr.warning('', 'Modules are not avialable to update the path');
      }
    }
    this.spinnerService.hide();
  }

  close() {
    this.router.navigate(['/api-configuration']);
  }

}
