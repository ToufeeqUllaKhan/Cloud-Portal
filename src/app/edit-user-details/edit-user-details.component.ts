import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../services/main-service';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationStart } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import mainscroll from '../model/Scroll';
declare var $: any;

@Component({
  selector: 'app-edit-user-details',
  templateUrl: './edit-user-details.component.html',
  styleUrls: ['./edit-user-details.component.css']
})
export class EditUserDetailsComponent implements OnInit {

  updateUserForm: FormGroup;
  submitted: Boolean = false;
  roles = [];
  role: any = null; username: any; firstname: any; lastname: any;
  email: any; phonenumber: any; password: any; selectedproject: any;
  projects: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false;
  limitSelection = false; mobileNumber: any;
  projectNames: any; selectedItems: Array<any> = [];
  hidePassword: Boolean = true;
  showPassword: Boolean = false;
  typeInput: any;
  prevProjects = []; public checkLength: any;

  @ViewChild(FormGroupDirective, { static: false }) formGroupDirective: FormGroupDirective;

  constructor(private mainService: MainService, private fb: FormBuilder, private toastr: ToastrService, private router: Router,
    private spinnerService: NgxSpinnerService) {
    this.checkLength = 0;
  }

  ngOnInit() {
    /** Eye icon visiblitity */
    this.typeInput = 'password';
    $(document).ready(function () {
      $('.dropdown-list ul').css('max-height', '97px');
    });
    let userName = localStorage.getItem('editUser');
    /** List of projects */
    let dataType = 1;
    this.mainService.getProjectNames(null, null, null, null, null, dataType)
      .subscribe(value => {
        let FilterProject = value.data;
        FilterProject.forEach(element => {
          element['projectname'] = element['dbinstance'] + '_' + element['projectname']
        })
        const unique = [...new Set(FilterProject.map(item => item.projectname))];
        let arrData = [];
        for (var i = 0; i < unique.length; i++) {
          arrData.push({ item_id: i, item_text: unique[i] });
        }
        this.projects = arrData;
        /** List of roles */
        let crudType = 5;
        this.mainService.createUser(crudType, null, null, null, null, null, null, null, null, null)
          .subscribe(value => {
            this.roles = value.data;
          });
        /** User Information to append in form */
        let crudtype = 4;
        this.mainService.createUser(crudtype, userName, null, null, null, null, null, null, null, null)
          .subscribe(value => {
            if (value.data.length > 0) {
              this.firstname = value.data[0]['firstName'];
              this.lastname = value.data[0]['lastName'];
              this.username = value.data[0]['username'];
              this.password = value.data[0]['password'];
              this.email = value.data[0]['eMail'];
              this.mobileNumber = value.data[0]['mobile'];
              this.role = value.data[0]['roleName'];
            }
            /** Role based default selection of projects */
            if (this.role == 'Admin') {
              for (var i = 0; i < this.projects.length; i++) {

                var setIndex = this.projects.findIndex(p => p.item_text == this.projects[i]['item_text']);

                this.selectedItems.push({ item_id: setIndex, item_text: this.projects[i]['item_text'] });
              }
              this.projectNames = this.selectedItems;
              this.prevProjects = this.projectNames;
              $('.projectAccess').css('pointer-events', 'none');
            } else {
              this.mainService.getRoleModule(8, null, null, userName, null)
                .then(value => {
                  let filterProject = value.data;
                  filterProject.forEach(element => {
                    element['name'] = element['dbPath'] + '_' + element['name']
                  })
                  for (var i = 0; i < filterProject.length; i++) {
                    var setIndex = this.projects.findIndex(p => p.item_text == filterProject[i]['name']);

                    this.selectedItems.push({ item_id: setIndex, item_text: filterProject[i]['name'] });
                  }
                  this.projectNames = this.selectedItems;
                  this.prevProjects = this.projectNames;
                });
            }

          });
      });
    /** Validation for edit user */
    this.updateUserForm = this.fb.group({
      Role: ['', Validators.required],
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      passWord: ['', [Validators.required, Validators.minLength(6)]],
      eMail: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.maxLength(10)]]
    });

    /** Multiselect dropdown settings */

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter
    };
    mainscroll();
  }

  onInstanceSelect(item: any) {
    // console.log('onItemSelect', item);
  }

  onDeSelectAll(items: any) {
    console.log(items); // items is an empty array
  }

  onSelectAll(items: any) {
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

  onProjectSelect(e) {
    // console.log(this.projectNames);
  }

  /** Role base deafult selection of projects */

  roleChange() {
    if (this.role == 'Admin') {
      this.projectNames = [];
      this.selectedItems = [];
      for (var i = 0; i < this.projects.length; i++) {
        var setIndex = this.projects.findIndex(p => p.item_text == this.projects[i]['item_text']);
        this.selectedItems.push({ item_id: setIndex, item_text: this.projects[i]['item_text'] });
      }
      this.projectNames = this.selectedItems;
      $('.projectAccess').css('pointer-events', 'none');
    } else {
      $('.projectAccess').css('pointer-events', 'auto');
    }
  }

  get f() { return this.updateUserForm.controls; }

  /** Update user information submit operation */

  onUpdateUserSubmit() {
    if (this.password.length < 4) {
      this.toastr.warning('', 'Please enter a password with at least 4 characters');
    }
    this.spinnerService.show();
    this.submitted = true;
    if (this.updateUserForm.invalid) {
      return;
    }
    let crudType = 2;
    this.mainService.createUser(crudType, this.username, this.password, this.role, this.firstname, this.lastname, this.email, this.mobileNumber, null, null)
      .pipe()
      .subscribe(value => {
        if (value.data[0]['result'] == 1) {
          this.toastr.success('', value.data[0]['message']);
          this.submitted = false;
          this.mainService.getRegionsperClient()
            .pipe()
            .subscribe(value => {
              let FilterProject = value.data;
              FilterProject.forEach(element => {
                element['name'] = element['dbPath'] + '_' + element['name']
              })
              for (var i = 0; i < this.prevProjects.length; i++) {
                let projectRemove = FilterProject.filter(u => u.name === this.prevProjects[i]['item_text']);
                let Dbinstance = projectRemove[0]['dbPath'];
                let ProjectName = projectRemove[0]['name'];
                if (ProjectName.startsWith(Dbinstance + '_')) {
                  ProjectName = ProjectName.replace(Dbinstance + '_', '')
                }
                this.mainService.userProjectLinkingScenario(6, Dbinstance, null, null, this.username, ProjectName)
                  .then(val => {
                    this.checkLength++;
                    if (this.prevProjects.length === this.checkLength) {
                      let crudtype = 5;
                      for (var j = 0; j < this.projectNames.length; j++) {
                        let project = this.projectNames[j]['item_text'];
                        let projectRemove = FilterProject.filter(u => u.name === project);
                        let Projectname = projectRemove[0]['name'];
                        let dbInstance = projectRemove[0]['dbPath'];
                        if (Projectname.startsWith(dbInstance + '_')) {
                          Projectname = Projectname.replace(dbInstance + '_', '')
                        }

                        this.mainService.userProjectLinkingScenario(crudtype, dbInstance, null, null, this.username, Projectname)
                          .then(val => {
                          });
                      }
                      this.spinnerService.hide();
                      this.router.navigate(['/user-library']);
                    }
                  });
              }
              if (this.prevProjects.length == 0) {
                let crudtype = 5;
                for (var j = 0; j < this.projectNames.length; j++) {
                  let project = this.projectNames[j]['item_text'];
                  let projectRemove = FilterProject.filter(u => u.name === project);
                  let projectname = projectRemove[0]['name'];
                  let DbInstance = projectRemove[0]['dbPath'];
                  if (projectname.startsWith(DbInstance + '_')) {
                    projectname = projectname.replace(DbInstance + '_', '')
                  }
                  this.mainService.userProjectLinkingScenario(crudtype, DbInstance, null, null, this.username, projectname)
                    .then(val => {
                    });
                }
                this.spinnerService.hide();
                this.router.navigate(['/user-library']);
              }
            })

        } else {
          this.toastr.warning('', value.data[0]['message']);
        }
      });
  }

  /** New Role is clicked to handle new role page breadcrumbs list in add role page */

  newRole() {
    localStorage.removeItem('previousUrl');
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          window.localStorage.setItem('previousUrl', this.router.url);
        }
      });
    this.router.navigate(['/add-roles']);
  }

  /** Eye icon visiblity function to show and hide password */
  show() {
    this.typeInput = 'text';
    this.showPassword = true;
    this.hidePassword = false;

  }

  hide() {
    this.typeInput = 'password';
    this.hidePassword = true;
    this.showPassword = false;
  }

  close() {
    this.router.navigate(['/user-library']);
  }

}
