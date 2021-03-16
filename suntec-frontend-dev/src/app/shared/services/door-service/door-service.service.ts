import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoorDetail } from '../../model/door-model/door-detail.model';
let API_URL = "http://localhost:8084";
@Injectable({
  providedIn: 'root'
})
export class DoorServiceService {

  constructor(private http: HttpClient) { }

  getDoorData() : Observable<any> {
    return this.http.get(`${API_URL}/staff-api/doorData/detail`);
  }

  deleteDoor(post:DoorDetail) : Observable<any>{
    return this.http.get(`${API_URL}/staff-api/doorData/delete/${post.id}`);
  }

  addUpdateDoor(post:DoorDetail):Observable<Object> {  
    console.log("received post data :: " + post)
    return this.http.post(API_URL+'/staff-api/doorData/addUpdate',post);
}
}
