import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountDetail } from '../../model/account-model/account-detail.model';

let API_URL = "http://localhost:8084";
@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {
  constructor(private http: HttpClient) { }

  getAccountData() : Observable<any> {
    return this.http.get(`${API_URL}/staff-api/accountData/detail`);
  }

  deleteAccount(post:AccountDetail) : Observable<any>{
    return this.http.get(`${API_URL}/staff-api/accountData/delete/${post.id}`);
  }

  addUpdateAccount(post:AccountDetail):Observable<Object> {  
    console.log("received post data :: " + post)
    return this.http.post(API_URL+'/staff-api/accountData/addUpdate',post);
}
}
