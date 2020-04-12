import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuestionsService } from 'src/app/services/questions.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css']
})
export class TestDetailComponent implements OnInit {

  questions = [];
  user: any = {};
  constructor(public dialogRef: MatDialogRef<TestDetailComponent>, @Inject(MAT_DIALOG_DATA) public data,
  private questionService: QuestionsService, private userService: AuthService) { }

  ngOnInit() {
    this.userService.getUser(this.data.createdBy).subscribe(
      res => {
        this.user = res['user'];
      }
    );
    this.data.questions.forEach(q => {
      this.questions.push(q);
      let idx = this.data.questions.indexOf(q);
      this.questionService.getQuestion(q).subscribe(
        res => {
          this.questions[idx] = res['question'];
        }
      );
    });
  }

}
