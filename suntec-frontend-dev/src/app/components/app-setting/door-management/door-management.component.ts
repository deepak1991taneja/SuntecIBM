import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DoorDetail } from 'src/app/shared/model/door-model/door-detail.model';
import { FloorDetail } from 'src/app/shared/model/floor-model/floor-detail.model';
import { DoorServiceService } from 'src/app/shared/services/door-service/door-service.service';
import { FloorServiceService } from 'src/app/shared/services/floor-service/floor-service.service';
import { TableUtil } from '../building-management/table-util';

@Component({
  selector: 'app-door-management',
  templateUrl: './door-management.component.html',
  styleUrls: ['./door-management.component.scss']
})
export class DoorManagementComponent implements OnInit {
  doorData : DoorDetail[] = [];
  floorData : FloorDetail[] = [];
  doorDetail?:any;
  dataSource!: MatTableDataSource<DoorDetail>;
  errorMessage!: string;
  testFileName = 'SampleFile';
  exporter:any;

  displayedColumns: string[] = ['id', 'doorName','range', 'floorName', 'companyName', 'endPointName', 'Action'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
 
  constructor(public dialog: MatDialog, private doorService: DoorServiceService, private floorService: FloorServiceService) {
    this.dataSource = new MatTableDataSource<DoorDetail>();
   }

  ngOnInit(): void {
     this.doorService.getDoorData().subscribe(data => {
       this.doorData = data;
       this.dataSource.data = this.doorData;
      })

      this.floorService.getFloorData().subscribe(data => {
        this.floorData = data;
      })

   //this.dataSource.data = this.floorData;
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
  const onlyNameAndSymbolArr: Partial<DoorDetail>[] = this.dataSource.data.map(x => ({
    id: x.id,
    doorName: x.doorName,
    floorName: x.floorName,
    range:x.range,
    companyName: x.companyName,
    endpointName:x.endPointName

  }));
  TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, "ExampleArray");
}

  openDialog(action:String,obj:any) {
    console.log("Operation Clicked" + action);
    obj.action = action;
    obj.floorData = this.floorData;
    console.log("add bulding clicked" + obj.action);
    const dialogRef = this.dialog.open(DoorDialogComponent, {
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
    });
  }

addRowData(row_obj:DoorDetail){
console.log("data received :: " + row_obj.id + "  name " + row_obj.floorName.floorName)
  this.doorService.addUpdateDoor(row_obj).subscribe(data => {
    if(data !== null) {
      this.doorDetail = data;
      this.dataSource.data.push({
        id:this.doorDetail.id,
        doorName: this.doorDetail.doorName,
        floorName:this.doorDetail.floorName,
        range: this.doorDetail.range,
        companyName:this.doorDetail.companyName,
        endPointName:this.doorDetail.endPointName,
        createdDate:this.doorDetail.createdDate,
        updateDate: this.doorDetail.updateDate
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


updateRowData(row_obj:DoorDetail){

  this.doorService.addUpdateDoor(row_obj).subscribe(data => {
    if(data !== null) {
      this.doorDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.doorDetail.id){
          value.doorName= this.doorDetail.doorName,
          value.floorName=this.doorDetail.floorName,
          value.range= this.doorDetail.range,
          value.companyName=this.doorDetail.companyName,
          value.endPointName=this.doorDetail.endPointName
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
deleteRowData(row_obj:DoorDetail){

  this.doorService.deleteDoor(row_obj).subscribe(data => {
    if(data !== null) {
      this.doorDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.doorDetail.id){
          value.doorName= this.doorDetail.doorName,
          value.floorName=this.doorDetail.floorName,
          value.range= this.doorDetail.range,
          value.companyName=this.doorDetail.companyName,
          value.endPointName=this.doorDetail.endPointName
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
  selector: 'door-dialog-component',
  templateUrl: './door-dialog.component.html',
})
export class DoorDialogComponent {
  action?:string;
  local_data:any;
  constructor(
    public dialogRef: MatDialogRef<DoorDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DoorDetail) {
      console.log("data inside dialog :: " + data.floorName);
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