import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyDetail } from 'src/app/shared/model/company-model/company-detail.model';
import { FloorDetail } from 'src/app/shared/model/floor-model/floor-detail.model';
import { CompanyServiceService } from 'src/app/shared/services/company-service/company-service.service';
import { FloorServiceService } from 'src/app/shared/services/floor-service/floor-service.service';
import { SettingSnakbarComponent } from '../setting-snakbar/setting-snakbar.component';
import { TableUtil } from '../table-utils';

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.scss']
})
export class CompanyManagementComponent implements OnInit {

  durationInSeconds = 1;
  companyData : CompanyDetail[] = [];
  floorData : FloorDetail[] = [];
  companyDetail?:any;
  dataSource!: MatTableDataSource<CompanyDetail>;
  errorMessage!: string;
  testFileName = 'SampleFile';
  exporter:any;
  formGroup!: FormGroup;

  displayedColumns: string[] = ['id', 'companyName', 'floor', 'contactPerson', 'unitNumber', 'contactNumber', 'Action'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
 
  constructor(public dialog: MatDialog, private floorService: FloorServiceService, private companyService: CompanyServiceService, private _snackBar: MatSnackBar,formBuilder: FormBuilder) {
    this.dataSource = new MatTableDataSource<CompanyDetail>();
    this.dataSource.filterPredicate = ((data, filter) => {
      const a = !filter.id || data.id === filter.id;
      const b = !filter.companyName || data.companyName.toLowerCase().includes(filter.companyName);
      const c = !filter.floor || data.floor.floor.toLowerCase().includes(filter.floor);
      const d = !filter.contactPerson || data.contactPerson.toLowerCase().includes(filter.contactPerson);
      const e = !filter.unitNumber || data.unitNumber.toLowerCase().includes(filter.unitNumber);
      const f = !filter.contactNumber || data.contactNumber.toLowerCase().includes(filter.contactNumber);
      
     
      return a && b && c && d && e && f;
    }) as (companyData: any, string: any) => boolean;

    this.formGroup = formBuilder.group({
      id:'',
      companyName: '',
      floor: '',
      contactPerson:'',
      unitNumber:'',
      contactNumber:'',
    })
    this.formGroup.valueChanges.subscribe(value => {
      const filter = {...value, companyName: value.companyName.trim().toLowerCase(),floor: value.floor.trim().toLowerCase(),
        contactPerson: value.contactPerson.trim().toLowerCase(),unitNumber: value.unitNumber.trim().toLowerCase(),
        contactNumber: value.contactNumber.trim().toLowerCase()} as string;
      this.dataSource.filter = filter;
    });
   }

  ngOnInit(): void {
     this.companyService.getCompanyData().subscribe(data => {
       this.companyData = data;
       this.dataSource.data = this.companyData;
      })

    //this.dataSource.data = this.companyDetail;

      this.floorService.getFloorData().subscribe(data => {
        this.floorData = data;
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
  const onlyNameAndSymbolArr: Partial<CompanyDetail>[] = this.dataSource.data.map(x => ({
    id: x.id,
    companyName: x.companyName,
    floor: x.floor,
    contactPerson:x.contactPerson,
    unitNumber:x.unitNumber,
    contactNumber:x.contactNumber

  }));
  TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, "ExampleArray");
}

  openDialog(action:String,obj:any) {
    console.log("Operation Clicked" + action);
    obj.action = action;
    obj.floorName = this.floorData;
    console.log("add bulding clicked" + obj.action);
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
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
      
        // this._snackBar.openFromComponent(SettingSnakbarComponent, {
        //   duration: this.durationInSeconds * 1000,
        //   data:result.event
        // });

    });
  }



addRowData(row_obj:CompanyDetail){
console.log("data received :: " + row_obj.id + "  name " + row_obj.companyName)
  this.companyService.addUpdateCompany(row_obj).subscribe(data => {
    if(data !== null) {
      this.companyDetail = data;
      this.dataSource.data.unshift({
        id:this.companyDetail.id,
        companyName:this.companyDetail.companyName,
        floor:this.companyDetail.floor,
        contactPerson: this.companyDetail.contactPerson,
        unitNumber: this.companyDetail.unitNumber,
        contactNumber: this.companyDetail.contactNumber,
        createdDate:this.companyDetail.createdDate,
        updateDate: this.companyDetail.updateDate
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


updateRowData(row_obj:CompanyDetail){

  this.companyService.addUpdateCompany(row_obj).subscribe(data => {
    if(data !== null) {
      this.companyDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.companyDetail.id){
          value.companyName =this.companyDetail.companyName,
          value.floor = this.companyDetail.floor,
          value.contactPerson = this.companyDetail.contactPerson,
          value.unitNumber = this.companyDetail.unitNumber,
          value.contactNumber = this.companyDetail.contactNumber
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
deleteRowData(row_obj:CompanyDetail){

  this.companyService.deleteCompany(row_obj).subscribe(data => {
    if(data !== null) {
      this.companyDetail = data;
      this.dataSource.data = this.dataSource.data.filter((value,key)=>{
        if(value.id == this.companyDetail.id){
          value.companyName =this.companyDetail.companyName,
          value.floor = this.companyDetail.floor,
          value.contactPerson = this.companyDetail.contactPerson,
          value.unitNumber = this.companyDetail.unitNumber,
          value.contactNumber = this.companyDetail.contactNumber
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
  selector: 'company-dialog-component',
  templateUrl: './company-dialog.component.html',
})
export class CompanyDialogComponent {
  action?:string;
  local_data:any;
    constructor(
    public dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: CompanyDetail,private _snackBar: MatSnackBar) {
      console.log("data inside dialog :: " + data.companyName);
  this.local_data = {...data};

  this.action = this.local_data.action;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  doAction(){
    if(this.validate(this.local_data.companyName)){
      this._snackBar.open("Please enter company name !!", "Close", {
        duration: 2000,
      });
    } else if(this.validate(this.local_data.floorName)){
      this._snackBar.open("Please select floor !!", "Close", {
        duration: 2000,
      });
    } else if(this.validate(this.local_data.contactPerson)){
      this._snackBar.open("Please enter contact person !!", "Close", {
        duration: 2000,
      });
    } else if(this.validate(this.local_data.unitNumber)){
      this._snackBar.open("Please enter unit number !!", "Close", {
        duration: 2000,
      });
    } else if(this.validate(this.local_data.contactNumber)){
      this._snackBar.open("Please enter contact number !!", "Close", {
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

