import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadService } from 'src/app/services/upload.service';
import { StagesService } from 'src/app/services/stages.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    private router: Router) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      id: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      time: [-1, Validators.compose([Validators.required, Validators.min(-1)])],
      alert: [10, Validators.compose([Validators.required, Validators.min(-1)])],
      tips: ['', Validators.required],
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
    if(this.data.isEdit){
      this.loadStage(this.data.stage);
    }
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
