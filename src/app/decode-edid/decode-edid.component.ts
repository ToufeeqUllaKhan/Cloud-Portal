import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main-service';
import { ToastrService } from 'ngx-toastr';
import mainscroll from '../model/Scroll';
declare var $: any;

@Component({
  selector: 'app-decode-edid',
  templateUrl: './decode-edid.component.html',
  styleUrls: ['./decode-edid.component.css']
})
export class DecodeEdidComponent implements OnInit {
  EdidData: any;
  keys: any = [];
  Values: any = [];
  DecodeedidDataView: Boolean = false;
  edidError: Boolean = false;

  constructor(private mainService: MainService, private toastr: ToastrService) { }

  ngOnInit(): void {
    mainscroll();
  }

  decodeedid() {
    var edid = this.EdidData;
    let key = [];
    this.mainService.DecodeUrl(edid).then(value => {
      for (let i = 0; i < Object.keys(value).length; i++) {
        key.push(Object.keys(value)[i].charAt(0).toUpperCase() + Object.keys(value)[i].slice(1))
      }
      this.keys = key;
      this.Values = Object.values(value);
      this.viewDecodeEdidData(this.keys, this.Values);
    });
  }
  viewDecodeEdidData(value, value1) {
    this.DecodeedidDataView = true;
    this.keys = value;
    this.Values = value1;
    $('#decode').click();
  }

  validateEdid() {
    if (this.EdidData != undefined || this.EdidData != null) {
      var edid128 = this.EdidData.trim();
      if (edid128 != null && edid128 != '' && edid128 != undefined) {
        let checkEdidData = ((edid128.startsWith('00 FF FF FF FF FF FF 00') || edid128.startsWith('00 ff ff ff ff ff ff 00')) && edid128.length >= 383);
        if (!checkEdidData) {
          this.edidError = true;
        }
        else {
          $('#checkEdidValid').css('border', '1px solid #ced4da');
          this.edidError = false;
          this.decodeedid();
        }
      }
      else {
        this.edidError = true;
      }
    } else {
      this.edidError = true;
    }
  }

  modalClose() {
    this.EdidData = null;
  }
}
