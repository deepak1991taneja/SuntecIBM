import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { Users } from 'src/app/shared/model/users';
import { UsersLoginService } from 'src/app/shared/services/users-login.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements  OnInit {
  users : Users[] = [];
  dataSource!: MatTableDataSource<Users>;

  constructor(private userLoginService: UsersLoginService) {
    this.dataSource = new MatTableDataSource<Users>();
   }

  ngOnInit() {
    this.userLoginService.getAllUsers().subscribe(data => {
      this.users = data;
      this.dataSource.data = this.users;
      })
     
     
  
}
  displayedColumns: string[] = ['file', 'name', 'email', 'jobPosition', 'jobLocation', 'company' ];
  //dataSource = new MatTableDataSource(this.users);

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

}
