import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-app',
  templateUrl: './select-app.component.html',
  styleUrls: ['./select-app.component.scss']
})
export class SelectAppComponent implements OnInit {

  constructor() { 
   
  }
  
  ngOnInit(): void {
   
  }
  defaultElevation = 8;
  raisedElevation = 16;

  titles:title[] = [{name:'Application', detail:"Tanent Management Staff", image:"assets/images/tms.png"}, {name:'Application', detail:"Visitor Management Staff", image:"assets/images/visitor.jpg"}];
  titleSelected:any;

  name = 'Angular';

  select(title:any) {
    this.titles.map(t=>t.isSelected = false);
    title.isSelected = true;
    this.titleSelected = title;
    console.log(this.titles);
  }
}

export class title {
  name?: string;
  detail?:String;
  image?:String;
  isSelected?: boolean;
}
