import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { UploadService } from 'src/app/services/upload.service';
import { StagesService } from 'src/app/services/stages.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UploadComponent } from '../../template/upload/upload.component';
import { SimpleEditorComponent } from '../../template/simple-editor/simple-editor.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  modals: any = [];
  images: any = [];

  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<SearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private uploadService: UploadService, private stageService: StagesService, 
    private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      id: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      time: [-1, Validators.compose([Validators.required, Validators.min(-1)])],
      alert: [10, Validators.compose([Validators.required, Validators.min(-1)])],
      tips: ['', Validators.required],
      slides: ['', Validators.required],
      stage: ['', Validators.required]
    });
    this.getMyModals();
    this.getMyImages();
    
    if(this.data.isEdit){
      this.loadStage(this.data.stage);
    }
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
    this.searchForm.controls['id'].setValue(stage.id);
    this.searchForm.controls['time'].setValue(stage.time);
    this.searchForm.controls['alert'].setValue(stage.reminderAlert);
    this.searchForm.controls['tips'].setValue(stage.tips);
    this.searchForm.controls['slides'].setValue(stage.slides);
    this.searchForm.controls['stage'].setValue(stage.stage);
  }

  save(){
    let searchObj = this.searchForm.value;
    searchObj['state'] = this.data.typeName;
    searchObj['type'] = "stage";
    searchObj['user'] = localStorage.getItem('userId');
    if(this.data.isEdit){
      this.editStage(this.data.stage, searchObj);
    } else{
      this.saveNewStage(searchObj);
      if(this.data.stage.user != localStorage.getItem('userId')){
        this.data.isEdit = false;
      }
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

  newAsset(){
    this.router.navigate(['/template']);
    this.dialogRef.close();
  }

}
