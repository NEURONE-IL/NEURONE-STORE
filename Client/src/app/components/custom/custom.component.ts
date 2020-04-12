import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.css']
})
export class CustomComponent implements OnInit {

  constructor(private router:Router, private location: Location) { }

  ngOnInit() {
  }


  newTest(){
    this.router.navigate(['test']);
  }

  newTemplate(){
    this.router.navigate(['template']);
  }

  newDocument(){
    this.router.navigate(['document']);
  }

  newStudy(){
    this.router.navigate(['study']);
  }
}
