import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FrTabletConfig } from 'src/app/shared/model/frTablet-config-model/fr-tablet-config.model';
import { FrTabletServiceService } from 'src/app/shared/services/frTablet-service/fr-tablet-service.service';
import { TableUtil } from '../table-utils';

@Component({
  selector: 'app-fr-tablet-config',
  templateUrl: './fr-tablet-config.component.html',
  styleUrls: ['./fr-tablet-config.component.scss']
})
export class FrTabletConfigComponent implements OnInit {
  frTabletConfigData : FrTabletConfig[] = [];
  frTabletConfig?:any;
  dataSource!: MatTableDataSource<FrTabletConfig>;
  errorMessage!: string;
  testFileName = 'SampleFile';
  exporter:any;

  displayedColumns: string[] = ['id','userName','ip','port','action'];
  formGroup!: FormGroup;
  readonly formControl!: AbstractControl;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(public dialog: MatDialog, private frTabletService: FrTabletServiceService,private _snackBar: MatSnackBar,formBuilder: FormBuilder){
    this.dataSource = new MatTableDataSource<FrTabletConfig>();
    this.dataSource.filterPredicate = ((data, filter) => {
      const a = !filter.id || data.id === filter.id;
      const b = !filter.userName || data.userName.toLowerCase().includes(filter.userName);
      const c = !filter.ip || data.ip.toLowerCase().includes(filter.ip);
      const d = !filter.port || data.port.toLowerCase().includes(filter.port);
      return a && b && c && d;
    }) as (frTabletData: any, string: any) => boolean;

    this.formGroup = formBuilder.group({
      userName: '',
      id: '',
      ip: '',
      port: '',
    })
    this.formGroup.valueChanges.subscribe(value => {
      const filter = {...value, userName: value.userName.trim().toLowerCase(),ip: value.ip.trim().toLowerCase(),
        port: value.port.trim().toLowerCase()} as string;
      this.dataSource.filter = filter;
    });
   }

  ngOnInit(): void {
    this.frTabletService.getFrTabletConfigData().subscribe(data => {
      this.frTabletConfigData = data;
      this.dataSource.data = this.frTabletConfigData;
     })
    }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }

    setFileName() {
      this.testFileName = 'ExportFrTabletConfig' + '_' +
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
      const onlyNameAndSymbolArr: Partial<FrTabletConfig>[] = this.dataSource.data.map(x => ({
        userName: x.userName,
        id: x.id,
        ip:x.ip,
        port:x.port
   
    
      }));
      TableUtil.exportArrayToExcel(onlyNameAndSymbolArr, "ExampleArray");
    }

    openDialog(action:String,obj:any){
      console.log("Operation Clicked" + action);
      obj.action = action;
       console.log("add bulding clicked" + obj.action);
      const dialogRef = this.dialog.open(FrTabletConfigDialogComponent, {
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

    addRowData(row_obj:FrTabletConfig){
      console.log("data received :: " + row_obj.id)
        this.frTabletService.addUpdateFrTabletConfig(row_obj).subscribe(data => {
          if(data !== null) {
            this.frTabletConfig = data;
            this.dataSource.data.unshift({
              id:this.frTabletConfig.id,
              userName:this.frTabletConfig.userName,
              ip: this.frTabletConfig.ip,
              port: this.frTabletConfig.port,
              password: this.frTabletConfig.password,
              createdDate:this.frTabletConfig.createdDate,
              updateDate: this.frTabletConfig.updateDate
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
      
      
      updateRowData(row_obj:FrTabletConfig){
      
        this.frTabletService.addUpdateFrTabletConfig(row_obj).subscribe(data => {
          if(data !== null) {
            this.frTabletConfig = data;
            this.dataSource.data = this.dataSource.data.filter((value,key)=>{
              if(value.id == this.frTabletConfig.id){
                value.userName = this.frTabletConfig.name,
                value.ip = this.frTabletConfig.ip,
                value.port = this.frTabletConfig.port,
                value.password = this.frTabletConfig.password
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
      deleteRowData(row_obj:FrTabletConfig){
      
        this.frTabletService.deleteFrTabletConfig(row_obj).subscribe(data => {
          if(data !== null) {
            this.frTabletConfig = data;
            this.dataSource.data = this.dataSource.data.filter((value,key)=>{
              if(value.id == this.frTabletConfig.id){
                value.userName = this.frTabletConfig.userName,
                value.ip = this.frTabletConfig.ip,
                value.port = this.frTabletConfig.port,
                value.password = this.frTabletConfig.password
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
  selector: 'frTablet-config-dialog-component',
  templateUrl: './frTablet-config-dialog.component.html',
})
export class FrTabletConfigDialogComponent {

  action?:string;
  local_data:any;
  constructor(
    public dialogRef: MatDialogRef<FrTabletConfigDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: FrTabletConfig,private _snackBar: MatSnackBar) {
      console.log("data inside dialog :: " + data.userName);
  this.local_data = {...data};

  this.action = this.local_data.action;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  doAction(){
    if(this.validate(this.local_data.userName)){
      this._snackBar.open("Please enter name !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.local_data.ip)){
      this._snackBar.open("Please enter ip !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.local_data.port)){
      this._snackBar.open("Please enter port !!", "Close", {
        duration: 2000,
      });
    }else if(this.validate(this.local_data.password)){
      this._snackBar.open("Please enter account !!", "Close", {
        duration: 2000,
      });
    }else {
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

