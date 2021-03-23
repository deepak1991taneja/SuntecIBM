import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-app',
  templateUrl: './select-app.component.html',
  styleUrls: ['./select-app.component.scss']
})
export class SelectAppComponent implements OnInit {

  constructor(private router: Router) { 
   
  }
  
  ngOnInit(): void {
   
  }
  defaultElevation = 8;
  raisedElevation = 16;

  titles:title[] = [{name:'TMS', detail:"Tanent Management Staff", image:"assets/images/tms.png"}, {name:'VMS', detail:"Visitor Management Staff", image:"assets/images/visitor.jpg"}];
  titleSelected:any;

  name = 'Angular';

  select(title:any) {
    this.titles.map(t=>t.isSelected = false);
    title.isSelected = true;
    this.titleSelected = title;
    console.log(title.name);
    if(title.name==="TMS"){
    this.router.navigate(['/tanent'])
    }else if(title.name==="VMS"){
console.log("vms");
    }
  }
}

export class title {
  name?: string;
  detail?:String;
  image?:String;
  isSelected?: boolean;
}
