import { DatePipe } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, Inject, OnInit,Optional,ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { BuildingDetail } from 'src/app/shared/model/building-model/building-detail';
import { BuildingServiceService } from 'src/app/shared/services/building-service/building-service.service';
import { TableUtil } from './table-util';

@Component({
  selector: 'app-building-management',
  templateUrl: './building-management.component.html',
  styleUrls: ['./building-management.component.scss']
})
export class BuildingManagementComponent implements OnInit {

  buildingData : BuildingDetail[] = [];
  buildingDetail?:any;
  dataSource!: MatTableDataSource<BuildingDetail>;
  errorMessage!: string;
  testFileName = 'SampleFile';
  exporter:any;

  displayedColumns: string[] = ['Id', 'Name', 'Action'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
 
  constructor(public dialog: MatDialog, private buildingService: BuildingServiceService, private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<BuildingDetail>();
   }

  ngOnInit(): void {
     this.buildingService.getBuildingData().subscribe(data => {
       this.buildingData = data;
       this.dataSource.data = this.buildingData;
      })
   // this.dataSource.data = this.buildingData;
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
  const onlyNameAndSymbolArr: Partial<BuildingDetail>[] = this.dataSource.data.map(x => ({
    name: x.name,
    id: x.id
  }));
  TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, "ExampleArray");
}

  openDialog(action:String,obj:any) {
    console.log("Operation Clicked" + action);
    obj.action = action;
    console.log("add bulding clicked" + obj.action);
    const dialogRef = this.dialog.open(BuildingDialogComponent, {
      width: '350px',
      minHeight:'200px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("event Clicked Close popup" + result.event)
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



addRowData(row_obj:BuildingDetail){
console.log("data received :: " + row_obj.id + "  name " + row_obj.name)
  this.buildingService.addUpdateBuilding(row_obj).subscribe(data => {
    if(data !== null) {
      this.buildingDetail = data;
      this.dataSource.data.push({
        id:this.buildingDetail.id,
        name:this.buildingDetail.name,
        createdDate:this.buildingDetail.createdDate,
        updateDate: this.buildingDetail.updateDate
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


updateRowData(row_obj:BuildingDetail){

  this.buildingService.addUpdateBuilding(row_obj).subscribe(data => {
    if(data !== null) {
      this.buildingDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.buildingDetail.id){
          value.name = this.buildingDetail.name;
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
deleteRowData(row_obj:BuildingDetail){

  this.buildingService.deleteBuilding(row_obj).subscribe(data => {
    if(data !== null) {
      this.buildingDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.buildingDetail.id){
          value.name = this.buildingDetail.name;
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
    selector: 'building-dialog-component',
    templateUrl: './building-dialog.component.html',
  })
  export class BuildingDialogComponent {
    action?:string;
    local_data:any;
    constructor(
      public dialogRef: MatDialogRef<BuildingDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: BuildingDetail) {
        console.log(data);
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