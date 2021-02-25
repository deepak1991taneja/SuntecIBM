import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from 'src/app/shared/model/users';
import { UsersLoginService } from 'src/app/shared/services/users-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage:any
  users:Users = new Users();
  ngOnInit(): void {
  }
  formGroup;
  language: any[] = [
    { name: 'English' },
    { name: 'Chinese' },
    { name: 'Tamil' },
];
  constructor(
    private formBuilder: FormBuilder, private userLoginService: UsersLoginService, private router: Router
  ) {


    this.formGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      language: ['', [Validators.required]]
    });
  }

  onSubmit(formData:any) {
     var name = formData['username'];
     this.router.navigate(['/selectApp']);
    /*this.userLoginService.login(formData['username'], formData['password'],).subscribe(data => {
       if(data)this.router.navigate(['/navigation']);
       else this.router.navigate([''])
     }, err => {
      if(!err || err.status !== 409) {
        this.errorMessage = "Unexpected error occurred. Error : " + err;
      }else {
        this.errorMessage = "Username is already exist";
       }
     });*/
  }
}
