import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import { TitleEditComponent } from './title-edit.component';
import { CdkDragDrop, moveItemInArray  } from '@angular/cdk/drag-drop';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NewQuestionComponent } from '../new-question/new-question.component';
import { QuestionsService } from 'src/app/services/questions.service';
import { QuestionnairesService } from 'src/app/services/questionnaires.service';
import Swal from 'sweetalert2';
import { TestDetailComponent } from './test-detail/test-detail.component';
import { AddTestStoreComponent } from './add-test-store/add-test-store.component';
import { CreatedQuestionsComponent } from './created-questions/created-questions.component';
import { TestStoreComponent } from './test-store/test-store.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  editQuestionnaire: Boolean = false;
  editQuestId: String = null;

  idAux:number = 0;

  questions:any[] = [];
  questionnairesDB: any[] = [];
  showNewQuestion: boolean = false;
  showRepository: boolean = false;
  showStore: boolean = false;

  questionnaireForm: FormGroup;

  constructor(private location: Location, private modalService: NgbModal, private formBuilder: FormBuilder, 
    public dialog: MatDialog, private questionsService: QuestionsService, private questionnaireService: QuestionnairesService) { }

  ngOnInit() {
    this.questionnaireForm = this.formBuilder.group({
      questionnaireId: ['New Questionnaire', Validators.required],
      instructions: ['', Validators.required],
      questions: this.formBuilder.array([]),
      public: [false],
      tags: new FormControl()
    });
    this.questionnaireForm.controls['questions'].setValidators([Validators.required]);
    this.getQuestionnairesDB();
  }

  getQuestionnairesDB(){
    this.questionnaireService.getMyQuestionnaires().subscribe(
      res => {
        this.questionnairesDB = res['questionnaires'];
      },
      err => {
        //console.log(err);
      }
    );
  }

  activateNewQuestion(){
    if(this.showNewQuestion){
      this.showNewQuestion = this.showRepository = this.showStore = false;
    } else{
      this.showNewQuestion = true;
      this.showRepository = this.showStore = false;
    }
  }

  openRepository(){
    const dialogRef = this.dialog.open(CreatedQuestionsComponent, {
      width: '800px',
      data: 1
    });
    dialogRef.afterClosed().subscribe((question) => {
      if(question){
          if(question.edited){
            this.editQuestion(question);
            this.questions = this.questions.filter(q => q._id !== question._id);
            return;
          }
          if(question.deleted){
            this.questions = this.questions.filter(q => q._id !== question._id);
            return;
          }
          question.idAux = this.idAux;
          //console.log(question);
          this.idAux++;
          if(this.questions.includes(question._id)){
            let idx = this.questions.indexOf(question._id);
            this.questions[idx] = question;
          } else{
            this.questions.push(question);
          }
          this.getQuestions.push(new FormControl(question._id));
      }
    });
  }

  openStore(){
    const dialogRef = this.dialog.open(TestStoreComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe((questionnaire) => {
      if(questionnaire){
        if(questionnaire.add){
          this.addTestStore(questionnaire);
        }
        if(questionnaire.details){
          this.viewTestStore(questionnaire);
        }
      }
    });

  }

  activateStore(){
    if(this.showStore){
      this.showNewQuestion = this.showRepository = this.showStore = false;
    } else{
      this.showStore = true;
      this.showRepository = this.showNewQuestion = false;
    }
  }

  saveTitle(value:string){
    this.questionnaireForm.controls['questionnaireId'].setValue(value);
  }

  makePublic(){
    this.questionnaireForm.controls['public'].setValue(true);
    this.questionnaireForm.controls['tags'].setValidators([Validators.required]);
    this.questionnaireForm.controls['tags'].updateValueAndValidity();
  }

  cancelPublic(){
    this.questionnaireForm.controls['public'].setValue(false);
    this.questionnaireForm.controls['tags'].clearValidators();
    this.questionnaireForm.controls['tags'].updateValueAndValidity();
    //console.log(this.questionnaireForm);
  }

  viewTestStore(questionnaire: any){
    const dialogRef = this.dialog.open(TestDetailComponent, {
      width: '800px',
      data: questionnaire
    });
    dialogRef.afterClosed().subscribe();
  }

  addTestStore(questionnaire: any){
    const dialogRef = this.dialog.open(AddTestStoreComponent, {
      width: '800px',
      data: questionnaire
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getQuestionnairesDB();
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

  get getQuestions(){
    return this.questionnaireForm.get('questions') as FormArray;
  }

  addQuestion(){
    const dialogRef = this.dialog.open(NewQuestionComponent, {
      width: '600px',
      data: 1
    });
    dialogRef.afterClosed().subscribe(newQuestion => {
      if(newQuestion){
        setTimeout(() => {
          newQuestion['idAux'] = this.idAux;
          this.idAux++;
          this.questions.push(newQuestion);
          this.getQuestions.push(new FormControl(newQuestion._id));
        }, 500)
      }
    });
  }


  addQuestionDB(question: any){
    let aux = {
      title: question.title,
      questionId: question.questionId,
      hint: question.hint,
      required: question.required,
      idAux: this.idAux,
      type: question.type,
      _id: question._id,
      options: question.options
    };
    this.idAux++;
    if(this.questions.includes(question._id)){
      let idx = this.questions.indexOf(question._id);
      this.questions[idx] = aux;
    } else{
      this.questions.push(aux);
    }
    this.getQuestions.push(new FormControl(question._id));
  }

  editQuestion(question){
    const dialogRef = this.dialog.open(NewQuestionComponent, {
      width: '600px',
      data: question
    });
    dialogRef.afterClosed().subscribe(newQuestion => {
      if(newQuestion){
        this.questions = this.questions.filter(q => q._id !== question._id);
      }
    });
  }

  loadQuestionnaire(questionnaire: any, editable: boolean){
    this.clearForm();
    this.questionnaireForm.controls['questionnaireId'].setValue(questionnaire.questionnaireId);
    this.questionnaireForm.controls['instructions'].setValue(questionnaire.instructions);
    this.questionnaireForm.controls['public'].setValue(questionnaire.public);
    if(questionnaire.tags.length > 0){
      let tagsAux = [];
      for (const tag of questionnaire.tags){
        tagsAux.push({display: tag, value: tag});
      }
      this.questionnaireForm.controls['tags'].setValue(tagsAux);
    }
    //se obtiene cada objeto question relacionado a questionnaire
    while(this.getQuestions.length !== 0){
      this.getQuestions.removeAt(0);
    }
    this.questions = [];
    for (const q of questionnaire.questions) {
      this.questionsService.getQuestion(q).subscribe(
        res => {
          if(res['question']){
            this.questions.push(q);
            this.addQuestionDB(res['question']);
          }
        },
        err => {
          //console.log(err);
        }
      );
    }
    if(editable){
      this.editQuestionnaire = true;
      this.editQuestId = questionnaire._id;
    } else {
      this.editQuestionnaire = false;
    }
  }

  clearForm(){
    this.questionnaireForm.reset();
    this.questions = [];
    this.editQuestionnaire = false;
    this.questionnaireForm.controls['questionnaireId'].setValue('New Questionnaire');
    while(this.getQuestions.length > 0){
      this.getQuestions.removeAt(0);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
  }

  deleteQuestion(question: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: question.title
      });
    dialogRef.afterClosed().subscribe(result => {
        if(result) {
          let index = this.questions.map( a => {
              return a.idAux;
            } ).indexOf(question.idAux);
          this.questions.splice(index, 1);
          this.getQuestions.removeAt(this.getQuestions.value.findIndex(q => q == question._id));
        }
      });
  }

  deleteQuestionnaire(questionnaire: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: questionnaire.questionnaireId
      });
    dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.questionnaireService.deleteQuestionnaire(questionnaire._id).subscribe(
            res => {
              this.questionnairesDB = this.questionnairesDB.filter(q => q._id !== questionnaire._id);
              this.questionnaireForm.reset();
              this.questionnaireForm.controls['questionnaireId'].setValue("New Questionnaire");
              this.questions = [];
            },
            err => {
              console.log(err);
            }
          );
        }
      });
  }

  submitQuestionnaire(id?: String){
    //questions en orden dejado por el usuario
    while(this.getQuestions.length > 0){
      this.getQuestions.removeAt(0);
    }
    this.questions.forEach(q => {
      this.getQuestions.push(new FormControl(q._id))
    });
    //Se elimina el tags del nuevo objeto
    let newQuestionnaire = this.questionnaireForm.value;
    delete newQuestionnaire.tags;
    newQuestionnaire["user"] = localStorage.getItem('userId');
    //Si es publico, se le asigna los tags
    if(newQuestionnaire.public){
      newQuestionnaire.tags = [];
      this.questionnaireForm.controls['tags'].value.forEach(tag => {
        newQuestionnaire.tags.push(tag.value);
      });
    }
    //console.log(newQuestionnaire);
    if(!this.editQuestionnaire){
      this.questionnaireService.newQuestionnaire(newQuestionnaire).subscribe(
        res => {
          //console.log(res);
          this.questionnairesDB.push(res['questionnaire']);
          this.clearForm();
        },
        err => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Name of your questionnaire already exists!'
          });
          //console.log(err);
        }
      );
    } else {
      this.questionnaireService.editQuestionnaire(id, newQuestionnaire).subscribe(
        res => {
          this.getQuestionnairesDB();
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
  }

}
