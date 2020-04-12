import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { StagesService } from 'src/app/services/stages.service';

@Component({
  selector: 'app-study-detail',
  templateUrl: './study-detail.component.html',
  styleUrls: ['./study-detail.component.css']
})
export class StudyDetailComponent implements OnInit {

  stages = [];
  user: any = {};

  constructor(public dialogRef: MatDialogRef<StudyDetailComponent>, @Inject(MAT_DIALOG_DATA) public data,
  private stageService: StagesService, private userService: AuthService) { }

  ngOnInit() {
    //console.log(this.data);
    this.userService.getUser(this.data.user).subscribe(
      res => {
        this.user = res['user'];
      }
    );
    this.data.stages.forEach(s => {
      this.stages.push(s);
      let idx = this.data.stages.indexOf(s);
      this.stageService.getStage(s).subscribe(
        res => {
          this.stages[idx] = res['stage'];
          //console.log(this.stages);
        }
      );
    });
  }

}
