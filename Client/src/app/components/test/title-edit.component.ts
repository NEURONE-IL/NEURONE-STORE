import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-title-edit',
  templateUrl: './title-edit.component.html',
  styleUrls: ['./title-edit.component.css']
})
export class TitleEditComponent implements OnInit {

  forma:FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<TitleEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.forma = fb.group({
        'title': data.title
      });
    }

  ngOnInit() {
  }

  saveTitle(){
    this.dialogRef.close(this.forma.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
