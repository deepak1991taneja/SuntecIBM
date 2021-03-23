import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as Flatted from 'flatted';
import { Users } from 'src/app/shared/model/users';
import { UsersLoginService } from 'src/app/shared/services/users-login.service';
import { TableUtil } from '../../app-setting/table-utils';

@Component({
  selector: 'app-tanent-dashboard',
  templateUrl: './tanent-dashboard.component.html',
  styleUrls: ['./tanent-dashboard.component.scss']
})
export class TanentDashboardComponent implements OnInit {
  users : Users[] = [];
  userDetail?:any;
  dataSource!: MatTableDataSource<Users>;
  errorMessage!: string;
  testFileName = 'SampleFile';
  exporter:any;
  userData?: Users;

  constructor(private userLoginService: UsersLoginService, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<Users>();
   }

  ngOnInit() {
    this.userLoginService.getAllUsers().subscribe(data => {
      this.users = data;
      this.dataSource.data = this.users;
      })
     
     
  
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
      width: '500px',
      minHeight:'400px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("event Clicked Close popup" + result.data)
      if(result.event == 'Add'){
        this.addRowData(result.data, result.file);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data, result.file);
      }else if(result.event == 'Delete'){
       // this.deleteRowData(result.data);
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


