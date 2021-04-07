import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FrTabletConfig } from '../../model/frTablet-config-model/fr-tablet-config.model';
import { FrTabletDetail } from '../../model/frTablet-model/fr-tablet-detail.model';

let API_URL = "http://localhost:8084";
@Injectable({
  providedIn: 'root'
})
export class FrTabletServiceService {
  constructor(private http: HttpClient) { }

  getFrTabletData() : Observable<any> {
    return this.http.get(`${API_URL}/staff-api/frTabletData/detail`);
  }

  deleteFrTablet(post:FrTabletDetail) : Observable<any>{
    return this.http.get(`${API_URL}/staff-api/frTabletData/delete/${post.id}`);
  }

  addUpdateFrTablet(post:FrTabletDetail):Observable<Object> {  
    console.log("received post data :: " + post)
    return this.http.post(API_URL+'/staff-api/frTabletData/addUpdate',post);
}

getFrTabletConfigData() : Observable<any> {
  return this.http.get(`${API_URL}/staff-api/frTabletData/configDetail`);
}

deleteFrTabletConfig(post:FrTabletConfig) : Observable<any>{
  return this.http.get(`${API_URL}/staff-api/frTabletData/deleteConfig/${post.id}`);
}

addUpdateFrTabletConfig(post:FrTabletConfig):Observable<Object> {  
  console.log("received post data :: " + post)
  return this.http.post(API_URL+'/staff-api/frTabletData/addUpdateConfig',post);
}
}
