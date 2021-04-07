import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BuildingDetail } from 'src/app/shared/model/building-model/building-detail';
import { FloorDetail } from 'src/app/shared/model/floor-model/floor-detail.model';
import { BuildingServiceService } from 'src/app/shared/services/building-service/building-service.service';
import { FloorServiceService } from 'src/app/shared/services/floor-service/floor-service.service';
import { TableUtil } from '../table-utils';

@Component({
  selector: 'app-floor-management',
  templateUrl: './floor-management.component.html',
  styleUrls: ['./floor-management.component.scss']
})
export class FloorManagementComponent implements OnInit {


  floorData : FloorDetail[] = [];
  buildingData : BuildingDetail[] = [];
  floorDetail?:any;
  dataSource!: MatTableDataSource<FloorDetail>;
  errorMessage!: string;
  testFileName = 'SampleFile';
  exporter:any;

  displayedColumns: string[] = ['id', 'buildingName', 'floorName', 'floor', 'Action'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  formGroup!: FormGroup;
  readonly formControl!: AbstractControl;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
 
  constructor(public dialog: MatDialog, private floorService: FloorServiceService, private buildingService: BuildingServiceService, private _snackBar: MatSnackBar,formBuilder: FormBuilder) {
    this.dataSource = new MatTableDataSource<FloorDetail>();
    this.dataSource.filterPredicate = ((data, filter) => {
      const a = !filter.id || data.id === filter.id;
      const b = !filter.buildingName || data.buildingName.name.toLowerCase().includes(filter.buildingName);
      const c = !filter.floorName || data.floorName.toLowerCase().includes(filter.floorName);
      const d = !filter.floor || data.floor.toLowerCase().includes(filter.floor);
      
      return a && b && c && d ;
    }) as (floorData: any , string: any) => boolean;

    this.formGroup = formBuilder.group({
      buildingName: '',
      id: '',
      floorName: '',
      floor: '',
    })
    this.formGroup.valueChanges.subscribe(value => {
      const filter = {...value, buildingName: value.buildingName.trim().toLowerCase(),
        floorName: value.floorName.trim().toLowerCase(),floor: value.floor.trim().toLowerCase()} as string;
      this.dataSource.filter = filter;
    });
   }

  ngOnInit(): void {
     this.floorService.getFloorData().subscribe(data => {
       this.floorData = data;
       this.dataSource.data = this.floorData;
      })

      this.buildingService.getBuildingData().subscribe(data => {
        this.buildingData = data;
      })

   //this.dataSource.data = this.floorData;
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
  const onlyNameAndSymbolArr: Partial<FloorDetail>[] = this.dataSource.data.map(x => ({
    buildingName: x.buildingName,
    id: x.id,
    floorName: x.floorName,
    floor:x.floor

  }));
  TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, "ExampleArray");
}

  openDialog(action:String,obj:any) {
    console.log("Operation Clicked" + action);
    obj.action = action;
    obj.buildName = this.buildingData;
    console.log("add bulding clicked" + obj.action);
    const dialogRef = this.dialog.open(FloorDialogComponent, {
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



addRowData(row_obj:FloorDetail){
console.log("data received :: " + row_obj.id + "  name " + row_obj.buildingName.name)
  this.floorService.addUpdateFloor(row_obj).subscribe(data => {
    if(data !== null) {
      this.floorDetail = data;
      this.dataSource.data.unshift({
        id:this.floorDetail.id,
        buildingName:this.floorDetail.buildingName,
        floorName:this.floorDetail.floorName,
        floor: this.floorDetail.floor,
        createdDate:this.floorDetail.createdDate,
        updateDate: this.floorDetail.updateDate
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


updateRowData(row_obj:FloorDetail){

  this.floorService.addUpdateFloor(row_obj).subscribe(data => {
    if(data !== null) {
      this.floorDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.floorDetail.id){
          value.buildingName = this.floorDetail.buildingName,
          value.floorName = this.floorDetail.floorName,
          value.floor = this.floorDetail.floor
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
deleteRowData(row_obj:FloorDetail){

  this.floorService.deleteFloor(row_obj).subscribe(data => {
    if(data !== null) {
      this.floorDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.floorDetail.id){
          value.buildingName = this.floorDetail.buildingName,
          value.floorName = this.floorDetail.floorName,
          value.floor = this.floorDetail.floor
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
  selector: 'floor-dialog-component',
  templateUrl: './floor-dialog.component.html',
})
export class FloorDialogComponent {
  action?:string;
  local_data:any;
  constructor(
    public dialogRef: MatDialogRef<FloorDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: FloorDetail,private _snackBar: MatSnackBar) {
      console.log("data inside dialog :: " + data.buildingName);
  this.local_data = {...data};

  this.action = this.local_data.action;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  doAction(){
    if(this.validate(this.local_data.buildName)){
      this._snackBar.open("Please select building name !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.local_data.floorName) ){
      this._snackBar.open("Please enter floor name !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.local_data.floor) ){
      this._snackBar.open("Please enter floor !!", "Close", {
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
