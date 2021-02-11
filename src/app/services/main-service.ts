import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { retry, catchError, map, take } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { from } from 'rxjs';
import { User } from '../model/user';
import { Logintoken } from '../model/logintoken';
import { AlertService } from '../services/alert.service';
import * as alertify from 'alertify.js';


@Injectable({ providedIn: 'root' })
export class MainService {


  unzipFile: any; deleteDir: any;
  listZip: any; memStream: any;

  constructor(private http: HttpClient, private alertService: AlertService) {
  }

  getPortalSpecificUrlforZip() {

    /** sscloudportal.azurewebsites.net*/
    this.unzipFile = '/api/UnzipFile?code=NKrYd88jKdQuChXJX4XivotLL/fHC5YpjBD08dMWFOMl6NFTG9268Q==';
    this.deleteDir = '/api/DeleteDirectory?code=fWcoRNCBxIaZLvSe1YqHZ1BThrwueErsRhrzJlmA4Hgv7IMhWxilZw==';
    this.listZip = '/api/GetListOfZipFiles?code=fYWa6wb7qiWet6qRPhVa35RePhsuHvsIp50eXjoX4gXKGdy/6k8yKQ==';
    this.memStream = '/api/GetMemoryStream?code=QsFvvR7iP/iXKpZAO0YcsvIR6PAY9mOtETT6oTT7UcDa6QKs9YD1FA==';

  }

  logintoken: Logintoken = new Logintoken();



  createAuthorizationHeader(headers: HttpHeaders) {

    headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json')
      .set('mode', 'no-cors');
  }

  logout(user: User): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Authentication/Logout`,
      { "sessionToken": user.data[0]['sessionToken'] })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      );
  }

  getProfileInfo(user: User): Observable<any> {

    //let headers = new HttpHeaders();
    //this.createAuthorizationHeader(headers);
    return this.http.post<any>(`${environment.apiUrl}/api/Authentication/GetUserProfile`,
      { "sessionToken": user.data[0]['sessionToken'] })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      );
  }

  updateUserInfo(user: User, Firstname: String, Lastname: String, EMail: any, Mobile: Number, Role: any): Observable<any> {
    //alert(user.data[0]['sessionToken']);
    return this.http.post<any>(`${environment.apiUrl}/api/Authentication/UpdateUserProfile`,
      { "sessionToken": user.data[0]['sessionToken'], "Firstname": Firstname, "Lastname": Lastname, "EMail": EMail, "Mobile": Mobile, "Role": Role })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      );
  }

  createUser(crudtype: any, username: any, password: any, role: any, firstname: any, lastname: any, email: any,
    mobile: any, profilepic: any, fileextension: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Admin/CRUD_User`,
      {
        "crudtype": crudtype, "username": username, "password": password, "role": role, "firstname": firstname,
        "lastname": lastname, "email": email, "mobile": mobile, "profilepic": profilepic, "fileextension": fileextension
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getRoleModule(crudtype: any, role: any, module: any, user: any, project: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Admin/CRUD_RoleModuleMapping`,
      { "crudtype": crudtype, "role": role, "module": module, "user": user, "project": project })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  getRoleModules(crudtype: any, role: any, module: any, user: any, project: any, readpermission: any, writepermission: any, downloadpermission: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Admin/CRUD_RoleModuleMapping`,
      {
        "crudtype": crudtype, "role": role, "module": module, "user": user, "project": project,
        "readpermission": readpermission, "writepermission": writepermission, "downloadpermission": downloadpermission
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  userProjectLinkingScenario(crudtype: any, role: any, module: any, user: any, project: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Admin/CRUD_RoleModuleMapping`,
      {
        "crudtype": crudtype, "role": role, "module": module, "user": user, "project": project
      })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }


  saveCreatedUsers(user: User, Role: String, Firstname: String, Lastname: String, EMail: String, Mobile: Number, Username: String, Password: String) {

    return this.http.post<any>(`${environment.apiUrl}/api/Authentication/CreateNewUser`,
      { "sessionToken": user.data[0]['sessionToken'], Role, Firstname, Lastname, EMail, Mobile, Username, Password })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getUserRoles(user: User): Observable<any> {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    //alert(JSON.stringify(user.data[0]));
    return this.http.post<any>(`${environment.apiUrl}/api/UI/GetUserRoles`,
      { "sessionToken": user.data[0]['sessionToken'] })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getDbVersionList(user: User, projectName: String) {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post<any>(`${environment.apiUrl}/api/UI/GetDBVersion`,
      { "sessionToken": user.data[0]['sessionToken'], projectName })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getDevicesList(dbInstance: any, user: User, projectName: String, Dbversion: String) {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post<any>(`${environment.apiUrl}/api/UI/GetDevices`,
      { "dbInstance": dbInstance, "sessionToken": user.data[0]['sessionToken'], projectName, Dbversion })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllClients(user: User): Observable<any> {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post<any>(`${environment.apiUrl}/api/Config/GetAllClients`,
      { "sessionToken": user.data[0]['sessionToken'] })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllRegionsperClient(user: User, Client: any): Observable<any> {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post<any>(`${environment.apiUrl}/api/Config/GetRegions`,
      { "sessionToken": user.data[0]['sessionToken'], Client })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getProjectList(user: User, Client: any, Region: any): Observable<any> {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post<any>(`${environment.apiUrl}/api/Config/GetProjects`,
      { "sessionToken": user.data[0]['sessionToken'], Client, Region })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getRegisteredDevice(user: User, Region: any, Client: any, Dbname: any, Dbversion: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Config/GetRegisteredDevice`,
      { "sessionToken": user.data[0]['sessionToken'], Region, Client, Dbname, Dbversion })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAPIListData(sessionToken: any, Dbname: any, Project: any): Promise<any> {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);

    return this.http.post<any>(`${environment.apiUrl}/api/Config/GetAPIList`,
      { "sessionToken": sessionToken, "Dbname": Dbname, "Project": Project })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  getAPIList(sessionToken: any, Dbname: any, Project: any): Observable<any> {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);

    return this.http.post<any>(`${environment.apiUrl}/api/Config/GetAPIList`,
      { "sessionToken": sessionToken, "Dbname": Dbname, "Project": Project })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getDbVersion(user: User, Dbname: any, Projectname: any): Observable<any> {

    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);

    return this.http.post<any>(`${environment.apiUrl}/api/UI/GetDBVersion`,
      { "sessionToken": user.data[0]['sessionToken'], Dbname, Projectname })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTestApiRegister(eventUrl, DeviceID: any, Dbversion: any, Signaturekey: any, Countrycode: any): Observable<any> {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post<any>(eventUrl,
      { "Signaturekey": Signaturekey, "DeviceID": DeviceID, "Dbversion": Dbversion, "Countrycode": Countrycode })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTestApiLogin(eventUrl, guid: any): Observable<any> {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post<any>(eventUrl,
      { guid })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTestApiCurrentDbVersion(eventUrl, Datatype: Number): Observable<any> {

    this.logintoken = JSON.parse(localStorage.getItem('token'));
    if (this.logintoken == null) {
      alertify.alert("Invalid Token!! Please Login and try again!!");
    }
    let headers = new HttpHeaders().append('Authorization', `Bearer ${this.logintoken}`);
    let options = {
      headers: headers
    }
    console.log(options);
    return this.http.post<any>(eventUrl,
      { "Datatype": Datatype }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  getTestApiLatestDbVersion(eventUrl, Datatype: any): Observable<any> {

    this.logintoken = JSON.parse(localStorage.getItem('token'));
    if (this.logintoken == null) {
      alertify.alert("Invalid Token!! Please Login and try again!!").setHeader('SSC-APP Says');
    }

    let headers = new HttpHeaders().append('Authorization', `Bearer ${this.logintoken}`);
    let options = {
      headers: headers
    }
    return this.http.post<any>(eventUrl,
      { "Datatype": Datatype }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTestApiDownloadStats(eventUrl, downloadstatus: Number, dbversion: any): Observable<any> {
    this.logintoken = JSON.parse(localStorage.getItem('token'));
    if (this.logintoken == null) {
      alertify.alert("Invalid Token!! Please Login and try again!!");
    }
    let headers = new HttpHeaders().append('Authorization', `Bearer ${this.logintoken}`);
    let options = {
      headers: headers
    }
    return this.http.post<any>(eventUrl,
      { "downloadstatus": downloadstatus, "dbversion": dbversion }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getDownloadStatus(eventUrl, Datatype: Number): Observable<any> {
    this.logintoken = JSON.parse(localStorage.getItem('token'));
    if (this.logintoken == null) {
      alertify.alert("Invalid Token!! Please Login and try again!!");
    }
    let headers = new HttpHeaders().append('Authorization', `Bearer ${this.logintoken}`);
    let options = {
      headers: headers
    }
    return this.http.post<any>(eventUrl,
      { "Datatype": Datatype }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getUpdateGenericLog(eventUrl, apiname: any, input: any, output: any, result: any): Observable<any> {
    this.logintoken = JSON.parse(localStorage.getItem('token'));
    if (this.logintoken == null) {
      alertify.alert("Invalid Token!! Please Login and try again!!");
    }
    let headers = new HttpHeaders().append('Authorization', `Bearer ${this.logintoken}`);
    let options = {
      headers: headers
    }
    return this.http.post<any>(eventUrl,
      { "apiname": apiname, "input": input, "output": output, "result": result }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTestAutoSearch(eventUrl, Device: any, Edid: any, Vendorid: any, Osd: any): Observable<any> {

    this.logintoken = JSON.parse(localStorage.getItem('token'));
    if (this.logintoken == null) {
      alertify.alert("Invalid Token!! Please Login and try again!!");
    }
    let headers = new HttpHeaders().append('Authorization', `Bearer ${this.logintoken}`);
    let options = {
      headers: headers
    }
    return this.http.post<any>(eventUrl,
      { "Device": Device, "Edid": Edid, "Vendorid": Vendorid, "Osd": Osd }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTestModelSearch(eventUrl, Device: any, Brand: any, Model: any): Observable<any> {

    this.logintoken = JSON.parse(localStorage.getItem('token'));
    if (this.logintoken == null) {
      alertify.alert("Invalid Token!! Please Login and try again!!");
    }
    let headers = new HttpHeaders().append('Authorization', `Bearer ${this.logintoken}`);
    let options = {
      headers: headers
    }
    return this.http.post<any>(eventUrl,
      { "device": Device, "brand": Brand, "model": Model }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTestDeltaSearch(eventUrl, Device: any, Brand: any, DbVersion: any): Observable<any> {

    this.logintoken = JSON.parse(localStorage.getItem('token'));
    if (this.logintoken == null) {
      alertify.alert("Invalid Token!! Please Login and try again!!");
    }
    let headers = new HttpHeaders().append('Authorization', `Bearer ${this.logintoken}`);
    let options = {
      headers: headers
    }
    return this.http.post<any>(eventUrl,
      { "device": Device, "Brand": Brand, "dbversion": DbVersion }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getTestFeedbackSearch(eventUrl, Device: any, Brand: any, model: any, vendorid: any, osd: any, edid: any,
    codeset: any, searchtype: any, message: any, statusflag: any): Observable<any> {

    this.logintoken = JSON.parse(localStorage.getItem('token'));
    if (this.logintoken == null) {
      alertify.alert("Invalid Token!! Please Login and try again!!");
    }
    let headers = new HttpHeaders().append('Authorization', `Bearer ${this.logintoken}`);
    let options = {
      headers: headers
    }
    return this.http.post<any>(eventUrl,
      {
        "device": Device, "Brand": Brand, "model": model, "vendorid": vendorid, "osd": osd, "edid": edid,
        "codeset": codeset, "searchtype": searchtype, "message": message, "statusflag": statusflag
      }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getBoxId(crudtype: any, project: any, signaturekey: any, boxid: any, dbname: any, dbversion: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Admin/CRUD_BoxIdInfo`,
      { "crudtype": crudtype, "project": project, "signaturekey": signaturekey, "boxid": boxid, "dbname": dbname, "dbversion": dbversion })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllBrands(user: User, Dbname: any, Projectname: any, Dbversion: any, Device: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/UI/GetBrands`,
      { "sessionToken": user.data[0]['sessionToken'], "Dbname": Dbname, "Projectname": Projectname, "Dbversion": Dbversion, "Device": Device })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllprojectdetails(dbname: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Admin/GetAllProjectDetails`,
      { dbinstance: dbname })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllDevices(user: User, Projectname: any, Dbversion: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/UI/GetDevices`,
      { "sessionToken": user.data[0]['sessionToken'], "Projectname": Projectname, "Dbversion": Dbversion })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getInsertRegisteredDevice(user: User, Region: any, Client: any, Dbversion: any, Dbname: any, DeviceId: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Config/InsertRegisterdDevice`,
      { "sessionToken": user.data[0]['sessionToken'], "Region": Region, "Client": Client, "Dbversion": Dbversion, "Dbname": Dbname, "DeviceId": DeviceId })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createClient(Clientname: any, CLientlogopath: any, Statusflag: any, Crudtype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Operations/NewClient`,
      { "Clientname": Clientname, "CLientlogopath": CLientlogopath, "Statusflag": Statusflag, "Crudtype": Crudtype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllRegions(Region: any, Regionlogopath: any, Statusflag: any, Crudtype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Operations/NewRegion`,
      { "Region": Region, "Regionlogopath": Regionlogopath, "Statusflag": Statusflag, "Crudtype": Crudtype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllDbInstance(Crudtype: any, Dbinstance: any, Connectionstring: any, Statusflag: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Operations/CreateDBInstance`,
      { "Crudtype": Crudtype, "Dbinstance": Dbinstance, "Connectionstring": Connectionstring, "Statusflag": Statusflag })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createDbInstance(Client: any, Region: any, Dbinstance: any, Connectionstring: any, Statusflag: any, Crudtype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Operations/NewDbInstance`,
      { "Client": Client, "Region": Region, "Dbinstance": Dbinstance, "Connectionstring": Connectionstring, "Statusflag": Statusflag, "Crudtype": Crudtype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  createNewRegion(Region: any, Regionlogopath: any, Statusflag: any, Crudtype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Operations/NewRegion`,
      { "Region": Region, "Regionlogopath": Regionlogopath, "Statusflag": Statusflag, "Crudtype": Crudtype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  filterClient(Client: any, Region: any, Crudtype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Operations/NewDbInstance`,
      { "Client": Client, "Region": Region, "Crudtype": Crudtype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createNewProject(Dbname: any, Client: any, Region: any, Projectname: any, Signaturekey: any, Dbpath: any, Embeddeddbversion: any,
    Dbversion: any, Statusflag: any, Flagtype: any, Projectversion: any, Swversion: any, Allowdownload: any,
    Binfile: any, Binfilechecksum: any, Zipfile: any, Zipfilechecksum: any): Observable<any> {


    return this.http.post<any>(`${environment.apiUrl}/api/Operations/CreateNewProject`,
      {
        "Dbname": Dbname, "Client": Client, "Region": Region, "Projectname": Projectname, "Signaturekey": Signaturekey, "Dbpath": Dbpath,
        "Embeddeddbversion": Embeddeddbversion, "Dbversion": Dbversion, "Statusflag": Statusflag, "Flagtype": Flagtype,
        "Projectversion": Projectversion, "Swversion": Swversion, "Allowdownload": Allowdownload, "Binfile": Binfile,
        "Binfilechecksum": Binfilechecksum, "Zipfile": Zipfile, "Zipfilechecksum": Zipfilechecksum
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  changePasswordRequest(Username: String, OldPassword: String, NewPassword: String): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Authentication/ChangePassword`,
      { "Username": Username, "OldPassword": OldPassword, "NewPassword": NewPassword })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      );
  }

  searchProject(Client: any, Region: any, Dbinstance: any, Crudtype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Operations/NewDbInstance`,
      { "Client": Client, "Region": Region, "Dbinstance": Dbinstance, "Crudtype": Crudtype })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      );
  }

  dataUploadloadBrands(Dbname: any, Jsonbrand: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadBrands`,
      { "Dbname": Dbname, "Jsonbrand": Jsonbrand })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  dataUploadloadComponentModel(Dbname: any, Projectname: any, Embeddeddbversion: any, JsonComponentModels: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadComponentModels`,
      { "Dbname": Dbname, "Projectname": Projectname, "Embeddeddbversion": Embeddeddbversion, "JsonComponentModels": JsonComponentModels })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();

  }

  dataUploadloadBrandInfoCec(Dbname: any, JsonBICEC: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadBrandInfoCEC`,
      { "Dbname": Dbname, "JsonBICEC": JsonBICEC })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  dataUploadloadBrandInfoEdid(Dbname: any, JsonBIEDID: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadBrandInfoEDID`,
      { "Dbname": Dbname, "JsonBIEDID": JsonBIEDID })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  dataUploadloadCodesets(Dbname: String, Projectname: String, Embeddeddbversion: String, Jsoncodeset: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadCodesets`,
      { "Dbname": Dbname, "Projectname": Projectname, "Embeddeddbversion": Embeddeddbversion, "Jsoncodeset": Jsoncodeset })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  dataUploadloadXmlData(Dbname: String, Projectname: String, Embeddeddbversion: String, Jsonxrefbrands: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadXrefBrands`,
      { "Dbname": Dbname, "Projectname": Projectname, "Embeddeddbversion": Embeddeddbversion, "Jsonxrefbrands": Jsonxrefbrands })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  dataUploadloadCecEdidData(Dbname: String, Projectname: any, Dbversion: any, JsonCecEdidtype: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadCecEdidData`,
      { "Dbname": Dbname, "Projectname": Projectname, "Dbversion": Dbversion, "JsonCecEdidtype": JsonCecEdidtype })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  dataUploadLoadCountryCodeData(crudtype: any, dbname: any, JsonCountrycodes: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadCountryCodeData`,
      { "Crudtype": crudtype, "Dbname": dbname, "JsonCountrycodes": JsonCountrycodes })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();

  }
  insertCecEdidData(Dbname: String, Projectname: any, Dbversion: any, JsonCecEdidtype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadCecEdidData`,
      { "Dbname": Dbname, "Projectname": Projectname, "Dbversion": Dbversion, "JsonCecEdidtype": JsonCecEdidtype })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      );
  }

  getDataTable(datas: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/UI/GetPaginatedData`,
      datas)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );

  }

  filterDataUpload(Client: String, Region: String, Projectname: String, Dbversion: any, Dbinstance: String, Datatype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Config/UIData`,
      { "Client": Client, "Region": Region, "Projectname": Projectname, "Dbversion": Dbversion, "Dbinstance": Dbinstance, "Datatype": Datatype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  clearDataUpload(Dbname: String, Projectname: String, Embeddedversion: any, Contenttype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/CleanContents`,
      { "Dbname": Dbname, "Projectname": Projectname, "Embeddedversion": Embeddedversion, "Contenttype": Contenttype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  DBUpdates(Username: String, Projectname: String, Dbversion: any, Datasection: any, Recordcount: any, Updatedescription: any, Operation: any,
    Ipaddress: any, Updatestatus: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/DataUpdates`,
      {
        "Username": Username, "Projectname": Projectname, "Dbversion": Dbversion, "Datasection": Datasection, "Recordcount": Recordcount, "Updatedescription": Updatedescription,
        "Operation": Operation, "Ipaddress": Ipaddress, "Updatestatus": Updatestatus
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  DataDBUpdates(Username: String, Projectname: String, Dbversion: any, Datasection: any, Totalinsertedrecords: any,
    Totalfailedrecords: any, Totalupdatedrecords: any, Recordcount: any, Updatedescription: any, Operation: any, Systemuser: any,
    Ipaddress: any, Updatestatus: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/DataUpdates`,
      {
        "Username": Username, "Projectname": Projectname, "Dbversion": Dbversion, "Datasection": Datasection,
        "Totalinsertedrecords": Totalinsertedrecords, "Totalfailedrecords": Totalfailedrecords, "Totalupdatedrecords": Totalupdatedrecords,
        "Recordcount": Recordcount, "Updatedescription": Updatedescription, "Operation": Operation, "Systemuser": Systemuser,
        "Ipaddress": Ipaddress, "Updatestatus": Updatestatus
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  sidebarLists(): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/UI/GetSideNavMenu`, {})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getRegionsperClient(): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Config/GetRegionsPerClient`, {})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getProjectNames(Client: any, Region: any, Projectname: any, Dbversion: any, Dbinstance: any, Datatype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Config/UIData`,
      { "Client": Client, "Region": Region, "Projectname": Projectname, "Dbversion": Dbversion, "Dbinstance": Dbinstance, "Datatype": Datatype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getProjectNamesWaitReq(Client: any, Region: any, Projectname: any, Dbversion: any, Dbinstance: any, Datatype: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Config/UIData`,
      { "Client": Client, "Region": Region, "Projectname": Projectname, "Dbversion": Dbversion, "Dbinstance": Dbinstance, "Datatype": Datatype })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  getPaginatedRecords(Dbname: any, Projectname: any, Dbversion: any, Startrow: any, Endrow: any, search: any, order: any[], Datatype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/UI/GetPaginatedData`,
      { "Dbname": Dbname, "Projectname": Projectname, "Dbversion": Dbversion, "Start": Startrow, "length": Endrow, "search": search, "order": order, "Datatype": Datatype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  GetPaginatedProductionDBStats(dbname: any, Projectname: any, Startdate: any, Enddate: any, Startrow: any, Endrow: any, search: any, order: any[], Datatype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Stats/GetPaginatedProductionDBStats`,
      { "Dbname": dbname, "Projectname": Projectname, "Startdate": Startdate, "Enddate": Enddate, "Start": Startrow, "length": Endrow, "search": search, "order": order, "Datatype": Datatype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getSaveEditBrandDetailsInfo(Dbname: any, Projectname: any, Dbversion: any, Device: any, Brand: any, Brandcode: any, Model: any, Modelx: any, Codeset: any,
    Codesetdata: any, Cschecksum: any, Region: any, Regioncode: any, Country: any, Countrycode: any, Csrank: any, Vendorid: any, Osd: any, Edidbrand: any,
    Datatype: any, Optype: any, recordid: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/InsertDelete`,
      {
        "Dbname": Dbname, "Projectname": Projectname, "Dbversion": Dbversion, "Device": Device, "Brand": Brand, "Brandcode": Brandcode,
        "Model": Model, "Modelx": Modelx, "Codeset": Codeset, "Codesetdata": Codesetdata, "Cschecksum": Cschecksum, "Region": Region,
        "Regioncode": Regioncode, "Country": Country, "Countrycode": Countrycode, "Csrank": Csrank, "Vendorid": Vendorid, "Osd": Osd,
        "Edidbrand": Edidbrand, "Datatype": Datatype, "Optype": Optype, "recordid": recordid
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getSaveEditCECEDIDdataInfo(Dbname: any, Projectname: any, Dbversion: any, Device: any, Brand: any, Brandcode: any, Model: any, Modelx: any, Codeset: any,
    Codesetdata: any, Cschecksum: any, Region: any, Regioncode: any, Country: any, Countrycode: any, Csrank: any, Vendorid: any, Osd: any, osdstr: any,
    Edidraw: any, edid128: any, Edidbrand: any, Datatype: any, Optype: any, recordid: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/InsertDelete`,
      {
        "Dbname": Dbname, "Projectname": Projectname, "Dbversion": Dbversion, "Device": Device, "Brand": Brand, "Brandcode": Brandcode,
        "Model": Model, "Modelx": Modelx, "Codeset": Codeset, "Codesetdata": Codesetdata, "Cschecksum": Cschecksum, "Region": Region,
        "Regioncode": Regioncode, "Country": Country, "Countrycode": Countrycode, "Csrank": Csrank, "Vendorid": Vendorid, "Osd": Osd,
        "osdstring": osdstr, "edidraw": Edidraw, "edid128": edid128, "Edidbrand": Edidbrand, "Datatype": Datatype, "Optype": Optype,
        "recordid": recordid
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getSavebrandDetailsInfo(Dbname: any, Projectname: any, Dbversion: any, Device: any, Brand: any, Brandcode: any, Model: any, Modelx: any, Codeset: any,
    Codesetdata: any, Cschecksum: any, Region: any, Regioncode: any, Country: any, Countrycode: any, Csrank: any, Vendorid: any, Osd: any, Edidbrand: any,
    Datatype: any, Optype: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/InsertDelete`,
      {
        "Dbname": Dbname, "Projectname": Projectname, "Dbversion": Dbversion, "Device": Device, "Brand": Brand, "Brandcode": Brandcode,
        "Model": Model, "Modelx": Modelx, "Codeset": Codeset, "Codesetdata": Codesetdata, "Cschecksum": Cschecksum, "Region": Region,
        "Regioncode": Regioncode, "Country": Country, "Countrycode": Countrycode, "Csrank": Csrank, "Vendorid": Vendorid, "Osd": Osd,
        "Edidbrand": Edidbrand, "Datatype": Datatype, "Optype": Optype
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getClientViewProjects(): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl}/api/Admin/GetProjectList`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createNewProjectDef(Dbname: any, Client: any, Region: any, Projectname: any, Signaturekey: any, Dbpath: any, Statusflag: any, Flagtype: any, allowdownload: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Admin/CreateNewProjectDefinition`,
      {
        "Dbname": Dbname, "Client": Client, "Region": Region, "Projectname": Projectname, "Signaturekey": Signaturekey,
        "Dbpath": Dbpath, "Statusflag": Statusflag, "Flagtype": Flagtype, "allowdownload": allowdownload
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  CreateNewProjectWithVersion(Dbname: any, Client: any, Region: any, Projectname: any, Signaturekey: any, Dbpath: any, Embeddeddbversion: any,
    Dbversion: any, Statusflag: any, Flagtype: any, Projectversion: any, Swversion: any, Allowdownload: any,
    Binfile: any, Binfilechecksum: any, Zipfile: any, Zipfilechecksum: any): Promise<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Admin/CreateNewProjectWithVersion`,
      {
        "Dbname": Dbname, "Client": Client, "Region": Region, "Projectname": Projectname, "Signaturekey": Signaturekey, "Dbpath": Dbpath,
        "Embeddeddbversion": Embeddeddbversion, "Dbversion": Dbversion, "Statusflag": Statusflag, "Flagtype": Flagtype,
        "Projectversion": Projectversion, "Swversion": Swversion, "Allowdownload": Allowdownload, "Binfile": Binfile,
        "Binfilechecksum": Binfilechecksum, "Zipfile": Zipfile, "Zipfilechecksum": Zipfilechecksum
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  Unlinkanddeletetheproject(Projectname: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Admin/UnlinkAndDeleteProject`,
      { "projectname": Projectname })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getUserRoleModuleInfo(Datatype: any, Username: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Admin/GetUserRoleModuleInfo`,
      { "Datatype": Datatype, "Username": Username })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  searchHistory(Dbname: any, Apiname: any, Projectname: any, Dbversion: any, Boxid: any, Startdate: any, Enddate: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Report/SearchHistory`,
      { "Dbname": Dbname, "Apiname": Apiname, "Projectname": Projectname, "Dbversion": Dbversion, "Boxid": Boxid, "Startdate": Startdate, "Enddate": Enddate })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  ChangeHistory(Projectname: any, Username: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Admin/GetChangeHistory`,
      { "Projectname": Projectname, "Username": Username })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  viewDetailedData(dbname: any, apiname: any, boxid: any, recordeddate: any, device: any, brand: any, model: any, recordid: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/UI/ViewDetailedData`,
      { "dbname": dbname, "apiname": apiname, "boxid": boxid, "recordeddate": recordeddate, "device": device, "brand": brand, "model": model, "recordid": recordid })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getListofZipFiles(): Observable<any> {
    // this.getPortalSpecificUrlforZip();
    let zipurl = `${environment.zipUrl}`;
    if (zipurl === 'https://sscportalazurefunctions.azurewebsites.net') {
      this.listZip = '/api/GetListOfZipFiles?code=fYWa6wb7qiWet6qRPhVa35RePhsuHvsIp50eXjoX4gXKGdy/6k8yKQ==';
    }
    else if (zipurl === 'https://sscazurefunctionsdev.azurewebsites.net') {
      this.listZip = '/api/GetListOfZipFiles?code=kM1WickwooGRnQLYGtT1ev1tjdd2jt5y4vRaTELj87bbl2XoaPApsQ==';
    }
    else if (zipurl === 'https://zipprocessing.azurewebsites.net') {
      this.listZip = '/api/GetListOfZipFiles?code=Fk5s14t8lPNmniS4NRQi/T2EDKai6tI8s0pPtZC6buOa9rR5RmWWow==';
    }
    return this.http.post<any>(`${environment.zipUrl}${this.listZip}`, {})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  fileUnzipData(url: any): Observable<any> {
    // this.getPortalSpecificUrlforZip();
    let zipurl = `${environment.zipUrl}`;
    if (zipurl === 'https://sscportalazurefunctions.azurewebsites.net') {
      this.unzipFile = '/api/UnzipFile?code=NKrYd88jKdQuChXJX4XivotLL/fHC5YpjBD08dMWFOMl6NFTG9268Q==';
    }
    if (zipurl === 'https://sscazurefunctionsdev.azurewebsites.net') {
      this.unzipFile = '/api/UnzipFile?code=mY7ESySYMv0pgqwaaEWz2/9AAA1SWqwjrRABi7JletOsa1aSNnPJcQ==';
    }
    if (zipurl === 'https://zipprocessing.azurewebsites.net') {
      this.unzipFile = '/api/UnzipFile?code=9pCaBiclLRo89t807YAKVMW6yDrizwC3ggJC2YeaEq6HKs/gDkywnQ==';
    }
    return this.http.post<any>(`${environment.zipUrl}${this.unzipFile}`,
      { "zipfile": url })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getMemoryStream(url: any): Observable<any> {
    // this.getPortalSpecificUrlforZip();
    let zipurl = `${environment.zipUrl}`;
    if (zipurl === 'https://sscportalazurefunctions.azurewebsites.net') {
      this.memStream = '/api/GetMemoryStream?code=QsFvvR7iP/iXKpZAO0YcsvIR6PAY9mOtETT6oTT7UcDa6QKs9YD1FA==';
    }
    if (zipurl === 'https://sscazurefunctionsdev.azurewebsites.net') {
      this.memStream = '/api/GetMemoryStream?code=BrPSbj8hRXNKAihXR91dUQBxyDCAKoMiAcaVBePb9sj5qdQPMRuOyw==';
    }
    if (zipurl === 'https://zipprocessing.azurewebsites.net') {
      this.memStream = '/api/GetMemoryStream?code=8ua2iLhT0vQ1qf1dffuQ51Ll9d33QflFhQ/UaOUl7YqAPs3KBaK8EA==';
    }
    return this.http.post<any>(`${environment.zipUrl}${this.memStream}`,
      { "fileurl": url })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getCodesetMemoryStream(url: any): Promise<any> {
    // this.getPortalSpecificUrlforZip();
    let zipurl = `${environment.zipUrl}`;
    if (zipurl === 'https://sscportalazurefunctions.azurewebsites.net') {
      this.memStream = '/api/GetMemoryStream?code=QsFvvR7iP/iXKpZAO0YcsvIR6PAY9mOtETT6oTT7UcDa6QKs9YD1FA==';
    }
    if (zipurl === 'https://sscazurefunctionsdev.azurewebsites.net') {
      this.memStream = '/api/GetMemoryStream?code=BrPSbj8hRXNKAihXR91dUQBxyDCAKoMiAcaVBePb9sj5qdQPMRuOyw==';
    }
    if (zipurl === 'https://zipprocessing.azurewebsites.net') {
      this.memStream = '/api/GetMemoryStream?code=8ua2iLhT0vQ1qf1dffuQ51Ll9d33QflFhQ/UaOUl7YqAPs3KBaK8EA==';
    }
    return this.http.post<any>(`${environment.zipUrl}${this.memStream}`,
      { "fileurl": url })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  loadBinZip(dbname: any, projectname: any, dbversion: any, projectversion: any, swversion: any, binfile: any, binchecksum: any, zipfile: any, zipchecksum: any, statusflag: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/LoadBinAndZip`,
      {
        "dbname": dbname, "projectname": projectname, "dbversion": dbversion, "projectversion": projectversion,
        "swversion": swversion, "binfile": binfile, "binchecksum": binchecksum, "zipfile": zipfile, "zipchecksum": zipchecksum, "statusflag": statusflag
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  cleanContents(Dbname: any, Projectname: any, Embeddedversion: any, Contenttype: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/CleanContents`,
      { "Dbname": Dbname, "Projectname": Projectname, "Embeddedversion": Embeddedversion, "Contenttype": Contenttype })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();
  }

  deleteZipFile(Dbname: any, Projectname: any, Embeddedversion: any, Contenttype: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/LoadData/DeleteContents`,
      { "Dbname": Dbname, "Projectname": Projectname, "Embeddedversion": Embeddedversion, "Contenttype": Contenttype })
      .pipe(
        retry(1),
        catchError(this.handleEventerror)
      ).toPromise();

  }

  getSearchDetails(dbname: any, projectname: any, startdate: any, enddate: any, datatype: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Stats/GetProductionDBStats`,
      { "dbname": dbname, "projectname": projectname, "startdate": startdate, "enddate": enddate, "datatype": datatype })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  crudApiList(dbname: any, crudtype: any, project: any, signaturekey: any, apiname: any, address: any, uri: any, description: any, status: any, pid: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Config/CRUD_APIList`,
      { "dbname": dbname, "crudtype": crudtype, "project": project, "signaturekey": signaturekey, "apiname": apiname, "address": address, "uri": uri, "description": description, "status": status, "pid": pid })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  hdmiData(dbname: any, projectName: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Delete/HDMIAndComponentData`,
      {
        "dbname": dbname, "projectName": projectName
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  MigrateRawToStaging(Crudtype: any, Detectionid: any, Device: any, Subdevice: any, Brand: any, Model: any, Regioncountry: any, Year: any, cecpresent: any,
    cecenabled: any, vendoridhex: any, vendoridstring: any, osdhex: any, osdstring: any, ediddata: any, uid: any, statusflag: any,
    recordid: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/CecEdid/MigrateRawToStaging`,
      {
        "crudtype": Crudtype, "detectionid": Detectionid, "device": Device, "subdevice": Subdevice, "brand": Brand, "model": Model,
        "regioncountry": Regioncountry, "year": Year, "cecpresent": cecpresent, "cecenabled": cecenabled, "vendoridhex": vendoridhex,
        "vendoridstring": vendoridstring, "osdhex": osdhex, "osdstring": osdstring, "ediddata": ediddata, "uid": uid, "statusflag": statusflag,
        "recordid": recordid
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  RawToStaging(Crudtype: any, Jsondata: any, detectionid: any, statusflag: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Detection/RawToStaging`,
      { "crudtype": Crudtype, "jsondata": Jsondata, "detectionid": detectionid, "statusflag": statusflag })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  LoadDetectionInJSON(CECDevice: any, device: any, brand: any, model: any, Jsondata: any, Statusflag: any, Recordid: any, Crudtype: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Detection/LoadDetectionInJSON`,
      {
        "CECDevice": CECDevice, "Device": device, "Brand": brand, "Model": model, "Jsondata": Jsondata,
        "Statusflag": Statusflag, "Recordid": Recordid, "Crudtype": Crudtype
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  DecodeUrl(EDID: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/EDID`,
      { "Edid": EDID })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  ClearDefaultBoxIdLogs(dbname: any, boxid: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Admin/ClearDefaultBoxIdLogs`,
      {
        "dbname": dbname, "boxid": boxid
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  getRemoteUID(brand: any, componentModel: any, deviceCategory: any): Observable<any> {
    let token = "WittSSUPortalConnector2020"
    let headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);
    let options = {
      headers: headers
    }
    return this.http.post<any>(`${environment.getuidurl}/api/WittSSUPortal/getRemoteUID`,
      { "brand": brand, "componentModel": componentModel, "deviceCategory": deviceCategory }, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  Genericlog(crudtype: any, id: any, log: any): Promise<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Admin/GenericLog`,
      {
        "crudtype": crudtype,
        "loginid": id,
        "log": log
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  StagingToProd(Crudtype: any, Projectname: any, Device: any, Subdevice: any, Brand: any, Model: any, Region: any, country: any, cecpresent: any,
    cecenabled: any, vendorid: any, osd: any, ediddata: any, codeset: any, recordid: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Detection//StagingToProd`,
      {
        "crudtype": Crudtype, "Projectname": Projectname, "device": Device, "subdevice": Subdevice, "brand": Brand, "model": Model,
        "region": Region, "country": country, "iscecpresent": cecpresent, "iscecenabled": cecenabled, "vendorid": vendorid,
        "osd": osd, "edid": ediddata, "codeset": codeset, "recordid": recordid
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  CECEDID_NewProject(Crudtype: any, Projectname: any, signaturekey: any, dbpath: any, statusflag: any, recordid: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Admin/CECEDID_NewProject`,
      {
        "crudtype": Crudtype, "projectname": Projectname, "signaturekey": signaturekey, "dbpath": dbpath, "statusflag": statusflag, "recordid": recordid
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  Notifications(Crudtype: any, Projectname: any, dbversion: any, dbpath: any, data: any, loginid: any, notificationid: any, statusflag: any, recordid: any): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Admin/Notifications`,
      {
        "crudtype": Crudtype, "projectname": Projectname, "dbversion": dbversion, "dbpath": dbpath, "data": data, "loginid": loginid, "recordid": recordid, "notificationid": notificationid, "statusflag": statusflag
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  GetReports(dbinstance: any, Crudtype: any,): Promise<any> {

    return this.http.post<any>(`${environment.apiUrl}/api/Report/GetReports`,
      {
        "dbinstance": dbinstance, "reporttype": Crudtype
      })
      .pipe(
        retry(1),
        catchError(this.handleError)
      ).toPromise();
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      // alert(errorMessage);
      if (errorMessage != '') {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}\nErrorStatus: ${error.error.errormessage}`;
      } else {
        errorMessage = `Error Message: ${error}`;
      }

    }
    if (!navigator.onLine) {
      // Handle offline error
      return alertify.alert('No Internet Connection', function (e) {
        if (e) {
          location.reload();
        }
      });

    } else {
      if (error.status != undefined || error.message != undefined) {
        // Handle Http Error (error.status === 403, 404...)
        return alertify.alert(`${error.status} - ${error.message}`);
      } else {
        return alertify.alert(`${error}`);
      }
    }
    // alertify.alert(error);
    // return throwError(errorMessage);
  }

  handleEventerror(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `ErrorStatus: ${error.error.errormessage}`;
    }
    if (!navigator.onLine) {
      // Handle offline error
      return alertify.alert('No Internet Connection', function (e) {
        if (e) {
          location.reload();
        }
      });
    } else {
      if (error.status != undefined || error.message != undefined) {
        // Handle Http Error (error.status === 403, 404...)
        return alertify.alert(`${error.status} - ${error.message}`);
      } else {
        return alertify.alert(`${error}`);
      }
    }
    // alertify.alert(error);
    // return throwError(errorMessage);
  }


}
