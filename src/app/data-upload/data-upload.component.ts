// import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormGroupDirective} from '@angular/forms';
// import { MainService } from '../services/main-service';
// import { Router } from '@angular/router';
// import { DeviceCategory } from '../model/DeviceCategory';
// import { DiviceForm } from '../model/DiviceForm';
// import { Brand } from '../model/Brand';
// import { stringify } from 'querystring';
// import { Title } from '@angular/platform-browser';
// import * as xml2js from 'xml2js';

// @Component({
//   selector: 'app-data-upload',
//   templateUrl: './data-upload.component.html',
//   styleUrls: ['./data-upload.component.css']
// })

// export class DataUploadComponent implements OnInit {

//   dataUploadForm: FormGroup;
//   i: number; public j: number = 0;
//   public k: number = 10;
//   diviceForm: DiviceForm;
//   submitted: Boolean = false;
//   master_brand: any;
//   private incremet:number;
//   codesets: any;
//   brand_model_collection: any;
//   cross_reference_brands: any;
//   _objectParse: Array<DeviceCategory>;
//   _brand: Array<Brand>;
//   brand_info_cec: any;
//   brand_info_edid: any; brand_info_cec_edid: any;
//   masterBrandList = []; brandModelList = []; brandInfoCecList = []; brandInfoEdidList = []; brandInfoCecEdidList = [];
//   codesetsList = [];
//   codeset = []; csData: any = []; csChecksum: any;
//   public codesetArr = []; 
//   _incValue: number;
//   public codeArrResult = [];
//   public xmlDataResult = [];
//   public byteArr = [];
//   public index: any; public index2: any; public index3: any; public index4: any; public index5: any; public index6: any;
//   public index7: any;
//   progressName: any;
//   isProgreessVisible: Boolean;
//   progressWidth: any; isIconVis1: Boolean;
//   isIconVis2: Boolean; isIconVis3: Boolean; isIconVis4: Boolean; isIconVis5: Boolean; isIconVis6: Boolean; isIconVis7: Boolean;
//   clientSelected: any; projectSelected: any; isdataUploaded: Boolean = false;
//   InsertCount: any; ExistsCount: any; FailedCount: any; dataName: any;
//   dataCodeName: any; InsertCodeCount: any; ExistsCodeCount: any; FailedCodeCount: any;
//   dataBrandName: any; InsertBrandCount: any; ExistsBrandCount: any; FailedBrandCount: any;
//   dataCrossName: any; InsertCrossCount: any; ExistsCrossCount: any; FailedCrossCount: any;
//   dataCecName: any; InsertCecCount: any; ExistsCecCount: any; FailedCecCount: any;
//   dataEdidName: any; InsertEdidCount: any; ExistsEdidCount: any; FailedEdidCount: any;
//   dataCecEdidName: any; InsertCecEdidCount: any; ExistsCecEdidCount: any; FailedCecEdidCount: any;
//   codeVisible: Boolean = false; brandVisible: Boolean = false; crossDataVisible: Boolean = false; masterDataVisible: Boolean = false;
//   cecDataVisible: Boolean = false; edidDataVisible: Boolean = false; cecEdidDataVisible: Boolean = false;
//   fetchDbName: any; fetchembedVersion: any;
//   public existsBrandCount: any = 0; public addedBrandCount: any = 0; public failedBrandCount: any = 0;
//   public existsCodeCount: any = 0; public addedCodeCount: any = 0; public failedCodeCount: any = 0;
//   public existsModelCount: any = 0; public addedModelCount: any = 0; public failedModelCount: any = 0;
//   public existsXmlCount: any = 0; public addedXmlCount: any = 0; public failedXmlCount: any = 0;
//   public existsCecCount: any = 0; public addedCecCount: any = 0; public failedCecCount: any = 0;
//   public existsEdidCount: any = 0; public addedEdidCount: any = 0; public failedEdidCount: any = 0;
//   public existsCecEdidCount: any = 0; public addedCecEdidCount: any = 0; public failedCecEdidCount: any = 0;

//   @ViewChild(FormGroupDirective, { static: false }) formGroupDirective: FormGroupDirective;

//   constructor(private fb: FormBuilder, private mainService: MainService, private router: Router, private titleService: Title) {
//     this.incremet = 0;
//     this.i = 0;
//     this._incValue = 0;
//     this.diviceForm = new DiviceForm();

//     this.titleService.setTitle("Data Uploads");
//     var clientPage = localStorage.getItem('clientUpdated');
//     var createClient = localStorage.getItem('selectedClient');
//     if (clientPage != null) {
//       this.clientSelected = clientPage;
//     }
//     if (createClient != null) {
//       this.clientSelected = createClient.replace(/\"/g, "");
//     }
//     var projCreate = localStorage.getItem('projectSelected');
//     var projUpdate = localStorage.getItem('projectNameSelected');
//     if (projCreate != null) {
//       this.projectSelected = localStorage.getItem('projectSelected');
//     }
//     if (projUpdate != null) {
//       this.projectSelected = localStorage.getItem('projectNameSelected');
//     }

//     var fetchDb = localStorage.getItem('setDbInstance');
//     var fetchUpdDb = localStorage.getItem('updDbInstance');
//     if (fetchDb != null) {
//       this.fetchDbName = localStorage.getItem('setDbInstance');
//     }
//     if (fetchUpdDb != null) {
//       this.fetchDbName = localStorage.getItem('updDbInstance');
//     }

//     var embver = localStorage.getItem('embedVersion');
//     var updembver = localStorage.getItem('embedupdateVersion');
//     console.log(embver);
//     if (embver != null) {
//       this.fetchembedVersion = localStorage.getItem('embedVersion');
//     }
//     if (updembver != null) {
//       this.fetchembedVersion = localStorage.getItem('embedupdateVersion');
//     }
//   }

//   ngOnInit() {

//     this.dataUploadForm = this.fb.group({
//       BrandListFile: ['', Validators.required],
//       Codesets: ['', Validators.required],
//       BrandModelCollection: ['', Validators.required],
//       CrossReferenceBrands: ['', null],
//       BrandInfoCec: ['', null],
//       BrandInfoEdid: ['',  null],
//       BrandInfoCecEdid: ['', null]
//     });

//   }

//   get f() { return this.dataUploadForm.controls; }



//   handleFileSelect(evt) {
//     var files = evt.target.files;
//     var file = files[0];

//     if (files && file) {
//       var reader = new FileReader();

//       reader.onload = this._handleReaderLoaded.bind(this);

//      // reader.readAsBinaryString(file);
//       reader.readAsText(file, 'UTF-8');
//     }
//   }

//   _handleReaderLoaded(readerEvt) {

//     var binaryString = readerEvt.target.result;

//     var allTextLines = binaryString.split(/\r\n|\n/);
//     var headers = allTextLines[0].split(',');
//     var lines = [];

//     for (var i = 1; i < allTextLines.length; i++) {

//       var data = allTextLines[i].split(',');
//       if (data.length == headers.length) {
//         var row = {};
//         for (var j = 0; j < headers.length; j++) {
//           row[headers[j].trim()] = data[j].trim();
//             var b = {};
//           b['RowId'] = i;
//           var row1 = Object.assign({}, b, row);
//         }
//         lines.push(row1);
//       }
//     }
//     this.masterBrandList = lines;
//   }

//   codesetFolderSelect(evt) {
//     var files = evt.target.files;

//     for (var i = 0; i < files.length; i++) {
//       var file = files[i];
      
//       this.codeset = file['name'].slice(0, -4);
//       this.codesetArr.push(this.codeset);
//       if (files && file) {
//         var reader = new FileReader();

//         reader.onload = this._codeSetReaderLoaded.bind(this);

//         reader.readAsBinaryString(file);
//       }
//     }

//   }


//   _codeSetReaderLoaded(readerEvt) {
    
//     var binaryString = readerEvt.target.result;

//     var b64 = btoa(binaryString);
    
//     this.csData = b64;
//     var base64 = b64;
//     if (base64 != undefined && base64 != '') {
//       /** Binary Data */
//       var getArr = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    
//       var result = 0;
//       getArr.forEach(function (value) {
//         result += value;
//       });
//       var checkResult = result & 0xFF;
//       var hexString = checkResult.toString(16);
//       this.csChecksum = hexString.toUpperCase();

//       if (this.csChecksum.length == 1) {
//         this.csChecksum = '0' + this.csChecksum;
//       }

//       this.codeArrResult.push({ "RowId": this._incValue, "Codeset": this.codesetArr[this._incValue], "CSData": this.csData, "CSChecksum": this.csChecksum });
//       this._incValue = this._incValue + 1;
       
//     }
//   }

//   ComponentDataSelect(evt) {
//     var files = evt.target.files;
//     var file = files[0];

//     if (files && file) {
//       var reader = new FileReader();

//       reader.onload = this._componentDataReaderLoaded.bind(this);

//      // reader.readAsBinaryString(file);
//       reader.readAsText(file, 'UTF-8');
//     }
//   }

//   _componentDataReaderLoaded(readerEvt) {
//     var binaryString = readerEvt.target.result;

//     var allTextLines = binaryString.split(/\r\n|\n/);
//     var headers = allTextLines[0].split(',');
//     var lines = [];

//     for (var i = 1; i < allTextLines.length; i++) {

//       var data = allTextLines[i].split(',');
//       if (data.length == headers.length) {
//         var row = {};
//         for (var j = 0; j < headers.length; j++) {
//           data[j] = data[j].replace(/"/g, "");
//           row[headers[j].trim()] = data[j].trim();
//           var b = {}; var modelx = {}; var model = {}; var device = {};
//           var brand = {}; var codeset = {};
//           var ArrayValues = [];
//           ArrayValues.push(row);
//           for (var k = 0; k < ArrayValues.length; k++) {
//             var modelX = ArrayValues[k]['ModelName'];
//             var modeL = ArrayValues[k]['ModelName'];
//             var Device = ArrayValues[k]['DeviceCategoryName'];
//             var Brand = ArrayValues[k]['Brand'];
//             var Codeset = ArrayValues[k]['Codeset'];
//             if (modelX != undefined) {
//               var removeChars = modelX.replace(/[^a-zA-Z0-9]/g, '');
//             }
//           }
//           modelx['modelx'] = removeChars;
//           model['model'] = modeL;
//           device['device'] = Device;
//           brand['brand'] = Brand;
//           codeset['codeset'] = Codeset;
//           b['RowId'] = i;
//           var row1 = Object.assign({}, b, device, brand, model, modelx, codeset);
//         }
//         lines.push(row1);
//       }
//     }
//     this.brandModelList = lines;
//   }

//   BrandInfoCecSelect(evt) {
//     var files = evt.target.files;
//     var file = files[0];

//     if (files && file) {
//       var reader = new FileReader();

//       reader.onload = this._BrandInfoCecDataReaderLoaded.bind(this);

//      // reader.readAsBinaryString(file);
//       reader.readAsText(file, 'UTF-8');
//     }
//   }

//   _BrandInfoCecDataReaderLoaded(readerEvt) {
//     var binaryString = readerEvt.target.result;

//     var allTextLines = binaryString.split(/\r\n|\n/);
//     var headers = allTextLines[0].split(',');
//     var lines = [];

//     for (var i = 1; i < allTextLines.length; i++) {

//       var data = allTextLines[i].split(',');
//       if (data.length == headers.length) {
//         var row = {}; var device = {}; var brand = {}; var vendorid = {};
//         for (var j = 0; j < headers.length; j++) {
//           row[headers[j].trim()] = data[j].trim();
//           var b = {};
//           device['device'] = data[0];
//           brand['brand'] = data[2];
//           vendorid['vendorid'] = data[3];
//           b['RowId'] = i;
//           var row1 = Object.assign({}, b, device, brand, vendorid);
//         }
//         lines.push(row1);
//       }
//     }
//     this.brandInfoCecList = lines;
//   }

//   BrandInfoEdidSelect(evt) {
//     var files = evt.target.files;
//     var file = files[0];

//     if (files && file) {
//       var reader = new FileReader();

//       reader.onload = this._BrandInfoEdidDataReaderLoaded.bind(this);

//      // reader.readAsBinaryString(file);
//       reader.readAsText(file, 'UTF-8');
//     }
//   }

//   _BrandInfoEdidDataReaderLoaded(readerEvt) {
//     var binaryString = readerEvt.target.result;

//     var allTextLines = binaryString.split(/\r\n|\n/);
//     var headers = allTextLines[0].split(',');
//     var lines = [];

//     for (var i = 1; i < allTextLines.length; i++) {

//       var data = allTextLines[i].split(',');
//       if (data.length == headers.length) {
//         var row = {}; var device = {}; var brand = {}; var edidbrand = {};
//         for (var j = 0; j < headers.length; j++) {
//           row[headers[j].trim()] = data[j].trim();
//           var b = {};
//           device['device'] = data[0];
//           brand['brand'] = data[2];
//           edidbrand['edidbrand'] = data[3];
//           b['RowId'] = i;
//           var row1 = Object.assign({}, b, device, brand, edidbrand);
//         }
//         lines.push(row1);
//       }
//     }
//     this.brandInfoEdidList = lines;
//   }

//   BrandInfoCecEdidSelect(evt) {
//     var files = evt.target.files;
//     var file = files[0];

//     if (files && file) {
//       var reader = new FileReader();

//       reader.onload = this._BrandInfoCecEdidDataReaderLoaded.bind(this);

//      // reader.readAsBinaryString(file);
//       reader.readAsText(file, 'UTF-8');
//     }
//   }
//   _BrandInfoCecEdidDataReaderLoaded(readerEvt) {
//     var binaryString = readerEvt.target.result;
//     var allTextLines = binaryString.split(/\r\n|\n/);
//     var headers = allTextLines[0].split(',');
//     let cecEdidArrayForm = [];
    
//     let dataval = {
//       "RowId": 0, "device": "", "brand": "", "model": "", "modelx": "", "region": "", "country": "", "edid": "",
//       "edidbrand": "", "edid128": "", "vendorid": "", "osd": "", "osdstr": "", "iscecpresent": "", "iscecenabled": "",
//       "codeset": ""
//     };
//     let resultArray = [];
//     for (var i = 1; i < allTextLines.length; i++) {

//       var data = allTextLines[i].split(',');

//       if (data.length == headers.length) {
//         var row = {};
        
//         for (var j = 0; j < headers.length; j++) {
//           row[headers[j].trim()] = data[j].trim();
//           var ArrayValues = [];
//           ArrayValues.push(row);
//         }
//       }
//       resultArray.push(ArrayValues[0]);
      
//     }
//     for (var k = 0; k < resultArray.length; k++) {
//       dataval['device'] = resultArray[k]['Device Type'];
//       dataval['brand'] = resultArray[k]['Brand'];
//       dataval['model'] = resultArray[k]['Model'];
//       var modelX = resultArray[k]['Model'];
//       if (modelX != undefined) {
//         var filterChars = modelX.replace(/[^a-zA-Z0-9]/g, '');
//       }
//       dataval['modelx'] = filterChars;
//       dataval['region'] = resultArray[k]['Region'];
//       dataval['country'] = resultArray[k]['Country'];
//       dataval['edid'] = resultArray[k]['EDID'];
//       var edidBrand = resultArray[k]['EDID'];
//       if (edidBrand != undefined && edidBrand != null && edidBrand != '') {
//         var filterHex = edidBrand.replace(/[^a-zA-Z0-9]/g, '');
//         if (filterHex.length >= 128) {
//           var finalString = filterHex.slice(16, 20);
//           let getBit = (parseInt(finalString, 16)).toString(2);
//           if (finalString[0] == '0') {
//             getBit = '0000' + getBit;
//           }
//           if (finalString[0] == '1' || finalString[0] == '3' || finalString[0] == '2') {
//             getBit = '00' + getBit;
//           }
//           if (getBit.length > 15) {
//             getBit = getBit.slice(1, 16);
//           }
//           var finalBit = this.convertAlpha(getBit.slice(0, 5)) + '' + this.convertAlpha(getBit.slice(5, 10)) + '' + this.convertAlpha(getBit.slice(10, 15));
          
//         }
//       }
//       dataval['edidbrand'] = finalBit;
//       var edid128 = resultArray[k]['EDID'];
//       if (edid128.length < 383) {
//         dataval['edid128'] = '';
//       } else {
//         dataval['edid128'] = edid128.slice(0, 383);
//       }
//       var modVendorId = resultArray[k]['Vendor ID'];
//       dataval['vendorid'] = modVendorId.replace(/[^a-zA-Z0-9]/g, '');
//       var modOsd = resultArray[k]['OSD Name'];
//       dataval['osd'] = modOsd.replace(/[^a-zA-Z0-9]/g, '');
//       var modOstString = modOsd.replace(/[^a-zA-Z0-9]/g, '');

//       var hex = modOstString.toString();//force conversion
//       var str = '';
//       for (var i = 0; i < hex.length; i += 2)
//         str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      
//       dataval['osdstr'] = str;
//       let cecPresent = resultArray[k]['IS CEC Present'];
//       if (cecPresent != undefined && cecPresent != null && cecPresent != '') {
//         if (cecPresent === 'Y') {
//           cecPresent = 1;
//         }
//         if (cecPresent === 'N') {
//           cecPresent = 0;
//         }
//       }

//       let cecEnabled = resultArray[k]['Is  CEC Enabled'];
//       if (cecEnabled != undefined && cecEnabled != null && cecEnabled != '') {
//         if (cecEnabled === 'Y') {
//           cecEnabled = 1;
//         }
//         if (cecEnabled === 'N') {
//           cecEnabled = 0;
//         }
//       }

//       dataval['iscecpresent'] = cecPresent;
//       dataval['iscecenabled'] = cecEnabled;
//       dataval['codeset'] = resultArray[k]['Id'];
//       const setValue = {
//         "RowId": this.incremet++,
//         "device": dataval['device'],
//         "brand": dataval['brand'],
//         "model": dataval['model'],
//         "modelx": dataval['modelx'],
//         "region": dataval['region'],
//         "country": dataval['country'],
//         "edid": dataval['edid'],
//         "edidbrand": dataval['edidbrand'],
//         "edid128": dataval['edid128'],
//         "vendorid": dataval['vendorid'],
//         "osd": dataval['osd'],
//         "osdstr": dataval['osdstr'],
//         "iscecpresent": dataval['iscecpresent'],
//         "iscecenabled": dataval['iscecenabled'],
//         "codeset": dataval['codeset']
//       };
//       cecEdidArrayForm.push(setValue);
//     }
//     cecEdidArrayForm = cecEdidArrayForm.filter(remove128 => remove128.edid128 !== "");

    
//     this.brandInfoCecEdidList = cecEdidArrayForm;
//     console.log(this.brandInfoCecEdidList);
//   }

//   convertAlpha(value) {
//     var resVal = '';
//     if (value == '00001') {resVal = 'A';}if (value == '00010') {resVal = 'B';}if (value == '00011') {resVal = 'C';}
//     if (value == '00100') {resVal = 'D';}if (value == '00101') {resVal = 'E';}if (value == '00110') {resVal = 'F';}
//     if (value == '00111') {resVal = 'G';}if (value == '01000') {resVal = 'H';}if (value == '01001') {resVal = 'I';}
//     if (value == '01010') {resVal = 'J';}if (value == '01011') {resVal = 'K';}if (value == '01100') {resVal = 'L';}
//     if (value == '01101') {resVal = 'M';}if (value == '01110') {resVal = 'N';}if (value == '01111') {resVal = 'O';}
//     if (value == '10000') {resVal = 'P';}if (value == '10001') {resVal = 'Q';}if (value == '10010') {resVal = 'R';}
//     if (value == '10011') {resVal = 'S';}if (value == '10100') {resVal = 'T';}if (value == '10101') {resVal = 'U';}
//     if (value == '10110') {resVal = 'V';}if (value == '10111') {resVal = 'W';}if (value == '11000') {resVal = 'X';}
//     if (value == '11001') {resVal = 'Y';}if (value == '11010') {resVal = 'Z';}
//     return resVal;
//   }

//   crossReferenceBrandsSelect(evt) {
//     var files = evt.target.files;
//     var file = files[0];

//     if (files && file) {
//       var reader = new FileReader();

//       reader.onload = this._crossReferenceBrandsDataReaderLoaded.bind(this);

//      // reader.readAsBinaryString(file);
//       reader.readAsText(file, 'UTF-8');
//     }
//   }

//   _crossReferenceBrandsDataReaderLoaded(readerEvt) {
//     var xmlData = readerEvt.target.result;
    
//     xmlData = xmlData.replace(/\ï»¿/g, '');

//     let obj = {};
//     const parser = new xml2js.Parser({ strict: false, trim: true });
//     parser.parseString(xmlData, (err, result) => {
//       console.log(result);
//       obj = result;
//     });

//     this._objectParse = obj['CROSSREFERENCEBYBRANDS']['DEVICECATEGORY'];

//     let codeSet = [];
//     let diviceArrayForm = [];
//     let dataval = {
//       "RowId": 0,
//       "device": "",
//       "brand": "",
//       "codeset": "",
//       "ranking": 0
//     };
    
//     for (let i = 0; i < this._objectParse.length; i++) {
//       this._brand = this._objectParse[i]['BRANDS'][0]['BRAND'];
//       console.log(this._brand.length);
//       for (let j = 0; j < this._brand.length; j++) {
       
//         dataval['brand'] = this._brand[j]["$"]['NAME'];
//         codeSet = this._brand[j]['CODESETS'][0]['CODESETID'];
        
//         if (typeof codeSet === 'string') {
//           codeSet = Array(codeSet);
//         }
//         for (let k = 0; k < codeSet.length; k++) {
//           dataval['device'] = this._objectParse[i]['$']['NAME'];
//           this._brand = this._objectParse[i]['BRANDS'][0]['BRAND'];
//           dataval['codeset'] = codeSet[k];
//           dataval['ranking'] = k + 1;
//          const setValue= {
//            "RowId": this.incremet++,
//            "device": dataval['device'],
//            "brand": dataval['brand'],
//            "codeset": dataval['codeset'],
//            "ranking": dataval['ranking'],

//           };
//           diviceArrayForm.push(setValue);
//         }
//       }
     
//     }
    
//     this.xmlDataResult = diviceArrayForm;
//   }


//   async masterBrand() {
    
//     let Dbname = this.fetchDbName;
//       var j = 0;
//       var k = 1;
//       let checkLength = this.masterBrandList.length / 1;
     
//     if (checkLength % 1 != 0) {
//       checkLength = Math.trunc(checkLength) + 1;
//     }

//     for (var i = 0; i < checkLength; i++) {
//           var Jsonbrand = this.masterBrandList.slice(j, k);
//           j = j + 1;
//           k = k + 1;
//       await this.mainService.dataUploadloadBrands(Dbname, Jsonbrand)
//         .then(value => {
//           console.log(value);
//           this.isProgreessVisible = true;
//           this.progressWidth = Math.floor((i * 100) / checkLength);
//           this.progressName = 'Master Brand Uploading..';
//          // console.log(value.data);
//           if (value.data != '' && value.data != undefined) {
//             console.log(value.data);
            
//             for (var l = 0; l < value.data.length; l++) {
//               if (value.data[l]['searchResult'] == '2') {
//                 this.existsBrandCount++;
//               }
//               if (value.data[l]['searchResult'] == '1') {
//                 this.addedBrandCount++;
//               }
//               if (value.data[l]['searchResult'] == '0') {
//                 this.failedBrandCount++;
//               }
//             }
            
//           }
//         });
//           this.index = i;
//     } 

//     if (this.index + 1 == checkLength) {
//       this.isProgreessVisible = false;
//       this.isIconVis1 = true;
//       this.progressName = null;
//       this.isdataUploaded = true;

//     /* Db Updates Start */
//       this.masterDataVisible = true;
//       this.dataName = 'Master Brand List';
//       this.InsertCount = this.addedBrandCount;
//       this.ExistsCount = this.existsBrandCount;
//       this.FailedCount = this.failedBrandCount;
//       let userName = localStorage.getItem('userName'); let Projectname = this.projectSelected; let Dbversion = this.fetchembedVersion;
//       let Datasection = "Master Brand List"; let recordCount2 = this.existsBrandCount; let Updatedescription = "Updated Records";
//       let Updatestatus = 1;
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount2, Updatedescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount1 = this.addedBrandCount; let Updateadddescription = "Inserted Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount1, Updateadddescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount0 = this.failedBrandCount; let Updatedeldescription = "Failed Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount0, Updatedeldescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });

//     /* Db Updates End */

//       if (this.codeArrResult && this.codeArrResult.length > 0) {
//         this.codeSets();
//       }

//     }
//   }

//   async codeSets() {
//     this.progressWidth = 0;

//     let Dbname = this.fetchDbName;
//     let ProjectName = this.projectSelected;
//     let embedVersion = this.fetchembedVersion;
//     var j = 0;
//     var k = 1;
//     var checkcodeArrLength = this.codeArrResult.length / 1;
//     if (checkcodeArrLength % 1 != 0) {
//       checkcodeArrLength = Math.trunc(checkcodeArrLength) + 1;
//     }
//         for (var i = 0; i < checkcodeArrLength; i++) {
//           var JsonCodeArr = this.codeArrResult.slice(j, k);
//           j = j + 1;
//           k = k + 1;
//           await this.mainService.dataUploadloadCodesets(Dbname, ProjectName, embedVersion, JsonCodeArr)
//             .then(Codesetvalue => {
//               console.log(Codesetvalue);
//               this.isProgreessVisible = true;
//               this.progressWidth = Math.floor((i * 100) / checkcodeArrLength);
//               this.progressName = 'Codeset Data Uploading..';
//               if (Codesetvalue.data != '' && Codesetvalue.data != undefined) {
//                // console.log(Codesetvalue.data);
//                 for (var l = 0; l < Codesetvalue.data.length; l++) {
//               if (Codesetvalue.data[l]['searchResult'] == '2') {
//                 this.existsCodeCount++;
//               }
//               if (Codesetvalue.data[l]['searchResult'] == '1') {
//                 this.addedCodeCount++;
//               }
//               if (Codesetvalue.data[l]['searchResult'] == '0') {
//                 this.failedCodeCount++;
//               }
//             }
             
//            }  
            
//             });
//           this.index2 = i;
//     }
//     if (this.index2 + 1 == checkcodeArrLength) {
      
//       this.isProgreessVisible = false;
//       this.progressName = null;
//       this.isIconVis2 = true;

//     /** Db Updates start **/
//       this.dataCodeName = 'Codesets';
//       this.isdataUploaded = true;
//       this.codeVisible = true;
//       this.InsertCodeCount = this.addedCodeCount;
//       this.ExistsCodeCount = this.existsCodeCount;
//       this.FailedCodeCount = this.failedCodeCount;

//       let userName = localStorage.getItem('userName'); let Projectname = this.projectSelected; let Dbversion = this.fetchembedVersion;
//       let Datasection = "Codesets"; let recordCount2 = this.existsCodeCount; let Updatedescription = "Updated Records";
//       let Updatestatus = 1;
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount2, Updatedescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount1 = this.addedCodeCount; let Updateadddescription = "Inserted Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount1, Updateadddescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount0 = this.failedCodeCount; let Updatedeldescription = "Failed Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount0, Updatedeldescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       /** Db Updates end **/

//       if (this.brandModelList && this.brandModelList.length > 0) {
//         this.brandModel();
//       } 
//      if (this.brandModelList.length === 0 && this.xmlDataResult && this.xmlDataResult.length > 0) {
//         this.crossReferenceBrandsModel();
//      } 
//     }
//   }

//   async brandModel() {
//     this.progressWidth = 0;
//     let Dbname = this.fetchDbName;
//     var j = 0;
//     var k = 1;
//     let checkBrandModelLength = this.brandModelList.length / 1;
//     if (checkBrandModelLength % 1 != 0) {
//       checkBrandModelLength = Math.trunc(checkBrandModelLength) + 1;
//     }
//     let ProjectName = this.projectSelected; let embedVersion = this.fetchembedVersion;
//     for (var i = 0; i < checkBrandModelLength; i++) {
//           var JsonComponentModels = this.brandModelList.slice(j, k);
//           j = j + 1;
//           k = k + 1;
//       await this.mainService.dataUploadloadComponentModel(Dbname, ProjectName, embedVersion, JsonComponentModels)
//             .then(brandvalue => {
//               console.log(brandvalue);
//               this.isProgreessVisible = true;
//               this.progressWidth = Math.floor((i * 100) / checkBrandModelLength);
//               this.progressName = 'Brand Model Uploading..';
//               if (brandvalue.data != '' && brandvalue.data != undefined) {
//                 for (var l = 0; l < brandvalue.data.length; l++) {
//                   if (brandvalue.data[l]['searchResult'] == '2') {
//                     this.existsModelCount++;
//                   }
//                   if (brandvalue.data[l]['searchResult'] == '1') {
//                     this.addedModelCount++;
//                   }
//                   if (brandvalue.data[l]['searchResult'] == '0') {
//                     this.failedModelCount++;
//                   }
//                 }
//               }
             
//             });
//           this.index3 = i;
         
//     }
//     if (this.index3 + 1 == checkBrandModelLength) {
      
//       this.isIconVis3 = true;
//       this.progressName = null;
//       this.isProgreessVisible = false;

//     /** Db Updates start **/
//       this.dataBrandName = 'Brand Model Collection';
//       this.isdataUploaded = true;
//       this.brandVisible = true;
//       this.InsertBrandCount = this.addedModelCount;
//       this.ExistsBrandCount = this.existsModelCount;
//       this.FailedBrandCount = this.failedModelCount;

//       let userName = localStorage.getItem('userName'); let Projectname = this.projectSelected; let Dbversion = this.fetchembedVersion;
//       let Datasection = "Brand Model Collection"; let recordCount2 = this.existsModelCount; let Updatedescription = "Updated Records";
//       let Updatestatus = 1;
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount2, Updatedescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount1 = this.addedModelCount; let Updateadddescription = "Inserted Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount1, Updateadddescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount0 = this.failedModelCount; let Updatedeldescription = "Failed Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount0, Updatedeldescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       /** Db Updates end **/

//       if (this.xmlDataResult && this.xmlDataResult.length > 0) {
//         this.crossReferenceBrandsModel();
//         console.log('move func to cross reference');
//       }
//     }
//   }

//   async crossReferenceBrandsModel() {
//     console.log("cross reference by brands");
//     this.progressWidth = 0;
//     let Dbname = this.fetchDbName;
//     let embedVersion = this.fetchembedVersion;
//     let ProjectName = this.projectSelected;
//     var j = 0;
//     var k = 1;
//     var checkxmlDataArrLength = this.xmlDataResult.length / 1;
//     if (checkxmlDataArrLength % 1 != 0) {
//       checkxmlDataArrLength = Math.trunc(checkxmlDataArrLength) + 1;
//     }
//         for (var i = 0; i < checkxmlDataArrLength; i++) {
//           var JsonXmlArr = this.xmlDataResult.slice(j, k);
//           j = j + 1;
//           k = k + 1;
//           await this.mainService.dataUploadloadXmlData(Dbname, ProjectName, embedVersion, JsonXmlArr)
//             .then(xmlValue => {
//               console.log(xmlValue);
//               console.log("cross reference values");
//               this.isProgreessVisible = true;
//               this.progressWidth = Math.floor((i * 100) / checkxmlDataArrLength);
//               this.progressName = 'Cross Reference by Brands Uploading..';
//               if (xmlValue.data != '' && xmlValue.data != undefined) {
//                 for (var l = 0; l < xmlValue.data.length; l++) {
//                   if (xmlValue.data[l]['searchResult'] == '2') {
//                     this.existsXmlCount++;
//                   }
//                   if (xmlValue.data[l]['searchResult'] == '1') {
//                     this.addedXmlCount++;
//                   }
//                   if (xmlValue.data[l]['searchResult'] == '0') {
//                     this.failedXmlCount++;
//                   }
//                 }
//               }
              
             
//             });
//           this.index4 = i;
//     }
//     if (this.index4 + 1 === checkxmlDataArrLength) {
//       this.isIconVis4 = true;
//       this.isProgreessVisible = false;
//       this.progressName = null;

//     /** Db Updates start **/
//       this.dataCrossName = 'Cross Reference By Brands';
//       this.isdataUploaded = true;
//       this.crossDataVisible = true;
//       this.InsertCrossCount = this.addedXmlCount;
//       this.ExistsCrossCount = this.existsXmlCount;
//       this.FailedCrossCount = this.failedXmlCount;

//       let userName = localStorage.getItem('userName'); let Projectname = this.projectSelected; let Dbversion = this.fetchembedVersion;
//       let Datasection = "Cross Reference By Brands"; let recordCount2 = this.existsXmlCount; let Updatedescription = "Updated Records";
//       let Updatestatus = 1;
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount2, Updatedescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount1 = this.addedXmlCount; let Updateadddescription = "Inserted Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount1, Updateadddescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount0 = this.failedXmlCount; let Updatedeldescription = "Failed Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount0, Updatedeldescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       /** Db Updates end **/

//       if (this.brandInfoEdidList && this.brandInfoCecList.length > 0) {
//          this.brandInfoCecModel();
//       }
//       if (this.brandInfoCecList.length === 0 && this.brandInfoEdidList.length > 0) {
//         this.brandInfoEdidModel();
//       }
//       if (this.brandInfoCecList.length === 0 && this.brandInfoEdidList.length === 0 && this.brandInfoCecEdidList.length > 0) {
//         this.brandInfoCecEdidModel();
//       }
//       if (this.brandInfoCecList.length === 0 && this.brandInfoEdidList.length === 0 && this.brandInfoCecEdidList.length === 0) {
//         this.formGroupDirective.resetForm();
//         this.submitted = false;
//         this.isIconVis1 = false; this.isIconVis2 = false; this.isIconVis3 = false;
//         this.isIconVis4 = false; this.isIconVis5 = false; this.isIconVis6 = false;
//         this.isIconVis7 = false;
//       }
//     }
      
//   }

//   async brandInfoCecModel() {
//     this.progressWidth = 0;
//     let Dbname = this.fetchDbName;
//     var j = 0;
//     var k = 1;
//       var checkBrandCecLength = this.brandInfoCecList.length / 1;
//       if (checkBrandCecLength % 1 != 0) {
//         checkBrandCecLength = Math.trunc(checkBrandCecLength) + 1;
//       }
//         for (var i = 0; i < checkBrandCecLength; i++) {
//           var JsonBICEC = this.brandInfoCecList.slice(j, k);
//           j = j + 1;
//           k = k + 1;
//           //console.log(JsonBICEC);
//           await this.mainService.dataUploadloadBrandInfoCec(Dbname, JsonBICEC)
//             .then(brandInfoCecvalue => {
//               console.log(brandInfoCecvalue);
//               this.isProgreessVisible = true;
//               this.progressWidth = Math.floor((i * 100) / checkBrandCecLength);
//               this.progressName = 'Brand Info CEC Data Uploading..';
//               if (brandInfoCecvalue.data != '' && brandInfoCecvalue.data != undefined) {
//                 for (var l = 0; l < brandInfoCecvalue.data.length; l++) {
//                   if (brandInfoCecvalue.data[l]['searchResult'] == '2') {
//                     this.existsCecCount++;
//                   }
//                   if (brandInfoCecvalue.data[l]['searchResult'] == '1') {
//                     this.addedCecCount++;
//                   }
//                   if (brandInfoCecvalue.data[l]['searchResult'] == '0') {
//                     this.failedCecCount++;
//                   }
//                 }
//               }
            
//             });
//           this.index5 = i;
//         }
//     if (this.index5 + 1 === checkBrandCecLength) {

//       this.isIconVis5 = true;
//       this.isProgreessVisible = false;

//     /** Db Updates start **/
//       this.dataCecName = 'Brand Info CEC';
//       this.isdataUploaded = true;
//       this.cecDataVisible = true;
//       this.InsertCecCount = this.addedCecCount;
//       this.ExistsCecCount = this.existsCecCount;
//       this.FailedCecCount = this.failedCecCount;

//       let userName = localStorage.getItem('userName'); let Projectname = this.projectSelected; let Dbversion = this.fetchembedVersion;
//       let Datasection = "Brand Info Cec"; let recordCount2 = this.existsCecCount; let Updatedescription = "Updated Records";
//       let Updatestatus = 1;
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount2, Updatedescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount1 = this.addedCecCount; let Updateadddescription = "Inserted Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount1, Updateadddescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount0 = this.failedCecCount; let Updatedeldescription = "Failed Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount0, Updatedeldescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       /** Db Updates end **/

//       if (this.brandInfoEdidList.length > 0) {
//          this.brandInfoEdidModel();
//       }
//       if (this.brandInfoEdidList.length === 0 && this.brandInfoCecEdidList.length > 0) {
//         this.brandInfoCecEdidModel();
//       }
//       if (this.brandInfoEdidList.length === 0 && this.brandInfoCecEdidList.length === 0) {
//         this.formGroupDirective.resetForm();
//         this.submitted = false;
//         this.isIconVis1 = false; this.isIconVis2 = false; this.isIconVis3 = false;
//         this.isIconVis4 = false; this.isIconVis5 = false; this.isIconVis6 = false;
//         this.isIconVis7 = false;
//       }

//     }
       
//   }

//   async brandInfoEdidModel() {
//     this.progressWidth = 0;
//     let Dbname = this.fetchDbName;
//     var j = 0;
//     var k = 1;
//     var checkBrandEdidLength = this.brandInfoEdidList.length / 1;
//     if (checkBrandEdidLength % 1 != 0) {
//       checkBrandEdidLength = Math.trunc(checkBrandEdidLength) + 1;
//     }
//     for (var i = 0; i < checkBrandEdidLength; i++) {
//       var JsonBIEDID = this.brandInfoEdidList.slice(j, k);
//       j = j + 1;
//       k = k + 1;

//       await this.mainService.dataUploadloadBrandInfoEdid(Dbname, JsonBIEDID)
//         .then(brandInfoEdidvalue => {
//           console.log(brandInfoEdidvalue);
//           this.isProgreessVisible = true;
//           this.progressWidth = Math.floor((i * 100) / checkBrandEdidLength);
//           this.progressName = 'Brand Info EDID Data Uploading..';
//           if (brandInfoEdidvalue.data != '' && brandInfoEdidvalue.data != undefined) {
//             for (var l = 0; l < brandInfoEdidvalue.data.length; l++) {
//               if (brandInfoEdidvalue.data[l]['searchResult'] == '2') {
//                 this.existsEdidCount++;
//               }
//               if (brandInfoEdidvalue.data[l]['searchResult'] == '1') {
//                 this.addedEdidCount++;
//               }
//               if (brandInfoEdidvalue.data[l]['searchResult'] == '0') {
//                 this.failedEdidCount++;
//               }
//             }
//           }
          
         
//         });
//       this.index6 = i;
//     }
//     if (this.index6 + 1 === checkBrandEdidLength) {

//       this.isIconVis6 = true;
//       this.isProgreessVisible = false;

//     /** Db Updates start **/
//       this.dataEdidName = 'Brand Info EDID';
//       this.isdataUploaded = true;
//       this.edidDataVisible = true;
//       this.InsertEdidCount = this.addedEdidCount;
//       this.ExistsEdidCount = this.existsEdidCount;
//       this.FailedEdidCount = this.failedEdidCount;

//       let userName = localStorage.getItem('userName'); let Projectname = this.projectSelected; let Dbversion = this.fetchembedVersion;
//       let Datasection = "Brand Info Edid"; let recordCount2 = this.existsEdidCount; let Updatedescription = "Updated Records";
//       let Updatestatus = 1;
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount2, Updatedescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount1 = this.addedEdidCount; let Updateadddescription = "Inserted Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount1, Updateadddescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount0 = this.failedEdidCount; let Updatedeldescription = "Failed Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount0, Updatedeldescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       /** Db Updates end **/

//       if (this.brandInfoCecEdidList.length > 0) {
//         this.brandInfoCecEdidModel();
//       }
//       if (this.brandInfoCecEdidList.length === 0) {
//         this.formGroupDirective.resetForm();
//         this.submitted = false;
//         this.isIconVis1 = false; this.isIconVis2 = false; this.isIconVis3 = false;
//         this.isIconVis4 = false; this.isIconVis5 = false; this.isIconVis6 = false;
//         this.isIconVis7 = false;
//       }
//           }
//   }

//   async brandInfoCecEdidModel() {
//     this.progressWidth = 0;
//     let Dbname = this.fetchDbName;
//     let Projectname = this.projectSelected;
//     var j = 0;
//     var k = 1;
//     var checkCecEdidArrLength = this.brandInfoCecEdidList.length / 1;
//     if (checkCecEdidArrLength % 1 != 0) {
//       checkCecEdidArrLength = Math.trunc(checkCecEdidArrLength) + 1;
//     }
//       for (var i = 0; i < checkCecEdidArrLength; i++) {
//         var JsonCecEdidArr = this.brandInfoCecEdidList.slice(j, k);
//         j = j + 1;
//         k = k + 1;
//         let Dbversion = this.fetchembedVersion;
//         await this.mainService.dataUploadloadCecEdidData(Dbname, Projectname, Dbversion, JsonCecEdidArr)
//           .then(cecEdidValue => {
//             console.log(cecEdidValue);
//             this.isProgreessVisible = true;
//             this.progressWidth = Math.floor((i * 100) / checkCecEdidArrLength);
//             this.progressName = 'Brand Info CEC-EDID Data Uploading..';
//             if (cecEdidValue.data != '' && cecEdidValue.data != undefined) {
//               for (var l = 0; l < cecEdidValue.data.length; l++) {
//                 if (cecEdidValue.data[l]['searchResult'] == '2') {
//                   this.existsCecEdidCount++;
//                 }
//                 if (cecEdidValue.data[l]['searchResult'] == '1') {
//                   this.addedCecEdidCount++;
//                 }
//                 if (cecEdidValue.data[l]['searchResult'] == '0') {
//                   this.failedCecEdidCount++;
//                 }
//               }
//             }
            
           
//           });
//         this.index7 = i;
//     }
//     if (this.index7 + 1 === checkCecEdidArrLength) {
      
//       this.isIconVis7 = true;
//       this.isProgreessVisible = false;
//       this.progressName = null;

//     /** Db Updates start **/
//       this.dataCecEdidName = 'Brand Info CEC-EDID';
//       this.isdataUploaded = true;
//       this.cecEdidDataVisible = true;
//       this.InsertCecEdidCount = this.addedCecEdidCount;
//       this.ExistsCecEdidCount = this.existsCecEdidCount;
//       this.FailedCecEdidCount = this.failedCecEdidCount;

//       let userName = localStorage.getItem('userName'); let Projectname = this.projectSelected; let Dbversion = this.fetchembedVersion;
//       let Datasection = "Brand Info Edid"; let recordCount2 = this.existsCecEdidCount; let Updatedescription = "Updated Records";
//       let Updatestatus = 1;
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount2, Updatedescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount1 = this.addedCecEdidCount; let Updateadddescription = "Inserted Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount1, Updateadddescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       let recordCount0 = this.failedCecEdidCount; let Updatedeldescription = "Failed Records";
//       this.mainService.DBUpates(userName, Projectname, Dbversion, Datasection, recordCount0, Updatedeldescription, Updatestatus)
//         .pipe()
//         .subscribe(value => {
//           console.log(value.data);
//         });
//       /** Db Updates end **/
//       this.formGroupDirective.resetForm();
//       this.submitted = false;
//       this.isIconVis1 = false; this.isIconVis2 = false; this.isIconVis3 = false;
//       this.isIconVis4 = false; this.isIconVis5 = false; this.isIconVis6 = false;
//       this.isIconVis7 = false;
//       $("#form_inputs :input").prop("disabled", false);
//     }
    
//   }
  

//   onDataUploadSubmit() {
//     this.submitted = true;
//     $('.icons-check').css('display', 'block');
//     if (this.dataUploadForm.invalid) {
//       return;
//     }

   
//     if (this.masterBrandList.length > 0) {
//       this.masterBrand();
//     } else {
//       this.codeSets();
//     }
//     $("a").css("cursor", "arrow").click(false);
//     $("#form_inputs :input").prop("disabled", true);
    

//   }




//   close() {
//     this.router.navigate(['/dashboard']);
//   }
// }
