import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { QuestionsService } from 'src/app/services/questions.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.css']
})
export class NewQuestionComponent implements OnInit {

  newQuestionForm: FormGroup;
  isOptions: Boolean = false;
  isScale: Boolean = false;
  isRating: Boolean = false;
  isEdit: Boolean = false;
  typesQuestions: any[] = [];
  selectedType = '';

  
  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<NewQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private questionService: QuestionsService, private utils: UtilsService) {
    }

  ngOnInit() {
    this.typesQuestions = this.utils.getTypesQuestion();
    if(this.data._id){
      this.newQuestionForm = this.fb.group({
        title: ['', Validators.compose([
          Validators.required
        ])],
        questionId: ['', Validators.compose([
          Validators.required
        ])],
        hint: [''],
        required: [false],
        options: this.fb.array([])
      });
      if(["multiple choice", "checkbox", "list"].includes(this.data.type.toLowerCase())){
        this.isOptions = true;
        this.newQuestionForm.controls['options'].setValidators([Validators.required]);
      } else if(this.data.type.toLowerCase() == "scale"){
        this.isScale = true;
        this.newQuestionForm.addControl('min', new FormControl(0, Validators.required));
        this.newQuestionForm.addControl('max', new FormControl(1, Validators.compose([
          Validators.required,
          Validators.min(1)
        ])));
        this.newQuestionForm.addControl('step', new FormControl(1, Validators.compose([
          Validators.required,
          Validators.min(1)
        ])));
        this.newQuestionForm.addControl('minLabel', new FormControl("", Validators.required));
        this.newQuestionForm.addControl('maxLabel', new FormControl("", Validators.required));
  
      } else if(this.data.type.toLowerCase() == "rating"){
        this.isRating = true;
        this.newQuestionForm.addControl('maxStars', new FormControl(0, Validators.compose([
          Validators.required,
          Validators.min(3)
        ])));
      }
      this.editQuestion();
    }
  }

  loadFormType(){
    this.isOptions = this.isRating = this.isScale = false;
    this.data = this.selectedType;
    this.newQuestionForm = this.fb.group({
      title: ['', Validators.compose([
        Validators.required
      ])],
      questionId: ['', Validators.compose([
        Validators.required
      ])],
      hint: [''],
      required: [false],
      options: this.fb.array([])
    });
    if(["multiple choice", "checkbox", "list"].includes(this.data.type.toLowerCase())){
      this.isOptions = true;
      this.newQuestionForm.controls['options'].setValidators([Validators.required]);
    } else if(this.data.type.toLowerCase() == "scale"){
      this.isScale = true;
      this.newQuestionForm.addControl('min', new FormControl(0, Validators.required));
      this.newQuestionForm.addControl('max', new FormControl(1, Validators.compose([
        Validators.required,
        Validators.min(1)
      ])));
      this.newQuestionForm.addControl('step', new FormControl(1, Validators.compose([
        Validators.required,
        Validators.min(1)
      ])));
      this.newQuestionForm.addControl('minLabel', new FormControl("", Validators.required));
      this.newQuestionForm.addControl('maxLabel', new FormControl("", Validators.required));

    } else if(this.data.type.toLowerCase() == "rating"){
      this.isRating = true;
      this.newQuestionForm.addControl('maxStars', new FormControl(0, Validators.compose([
        Validators.required,
        Validators.min(3)
      ])));
    }
  }

  editQuestion(){
    this.isEdit = true;
    this.newQuestionForm.controls['title'].setValue(this.data.title);
    this.newQuestionForm.controls['questionId'].setValue(this.data.questionId);
    this.newQuestionForm.controls['hint'].setValue(this.data.hint);
    this.newQuestionForm.controls['required'].setValue(this.data.required);
    if(this.isOptions){
      setTimeout(() => {
        const options = this.getOptions;
        this.data.options.forEach(o => {
          options.push(this.fb.control(o));
        });
      }, 200);
    }else if(this.isScale){
      this.newQuestionForm.controls['min'].setValue(this.data.min);
      this.newQuestionForm.controls['max'].setValue(this.data.max);
      this.newQuestionForm.controls['step'].setValue(this.data.step);
      this.newQuestionForm.controls['minLabel'].setValue(this.data.minLabel);
      this.newQuestionForm.controls['maxLabel'].setValue(this.data.maxLabel);
    } else if(this.isRating){
      this.newQuestionForm.controls['maxStars'].setValue(this.data.maxStars);
    }
  }

  get getOptions(){
    return this.newQuestionForm.get('options') as FormArray;
  }
  addOption(){
    this.getOptions.push(this.fb.control(''));
  }

  deleteOption(i:number){
    this.getOptions.removeAt(i);
  }

  scaleCheck(){
    if(this.isScale){
      let max = this.newQuestionForm.get('max').value;
      let min = this.newQuestionForm.get('min').value;
      if(max > min && max > 0 && min >= 0){
        return true;
      }
      return false;
    }
    return true;
  }

  stepCheck(){
    if(this.isScale){
      let step = this.newQuestionForm.get('step').value;
      let max = this.newQuestionForm.get('max').value;
      let min = this.newQuestionForm.get('min').value;
      if(step >= min && step <= max && step !== 0){
        return true;
      }
      return false;
    }
    return true;
  }

  save(){
    if(this.scaleCheck() && this.stepCheck()){
      let question = {};
      question['title'] = this.newQuestionForm.get('title').value;
      question['questionId'] = this.newQuestionForm.get('questionId').value;
      question['hint'] = this.newQuestionForm.get('hint').value;
      question['required'] = this.newQuestionForm.get('required').value;
      if(this.isOptions){
        question['options'] = this.newQuestionForm.get('options').value;
      } else if(this.isScale){
        question['min'] = this.newQuestionForm.get('min').value;
        question['max'] = this.newQuestionForm.get('max').value;
        question['step'] = this.newQuestionForm.get('step').value;
        question['minLabel'] = this.newQuestionForm.get('minLabel').value;
        question['maxLabel'] = this.newQuestionForm.get('maxLabel').value;
      } else if(this.isRating){
        question['maxStars'] = this.newQuestionForm.get('maxStars').value;
      }
      //console.log(this.newQuestionForm.get('options').value);
      //console.log(question);
      if(!this.isEdit){
        question['user'] = localStorage.getItem('userId');
        question['type'] = this.data.type.toLowerCase();
        this.questionService.newQuestion(question).subscribe(
          res => {
            //console.log(res);
            question['_id'] = res['question']._id;
            this.dialogRef.close(question);
          },
          err => {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err
            });
            this.dialogRef.close()
            //console.log(err);
          }
        );
      }else {
        this.questionService.editQuestion(this.data._id, question).subscribe(
          res => {
            //console.log(res);
            this.dialogRef.close(question)
          },
          err => {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err
            });
            this.dialogRef.close()
            //console.log(err);
          }
        )
      }
      //console.log(this.newQuestionForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}