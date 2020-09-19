import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataManagementComponent } from './data-management/data-management.component';
import { CreateNewClientComponent } from './create-new-client/create-new-client.component';
import { ClientsComponent } from './clients/clients.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
// import { DataUploadComponent } from './data-upload/data-upload.component';
import { AddProjectVersionComponent } from './add-project-version/add-project-version.component';
import { Authguard } from './guard/auth.guard';
import { DataConfigurationListComponent } from './data-configuration-list/data-configuration-list.component';
import { BrandLibraryComponent } from './brand-library/brand-library.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ClientLibraryComponent } from './client-library/client-library.component';
import { UserLibraryComponent } from './user-library/user-library.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { SearchHistoryComponent } from './search-history/search-history.component';
import { AdminClientsComponent } from './admin-clients/admin-clients.component';
import { ZipUploadComponent } from './zip-upload/zip-upload.component';
import { ApiDbTestComponent } from './api-db-test/api-db-test.component';
import { CloudApiModulesComponent } from './cloud-api-modules/cloud-api-modules.component';
import { ApiClientsComponent } from './api-clients/api-clients.component';
import { AccessibleModulesComponent } from './accessible-modules/accessible-modules.component';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { RoleModuleViewComponent } from './role-module-view/role-module-view.component';
import { EditRoleModuleComponent } from './edit-role-module/edit-role-module.component';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';
import { RoleGuardService } from './guard/role-guard-service';
import { ApiCongigurationComponent } from './api-congiguration/api-congiguration.component';
import { EditApiComponent } from './edit-api/edit-api.component';
import { LogViewComponent } from './log-view/log-view.component';
import { GenericLogsComponent } from './generic-logs/generic-logs.component';
import { ReportConfigurationListComponent } from './report-configuration-list/report-configuration-list.component';
import { ReportComponent} from './report/report.component';
import { ChangehistoryComponent } from './changehistory/changehistory.component';
import { ReportsClientComponent } from './reports-client/reports-client.component';
import { RawdataComponent } from './rawdata/rawdata.component'
import { StagingdataComponent } from './stagingdata/stagingdata.component';

const appRoutes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [Authguard] },
  { path: 'clients', component: ClientsComponent, canActivate: [Authguard]},
  { path: 'data-management', component: DataManagementComponent, canActivate: [Authguard] },
  { path: 'create-new-client', component: CreateNewClientComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'profile', component: ProfileComponent, canActivate: [Authguard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  // { path: 'data-upload', component: DataUploadComponent, canActivate: [Authguard] },
  { path: 'add-project-version', component: AddProjectVersionComponent, canActivate: [Authguard]},
  { path: 'data-configuration-list', component: DataConfigurationListComponent, canActivate: [Authguard] },
  { path: 'brand-library', component: BrandLibraryComponent, canActivate: [Authguard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'client-library', component: ClientLibraryComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'user-library', component: UserLibraryComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'create-users', component: CreateUsersComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'search-history', component: SearchHistoryComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'zip-upload', component: ZipUploadComponent, canActivate: [Authguard] },
  { path: 'api-db-test', component: ApiDbTestComponent, canActivate: [Authguard] },
  { path: 'cloud-api-modules', component: CloudApiModulesComponent, canActivate: [Authguard] },
  { path: 'api-clients', component: ApiClientsComponent, canActivate: [Authguard] },
  { path: 'admin-clients', component: AdminClientsComponent, canActivate: [Authguard] },
  { path: 'accessible-modules', component: AccessibleModulesComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'add-roles', component: AddRolesComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'role-module-view', component: RoleModuleViewComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'edit-role-module', component: EditRoleModuleComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'edit-user-details', component: EditUserDetailsComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'api-configuration', component: ApiCongigurationComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'edit-api', component: EditApiComponent, canActivate: [RoleGuardService], data: { role: 'Admin' } },
  { path: 'log-view', component: LogViewComponent, canActivate: [Authguard]},
  { path: 'generic-logs', component: GenericLogsComponent, canActivate: [RoleGuardService], data: { role: 'Admin'} },
  { path: 'Report-configuration-list', component: ReportConfigurationListComponent, canActivate: [Authguard] },
  { path: 'history', component: ReportComponent, canActivate: [Authguard] },
  { path: 'changeHistory', component: ChangehistoryComponent, canActivate: [Authguard] },
  { path: 'report-clients', component: ReportsClientComponent, canActivate: [Authguard] },
  { path: 'view_raw_capture', component: RawdataComponent, canActivate: [Authguard] },
  { path: 'view_staging_data', component: StagingdataComponent, canActivate: [Authguard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];


export const routing = RouterModule.forRoot(appRoutes);

