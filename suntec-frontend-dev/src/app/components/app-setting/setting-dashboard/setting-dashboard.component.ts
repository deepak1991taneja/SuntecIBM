import { Component, Inject, OnInit,Optional,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountDetail } from 'src/app/shared/model/account-model/account-detail.model';
import { AccountServiceService } from 'src/app/shared/services/account-service/account-service.service';
import { TableUtil } from '../table-utils';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { validateBasis } from '@angular/flex-layout';


@Component({
  selector: 'app-setting-dashboard',
  templateUrl: './setting-dashboard.component.html',
  styleUrls: ['./setting-dashboard.component.scss']
})
export class SettingDashboardComponent implements OnInit {
  // filterValues : any=[];
  accountData : AccountDetail[] = [];
  accountDetail?:any;
  dataSource!: MatTableDataSource<AccountDetail>;
  errorMessage!: string;
  testFileName = 'SampleFile';
  formGroup!: FormGroup;
  exporter:any;
  displayedColumns: string[] = ['Position', 'Name', 'Roles', 'Floor','Company','Email','Action'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  
  readonly formControl!: AbstractControl;
  // filterSelectObj : any[] = [];
  constructor(public dialog: MatDialog, private accountService: AccountServiceService,private _snackBar: MatSnackBar,formBuilder: FormBuilder) {
    this.dataSource = new MatTableDataSource<AccountDetail>();

    this.dataSource.filterPredicate = ((data, filter) => {
      const a = !filter.position || data.position === filter.position;
      const b = !filter.name || data.name.toLowerCase().includes(filter.name);
      const c = !filter.roles || data.roles.toLowerCase().includes(filter.roles);
      const d = !filter.floor || data.floor.toLowerCase().includes(filter.floor);
      const e = !filter.companyName || data.companyName.toLowerCase().includes(filter.companyName);
      const f = !filter.email || data.email.toLowerCase().includes(filter.email);

      return a && b && c && d && e && f;
    }) as (accountData: any, string: any) => boolean;

    this.formGroup = formBuilder.group({
      name: '',
      position: '',
      roles: '',
      floor: '',
      companyName: '',
      email: '',
    })
    this.formGroup.valueChanges.subscribe(value => {
      const filter = {...value, name: value.name.trim().toLowerCase(),roles: value.roles.trim().toLowerCase(),
        floor: value.floor.trim().toLowerCase(),companyName: value.companyName.trim().toLowerCase(),email: value.email.trim().toLowerCase()} as string;
      this.dataSource.filter = filter;
    });
    
   }

   ngOnInit(): void {
    this.accountService.getAccountData().subscribe(data => {
      this.accountData = data;
      this.dataSource.data = this.accountData;
     
     })

 }
 ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}




// applyFilter(event: Event) {
//   const filterValue = (event.target as HTMLInputElement).value;
//   this.dataSource.filter = filterValue.trim().toLowerCase();
//   if (this.dataSource.paginator) {
//     this.dataSource.paginator.firstPage();
//   }
// }


setFileName() {
  this.testFileName = 'ExportAccountDetail' + '_' +
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
  const onlyNameAndSymbolArr: Partial<AccountDetail>[] = this.dataSource.data.map(x => ({
    name: x.name,
    id: x.id,
    roles:x.roles,
    floor:x.floor,
    companyName:x.companyName,
    email:x.email

  }));
  TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, "ExampleArray");
}


  openDialog(action:String,obj:any){
    console.log("Operation Clicked" + action);
    obj.action = action;
    console.log("add bulding clicked" + obj.action);
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '350px',
      minHeight:'200px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("event Clicked Close popup" + result.data)
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
      this._snackBar.open("sucessfully "+ result.event + " !!", "Thanks", {
        duration: 1000,
      });
          });
          
  }

  addRowData(row_obj:AccountDetail){
    console.log("data received :: " + row_obj.id)
      this.accountService.addUpdateAccount(row_obj).subscribe(data => {
        if(data !== null) {
          this.accountDetail = data;
          this.dataSource.data.unshift({
            id:this.accountDetail.id,
            name:this.accountDetail.name,
            roles:this.accountDetail.roles,
            floor: this.accountDetail.floor,
            companyName: this.accountDetail.companyName,
            email: this.accountDetail.email,
            createdDate:this.accountDetail.createdDate,
            updateDate: this.accountDetail.updateDate
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
    
    
    updateRowData(row_obj:AccountDetail){
    
      this.accountService.addUpdateAccount(row_obj).subscribe(data => {
        if(data !== null) {
          this.accountDetail = data;
          this.dataSource.data = this.dataSource.data.filter((value,key)=>{
            if(value.id == this.accountDetail.id){
              value.name = this.accountDetail.name,
              value.roles = this.accountDetail.roles,
              value.floor = this.accountDetail.floor,
              value.companyName = this.accountDetail.companyName,
              value.email = this.accountDetail.email
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
    deleteRowData(row_obj:AccountDetail){
    
      this.accountService.deleteAccount(row_obj).subscribe(data => {
        if(data !== null) {
          this.accountDetail = data;
          this.dataSource.data = this.dataSource.data.filter((value,key)=>{
            if(value.id == this.accountDetail.id){
              value.name = this.accountDetail.name,
              value.roles = this.accountDetail.roles,
              value.floor = this.accountDetail.floor,
              value.companyName = this.accountDetail.companyName,
              value.email = this.accountDetail.email
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
 
}

@Component({
  selector: 'account-dialog-component',
  templateUrl: './account-dialog.component.html',
})
export class AccountDialogComponent {

  action?:string;
  local_data:any;
  constructor(
    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AccountDetail,private _snackBar: MatSnackBar) {
      console.log("data inside dialog :: " + data.name);
  this.local_data = {...data};

  this.action = this.local_data.action;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  doAction(){
    console.log("Action Clicked "+this.action)
   
    let emailPattern='^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    if(this.validate(this.local_data.name)){
      this._snackBar.open("Please enter name !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.local_data.roles) ){
      this._snackBar.open("Please enter roles !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.local_data.floor)){
      this._snackBar.open("Please enter floor !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.local_data.companyName)){
      this._snackBar.open("Please enter company name !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.local_data.email)){
      this._snackBar.open("Please enter email !!", "Close", {
        duration: 2000,
      });
    }else if(!this.local_data.email.match(emailPattern)){
      this._snackBar.open("Please enter vaild email address!!", "Close", {
        duration: 2000,
      });
    }else{
 this.dialogRef.close({event:this.action,data:this.local_data});
    }
   
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
   validate(fieldData: String) {
    if(fieldData == null || fieldData == "")
    return true;
    else
    return false;
  }
}




