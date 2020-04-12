import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadService } from 'src/app/services/upload.service';
import { SynthesisService } from 'src/app/services/synthesis.service';
import { StagesService } from 'src/app/services/stages.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-synthesis',
  templateUrl: './synthesis.component.html',
  styleUrls: ['./synthesis.component.css']
})
export class SynthesisComponent implements OnInit {

  synthesisForm: FormGroup;
  images: any = [];
  modals: any = [];
  forms: any = [];

  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<SynthesisComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private uploadService: UploadService, private synthService: SynthesisService, 
    private stageService: StagesService, private router: Router) { }

  ngOnInit() {
    this.synthesisForm = this.fb.group({
      id: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      time: [-1, Validators.compose([Validators.required, Validators.min(-1)])],
      alert: [10, Validators.compose([Validators.required, Validators.min(-1)])],
      tips: ['', Validators.required],
      form: ['', Validators.required],
      slides: ['', Validators.required],
      stage: ['', Validators.required]
    });
    this.uploadService.getHtml("1").subscribe(
      res => {
        this.modals = res['html'];
      }
    );
    this.uploadService.getImages().subscribe(
      res => {
        this.images = res['images']
      }
    );
    this.synthService.getMySynthesis().subscribe(
      res => {
        this.forms = res['synthesis']
      }
    );
    if(this.data.isEdit){
      this.loadStage(this.data.stage);
      if(this.data.stage.user != localStorage.getItem('userId')){
        this.data.isEdit = false;
      }
    }
  }

  loadStage(stage){
    this.synthesisForm.controls['id'].setValue(stage.id);
    this.synthesisForm.controls['time'].setValue(stage.time);
    this.synthesisForm.controls['alert'].setValue(stage.reminderAlert);
    this.synthesisForm.controls['tips'].setValue(stage.tips);
    this.synthesisForm.controls['form'].setValue(stage.form);
    this.synthesisForm.controls['slides'].setValue(stage.slides);
    this.synthesisForm.controls['stage'].setValue(stage.stage);
  }

  save(){
    let synthObj = this.synthesisForm.value;
    synthObj['state'] = this.data.typeName;
    synthObj['type'] = "stage";
    synthObj['user'] = localStorage.getItem('userId');
    if(this.data.isEdit){
      this.editStage(this.data.stage, synthObj);
    } else{
      this.saveNewStage(synthObj);
    }
  }

  saveNewStage(obj){
    this.stageService.newStage(obj).subscribe(
      res => {
        this.dialogRef.close(res['stage']);
      },
      err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Error en el servidor'
        });
        this.dialogRef.close();
      }
    );
  }

  editStage(old, newObj){
    this.stageService.editStage(old._id, newObj).subscribe(
      res => {
        this.dialogRef.close(res['stage']);
      },
      err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Error en el servidor'
        });
        this.dialogRef.close();
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  newQuestionnaire(){
    this.router.navigate(['/test']);
    this.dialogRef.close();
  }

  newModal(){
    this.router.navigate(['/template']);
    this.dialogRef.close();
  }

}
