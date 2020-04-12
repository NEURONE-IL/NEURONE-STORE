import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadService } from 'src/app/services/upload.service';
import { QuestionnairesService } from 'src/app/services/questionnaires.service';
import { StagesService } from 'src/app/services/stages.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-critical-eval',
  templateUrl: './critical-eval.component.html',
  styleUrls: ['./critical-eval.component.css']
})
export class CriticalEvalComponent implements OnInit {

  criticalForm: FormGroup;
  images: any = [];
  modals: any = [];
  questionnaires: any = [];

  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<CriticalEvalComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private uploadService: UploadService, private qsService: QuestionnairesService,
    private stageService: StagesService, private router: Router) { }

  ngOnInit() {
    this.criticalForm = this.fb.group({
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
    this.qsService.getMyQuestionnaires().subscribe(
      res => {
        this.questionnaires = res['questionnaires']
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
    this.criticalForm.controls['id'].setValue(stage.id);
    this.criticalForm.controls['time'].setValue(stage.time);
    this.criticalForm.controls['alert'].setValue(stage.reminderAlert);
    this.criticalForm.controls['tips'].setValue(stage.tips);
    this.criticalForm.controls['form'].setValue(stage.form);
    this.criticalForm.controls['slides'].setValue(stage.slides);
    this.criticalForm.controls['stage'].setValue(stage.stage);
  }

  save(){
    let criticalObj = this.criticalForm.value;
    criticalObj['state'] = this.data.typeName;
    criticalObj['type'] = "stage";
    criticalObj['user'] = localStorage.getItem('userId');
    if(this.data.isEdit){
      this.editStage(this.data.stage, criticalObj);
    } else{
      this.saveNewStage(criticalObj);
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
