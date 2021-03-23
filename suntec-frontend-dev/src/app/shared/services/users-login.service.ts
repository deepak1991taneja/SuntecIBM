import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { Users } from '../model/users';
let API_URL = "http://localhost:8084/staff-api/";
@Injectable({
  providedIn: 'root'
})
export class UsersLoginService {
  
  getAllUsers() : Observable<any> {
    return this.http.get(`${API_URL}/staffData/users`);
  }

  constructor(private http: HttpClient) { }

  login(username:String, password:String):  Observable<Object> {  
    return this.http.get(`${API_URL}/staffData/link/${username}/${password}`); 
 
  }
  registerPerson(post:FormData):Observable<Object> {  
    console.log("received post data :: " + post)
    return this.http.post(API_URL+'staffData/register',post);
}

addUpdateTanentStaff(post:Users):Observable<Object> {  
  console.log("received post data :: " + post)
  return this.http.post(API_URL+'staffData/addUpdate',post);
}
}
