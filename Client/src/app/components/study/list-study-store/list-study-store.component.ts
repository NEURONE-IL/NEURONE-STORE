import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { StudyService } from 'src/app/services/study.service';
import { StudyDetailComponent } from '../study-detail/study-detail.component';

@Component({
  selector: 'app-list-study-store',
  templateUrl: './list-study-store.component.html',
  styleUrls: ['./list-study-store.component.css']
})
export class ListStudyStoreComponent implements OnInit {

  studies = [];
  studiesFilter = [];
  currentUserId = localStorage.getItem('userId');

  constructor(public dialogRef: MatDialogRef<ListStudyStoreComponent>, private studyService: StudyService,
    public dialogDetails: MatDialog) { }

  ngOnInit() {
    this.studyService.getPublicStudies().subscribe(
      res => {
        this.studies = this.studiesFilter = res['public'].filter(
          s => s.user != this.currentUserId
        );
      }
    );
  }

  searchStudy(name: string){
    if(name == ''){
      this.studiesFilter = this.studies;
      return;
    }
    this.studiesFilter = this.studies.filter(
      q => q.tags.includes(name)
    );
  }

  viewStudyStore(study: any){
    const dialogAux = this.dialogDetails.open(StudyDetailComponent, {
      width: '900px',
      data: study
    });
    dialogAux.afterClosed().subscribe();
  }

  addStudy(study: any){
    study.add = true;
    this.dialogRef.close(study);
  }

  onNoClick(){
    this.dialogRef.close();
  }

}
