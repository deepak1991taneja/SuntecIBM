import { Component, Inject, OnInit,Optional,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountDetail } from 'src/app/shared/model/account-model/account-detail.model';
import { AccountServiceService } from 'src/app/shared/services/account-service/account-service.service';
import { TableUtil } from '../table-utils';
import { DatePipe } from '@angular/common';
import { FrTabletDetail } from 'src/app/shared/model/frTablet-model/fr-tablet-detail.model';
import { FrTabletServiceService } from 'src/app/shared/services/frTablet-service/fr-tablet-service.service';
import { FloorDetail } from 'src/app/shared/model/floor-model/floor-detail.model';
import { FloorServiceService } from 'src/app/shared/services/floor-service/floor-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fr-tablet',
  templateUrl: './fr-tablet.component.html',
  styleUrls: ['./fr-tablet.component.scss']
})
export class FrTabletComponent implements OnInit {

  frTabletData : FrTabletDetail[] = [];
  floorData : FloorDetail[] = [];
  frTabletDetail?:any;
  dataSource!: MatTableDataSource<FrTabletDetail>;
  errorMessage!: string;
  testFileName = 'SampleFile';
  exporter:any;

  displayedColumns: string[] = ['No', 'Floor', 'Name', 'Protocol','IP','Port','Account','Action'];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

    constructor(public dialog: MatDialog, private frTabletService: FrTabletServiceService,private floorService: FloorServiceService,private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<FrTabletDetail>();
   }

   ngOnInit(): void {
    this.frTabletService.getFrTabletData().subscribe(data => {
      this.frTabletData = data;
      this.dataSource.data = this.frTabletData;
     })
     this.floorService.getFloorData().subscribe(data => {
      this.floorData = data;
    })

 }

 ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

setFileName() {
  this.testFileName = 'ExportFrTabletDetail' + '_' +
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
  const onlyNameAndSymbolArr: Partial<FrTabletDetail>[] = this.dataSource.data.map(x => ({
    name: x.name,
    id: x.id,
    protocol:x.protocol,
    floor:x.floorName,
    ip:x.ip,
    port:x.port,
    account:x.account

  }));
  TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, "ExampleArray");
}

openDialog(action:String,obj:any){
  console.log("Operation Clicked" + action);
  obj.action = action;
  obj.floorData = this.floorData;
  console.log("add bulding clicked" + obj.action);
  const dialogRef = this.dialog.open(FrTabletDialogComponent, {
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

addRowData(row_obj:FrTabletDetail){
  console.log("data received :: " + row_obj.id)
    this.frTabletService.addUpdateFrTablet(row_obj).subscribe(data => {
      if(data !== null) {
        this.frTabletDetail = data;
        this.dataSource.data.push({
          id:this.frTabletDetail.id,
          name:this.frTabletDetail.name,
          protocol:this.frTabletDetail.protocol,
          floorName:this.frTabletDetail.floorName,
          ip: this.frTabletDetail.ip,
          port: this.frTabletDetail.port,
          account: this.frTabletDetail.account,
          createdDate:this.frTabletDetail.createdDate,
          updateDate: this.frTabletDetail.updateDate
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
  
  
  updateRowData(row_obj:FrTabletDetail){
  
    this.frTabletService.addUpdateFrTablet(row_obj).subscribe(data => {
      if(data !== null) {
        this.frTabletDetail = data;
        this.dataSource.data = this.dataSource.data.filter((value,key)=>{
          if(value.id == this.frTabletDetail.id){
            value.name = this.frTabletDetail.name,
            value.protocol = this.frTabletDetail.protocol,
            value.floorName = this.frTabletDetail.floorName,
            value.ip = this.frTabletDetail.ip,
            value.port = this.frTabletDetail.port,
            value.account = this.frTabletDetail.account
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
  deleteRowData(row_obj:FrTabletDetail){
  
    this.frTabletService.deleteFrTablet(row_obj).subscribe(data => {
      if(data !== null) {
        this.frTabletDetail = data;
        this.dataSource.data = this.dataSource.data.filter((value,key)=>{
          if(value.id == this.frTabletDetail.id){
            value.name = this.frTabletDetail.name,
            value.protocol = this.frTabletDetail.protocol,
            value.floorName = this.frTabletDetail.floorName,
            value.ip = this.frTabletDetail.ip,
            value.port = this.frTabletDetail.port,
            value.account = this.frTabletDetail.account
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
  selector: 'frTablet-dialog-component',
  templateUrl: './frTablet-dialog.component.html',
})
export class FrTabletDialogComponent {

  action?:string;
  local_data:any;
  constructor(
    public dialogRef: MatDialogRef<FrTabletDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: FrTabletDetail) {
      console.log("data inside dialog :: " + data.name);
  this.local_data = {...data};

  this.action = this.local_data.action;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  doAction(){
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
