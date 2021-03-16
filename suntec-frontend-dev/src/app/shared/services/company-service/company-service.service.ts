import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyDetail } from '../../model/company-model/company-detail.model';
let API_URL = "http://localhost:8084";
@Injectable({
  providedIn: 'root'
})
export class CompanyServiceService {

  constructor(private http: HttpClient) { }

  getCompanyData() : Observable<any> {
    return this.http.get(`${API_URL}/staff-api/companyData/detail`);
  }

  deleteCompany(post:CompanyDetail) : Observable<any>{
    return this.http.get(`${API_URL}/staff-api/companyData/delete/${post.id}`);
  }

  addUpdateCompany(post:CompanyDetail):Observable<Object> {  
    console.log("received post data :: " + post)
    return this.http.post(API_URL+'/staff-api/companyData/addUpdate',post);
}
}
