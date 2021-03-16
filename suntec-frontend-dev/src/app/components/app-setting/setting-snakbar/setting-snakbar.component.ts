import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-setting-snakbar',
  templateUrl: './setting-snakbar.component.html',
  styleUrls: ['./setting-snakbar.component.scss']
})
export class SettingSnakbarComponent implements OnInit {

  local_data:any;
  constructor(
  @Optional() @Inject(MAT_SNACK_BAR_DATA) public data: any) {
this.local_data = data;

  }

  ngOnInit(): void {
  }

}
