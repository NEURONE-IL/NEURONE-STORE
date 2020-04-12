import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { QuestionnairesService } from 'src/app/services/questionnaires.service';

@Component({
  selector: 'app-test-store',
  templateUrl: './test-store.component.html',
  styleUrls: ['./test-store.component.css']
})
export class TestStoreComponent implements OnInit {

  storeQuestionnaires = [];
  questionnaireFilter = [];

  constructor(public dialogRef: MatDialogRef<TestStoreComponent>, private questionnaireService: QuestionnairesService) { }

  ngOnInit() {
    this.questionnaireService.getPublicQuestionnaires().subscribe(
      res => {
        //console.log(res);
        this.storeQuestionnaires = res['public'].filter(
          q => q.createdBy != localStorage.getItem('userId')
        );
        this.questionnaireFilter = this.storeQuestionnaires;
      },
      err => {}
    );
  }

  addQuestionnaire(questionnaire: any){
    questionnaire.add = true;
    this.dialogRef.close(questionnaire);
  }

  detailsQuestionnaire(questionnaire: any){
    questionnaire.details = true;
    this.dialogRef.close(questionnaire);
  }

  searchQuestionnaire(name: string){
    this.questionnaireFilter = this.storeQuestionnaires.filter(obj => obj.questionId.includes(name));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
