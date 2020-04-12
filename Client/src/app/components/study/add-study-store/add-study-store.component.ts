import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import { StudyService } from 'src/app/services/study.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-study-store',
  templateUrl: './add-study-store.component.html',
  styleUrls: ['./add-study-store.component.css']
})
export class AddStudyStoreComponent implements OnInit {

  newStudyId: string = "";
  newStudyForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddStudyStoreComponent>, @Inject(MAT_DIALOG_DATA) public data,
  private studyService: StudyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.newStudyId = this.data.id;
    this.newStudyForm = this.fb.group({
      locale: ['', Validators.required],
      domain: ['', Validators.required],
      task: ['', Validators.required],
      taskPage: ['', Validators.required]
    });
  }

  save(){
    if(this.newStudyId.length < 3){
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Title must have 3 characters minimum.'
      });
      return;
    }
    let newStudy = {
      stages: this.data.stages,
      public: false,
      id: this.newStudyId,
      user: localStorage.getItem('userId'),
      tags: this.data.tags,
      locale: this.newStudyForm.controls['locale'].value,
      domain: this.newStudyForm.controls['domain'].value,
      task: this.newStudyForm.controls['task'].value,
      maxGlobalTime: this.data.maxGlobalTime,
      minBookmarks: this.data.minBookmarks,
      maxBookmarks: this.data.maxBookmarks,
      minSnippetsPerPage: this.data.minSnippetsPerPage,
      maxSnippetsPerPage: this.data.maxSnippetsPerPage,
      minSnippetWordLength: this.data.minSnippetWordLength,
      maxSnippetWordLength: this.data.maxSnippetWordLength,
      snippetWordTruncateThreshold: this.data.snippetWordTruncateThreshold,
      minSynthesisWordLength: this.data.minSynthesisWordLength,
      minSynthesisCharLength: this.data.minSynthesisCharLength,
      syhtesisAutosaveInterval: this.data.syhtesisAutosaveInterval,
      maxStars: this.data.maxStars,
      taskPage: this.newStudyForm.controls['taskPage'].value,
      replaceWithRelevantDocuments: this.data.replaceWithRelevantDocuments,
      avatar: this.data.avatar
    };
    //console.log(newStudy);
    this.studyService.newStudy(newStudy).subscribe(
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
