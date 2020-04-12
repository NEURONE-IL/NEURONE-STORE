import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AssetsService } from 'src/app/services/assets.service';

@Component({
  selector: 'app-new-asset',
  templateUrl: './new-asset.component.html',
  styleUrls: ['./new-asset.component.css']
})
export class NewAssetComponent implements OnInit {

  assetForm: FormGroup;
  needDescription: Boolean = false;
  typeAsset: String = 'Locale';

  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<NewAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private assetService: AssetsService) { }

  ngOnInit() {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      alias: ['', Validators.required],
      code: ['', Validators.required],
      description: ['']
    });
    if(this.data !== 1){
      this.needDescription = true;
      if(this.data == 2){
        this.typeAsset = 'Domain'
      } else{ this.typeAsset = 'Task' }
    }
  }

  save(){
    let asset = {};
    asset['name'] = this.assetForm.get('name').value;
    asset['alias'] = this.assetForm.get('alias').value;
    asset['code'] = this.assetForm.get('code').value;
    if(this.needDescription){
      asset['description'] = this.assetForm.get('description').value;
    }
    asset['user'] = localStorage.getItem('userId');
    switch(this.data){
      case 1:
        this.assetService.newLocale(asset).subscribe(
          res => {
            //console.log(res);
          },
          err => {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err
            });
          }
        );
        break;
      case 2:
        this.assetService.newDomain(asset).subscribe(
          res => {
            //console.log(res);
          },
          err => {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err
            });
          }
        );
        break;
      case 3:
        this.assetService.newTask(asset).subscribe(
          res => {
            //console.log(res);
          },
          err => {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: err
            });
          }
        );
        break;
    }
    this.dialogRef.close(asset);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
