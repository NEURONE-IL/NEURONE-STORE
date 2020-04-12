import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}')]
        )],
      password: ['', Validators.required]
    });
  }


  login(){
    let loggedUser = {};
    loggedUser["email"] = this.loginForm.get('email').value;
    loggedUser["password"] = this.loginForm.get('password').value;
    //console.log(loggedUser);
    this.auth.loginUser(loggedUser).subscribe(
      res => {
        //console.log(res);
        localStorage.setItem('token', res['token']);
        localStorage.setItem('userId', res['user']._id);
        //localStorage.setItem('userName', res['name']);
        // Swal.fire({
        //   type: 'success',
        //   title: 'Logged in successfully'
        // });
        setTimeout(() => {
          this.router.navigate(['/create']);
        }, 100);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 
      err => {
        //console.log(err);
        //if(err instanceof HttpErrorResponse){
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err
            });
        //}
      }
      );
  }

}
