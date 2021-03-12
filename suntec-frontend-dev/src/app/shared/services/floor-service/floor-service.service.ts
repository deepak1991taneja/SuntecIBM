import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FloorDetail } from '../../model/floor-model/floor-detail.model';
let API_URL = "http://localhost:8084";
@Injectable({
  providedIn: 'root'
})
export class FloorServiceService {
  constructor(private http: HttpClient) { }

  getFloorData() : Observable<any> {
    return this.http.get(`${API_URL}/staff-api/floorData/detail`);
  }

  deleteFloor(post:FloorDetail) : Observable<any>{
    return this.http.get(`${API_URL}/staff-api/floorData/delete/${post.id}`);
  }

  addUpdateFloor(post:FloorDetail):Observable<Object> {  
    console.log("received post data :: " + post)
    return this.http.post(API_URL+'/staff-api/floorData/addUpdate',post);
}
}
