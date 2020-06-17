import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from 'src/app/services/upload.service';
import { StagesService } from 'src/app/services/stages.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SimpleEditorComponent } from '../../template/simple-editor/simple-editor.component';

@Component({
  selector: 'app-affective',
  templateUrl: './affective.component.html',
  styleUrls: ['./affective.component.css']
})
export class AffectiveComponent implements OnInit {

  affectiveForm: FormGroup;
  templates: any = [];

  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<AffectiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data, public uploadService: UploadService, private stageService: StagesService,
    private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.affectiveForm = this.fb.group({
      id: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      time: [-1, Validators.compose([Validators.required, Validators.min(-1)])],
      avatar: ['', Validators.required],
      answerType: ['', Validators.required],
      page: ['', Validators.required],
      stage: ['', Validators.required]
    });
    this.getMyTemplates();
    if(this.data.isEdit){
      this.loadStage(this.data.stage);
      if(this.data.stage.user != localStorage.getItem('userId')){
        this.data.isEdit = false;
      }
    }
  }

  getMyTemplates(){
    this.uploadService.getHtml("2").subscribe(
      res => {
        this.templates = res['html']
      }
    );
  }

  uploadDialog(type: number){
    let dialogRef = this.dialog.open(SimpleEditorComponent, {
      width: '50%',
      data: type
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getMyTemplates();
    });
  }

  loadStage(stage){
    this.affectiveForm.controls['id'].setValue(stage.id);
    this.affectiveForm.controls['time'].setValue(stage.time);
    this.affectiveForm.controls['avatar'].setValue(stage.avatar);
    this.affectiveForm.controls['answerType'].setValue(stage.answerType);
    this.affectiveForm.controls['page'].setValue(stage.page);
    this.affectiveForm.controls['stage'].setValue(stage.stage);
  }

  save(){
    let affectiveObj = this.affectiveForm.value;
    affectiveObj['state'] = this.data.typeName;
    affectiveObj['type'] = "stage";
    affectiveObj['user'] = localStorage.getItem('userId');
    if(this.data.isEdit){
      this.editStage(this.data.stage, affectiveObj);
    } else{
      this.saveNewStage(affectiveObj);
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

  // newTemplate(){
  //   this.router.navigate(['/template']);
  //   this.dialogRef.close();
  // }
}
