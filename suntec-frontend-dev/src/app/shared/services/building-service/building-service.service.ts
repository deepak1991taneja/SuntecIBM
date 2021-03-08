import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BuildingDetail } from '../../model/building-detail';
let API_URL = "http://localhost:8084";
@Injectable({
  providedIn: 'root'
})
export class BuildingServiceService {

  constructor(private http: HttpClient) { }

  getBuildingData() : Observable<any> {
    return this.http.get(`${API_URL}/staff-api/buildingData/detail`);
  }

  deleteBuilding(post:BuildingDetail) : Observable<any>{
    return this.http.get(`${API_URL}/staff-api/buildingData/delete/${post.id}`);
  }

  addUpdateBuilding(post:BuildingDetail):Observable<Object> {  
    console.log("received post data :: " + post)
    return this.http.post(API_URL+'/staff-api/buildingData/addUpdate',post);
}
}
