import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadService } from 'src/app/services/upload.service';
import { StagesService } from 'src/app/services/stages.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  instructionsForm: FormGroup;
  templates:any = [];

  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<InstructionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private uploadService: UploadService, private stageService: StagesService,
    private router: Router) { }

  ngOnInit() {
    this.instructionsForm = this.fb.group({
      id: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      time: [-1, Validators.compose([Validators.required, Validators.min(-1)])],
      page: ['', Validators.required],
      stage: ['', Validators.required]      
    });
    this.uploadService.getHtml("2").subscribe(
      res => {
        this.templates = res['html']
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
    this.instructionsForm.controls['id'].setValue(stage.id);
    this.instructionsForm.controls['time'].setValue(stage.time);
    this.instructionsForm.controls['page'].setValue(stage.page);
    this.instructionsForm.controls['stage'].setValue(stage.stage);
  }

  save(){
    let instructionsObj = this.instructionsForm.value;
    instructionsObj['state'] = this.data.typeName;
    instructionsObj['type'] = "stage";
    instructionsObj['user'] = localStorage.getItem('userId');
    if(this.data.isEdit){
      this.editStage(this.data.stage, instructionsObj);
    } else{
      this.saveNewStage(instructionsObj);
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

  newTemplate(){
    this.router.navigate(['/template']);
    this.dialogRef.close();
  }

}
