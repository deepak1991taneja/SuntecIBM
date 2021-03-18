import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcsDetail } from 'src/app/shared/model/acs-setting-model/acs-detail.model';
import { RangeDetail } from 'src/app/shared/model/range-setting-model/range-detail.model';
import { SettingServiceService } from 'src/app/shared/services/setting-service/setting-service.service';

@Component({
  selector: 'app-acs-server-setting',
  templateUrl: './acs-server-setting.component.html',
  styleUrls: ['./acs-server-setting.component.scss']
})
export class AcsServerSettingComponent implements OnInit {
  rangeData!:RangeDetail;
  acsData!: AcsDetail;
  acsDetail?:any;
  errorMessage!: string;
  rangeDetail?:any;
  constructor(private settingService: SettingServiceService, private _snackBar: MatSnackBar) {
    this.rangeData = new RangeDetail;
    this.acsData = new AcsDetail;
   }

  ngOnInit(): void {
    this.settingService.getRangeData().subscribe(data => {
      if(data !== null) {
      this.rangeData = data;
      }else{
        this.rangeData;
      }
    })

    this.settingService.getACSData().subscribe(data => {
      if(data !== null) {
      this.acsData = data;
      }else{
        this.acsData;
      }
    })

  }

  SaveData(){
    this.settingService.updateCardRange(this.rangeData).subscribe(data => {
      if(data !== null) {
        this.rangeDetail= data;
        this.rangeData.id = this.rangeDetail.id;
        this._snackBar.open("Data saved sucessfully  !!", "Thanks", {
          duration: 1000,
        });
        
      }else {
       console.log("somethings went wrong")
      }
     }, err => {
       if(!err || err.status !== 409) {
         this.errorMessage = "Unexpected error occurred. Error : " + err;
       }else {
         this.errorMessage = "Username is already exist";
       }
     });
  }

  ResetRangeData(){
    this.settingService.ResetCardRange().subscribe(data => {
      if(data !== null) {
        this.rangeDetail= data;
        //this.rangeData.id = this.rangeDetail.id;
        this.rangeData = this.rangeDetail;
        this._snackBar.open("Data reset sucessfully  !!", "Thanks", {
          duration: 1000,
        });
        
      }else {
       console.log("somethings went wrong")
      }
     }, err => {
       if(!err || err.status !== 409) {
         this.errorMessage = "Unexpected error occurred. Error : " + err;
       }else {
         this.errorMessage = "Username is already exist";
       }
     });
  }


  SaveAcsData(){
    this.settingService.updateACSData(this.acsData).subscribe(data => {
      if(data !== null) {
        this.acsDetail= data;
        this.acsData.id = this.acsDetail.id;
        this._snackBar.open("Data saved sucessfully  !!", "Thanks", {
          duration: 1000,
        });
        
      }else {
       console.log("somethings went wrong")
      }
     }, err => {
       if(!err || err.status !== 409) {
         this.errorMessage = "Unexpected error occurred. Error : " + err;
       }else {
         this.errorMessage = "Username is already exist";
       }
     });
  }

  ResetAcsData(){
    this.settingService.ResetACSData().subscribe(data => {
      if(data !== null) {
        this.acsDetail= data;
        //this.rangeData.id = this.rangeDetail.id;
        this.acsData = this.acsDetail;
        this._snackBar.open("Data reset sucessfully  !!", "Thanks", {
          duration: 1000,
        });
        
      }else {
       console.log("somethings went wrong")
      }
     }, err => {
       if(!err || err.status !== 409) {
         this.errorMessage = "Unexpected error occurred. Error : " + err;
       }else {
         this.errorMessage = "Username is already exist";
       }
     });
  }

}
