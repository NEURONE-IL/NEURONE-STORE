import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { UploadService } from 'src/app/services/upload.service';
import { SynthesisService } from 'src/app/services/synthesis.service';
import { StagesService } from 'src/app/services/stages.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UploadComponent } from '../../template/upload/upload.component';
import { SimpleEditorComponent } from '../../template/simple-editor/simple-editor.component';

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
  window: Window;

  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<SynthesisComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private uploadService: UploadService, private synthService: SynthesisService, 
    private stageService: StagesService, private router: Router, public dialog: MatDialog) { }

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
    this.getMyModals();
    this.getMyImages();
    this.getMyQuestionnaires();
    if(this.data.isEdit){
      this.loadStage(this.data.stage);
      if(this.data.stage.user != localStorage.getItem('userId')){
        this.data.isEdit = false;
      }
    }
  }

  getMyQuestionnaires(){
    this.synthService.getMySynthesis().subscribe(
      res => {
        this.forms = res['synthesis']
      }
    );
  }

  getMyImages(){
    this.uploadService.getImages().subscribe(
      res => {
        this.images = res['images']
      }
    );
  }

  getMyModals(){
    this.uploadService.getHtml("1").subscribe(
      res => {
        this.modals = res['html'];
      }
    );
  }

  uploadDialog(type: number){
    let component;
    if(type === 4){
      component = UploadComponent;
    } else if(type === 1){
      component = SimpleEditorComponent;
    }
    let dialogRef = this.dialog.open(component, {
      width: '50%',
      data: type
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getMyImages();
      this.getMyModals();
    });
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
    window.open(window.origin + '/#/test');
  }

  newModal(){
    this.router.navigate(['/template']);
    this.dialogRef.close();
  }

}
