import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { QuestionsService } from 'src/app/services/questions.service';
import { NewQuestionComponent } from '../../new-question/new-question.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-created-questions',
  templateUrl: './created-questions.component.html',
  styleUrls: ['./created-questions.component.css']
})
export class CreatedQuestionsComponent implements OnInit {

  myQuestions = [];
  questionFilter = [];

  constructor(public dialogRef: MatDialogRef<CreatedQuestionsComponent>, private questionService: QuestionsService,
    private dialog:MatDialog) { }

  ngOnInit() {
    this.questionService.getMyQuestions().subscribe(
      res => {
        this.myQuestions = res['questions']
        this.questionFilter = this.myQuestions;
      },
      err => {}
    );
  }

  addQuestion(question: any){
    this.dialogRef.close(question);
  }

  editQuestion(question: any){
    question.edited = true;
    this.dialogRef.close(question);
  }

  deleteQuestion(question: any){
    const confirm = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: question.questionId
    });
    confirm.afterClosed().subscribe(result => {
      if(result){
        this.questionService.deleteQuestion(question._id).subscribe(
          res => {
            question.deleted = true;
            this.dialogRef.close(question);
          }, err => {}
        );
      }
    });
  }

  searchQuestion(name: string){
    this.questionFilter = this.myQuestions.filter(obj => obj.questionId.includes(name));
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
