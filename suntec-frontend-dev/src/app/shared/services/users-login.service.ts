import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

deleteUser(post:Users) : Observable<any>{
  return this.http.get(`${API_URL}staffData/delete/${post.id}`);
}



uploadExcelFile(post:FormData): Observable<HttpEvent<any>>{  
  console.log("received post data :: " + post)
 // return this.http.post(API_URL+'staffData/uploadFile',post);

  // return this.http.post<any>(API_URL+'staffData/uploadFile',post, {
  //     reportProgress: true,
  //     responseType: 'json',
  //     observe: 'events'
  //   }).pipe(
  //     catchError(this.errorMgmt)
  //   )

  const req = new HttpRequest('POST', API_URL+`staffData/uploadFile`, post, {
    reportProgress: true,
    responseType: 'json'
  });

  return this.http.request(req);
}

errorMgmt(error: HttpErrorResponse) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
    // Get client-side error
    errorMessage = error.error.message;
  } else {
    // Get server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  console.log(errorMessage);
  return throwError(errorMessage);
}

}
