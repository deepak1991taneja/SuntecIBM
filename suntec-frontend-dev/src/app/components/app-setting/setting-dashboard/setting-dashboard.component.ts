import { Component, OnInit,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-setting-dashboard',
  templateUrl: './setting-dashboard.component.html',
  styleUrls: ['./setting-dashboard.component.scss']
})
export class SettingDashboardComponent implements OnInit {
  displayedColumns: string[] = ['Position', 'Name', 'Roles', 'Floor','Company','Email'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  roles: String;
  floor: string;
  company: string;
  email: string;
    
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'User1', roles: 'Administrator', floor: 'Lobby Tower 5',company:'Inteq', email:'user1@gmail.com'},
  {position: 2, name: 'User2', roles: 'System Administrator', floor: 'Lobby Tower 2',company:'Inteq',email:'user2@gmail.com'},
  {position: 3, name: 'User3', roles: 'Administrator', floor: 'Lobby Tower 1',company:'Inteq',email:'user3@gmail.com'},
  {position: 4, name: 'User4', roles: 'System Administrator', floor: 'Lobby Tower 4',company:'Inteq',email:'user4@gmail.com'},
  {position: 5, name: 'User5', roles: 'Administrator', floor: 'Lobby Tower 1',company:'Inteq',email:'user5@gmail.com'},
  {position: 6, name: 'User6', roles: 'Administrator', floor: 'Lobby Tower 3',company:'Inteq',email:'user6@gmail.com'},
  {position: 7, name: 'User7', roles: 'System Administrator', floor: 'Lobby Tower 2',company:'Inteq',email:'user7@gmail.com'},
  {position: 8, name: 'User8', roles: 'Administrator', floor: 'Lobby Tower 3',company:'Inteq',email:'user8@gmail.com'},
  {position: 9, name: 'User9', roles: 'Administrator', floor: 'Lobby Tower 5',company:'Inteq',email:'user9@gmail.com'},
  {position: 10, name: 'User10', roles: 'System Administrator', floor: 'Lobby Tower X',company:'Inteq',email:'user10  @gmail.com'},
  ];
