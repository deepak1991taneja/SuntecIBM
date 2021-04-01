import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { Users } from 'src/app/shared/model/users';
import { UsersLoginService } from 'src/app/shared/services/users-login.service';
import { TableUtil } from '../../app-setting/table-utils';

@Component({
  selector: 'app-tanent-dashboard',
  templateUrl: './tanent-dashboard.component.html',
  styleUrls: ['./tanent-dashboard.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class TanentDashboardComponent implements OnInit {
  users : Users[] = [];
  usersImport : Users[] = [];
  userDetail?:any;
  dataSource!: MatTableDataSource<Users>;
  errorMessage!: string;
  testFileName = 'SampleFile';
  exporter:any;
  userData?: Users;
  name?:File;
  fileName:any;
  private sanitizer: DomSanitizer;
  progress = 0;
  currentFileUpload?: File;
  selectedFiles?: FileList;
  loaded = 0;
  message = '';
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private userLoginService: UsersLoginService, public dialog: MatDialog, private _snackBar: MatSnackBar, public _DomSanitizer: DomSanitizer) {
    this.dataSource = new MatTableDataSource<Users>();
    this.sanitizer = _DomSanitizer;
  
   }

  ngOnInit() {
    this.userLoginService.getAllUsers().subscribe(data => {
      this.users = data;
      this.dataSource.data = this.users;
      })
     
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required]
      });
  
}
  displayedColumns: string[] = ['id','file', 'name', 'email', 'door', 'phone', 'jobPosition', 'jobLocation', 'company', 'action' ];
  //dataSource = new MatTableDataSource(this.users);

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  setFileName() {
    this.testFileName = 'ExportResult' + '_' +
      new DatePipe('en-US').transform(Date.now(), 'dd_MM_yyyy_hh_mm_ss');
  }

  
exportTable() {
  TableUtil.exportTableToExcel("ExampleMaterialTable");
}

exportTable2(): void {
  this.exporter.exportTable('csv', {
    filename: `test-${new Date().toISOString()}`,
    Props: { 
      Author: 'myName'
    }
  })
}
exportArray() {
  const onlyNameAndSymbolArr: Partial<Users>[] = this.dataSource.data.map(x => ({
    id: x.id,
    name:x.name, 
    email: x.email,  
    password:x.password,  
    jobLocation:x.jobLocation, 
    door: x.door,  
    phone:x.phone,
    jobPosition:x.jobPosition,  
    company: x.company,
    unit:x.unit,
    nric:x.nric,  
    activationDate:x.activationDate,  
    expirationDate:x.expirationDate,
    remarks:x.remarks,
    validateTC:x.validateTC,
    validateQRCode:x.validateQRCode
  }));
  TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, "ExampleArray");
}

  openDialog(action:String,obj:any) {
    console.log("Operation Clicked" + action);
    obj.action = action;
    obj.users = this.users;
    obj.file = File;
    const dialogRef = this.dialog.open(DashboardDialogComponent, {
      minWidth: '200px',
      minHeight:'200px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("event Clicked Close popup" + result.data)
      if(result.event == 'Add'){
        this.addRowData(result.data, result.file);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data, result.file);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }

      this._snackBar.open("sucessfully "+ result.event + " !!", "Thanks", {
        duration: 1000,
      });
    });
  }

addRowData(row_obj:Users, file:File){
  let formData:FormData = new FormData();
  formData.append('uploadFile', file, file.name);
  formData.append('info',new Blob([JSON.stringify(row_obj)],
  {
      type: "application/json"
  }));

  this.userLoginService.registerPerson(formData).subscribe(data => {
    if(data !== null) {
      this.userDetail = data;
      this.dataSource.data.push({
        id:this.userDetail.id,
        name:this.userDetail.name,
        email: this.userDetail.email,
        jobLocation:this.userDetail.jobLocation, 
        door: this.userDetail.door,
        phone:this.userDetail.phone,
        jobPosition:this.userDetail.jobPosition,  
        company: this.userDetail.company,  
        unit:this.userDetail.unit,
        nric:this.userDetail.nric,  
        activationDate: this.userDetail.activationDate,  
        expirationDate:this.userDetail.expirationDate,
        remarks:this.userDetail.remarks, 
        validateTC:this.userDetail.validateTC,
        validateQRCode:this.userDetail.validateQRCode,
        file:this.userDetail.file,
        password:this.userDetail.password
      });
      this.dataSource.filter="";
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

updateRowData(row_obj:Users, file:File){
  this.addUpdatedData(row_obj);
  let formData:FormData = new FormData();
 formData.append('uploadFile', file, file.name);
 formData.append('info',new Blob([JSON.stringify(this.userData)],
  {
      type: "application/json"
  }));
  this.userLoginService.registerPerson(formData).subscribe(data => {
    if(data !== null) {
      this.userDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.userDetail.id){
          value.name = this.userDetail.name,
          value.email = this.userDetail.email,
          value.jobLocation = this.userDetail.jobLocation, 
          value.door = this.userDetail.door,
          value.phone = this.userDetail.phone,
          value.jobPosition = this.userDetail.jobPosition,  
          value.company = this.userDetail.company,  
          value.unit = this.userDetail.unit,
          value.nric = this.userDetail.nric,  
          value.activationDate = this.userDetail.activationDate,  
          value.expirationDate = this.userDetail.expirationDate,
          value.remarks = this.userDetail.remarks, 
          value.validateTC = this.userDetail.validateTC,
          value.validateQRCode = this.userDetail.validateQRCode,
          value.file = this.userDetail.file,
          value.password = this.userDetail.password
        }
        return true;
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
deleteRowData(row_obj:Users){

  this.userLoginService.deleteUser(row_obj).subscribe(data => {
    if(data !== null) {
      this.userDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.userDetail.id){
          value.name = this.userDetail.name,
          value.email = this.userDetail.email,
          value.jobLocation = this.userDetail.jobLocation, 
          value.door = this.userDetail.door,
          value.phone = this.userDetail.phone,
          value.jobPosition = this.userDetail.jobPosition,  
          value.company = this.userDetail.company,  
          value.unit = this.userDetail.unit,
          value.nric = this.userDetail.nric,  
          value.activationDate = this.userDetail.activationDate,  
          value.expirationDate = this.userDetail.expirationDate,
          value.remarks = this.userDetail.remarks, 
          value.validateTC = this.userDetail.validateTC,
          value.validateQRCode = this.userDetail.validateQRCode,
          value.file = this.userDetail.file,
          value.password = this.userDetail.password
        }
        return true;
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

  this.dataSource.data = this.dataSource.data.filter((value,key)=>{
    return value.id != row_obj.id;
  });
}

 addUpdatedData(row_obj: Users) {
  this.userData = new Users();
  this.userData.id = row_obj.id;
  this.userData.name = row_obj.name;
  this.userData.email=  row_obj.email,
  this.userData.jobLocation = row_obj.jobLocation, 
  this.userData.door = row_obj.door,
  this.userData.phone = row_obj.phone,
  this.userData.jobPosition = row_obj.jobPosition,  
  this.userData.company =  row_obj.company,  
  this.userData.unit = row_obj.unit,
  this.userData.nric = row_obj.nric,  
  this.userData.activationDate = row_obj.activationDate,  
  this.userData.expirationDate = row_obj.expirationDate,
  this.userData.remarks = row_obj.remarks, 
  this.userData.validateTC = row_obj.validateTC,
  this.userData.validateQRCode = row_obj.validateQRCode,
  this.userData.file = row_obj.file,
  this.userData.password = row_obj.password
}

 // Uploads the file to backend server.
 selectFile(event:any) {
  this.selectedFiles = event.target.files;
}
 upload() {
  const file: File | null = this.selectedFiles!.item(0);
  if(file){
  this.currentFileUpload = file;
  let formData:FormData = new FormData();
  formData.append('uploadFile', this.currentFileUpload, this.currentFileUpload.name);
  this.userLoginService.uploadExcelFile(formData)
  .subscribe(
    (event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.loaded = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log("response received ::: "+ JSON.stringify(event.body));
        this.message = event.body;
        this.usersImport = event.body;
        this.usersImport.forEach(element => {
          this.userDetail = element;
          this.dataSource.data.push({
            id:this.userDetail.id,
            name:this.userDetail.name,
            email: this.userDetail.email,
            jobLocation:this.userDetail.jobLocation, 
            door: this.userDetail.door,
            phone:this.userDetail.phone,
            jobPosition:this.userDetail.jobPosition,  
            company: this.userDetail.company,  
            unit:this.userDetail.unit,
            nric:this.userDetail.nric,  
            activationDate: this.userDetail.activationDate,  
            expirationDate:this.userDetail.expirationDate,
            remarks:this.userDetail.remarks, 
            validateTC:this.userDetail.validateTC,
            validateQRCode:this.userDetail.validateQRCode,
            file:this.userDetail.file,
            password:this.userDetail.password
          });
          this.dataSource.filter="";
        });
        this._snackBar.open("file upload sucessfully !!", "Thanks", {
          duration: 1000,
        });
        setTimeout(() => {
          this.loaded = 0;
        }, 1500);
      }
    },
    (err: any) => {
      console.log(err);
      this.loaded = 0;

      if (err.error && err.error.message) {
        this.message = err.error.message;
      } else {
        this.message = 'Could not upload the file!';
      }

      this.currentFileUpload = undefined;
    });
  }
}

// stepper file upload
selectFileStep1(event:any) {
  
  const file = (event.target as HTMLInputElement).files![0];
  this.firstFormGroup.patchValue({
    firstCtrl: file
  });
  this.firstFormGroup.controls.firstCtrl.setValue(file);
  this.fileName = file.name;
}

selectDirectoryStep2(event:any){
  var tmppath = event.target.files[0].value;
  console.log("stepper 2 called ::: "+ tmppath);
  //const file = (event.target as HTMLInputElement).files![0];
 let file!:FileList;
  if (event.target.files.length > 0){
     file = event.target.files;
}  
  this.secondFormGroup.patchValue({
    secondCtrl: file
  });
  this.secondFormGroup.controls.secondCtrl.setValue(file);
}

uploadStepper(){

  let step1: File|null|undefined  = this.firstFormGroup.get("firstCtrl")?.value;
  let step2:FileList|null|undefined = this.secondFormGroup.get("secondCtrl")?.value;

  if(step1 && step2){
    
    let formData:FormData = new FormData();
    formData.append('uploadFile', step1, step1.name);
    for (let i = 0; i < step2.length; i++) {
      formData.append('images[]', step2[i], step2[i].name);
    }
   
    this.userLoginService.uploadExcelFile(formData)
    .subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.loaded = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          console.log("response received ::: "+ JSON.stringify(event.body));
          this.message = event.body;
          this.usersImport = event.body;
          this.usersImport.forEach(element => {
            this.userDetail = element;
            this.dataSource.data.push({
              id:this.userDetail.id,
              name:this.userDetail.name,
              email: this.userDetail.email,
              jobLocation:this.userDetail.jobLocation, 
              door: this.userDetail.door,
              phone:this.userDetail.phone,
              jobPosition:this.userDetail.jobPosition,  
              company: this.userDetail.company,  
              unit:this.userDetail.unit,
              nric:this.userDetail.nric,  
              activationDate: this.userDetail.activationDate,  
              expirationDate:this.userDetail.expirationDate,
              remarks:this.userDetail.remarks, 
              validateTC:this.userDetail.validateTC,
              validateQRCode:this.userDetail.validateQRCode,
              file:this.userDetail.file,
              password:this.userDetail.password
            });
            this.dataSource.filter="";
          });
          this._snackBar.open("file upload sucessfully !!", "Thanks", {
            duration: 1000,
          });
          setTimeout(() => {
            this.loaded = 0;
          }, 1500);

          /// empty data
          this.fileName = undefined;
          this.secondFormGroup.patchValue({
            secondCtrl: undefined
          });
          this.secondFormGroup.controls.secondCtrl.setValue(undefined);

          this.firstFormGroup.patchValue({
            firstCtrl: undefined
          });
          this.firstFormGroup.controls.firstCtrl.setValue(undefined);
        }
      },
      (err: any) => {
        console.log(err);
        this.loaded = 0;
  
        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Could not upload the file!';
        }
  
        this.currentFileUpload = undefined;
      });
    
  }else if(!step1){
    this._snackBar.open("please upload excel file !!", "Close", {
      duration: 1000,
    });
  }else if(!step2){
    this._snackBar.open("please select image directory !!", "Close", {
      duration: 1000,
    });
  }


 
 

}


// submitUser() {

//   var formData: any = new FormData();
//   formData.append("uploadFile", this.form.value.avatar);
//   this.userLoginService.uploadExcelFile(
//     formData
//   ).subscribe((event : any) => {
//     switch (event.type) {
//       case HttpEventType.Sent:
//         console.log('Request has been made!');
//         break;
//       case HttpEventType.ResponseHeader:
//         console.log('Response header has been received!');
//         break;
//       case HttpEventType.UploadProgress:
//         this.progress = Math.round(event.loaded / event.total * 100);
//         console.log(`Uploaded! ${this.progress}%`);
//         break;
//       case HttpEventType.Response:
//         console.log('User successfully created!', event.body);
//         setTimeout(() => {
//           this.progress = 0;
//         }, 1500);

//     }
//   })
// }

}

@Component({
  selector: 'dashboard-dialog-component',
  templateUrl: './dashboard-dialog.component.html',
})
export class DashboardDialogComponent {
  action?:string;
  local_data:any;
  file?:File;
  constructor(
    public dialogRef: MatDialogRef<DashboardDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Users) {
  this.local_data = {...data};

  this.action = this.local_data.action;
  this.file = this.local_data.file;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data, file:this.file});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  uploadFile(event:any) {
   
    const file = (event.target as HTMLInputElement).files![0];
    console.log("upload event called :: " + file.text);
    this.file=file;
  
  }

}


