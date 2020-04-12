import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerURL = environment.apiUrl + "register";
  private loginURL = environment.apiUrl + "login";
  private profileUrl = environment.apiUrl + 'me';
  private userUrl = environment.apiUrl + "user/";

  constructor( private http: HttpClient, private router: Router) { }

  public register(user){
    return this.http.post(this.registerURL, user);
  }

  public loginUser(user){
    return this.http.post(this.loginURL, user);
  }

  public loggedIn(){
    return !!localStorage.getItem('token');
  }

  public profile(){
    return this.http.get(this.profileUrl);
  }

  public getToken(){
    return localStorage.getItem('token');
  }

  public logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }

  public getUser(id){
    return this.http.get(this.userUrl + id);
  }

}
