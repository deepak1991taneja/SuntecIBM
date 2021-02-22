import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VERSION } from 'hammerjs';
import { Observable } from 'rxjs';
import { UsersLoginService } from 'src/app/shared/services/users-login.service';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {
 
  hide = true;
  formGroup!: FormGroup;
  titleAlert: string = 'This field is required';
  titleAlertName: string = "This field is required(at least 3 characters)";
  post: any = '';
  readonly version = VERSION;
  errorMessage!: string;
  constructor(private formBuilder: FormBuilder, private userLoginService: UsersLoginService, private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.setChangeValidate()
  }

  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.formGroup = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(emailregex)], this.checkInUseEmail],
      'name': [null, [Validators.required,Validators.minLength(3)]],
      'jobLocation': [null, Validators.required],
      'door': [null],
      'jobPosition': [null, Validators.required],
      'phone': [null, Validators.required],
      'company': [null, Validators.required],
      'unit': [null],
      'nric': [null, Validators.required],
      'activationDate': [null, Validators.required],
      'expirationDate': [null, Validators.required],
      'password': [null, [Validators.required, this.checkPassword]],
      'remarks': [null, [ Validators.minLength(5), Validators.maxLength(10)]],
      'validateTC': '',
      'validateQRCode': '',
      'validate':'1',
       file: new FormControl('', [Validators.required])
    });
  }

  setChangeValidate() {
    this.formGroup.get('validate')!.valueChanges.subscribe(
      (validate) => {
        if (validate == '1') {
          this.formGroup.get('name')!.setValidators([Validators.required, Validators.minLength(3)]);
          this.titleAlertName = "You need to specify at least 3 characters";
        } else {
          this.formGroup.get('name')!.setValidators(Validators.required);
        }
        this.formGroup.get('name')!.updateValueAndValidity();
      }
    )
  }

  get name() {
    return this.formGroup.get('name') as FormControl
  }

  checkPassword(control:any) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }

  checkInUseEmail(control:any) {
    // mimic http database access
    let db = ['tony@gmail.com'];
    return new Observable(observer => {
      setTimeout(() => {
        let result = (db.indexOf(control.value) !== -1) ? { 'alreadyInUse': true } : null;
        observer.next(result);
        observer.complete();
      }, 4000)
    })
  }

  getErrorEmail() {
    return this.formGroup.get('email')!.hasError('required') ? 'Field is required' :
      this.formGroup.get('email')!.hasError('pattern') ? 'Not a valid emailaddress' :
        this.formGroup.get('email')!.hasError('alreadyInUse') ? 'This emailaddress is already in use' : '';
  }

  getErrorPassword() {
    return this.formGroup.get('password')!.hasError('required') ? 'Field is required (at least eight characters, one uppercase letter and one number)' :
      this.formGroup.get('password')!.hasError('requirements') ? 'Password needs to be at least eight characters, one uppercase letter and one number' : '';
  }

  uploadFile(event:any) {
    const file = (event.target as HTMLInputElement).files![0];
   
    this.formGroup.patchValue({
      file: file
    });
    this.formGroup.controls.file.setValue(file);
   // this.formGroup.get('file')!.updateValueAndValidity();
  }
  onSubmit(post:any) {
    this.post = post;
    let file: File = this.formGroup.get("file")?.value;
    let formData:FormData = new FormData();
    formData.append('uploadFile', file, file.name);
    formData.append('info',new Blob([JSON.stringify(this.formGroup.value)],
    {
        type: "application/json"
    }));
    this.userLoginService.registerPerson(formData).subscribe(data => {
     if(data == true) this.router.navigate(['/navigation/dashboard']);
     else this.router.navigate(['/navigation/add-person'])
    }, err => {
      if(!err || err.status !== 409) {
        this.errorMessage = "Unexpected error occurred. Error : " + err;
      }else {
        this.errorMessage = "Username is already exist";
      }
    });
  }
}
