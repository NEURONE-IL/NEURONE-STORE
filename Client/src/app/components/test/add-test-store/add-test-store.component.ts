import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuestionnairesService } from 'src/app/services/questionnaires.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-test-store',
  templateUrl: './add-test-store.component.html',
  styleUrls: ['./add-test-store.component.css']
})
export class AddTestStoreComponent implements OnInit {

  newQsId: string = "";

  constructor(public dialogRef: MatDialogRef<AddTestStoreComponent>, @Inject(MAT_DIALOG_DATA) public data,
  private qService: QuestionnairesService) { }

  ngOnInit() {
    this.newQsId = this.data.questionnaireId;
  }

  save(){
    if(this.newQsId.length < 3){
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Title must have 3 characters minimum.'
      });
      return;
    }
    let newQuestionnaire = {
      questions: this.data.questions,
      public: false,
      questionnaireId: this.newQsId,
      user: localStorage.getItem('userId'),
      tags: this.data.tags,
      instructions: this.data.instructions
    };
    //console.log(newQuestionnaire);
    this.qService.newQuestionnaire(newQuestionnaire).subscribe(
      res => {
        //console.log(res);
        this.dialogRef.close(true)
      },
      err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err
        });
      }
    );
  }

}
