import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { AssetsService } from 'src/app/services/assets.service';
import { UploadService } from 'src/app/services/upload.service';
import { MatDialog } from '@angular/material';
import { NewAssetComponent } from '../document/new-asset/new-asset.component';
import { EditAssetComponent } from '../document/edit-asset/edit-asset.component';
import { UploadComponent } from '../template/upload/upload.component';
import { AffectiveComponent } from '../study/affective/affective.component';
import { CollectionComponent } from '../study/collection/collection.component';
import { CriticalEvalComponent } from '../study/critical-eval/critical-eval.component';
import { EndComponent } from '../study/end/end.component';
import { InstructionsComponent } from '../study/instructions/instructions.component';
import { SearchComponent } from '../study/search/search.component';
import { SynthesisComponent } from '../study/synthesis/synthesis.component';
import { TaskQuestionsComponent } from '../study/task-questions/task-questions.component';
import { TutorialComponent } from '../study/tutorial/tutorial.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CreatedStagesComponent } from './created-stages/created-stages.component';
import { StudyService } from 'src/app/services/study.service';
import Swal from 'sweetalert2';
import { SimpleEditorComponent } from '../template/simple-editor/simple-editor.component';



@Component({
  selector: 'app-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.css']
})
export class QuickComponent implements OnInit {

  typesStages:any[] = [
    {
      type: 'Affective(SAM)',
      id: 1
    },
    {
      type: 'Task Questions',
      id: 2
    },
    {
      type: 'Instructions',
      id: 3
    },
    {
      type: 'Tutorial',
      id: 4
    },
    {
      type: 'Search',
      id: 5
    },
    {
      type: 'Collection',
      id: 6
    },
    {
      type: 'Critical Evaluation',
      id: 7
    },
    {
      type: 'Synthesis',
      id: 8
    },
    {
      type: 'End',
      id: 9
    }];


  generalForm: FormGroup;
  assetsForm: FormGroup;
  optionalForm: FormGroup;
  publicContent: boolean = false;
  showNewStage: boolean = false;
  myLocales = [];
  myDomains = [];
  myTasks = [];
  myModals = [];
  stages = [];
  newStudy: any = {};

  constructor(private location: Location, private fb: FormBuilder, private assetsService: AssetsService, private uploadService: UploadService, 
    public dialog: MatDialog, private studyService: StudyService) { }

  ngOnInit() {
    this.newStudy['stages'] = [];
    this.getMyLocales();
    this.getMyDomains();
    this.getMyTasks();
    this.getMyModals();
    this.generalForm = this.fb.group({
      id: ['', Validators.required],
      avatar: ['', Validators.required],
      public: [false],
      tags: new FormControl()
    });
    this.assetsForm = this.fb.group({
      locale: ['', Validators.required],
      domain: ['', Validators.required],
      task: ['', Validators.required],
      taskPage: ['', Validators.required]
    });
    this.optionalForm = this.fb.group({
      maxGlobalTime: [-1, Validators.compose([Validators.required, Validators.min(-1)])],
      minBookmarks: [3, Validators.compose([Validators.required, Validators.min(1)])],
      maxBookmarks: [3, Validators.compose([Validators.required, Validators.min(1)])],
      minSnippetsPerPage: [2, Validators.compose([Validators.required, Validators.min(1)])],
      maxSnippetsPerPage:[2, Validators.compose([Validators.required, Validators.min(1)])],
      minSnippetWordLength: [5, Validators.compose([Validators.required, Validators.min(1)])],
      maxSnippetWordLength: [20, Validators.compose([Validators.required, Validators.min(1)])],
      snippetWordTruncateThreshold: [20, Validators.compose([Validators.required, Validators.min(1)])],
      minSynthesisWordLength: [50, Validators.compose([Validators.required, Validators.min(1)])],
      minSynthesisCharLength: [425, Validators.compose([Validators.required, Validators.min(1)])],
      syhtesisAutosaveInterval: [30, Validators.compose([Validators.required, Validators.min(30)])],
      maxStars: [3, Validators.min(3)]
    });
  }

  getMyLocales(){
    this.assetsService.getMyLocales().subscribe(
      res => {
        this.myLocales = res['locales'];
      }
    );
  }

  getMyDomains(){
    this.assetsService.getMyDomains().subscribe(
      res => {
        this.myDomains = res['domains'];
      }
    );
  }

  getMyTasks(){
    this.assetsService.getMyTasks().subscribe(
      res => {
        this.myTasks = res['tasks'];
      }
    );
  }

  getMyModals(){
    this.uploadService.getHtml("1").subscribe(
      res => {
        this.myModals = res['html'];
      }
    );
  }
  

  activateNewStage(){
    if(this.showNewStage){
      this.showNewStage = false;
    } else{
      this.showNewStage = true;
    }
  }

  addAsset(type: number){
    const dialogRef = this.dialog.open(NewAssetComponent, {
      width: '600px',
      data: type
    });
    dialogRef.afterClosed().subscribe(newAsset => {
      if(newAsset){
        switch(type){
          case 1: 
            this.getMyLocales();
            break;
          case 2:
            this.getMyDomains();
            break;
          case 3:
            this.getMyTasks();
            break;
        }
      }
    });
  }

  editAsset(type: number){
    const dialogRef = this.dialog.open(EditAssetComponent, {
      width: '600px',
      data: type
    });
    dialogRef.afterClosed().subscribe(asset => {
      if(asset){
        this.assetsForm.reset();
        switch(type){
          case 1: 
            this.getMyLocales();
            break;
          case 2:
            this.getMyDomains();
            break;
          case 3:
            this.getMyTasks();
            break;
        }
      }
    });
  }

  uploadDialog(type: number){
    let dialogRef = this.dialog.open(SimpleEditorComponent, {
      width: '50%',
      data: type
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getMyModals();
    });
  }

  createdStages(){
    let dialogRef = this.dialog.open(CreatedStagesComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(stage => {
      if(stage){
        this.stages.push(stage);
      }
    });
  }

  newStage(typeName:string){
    let stageComp, dialogRef;
    switch (typeName){
      case 'Affective(SAM)':
        stageComp = AffectiveComponent;
        break;
      case 'Collection':
        stageComp = CollectionComponent;
        break;
      case 'Critical Evaluation':
        stageComp = CriticalEvalComponent;
        break;
      case 'End':
        stageComp = EndComponent;
        break;
      case 'Instructions':
        stageComp = InstructionsComponent;
        break;
      case 'Search':
        stageComp = SearchComponent;
        break;
      case 'Synthesis':
        stageComp = SynthesisComponent;
        break;
      case 'Task Questions':
        stageComp = TaskQuestionsComponent;
        break;
      case 'Tutorial':
        stageComp = TutorialComponent;
        break;
    }
    dialogRef = this.dialog.open(stageComp, {
      width: '600px',
      data: {
        typeName,
        isEdit: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
          //console.log(result);
          let aux = result;
          this.stages.push(aux);
      }
    });
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.stages, event.previousIndex, event.currentIndex);
    //console.log(this.stages);
  }

  deleteStage(stage: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: stage.id
      });
    dialogRef.afterClosed().subscribe(result => {
        if(result) {
          let index = this.stages.indexOf(stage);
          this.stages.splice(index, 1);
        }
      });
  }

  loadData(){
    this.newStudy = Object.assign({}, this.generalForm.value);
    this.newStudy = Object.assign(this.newStudy, this.optionalForm.value);
    this.newStudy = Object.assign(this.newStudy, this.assetsForm.value);
    this.newStudy['stages'] = [];
    //Si es publico, se le asigna los tags
    if(this.newStudy.public){
      this.newStudy.tags = [];
      this.generalForm.controls['tags'].value.forEach(tag => {
        this.newStudy.tags.push(tag.value);
      });
    }
    this.stages.forEach( s => {
      this.newStudy['stages'].push(s._id);
    });
    this.newStudy['user'] = localStorage.getItem('userId');
  }

  createStudy(){
    this.studyService.newStudy(this.newStudy).subscribe(
      res => {
        Swal.fire({
          type: 'success',
          title: `${this.newStudy.id} saved successfully`
        });
      },
      err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err
        });
        //console.log(err);
      }
    );
  }
}
