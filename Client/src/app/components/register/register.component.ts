import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}')]
        )],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      confirmPassword: new FormControl(),
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      institution: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])]

    });
    this.registerForm.controls['confirmPassword'].setValidators([
      Validators.required,
      this.confirmPasswords.bind(this.registerForm)
    ]);
  }

  confirmPasswords(control: FormControl): {[key:string]:boolean}{
    let form:any = this;
    if(control.value !== form.controls['password'].value){
      return {
        mismatch:true
      }
    }

    return null;
  }

  register(){
    let newUser = {};
    newUser["email"] = this.registerForm.get('email').value;
    newUser["name"] = this.registerForm.get('name').value;
    newUser["institution"] = this.registerForm.get('institution').value;
    newUser["password"] = this.registerForm.get('password').value;
    //console.log(newUser);
    this.auth.register(newUser).subscribe(
      res => {
        //console.log(res);
        localStorage.setItem('token', res['token']);
        localStorage.setItem('userId', res['user']._id);
        this.router.navigate(['/create'])
      }, 
      err => {
        //console.log(err);
        // if(err instanceof HttpErrorResponse){
        //   if(err.status === 409){
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err
            })
         // }
        //}
      }
    );
  }

}
