import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataManagementComponent } from './data-management/data-management.component';
import { ClientsComponent } from './clients/clients.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { Authguard } from './guard/auth.guard';
import { DataConfigurationListComponent } from './data-configuration-list/data-configuration-list.component';
import { BrandLibraryComponent } from './brand-library/brand-library.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserLibraryComponent } from './user-library/user-library.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { ZipUploadComponent } from './zip-upload/zip-upload.component';
import { ApiDbTestComponent } from './api-db-test/api-db-test.component';
import { CloudApiModulesComponent } from './cloud-api-modules/cloud-api-modules.component';
import { AccessibleModulesComponent } from './accessible-modules/accessible-modules.component';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { RoleModuleViewComponent } from './role-module-view/role-module-view.component';
import { EditRoleModuleComponent } from './edit-role-module/edit-role-module.component';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';
import { RoleGuardService } from './guard/role-guard-service';
import { ApiCongigurationComponent } from './api-congiguration/api-congiguration.component';
import { EditApiComponent } from './edit-api/edit-api.component';
// import { LogViewComponent } from './log-view/log-view.component';
import { ReportConfigurationListComponent } from './report-configuration-list/report-configuration-list.component';
import { ReportComponent } from './report/report.component';
import { ChangehistoryComponent } from './changehistory/changehistory.component';
import { RawdataComponent } from './rawdata/rawdata.component'
import { StagingdataComponent } from './stagingdata/stagingdata.component';
import { ClearDefaultBoxIdLogsComponent } from './clear-default-box-id-logs/clear-default-box-id-logs.component';
import { ImportprojfromprodComponent } from './importprojfromprod/importprojfromprod.component';
import { ProdCecEdidDataComponent } from './prod-cec-edid-data/prod-cec-edid-data.component';
import { ProdCecEdidHistoryComponent } from './prod-cec-edid-history/prod-cec-edid-history.component';
import { EditRoleModulePermissionComponent } from './edit-role-module-permission/edit-role-module-permission.component';
import { AnalyticalreportsComponent } from './analyticalreports/analyticalreports.component';
import { AnalyticalreportsviewComponent } from './analyticalreportsview/analyticalreportsview.component';
import { CecEdidViewComponent } from './cec-edid-view/cec-edid-view.component';
import { DecodeEdidComponent } from './decode-edid/decode-edid.component';
import { ProjectLibraryComponent } from './project-library/project-library.component';
import { CreateNewProjectComponent } from './create-new-project/create-new-project.component';
//const routes: Routes = [
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [Authguard] },
  { path: 'clients', component: ClientsComponent, canActivate: [Authguard] },
  { path: 'data-management', component: DataManagementComponent, canActivate: [Authguard] },
  { path: 'create-new-project', component: CreateNewProjectComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'profile', component: ProfileComponent, canActivate: [Authguard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'data-configuration-list', component: DataConfigurationListComponent, canActivate: [Authguard] },
  { path: 'brand-library', component: BrandLibraryComponent, canActivate: [Authguard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'project-library', component: ProjectLibraryComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'user-library', component: UserLibraryComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'create-users', component: CreateUsersComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'zip-upload', component: ZipUploadComponent, canActivate: [Authguard] },
  { path: 'api-db-test', component: ApiDbTestComponent, canActivate: [Authguard] },
  { path: 'cloud-api-modules', component: CloudApiModulesComponent, canActivate: [Authguard] },
  { path: 'accessible-modules', component: AccessibleModulesComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'add-roles', component: AddRolesComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'role-module-view', component: RoleModuleViewComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'edit-role-module', component: EditRoleModuleComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'edit-user-details', component: EditUserDetailsComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'api-configuration', component: ApiCongigurationComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'edit-api', component: EditApiComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  // { path: 'log-view', component: LogViewComponent, canActivate: [Authguard] },
  { path: 'Report-configuration-list', component: ReportConfigurationListComponent, canActivate: [Authguard] },
  { path: 'history', component: ReportComponent, canActivate: [Authguard] },
  { path: 'changeHistory', component: ChangehistoryComponent, canActivate: [Authguard] },
  { path: 'view_raw_capture', component: RawdataComponent, canActivate: [Authguard] },
  { path: 'view_staging_data', component: StagingdataComponent, canActivate: [Authguard] },
  { path: 'UpdateDefaultBoxIdLogs', component: ClearDefaultBoxIdLogsComponent, canActivate: [Authguard] },
  { path: 'importfromprod', component: ImportprojfromprodComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'prod_CEC-EDID_data', component: ProdCecEdidDataComponent, canActivate: [Authguard] },
  { path: 'Data Update History', component: ProdCecEdidHistoryComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'update-permission', component: EditRoleModulePermissionComponent, canActivate: [Authguard] },
  { path: 'Analyticalreports', component: AnalyticalreportsComponent, canActivate: [Authguard] },
  { path: 'reports-view', component: AnalyticalreportsviewComponent, canActivate: [Authguard] },
  { path: 'Centralized-DB-view', component: CecEdidViewComponent, canActivate: [Authguard] },
  { path: 'decode-edid', component: DecodeEdidComponent, canActivate: [Authguard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
export const routing = RouterModule.forRoot(appRoutes);
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

