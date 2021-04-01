import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailNotificationDetail } from 'src/app/shared/model/email-notification-model/email-notification-detail.model';
import { SmtpDetail } from 'src/app/shared/model/smtp-setting-model/smtp-detail.model';
import { SettingServiceService } from 'src/app/shared/services/setting-service/setting-service.service';
let API_URL = "http://localhost:8084";

@Component({
  selector: 'app-email-notification-setting',
  templateUrl: './email-notification-setting.component.html',
  styleUrls: ['./email-notification-setting.component.scss']
})
export class EmailNotificationSettingComponent implements OnInit {

  emailNotificationData!:EmailNotificationDetail;
  errorMessage!: string;
  emailNotificationDetail?:any;
 constructor(private settingService: SettingServiceService, private _snackBar: MatSnackBar) {
   this.emailNotificationData = new EmailNotificationDetail;
 
  }

 ngOnInit(): void {
   this.settingService.getEmailNotificationData().subscribe(data => {
     if(data !== null) {
     this.emailNotificationData = data;
     }else{
       this.emailNotificationData;
     }
   })

 
 }

 SaveEmailNotificationData(){
  this.settingService.updateEmailNotificationData(this.emailNotificationData).subscribe(data => {
    if(data !== null) {
      this.emailNotificationDetail= data;
      this.emailNotificationData.id = this.emailNotificationDetail.id;
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

ResetEmailNotificationData(){
  this.settingService.ResetEmailNotificationData().subscribe(data => {
    if(data !== null) {
      this.emailNotificationDetail= data;
      //this.rangeData.id = this.rangeDetail.id;
      this.emailNotificationData = this.emailNotificationDetail;
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
