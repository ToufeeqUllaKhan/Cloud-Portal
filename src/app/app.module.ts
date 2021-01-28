import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { routing } from '../app/app.route';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientsComponent } from './clients/clients.component';
import { DataManagementComponent } from './data-management/data-management.component';
import { CreateNewClientComponent } from './create-new-client/create-new-client.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { Authguard } from '../app/guard/auth.guard';
import { AlertService } from './services/alert.service';
import { JwtInterceptor } from './guard/jwtinterceptor';
import { ErrorInterceptor } from './guard/jwterrorinterceptors';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataConfigurationListComponent } from './data-configuration-list/data-configuration-list.component';
import { BrandLibraryComponent } from './brand-library/brand-library.component';
import { DataTablesModule } from 'angular-datatables';
import { Data } from './model/data';
// import { Ng2TableModule } from 'ng2-table/ng2-table';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ClientLibraryComponent } from './client-library/client-library.component';
import { UserLibraryComponent } from './user-library/user-library.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { AdminClientsComponent } from './admin-clients/admin-clients.component';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../app/model/DateCustomParser';
import { ZipUploadComponent } from './zip-upload/zip-upload.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ApiDbTestComponent } from './api-db-test/api-db-test.component';
import { CloudApiModulesComponent } from './cloud-api-modules/cloud-api-modules.component';
import { ApiClientsComponent } from './api-clients/api-clients.component';
import { AccessibleModulesComponent } from './accessible-modules/accessible-modules.component';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { RoleModuleViewComponent } from './role-module-view/role-module-view.component';
import { EditRoleModuleComponent } from './edit-role-module/edit-role-module.component';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';
import { RoleGuardService } from './guard/role-guard-service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ApiCongigurationComponent } from './api-congiguration/api-congiguration.component';
import { EditApiComponent } from './edit-api/edit-api.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { LogViewComponent } from './log-view/log-view.component';
import { ReportConfigurationListComponent } from './report-configuration-list/report-configuration-list.component';
import { ReportComponent } from './report/report.component';
import { ChangehistoryComponent } from './changehistory/changehistory.component';
import { ReportsClientComponent } from './reports-client/reports-client.component';
import { RawdataComponent } from './rawdata/rawdata.component';
import { StagingdataComponent } from './stagingdata/stagingdata.component';
import { ClearDefaultBoxIdLogsComponent } from './clear-default-box-id-logs/clear-default-box-id-logs.component';
import { ImportprojfromprodComponent } from './importprojfromprod/importprojfromprod.component';
import { ProdCecEdidDataComponent } from './prod-cec-edid-data/prod-cec-edid-data.component';
import { ProdCecEdidHistoryComponent } from './prod-cec-edid-history/prod-cec-edid-history.component';
import { EditRoleModulePermissionComponent } from './edit-role-module-permission/edit-role-module-permission.component';
// import { BtnCellRenderer } from './brand-library/btn-cell-renderer.component';
// import { CodesetDownloadCellRenderer } from "./brand-library/codesetdownload-cell-renderer.component";
// import { EdidviewCellRenderer } from './brand-library/edidview-cell-renderer.component';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 12
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ClientsComponent,
    DataManagementComponent,
    CreateNewClientComponent,
    LoginComponent,
    ProfileComponent,
    ChangePasswordComponent,
    DataConfigurationListComponent,
    BrandLibraryComponent,
    AdminDashboardComponent,
    ClientLibraryComponent,
    UserLibraryComponent,
    CreateUsersComponent,
    AdminClientsComponent,
    ZipUploadComponent,
    ApiDbTestComponent,
    CloudApiModulesComponent,
    ApiClientsComponent,
    AccessibleModulesComponent,
    AddRolesComponent,
    RoleModuleViewComponent,
    EditRoleModuleComponent,
    EditUserDetailsComponent,
    ApiCongigurationComponent,
    EditApiComponent,
    LogViewComponent,
    ReportConfigurationListComponent,
    ReportComponent,
    ChangehistoryComponent,
    ReportsClientComponent,
    RawdataComponent,
    StagingdataComponent,
    ClearDefaultBoxIdLogsComponent,
    ImportprojfromprodComponent,
    ProdCecEdidDataComponent,
    ProdCecEdidHistoryComponent,
    EditRoleModulePermissionComponent,
    // BtnCellRenderer,
    // CodesetDownloadCellRenderer,
    // EdidviewCellRenderer
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    routing,
    DataTablesModule,
    AppRoutingModule,
    // Ng2TableModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbModule,
    NotifierModule.withConfig(customNotifierOptions),
    CommonModule, MatButtonModule, MatToolbarModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule,
    ToastrModule.forRoot({ timeOut: 1000, positionClass: 'toast-top-right' }),
    AngularSvgIconModule.forRoot(),
    AngularResizedEventModule,
    ArchwizardModule,
    // AgGridModule.withComponents([BtnCellRenderer,CodesetDownloadCellRenderer,EdidviewCellRenderer])
    AgGridModule.withComponents([])
  ],
  providers: [AuthenticationService, Authguard, AlertService, Data, RoleGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
