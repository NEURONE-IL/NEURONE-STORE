import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StagesService } from 'src/app/services/stages.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.css']
})
export class EndComponent implements OnInit {

  endForm: FormGroup;

  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<EndComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private stageService: StagesService) { }

  ngOnInit() {
    //Formulario de etapa 'end'
    this.endForm = this.fb.group({
      id: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      time: [-1, Validators.compose([Validators.required, Validators.min(-1)])]
    });
    if(this.data.isEdit){
      this.loadStage(this.data.stage);
      if(this.data.stage.user != localStorage.getItem('userId')){
        this.data.isEdit = false;
      }
    }
  }

  loadStage(stage){
    this.endForm.controls['id'].setValue(stage.id);
    this.endForm.controls['time'].setValue(stage.time);
  }


  save(){
    let endObj = this.endForm.value;
    endObj['state'] = this.data.typeName;
    endObj['type'] = "stage";
    endObj['user'] = localStorage.getItem('userId');
    if(this.data.isEdit){
      this.editStage(this.data.stage, endObj);
    } else{
      this.saveNewStage(endObj);
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

}
