import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main-service';
import { Subject } from 'rxjs';
declare var $: any;
import 'datatables.net';
import {  FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-stagingdata',
  templateUrl: './stagingdata.component.html',
  styleUrls: ['./stagingdata.component.css']
})
export class StagingdataComponent implements OnInit {

  usersName: any;
  projectNames: any; selectedItems: Array<any> = [];
  dropdownSettings: any = {}; ShowFilter = false; tabslist = [];count: any = 0;oldValue: string; modalCount: any = 0;currentVal: any; 
  limitSelection = false; mainArr = [];
  clientDetails = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  resultProjArr: any =[];status:any;
  rawdatacapture:any =[];
  edidDataView: Boolean = false;
  RemarksView: boolean = false;
  SupportedregionsView: boolean = false;
  EdidData: any;
  Metadata: any;CEC: any;EDID: any;Scandevice: any;
  Supportedregions: any;data: any =[];
  constructor(private mainService: MainService, private router: Router, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private fb: FormBuilder) { 
    this.usersName = localStorage.getItem('userName');
    this.status=null;
  }

  ngOnInit() {
  // var self=this;
    let dataType = 1;
    let statusflag=this.status;
    
    this.rawdata(dataType,statusflag);
    $(document).ready(function () {
      $(".pop-menu").click(function () {
        $(this).toggleClass("transition");
      });
    });
    /** validation for not to accept space in input */
    $(document).ready(function () {
      $("input").on("keypress", function (e) {
        if (e.which === 32 && !this.value.length)
          e.preventDefault();
      });
    });

    
  }

  viewEdidData(value) {
    this.edidDataView = true;
    this.RemarksView = false;
    this.SupportedregionsView = false;
    this.EdidData = value;
  }

  viewRemarks(value1,value2,value3,value4) {
    this.RemarksView = true;
    this.edidDataView = false;
    this.SupportedregionsView = false;
    this.Metadata = value1;
    this.CEC = value2;
    this.EDID = value3;
    this.Scandevice = value4;

  }

  viewSupportedregions(value) {
    this.SupportedregionsView = true;
    this.RemarksView = false;
    this.edidDataView = false;
    this.Supportedregions = value;
  }

  getTabResponseData(statusflag){
    
    let dataType = 1;
    if (this.count == 1 && this.oldValue == undefined && this.modalCount != 1) {
      $('#projectView').dataTable().fnClearTable();
        $('#projectView').dataTable().fnDestroy();
    }
    var Table1 = $('#projectView').DataTable();
        Table1.destroy();
        Table1.clear();
    // if (this.count == 1 && this.oldValue == undefined && this.modalCount != 1) {
    //   $('#loadView').dataTable().fnClearTable();
    //     $('#loadView').dataTable().fnDestroy();
    // }
    // var Table1 = $('#loadView').DataTable();
    //     Table1.destroy();
    //     Table1.clear();
    this.rawdata(dataType,statusflag);

  }

  onchangestatus(){
    let statusflag=this.status;
    if(statusflag==null || statusflag=='null'){
      statusflag=null;
    }
    console.log(statusflag)
    this.getTabResponseData(statusflag);    
  }


  onModelChange(event) {
    if (event) {
      this.oldValue = this.currentVal;
      this.currentVal = event;
    }
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

  rawdata(dataType,statusflag){
    var self=this;
    var rows_selected = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      scrollY: '300px',
      scrollX: true,
      scrollCollapse: true,
      ordering:true,
    //   'rowCallback': function(row, data, dataIndex){
    //     // Get row ID
    //     var rowId = data[0];

    //     // If row ID is in the list of selected row IDs
    //     if($.inArray(rowId, rows_selected) !== -1){
    //        $(row).find('input[type="checkbox"]').prop('checked', true);
    //        $(row).addClass('selected');
    //     }
    //  }
    };

        this.mainService.MigrateRawToStaging(dataType, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, statusflag, null)
      .subscribe(value => {
        let arr=[]; let arr1=[]; let arr3=[];let arr2=[];let Remarks=[];let model=[];
        let Region=[];
            if (value.data.length > 0) {

              //convert  string to Object
              for (let i = 0, ien = value.data.length; i < ien; i++) {
                arr.push(JSON.parse(value.data[i]['sourceDataCapture']));
              }
              
              for (let i = 0, ien = value.data.length; i < ien; i++) {
                arr1.push({Detectionid:value.data[i]['detectionId'],Status:value.data[i]['statusFlag']});
              }
              for(let i=0;i<arr.length;i++){
              Remarks.push(arr[i]['Remarks']);
              }
              
              arr.forEach(element => {
                let RegionCountry = "";
                element.Supportedregions.forEach(element1 => {
                  let Countries = element1.Countries;
                  Countries.forEach(element3 => {
                    RegionCountry+=element1.Region+" : ";
                    //console.log(Countries)
                    RegionCountry+=element3.Country+" : "
                    element3.Models.forEach(element4 => {
                      RegionCountry+=element4+","
                    });
                    RegionCountry=RegionCountry.slice(0,-1)
                  RegionCountry+=" ; "
                  });
                  RegionCountry=RegionCountry.slice(0,-1)
                  // RegionCountry+=";"
                });
                RegionCountry=RegionCountry.slice(0,-1)
                
                Region.push(RegionCountry)

                // console.log(RegionCountry);
              });
              
            
              for(let i=0;i<arr1.length;i++){
                if(arr[i]['Cecpresent']==='1'){
                  arr[i]['Cecpresent']='Yes'
                }
                if(arr[i]['Cecpresent']==='0'){
                  arr[i]['Cecpresent']='No'
                }
                if(arr[i]['Cecenabled']==='1'){
                  arr[i]['Cecenabled']='Yes'
                }
                if(arr[i]['Cecenabled']==='0'){
                  arr[i]['Cecenabled']='No'
                }
                arr2.push({Detectionid:arr1[i]['Detectionid'],Device:arr[i]['Device'],Subdevice:arr[i]['Subdevice'],Brand:arr[i]['Brand'],Targetmodel:arr[i]['Targetmodel'],TargetRegion:arr[i]['TargetRegion'],TargetCountry:arr[i]['TargetCountry'],
                      Year: arr[i]['Year'],Remotemodel: arr[i]['Remotemodel'],Regionofcapture: arr[i]['Regionofcapture'],Countryofcapture: arr[i]['Countryofcapture'],
                  CECDevice: arr[i]['CECDevice'],Cecpresent: arr[i]['Cecpresent'],Cecenabled: arr[i]['Cecenabled'],Vendoridhex: arr[i]['Vendoridhex'],Vendoridstring: arr[i]['Vendoridstring'],Osdstring: arr[i]['Osdstring'],Osdhex: arr[i]['Osdhex'],Edid: arr[i]['Edid'],
                      Sourcename: arr[i]['Sourcename'],Sourcetype: arr[i]['Sourcetype'],
                      Supportedregions:Region[i],
                      Remarks:Remarks[i]['MetaData']+","+Remarks[i]['CEC']+"," +Remarks[i]['EDID']+","+Remarks[i]['Scan Device'],
                      Status:arr1[i]['Status']});
                    }
                    console.log(arr2)
          }
          this.rawdatacapture=arr2;
          this.dtTrigger.next();
          
      });

      $('#projectView').on('click', '.btn-edid', function () {
        
        var setEdid = $(this).val();
        self.viewEdidData(setEdid);
      });

      $('#projectView').on('click', '.btn-remarks', function () {
        
        var setRemarks = $(this).val();
        var ret = setRemarks.split(",");
        var str1 = ret[0];
        var str2 = ret[1];
        var str3 = ret[2];
        var str4 = ret[3];
        self.viewRemarks(str1,str2,str3,str4);
      });

      $('#projectView').on('click', '.btn-supportedregions', function () {
        
        var setEdid = $(this).val();
        self.viewSupportedregions(setEdid);
      });
      
      $('#projectView tbody').on( 'click', 'input[type="checkbox"]', function (e) {
        var $row = $(this).closest('tr');
        // Get row data
        var data = $('#projectView').DataTable().row($row).data();
        // Get row ID
        var rowId = data[0];
        // Determine whether row ID is in the list of selected row IDs 
        var index = $.inArray(rowId, rows_selected);
          // If checkbox is checked and row ID is not in list of selected row IDs
          if(this.checked && index === -1){
             rows_selected.push(rowId);
    
          // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
          } else if (!this.checked && index !== -1){
             rows_selected.splice(index, 1);
          }
    
          if(this.checked){
             $row.addClass('selected');
          } else {
             $row.removeClass('selected');
          }
         //  console.log(rows_selected);
          let rows_selected_id=[];
          for(let i=0;i<rows_selected.length;i++){
           let e=$.parseHTML( rows_selected[i])
           rows_selected_id.push(parseInt(e[0]['defaultValue']));
          }
          console.log(rows_selected_id)
         //  $('#example-console-rows').text(rows_selected_id.join(","));

         self.updateDataTableSelectAllCtrl($('#projectView').DataTable());
         $('#button').click(function(){
          self.exporttostaging(rows_selected_id,self.rawdatacapture);
         })
         // Prevent click event from propagating to parent
          e.stopPropagation();
      });
      
      // Handle click on "Select all" control
      $('#projectView thead').on( 'click', 'input[name="select_all"]', function(e){
        if(this.checked){
           $('#projectView tbody input[type="checkbox"]:not(:checked)').trigger('click');
        } else {
           $('#projectView tbody input[type="checkbox"]:checked').trigger('click');
        }
  
        // Prevent click event from propagating to parent
        e.stopPropagation();
     });
    //  this.exporttostaging(self.rawdatacapture)
  }

  updateDataTableSelectAllCtrl(table){
    var $table             = table.table().node();
    var $chkbox_all        = $('tbody input[type="checkbox"]', $table);
    var $chkbox_checked    = $('tbody input[type="checkbox"]:checked', $table);
    var chkbox_select_all  = $('thead input[name="select_all"]', $table).get(0);
 
    // If none of the checkboxes are checked
    if($chkbox_checked.length === 0){
       chkbox_select_all.checked = false;
       if('indeterminate' in chkbox_select_all){
          chkbox_select_all.indeterminate = false;
       }
 
    // If all of the checkboxes are checked
    } else if ($chkbox_checked.length === $chkbox_all.length){
       chkbox_select_all.checked = true;
       if('indeterminate' in chkbox_select_all){
          chkbox_select_all.indeterminate = false;
       }
 
    // If some of the checkboxes are checked
    } else {
       chkbox_select_all.checked = true;
       if('indeterminate' in chkbox_select_all){
          chkbox_select_all.indeterminate = true;
       }
    }
 }

exporttostaging(id,datacapture){
  
  let t1=[];
  for(let i=0;i<id.length;i++){
    let filterid: any =datacapture.filter( u => u.Detectionid == id[i] && u.Status == 1);
      t1.push(filterid); 
    }
    if(t1.length>0){
      for(let i=0;i<t1.length;i++){
        if(t1[i][0]['Cecpresent']==='Yes'){
          t1[i][0]['Cecpresent']=1
        }
        if(t1[i][0]['Cecpresent']==='No'){
          t1[i][0]['Cecpresent']=0
        }
        if(t1[i][0]['Cecenabled']==='Yes'){
          t1[i][0]['Cecenabled']=1
        }
        if(t1[i][0]['Cecenabled']==='No'){
          t1[i][0]['Cecenabled']=0
        }
        let dataType=2;
        let  Device= t1[i][0]['Device'], Subdevice= t1[i][0]['Subdevice'], Brand= t1[i][0]['Brand'], Model= t1[i][0]['Model']; 
        let Regioncountry= t1[i][0]['Supportedregions'], Year= t1[i][0]['Year'], cecpresent= t1[i][0]['Cecpresent'];
        let cecenabled= t1[i][0]['Cecenabled'], vendoridhex= t1[i][0]['Vendoridhex'], vendoridstring= t1[i][0]['Vendoridstring'];
        let osdhex= t1[i][0]['Osdhex'], osdstring= t1[i][0]['Osdstring'], ediddata= t1[i][0]['Edid'];
        let statusflag= t1[i][0]['Status'], recordid= t1[i][0]['Detectionid'];let uid=null;
  this.mainService.MigrateRawToStaging(dataType, null, Device, Subdevice, Brand, Model, Regioncountry, Year, cecpresent, cecenabled, vendoridhex, vendoridstring, osdhex, osdstring, ediddata, uid, statusflag, null)
  .subscribe(value => {
  });
  // console.log(stag)
}
}
else{
  this.toastr.warning('', 'Select valid records');
}

console.log(t1)

  // .subscribe(value => {
  //   let arr=[]; let arr1=[]; let arr3=[];let arr2=[];let Remarks=[];let model=[];
  //   let Region=[];
  //       if (value.data.length > 0) {

  //         //convert  string to Object
  //         for (let i = 0, ien = value.data.length; i < ien; i++) {
  //           arr.push(JSON.parse(value.data[i]['sourceDataCapture']));
  //         }
          
  //         for (let i = 0, ien = value.data.length; i < ien; i++) {
  //           arr1.push({Detectionid:value.data[i]['detectionId'],Status:value.data[i]['statusFlag']});
  //         }
  //         for(let i=0;i<arr.length;i++){
  //         Remarks.push(arr[i]['Remarks']);
  //         }
          
  //         arr.forEach(element => {
  //           let RegionCountry = "";
  //           element.Supportedregions.forEach(element1 => {
  //             let Countries = element1.Countries;
  //             Countries.forEach(element3 => {
  //               RegionCountry+=element1.Region+" : ";
  //               //console.log(Countries)
  //               RegionCountry+=element3.Country+" : "
  //               element3.Models.forEach(element4 => {
  //                 RegionCountry+=element4+","
  //               });
  //               RegionCountry=RegionCountry.slice(0,-1)
  //             RegionCountry+=" ; "
  //             });
  //             RegionCountry=RegionCountry.slice(0,-1)
  //             // RegionCountry+=";"
  //           });
  //           RegionCountry=RegionCountry.slice(0,-1)
            
  //           Region.push(RegionCountry)

  //           // console.log(RegionCountry);
  //         });
          
        
  //         for(let i=0;i<arr1.length;i++){
  //           if(arr[i]['Cecpresent']==='1'){
  //             arr[i]['Cecpresent']='Yes'
  //           }
  //           if(arr[i]['Cecpresent']==='0'){
  //             arr[i]['Cecpresent']='No'
  //           }
  //           if(arr[i]['Cecenabled']==='1'){
  //             arr[i]['Cecenabled']='Yes'
  //           }
  //           if(arr[i]['Cecenabled']==='0'){
  //             arr[i]['Cecenabled']='No'
  //           }
  //           arr2.push({Detectionid:arr1[i]['Detectionid'],Device:arr[i]['Device'],Subdevice:arr[i]['Subdevice'],Brand:arr[i]['Brand'],Targetmodel:arr[i]['Targetmodel'],TargetRegion:arr[i]['TargetRegion'],TargetCountry:arr[i]['TargetCountry'],
  //                 Year: arr[i]['Year'],Remotemodel: arr[i]['Remotemodel'],Regionofcapture: arr[i]['Regionofcapture'],Countryofcapture: arr[i]['Countryofcapture'],
  //             CECDevice: arr[i]['CECDevice'],Cecpresent: arr[i]['Cecpresent'],Cecenabled: arr[i]['Cecenabled'],Vendoridhex: arr[i]['Vendoridhex'],Vendoridstring: arr[i]['Vendoridstring'],Osdstring: arr[i]['Osdstring'],Osdhex: arr[i]['Osdhex'],Edid: arr[i]['Edid'],
  //                 Sourcename: arr[i]['Sourcename'],Sourcetype: arr[i]['Sourcetype'],
  //                 Supportedregions:Region[i],
  //                 Remarks:Remarks[i]['MetaData']+","+Remarks[i]['CEC']+"," +Remarks[i]['EDID']+","+Remarks[i]['Scan Device'],
  //                 Status:arr1[i]['Status']});
  //               }
  //               console.log(arr2)
  //     }
  //     this.rawdatacapture=arr2;
  //     this.dtTrigger.next();
      
  // });
}
}
