import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray  } from '@angular/cdk/drag-drop';
import {MatDialog, MatDialogRef} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TitleEditComponent } from '../test/title-edit.component';

//utils
import { UtilsService } from '../../services/utils.service';

//Stages
import { AffectiveComponent } from './affective/affective.component';
import { CollectionComponent } from './collection/collection.component';
import { CriticalEvalComponent } from './critical-eval/critical-eval.component';
import { EndComponent } from './end/end.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { SearchComponent } from './search/search.component';
import { SynthesisComponent } from './synthesis/synthesis.component';
import { TaskQuestionsComponent } from './task-questions/task-questions.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { StagesService } from 'src/app/services/stages.service';
import Swal from 'sweetalert2';
import { AssetsService } from 'src/app/services/assets.service';
import { UploadService } from 'src/app/services/upload.service';
import { StudyService } from 'src/app/services/study.service';
import { StudyDetailComponent } from './study-detail/study-detail.component';
import { AddStudyStoreComponent } from './add-study-store/add-study-store.component';
import { NewStageComponent } from './new-stage/new-stage.component';
import { CreatedStagesComponent } from '../quick/created-stages/created-stages.component';
import { ListStudyStoreComponent } from './list-study-store/list-study-store.component';
import { NewAssetComponent } from '../document/new-asset/new-asset.component';
import { SimpleEditorComponent } from '../template/simple-editor/simple-editor.component';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.css']
})
export class StudyComponent implements OnInit {

  stagesDB:any[] = [];
  createdStages;

  idAux:number = 0;

  stages:any[] = [];

  currentUserId = localStorage.getItem('userId');
  studyForm: FormGroup;
  advancedMode: boolean = false;
  isEdit: boolean = false;
  idEdit: string;
  showNewStage: boolean;
  showRepository: boolean;
  showStore: boolean;
  storeStudies = [];
  filterStore = [];
  myLocales = [];
  myDomains = [];
  myTasks = [];
  myModals = [];
  myStudies = [];
  loadedStudy: any;

  constructor(private location: Location, public dialog: MatDialog, private stageService: StagesService, 
    private fb: FormBuilder, private assetsService: AssetsService, private uploadService: UploadService,
    private studyService: StudyService, private utils: UtilsService) {}

  ngOnInit() {
    this.getMyStages();
    this.getMyDomains();
    this.getMyTasks();
    this.getMyLocales();
    this.getMyModals();
    this.getMyStudies();
    this.getPublicStudies();
    this.showNewStage = this.showRepository = this.showStore = false;
    this.studyForm = this.fb.group({
      id: ['New Study Title', Validators.required],
      locale: ['', Validators.required],
      domain: ['', Validators.required],
      task: ['', Validators.required],
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
      maxStars: [3, Validators.min(3)],
      taskPage: ['', Validators.required],
      replaceWithRelevantDocuments: [false],
      avatar: ['', Validators.required],
      stages: this.fb.array([]),
      public: [false],
      tags: new FormControl()
    });
    this.studyForm.controls['stages'].setValidators([Validators.required]);
  }

  loadStudy(study: any){
    //console.log(study);
    this.loadedStudy = study;
    this.isEdit = true;
    this.stages = [];
    this.idEdit = study._id;
    this.studyForm.patchValue({
      id: study.id,
      locale: study.locale,
      avatar: study.avatar,
      domain: study.domain,
      task: study.task,
      maxGlobalTime: study.maxGlobalTime,
      minBookmarks: study.minBookmarks,
      maxBookmarks: study.maxBookmarks,
      minSnippetWordLength: study.minSnippetWordLength,
      maxSnippetWordLength: study.maxSnippetWordLength,
      minSnippetsPerPage: study.minSnippetsPerPage,
      maxSnippetsPerPage: study.maxSnippetsPerPage,
      snippetWordTruncateThreshold: study.snippetWordTruncateThreshold,
      minSynthesisCharLength: study.minSynthesisCharLength,
      minSynthesisWordLength: study.minSynthesisWordLength,
      syhtesisAutosaveInterval: study.syhtesisAutosaveInterval,
      maxStars: study.maxStars,
      taskPage: study.taskPage,
      replaceWithRelevantDocuments: study.replaceWithRelevantDocuments,
      public: study.public
    });
    if(study.tags.length > 0){
      let tagsAux = [];
      for (const tag of study.tags){
        tagsAux.push({display: tag, value: tag});
      }
      this.studyForm.controls['tags'].setValue(tagsAux);
    }
    for( const s of study.stages){
      this.getStagesForm.push(new FormControl(s));
      this.stages.push(s);
      this.stageService.getStage(s).subscribe(
        res => {
          let idx = this.stages.indexOf(s);
          this.stages[idx] = res['stage'];
          this.stages[idx].idAux = this.idAux++;
        }
      );
    }
    console.log(this.studyForm.value);
    //console.log(this.stages);
  }

  getPublicStudies(){
    this.studyService.getPublicStudies().subscribe(
      res => {
        this.storeStudies = res['public'].filter(
          s => s.user != this.currentUserId
        );
        this.filterStore = this.storeStudies;
      }
    );
  }

  getMyStudies(){
    this.studyService.getMyStudies().subscribe(
      res => {
        this.myStudies = res['studies'];
      }
    );
  }

  getMyStages(){
    this.stageService.getMyStages().subscribe(
      res => {
        this.createdStages = res['stages'];
        this.stagesDB = this.createdStages;
      },
      err => {
      }
    );
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

  clearForm(){
    this.studyForm.reset();
    this.isEdit = false;
    
    this.studyForm.patchValue({
      maxGlobalTime: -1,
      minBookmarks: 3,
      maxBookmarks: 3,
      minSnippetsPerPage: 2,
      maxSnippetsPerPage: 2,
      minSnippetWordLength: 5,
      maxSnippetWordLength: 20,
      snippetWordTruncateThreshold: 20,
      minSynthesisWordLength: 50,
      minSynthesisCharLength: 425,
      syhtesisAutosaveInterval: 30,
      maxStars: 3,
    });
    this.stages = [];
    this.studyForm.controls['id'].setValue('New Study Title');
    while (this.getStagesForm.length > 0){
      this.getStagesForm.removeAt(0);
    }
  }

  makePublic(){
    this.studyForm.controls['public'].setValue(true);
    this.studyForm.controls['tags'].setValidators([Validators.required]);
    this.studyForm.controls['tags'].updateValueAndValidity();
  }

  cancelPublic(){
    this.studyForm.controls['public'].setValue(false);
    this.studyForm.controls['tags'].clearValidators();
    this.studyForm.controls['tags'].updateValueAndValidity();
    //console.log(this.studyForm.value);
  }

  saveTitle(value:string){
    this.studyForm.controls['id'].setValue(value);
  }

  get getStagesForm(){
    return this.studyForm.get('stages') as FormArray;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.stages, event.previousIndex, event.currentIndex);
    //console.log(this.stages);
  }

  openRepository(){
    let dialogRef = this.dialog.open(CreatedStagesComponent, {
      width: '700px'  
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.editable){
          this.editStage(result);
        } else if(result.delete){
          this.deleteStageDB(result);
        } else {
          this.addStageDB(result);
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

  addStageDB(stage){
    let aux = stage;
    aux.idAux = this.idAux;
    this.idAux++;
    this.stages.push(aux);
    this.getStagesForm.push(new FormControl(stage._id));
  }

  assignComponentStage(typeName){
    let stageComp;
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
    return stageComp;
  }

  //Funcion que intercambia data con dos componentes instanciados desde la misma
  newStage(typeName:string = ''){
    let stageComp, dialogType, dialogRef;
    //Componente instanciado para obtener el tipo de etapa
    dialogType = this.dialog.open(NewStageComponent, {
      width: '600px'
    });
    //Apertura del componente
    dialogType.afterClosed().subscribe(result => {
      //Si recibe un tipo de etapa se genera un nuevo componente con el formulario correspondiente
      if(result){
        typeName = result;
        stageComp = this.assignComponentStage(typeName);
        //Nueva llamada al componente en base al tipo de etapa
        dialogRef = this.dialog.open(stageComp, {
          width: '600px',
          data: {
            typeName,
            isEdit: false
          }
        });
        //Cuando es completada la data y enviada al padre se guarda la nueva etapa
        dialogRef.afterClosed().subscribe(result => {
          if(result){
              //console.log(result);
              let aux = result;
              aux['idAux'] = this.idAux;
              this.idAux++;
              this.stages.push(aux);
              this.getMyStages();
              this.getStagesForm.push(new FormControl(aux._id));
          }
        });
      }
    });
  }

  editStage(stage){
    let stageComp, dialogRef;
    stageComp = this.assignComponentStage(stage.state);
    dialogRef = this.dialog.open(stageComp, {
      width: '600px',
      data: {
        typeName: stage.state,
        isEdit: true,
        stage
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getMyStages();
        if(stage.user != this.currentUserId){
          let index = this.stages.map( a => {
              return a.idAux;
            } ).indexOf(stage.idAux);
          this.stages.splice(index, 1);
          this.getStagesForm.removeAt(this.getStagesForm.value.findIndex(q => q == stage._id));
          result.idAux = this.idAux++;
          this.stages.push(result);
          this.getStagesForm.push(new FormControl(result._id));
        } else {
          this.loadStudy(this.loadedStudy);
        }
      }
    });
  }

  editTitle(value:string){
    const dialogRef = this.dialog.open(TitleEditComponent, {
      width: '250px',
      data: {title: value}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return;
      }
      this.saveTitle(result.title)
    });
  }

  searchStage(name: string){
    this.createdStages = this.stagesDB.filter(obj => obj.id.includes(name));
  }

  openStore(){
    const dialogRef = this.dialog.open(ListStudyStoreComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.addStudyStore(result);
      }
    });
  }

  addStudyStore(study: any){
    let data = study;
    data['locales'] = this.myLocales;
    data['domains'] = this.myDomains;
    data['tasks'] = this.myTasks;
    data['modals'] = this.myModals;
    const dialogRef = this.dialog.open(AddStudyStoreComponent, {
      width: '800px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getMyStudies();
      }
    });
  }

  deleteStageDB(stage){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: stage.id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.stageService.deleteStage(stage._id).subscribe(
          res => {
            while(this.stages.includes(stage)){
              let index = this.stages.map( a => {
                return a._id;
              } ).indexOf(stage._id);
              this.stages.splice(index, 1);
            }
            this.getMyStages();
            this.openRepository();
          }
        );
      }
    });
  }

  deleteStage(stage: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: stage.id
      });
    dialogRef.afterClosed().subscribe(result => {
        if(result) {
          let index = this.stages.map( a => {
              return a.idAux;
            } ).indexOf(stage.idAux);
          this.stages.splice(index, 1);
          this.getStagesForm.removeAt(this.getStagesForm.value.findIndex(q => q == stage._id));
        }
      });
  }

  deleteStudy(study:any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: study.id
      });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.studyService.deleteStudy(study._id).subscribe(
          res => {
            this.stages = this.stages.filter(s => {s._id != study._id});
            this.getMyStudies();
            this.clearForm();
          },
          err => {
            //console.log(err);
          }
        );
      }
    });
  }

  submitStudy(){
    //stages en orden dejado por el usuario
    while (this.getStagesForm.length > 0){
      this.getStagesForm.removeAt(0);
    }
    this.stages.forEach(s => {
      this.getStagesForm.push(new FormControl (s._id))
    });
    let newStudy = this.studyForm.value;
    //Se elimina el tags del nuevo objeto
    delete newStudy.tags;
    newStudy['user'] = this.currentUserId;
    //Si es publico, se le asigna los tags
    if(newStudy.public){
      newStudy.tags = [];
      this.studyForm.controls['tags'].value.forEach(tag => {
        newStudy.tags.push(tag.value);
      });
    }
    //console.log(newStudy);
    this.studyService.newStudy(newStudy).subscribe(
      res => {
        this.getMyStudies();
        this.clearForm();
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

  editStudy(){
    while (this.getStagesForm.length > 0){
      this.getStagesForm.removeAt(0);
    }
    this.stages.forEach(s => {
      this.getStagesForm.push(new FormControl (s._id))
    });
    let putStudy = this.studyForm.value;
    //Se elimina el tags del nuevo objeto
    delete putStudy.tags;
    putStudy['user'] = this.currentUserId;
    //Si es publico, se le asigna los tags
    if(putStudy.public){
      putStudy.tags = [];
      this.studyForm.controls['tags'].value.forEach(tag => {
        putStudy.tags.push(tag.value);
      });
    }
    //console.log(putStudy);
    this.studyService.editStudy(this.idEdit, putStudy).subscribe(
      res => {
        this.getMyStudies();
        this.clearForm();
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
