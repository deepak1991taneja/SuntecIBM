import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SmtpDetail } from 'src/app/shared/model/smtp-setting-model/smtp-detail.model';
import { SettingServiceService } from 'src/app/shared/services/setting-service/setting-service.service';
let API_URL = "http://localhost:8084";

@Component({
  selector: 'app-smtp-setting',
  templateUrl: './smtp-setting.component.html',
  styleUrls: ['./smtp-setting.component.scss']
})
export class SmtpSettingComponent implements OnInit {
   smtpData!:SmtpDetail;
   errorMessage!: string;
   smtpDetail?:any;
  constructor(private settingService: SettingServiceService, private _snackBar: MatSnackBar) {
    this.smtpData = new SmtpDetail;
  
   }

  ngOnInit(): void {
    this.settingService.getSmtpData().subscribe(data => {
      if(data !== null) {
      this.smtpData = data;
      }else{
        this.smtpData;
      }
    })

  
  }

  SaveSmtpData(){
    if(this.validate(this.smtpData.host)){
      this._snackBar.open("Please enter the host !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.smtpData.port) ){
      this._snackBar.open("Please enter the port !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.smtpData.email) ){
      this._snackBar.open("Please enter the email !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.smtpData.password) ){
      this._snackBar.open("Please enter the password !!", "Close", {
        duration: 2000,
      });
    }else{
    this.settingService.updateSmtpData(this.smtpData).subscribe(data => {
      if(data !== null) {
        this.smtpDetail= data;
        this.smtpData.id = this.smtpDetail.id;
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
  }

  ResetSmtpData(){
    this.settingService.ResetSmtpData().subscribe(data => {
      if(data !== null) {
        this.smtpDetail= data;
        //this.rangeData.id = this.rangeDetail.id;
        this.smtpData = this.smtpDetail;
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

  validate(fieldData: String) {
    if(fieldData == null || fieldData == "")
    return true;
    else
    return false;
  }

 
}
