import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StagesService } from 'src/app/services/stages.service';

@Component({
  selector: 'app-created-stages',
  templateUrl: './created-stages.component.html',
  styleUrls: ['./created-stages.component.css']
})
export class CreatedStagesComponent implements OnInit {

  myStages = [];
  stageFilter = [];

  constructor(public dialogRef: MatDialogRef<CreatedStagesComponent>, private stageService: StagesService) { }

  ngOnInit() {
    this.stageService.getMyStages().subscribe(
      res => {
        this.myStages = res['stages'];
        this.stageFilter = this.myStages;
      }
    );
  }

  addStage(stage: any){
    this.dialogRef.close(stage);
  }

  editStage(stage:any){
    stage.editable = true;
    this.dialogRef.close(stage);
  }

  deleteStage(stage:any){
    stage.delete = true;
    this.dialogRef.close(stage);
  }

  searchStage(name: string){
    this.stageFilter = this.myStages.filter(obj => obj.id.includes(name));
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
