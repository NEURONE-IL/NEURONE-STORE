import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  user: any = {};
  loggedIn: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.profile().subscribe(
      res => {
        this.user = (res as any).user;
        this.loggedIn = true;
      },
      err => {
        this.loggedIn = false;
      }
    );
  }

  logout(){
    this.authService.logout();
    setTimeout(() => window.location.reload(), 200);
  }
}
