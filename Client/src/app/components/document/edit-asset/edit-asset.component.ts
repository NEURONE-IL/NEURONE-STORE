import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AssetsService } from 'src/app/services/assets.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrls: ['./edit-asset.component.css']
})
export class EditAssetComponent implements OnInit {

  assets: any = [];
  assetForm: FormGroup;
  needDescription: Boolean = false;
  typeAsset: String = 'Locale';
  idAsset: String = null;
  selectedAsset: any = null;

  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<EditAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, private assetService: AssetsService) { }

  ngOnInit() {
    switch(this.data){
      case 1: 
        this.getLocales();
        break;
      case 2:
        this.getDomains();
        break;
      case 3:
        this.getTasks();
        break;
    }
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

  getLocales(){
    this.assetService.getMyLocales().subscribe(
      res => {
        this.assets = res['locales']
      },
      err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err
        });
      }
    );
  }

  getDomains(){
    this.assetService.getMyDomains().subscribe(
      res => {
        this.assets = res['domains']
      },
      err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err
        });
      }
    );
  }

  getTasks(){
    this.assetService.getMyTasks().subscribe(
      res => {
        this.assets = res['tasks']
      },
      err => {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: err
        });
      }
    );
  }

  loadAsset(asset: any){
    this.assetForm.controls['name'].setValue(asset.name);
    this.assetForm.controls['code'].setValue(asset.code);
    this.assetForm.controls['alias'].setValue(asset.alias);
    if(this.data !== 1){
      this.assetForm.controls['description'].setValue(asset.description);
    }
    this.idAsset = asset._id;
  }

  deleteAsset(asset: any){
    const dialogAux = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: asset.name
      });
    dialogAux.afterClosed().subscribe(result => {
        if(result) {
          switch(this.data){
            case 1:
              this.assetService.deleteLocale(asset._id).subscribe(
                res => {
                  this.dialogRef.close(true);
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
              this.assetService.deleteDomain(asset._id).subscribe(
                res => {
                  this.dialogRef.close(true);
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
              this.assetService.deleteTask(asset._id).subscribe(
                res => {
                  this.dialogRef.close(true);
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
        }
      });
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
        this.assetService.editLocale(this.idAsset, asset).subscribe(
          res => {
            //console.log(res);
            this.dialogRef.close(asset);
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
        this.assetService.editDomain(this.idAsset, asset).subscribe(
          res => {
            //console.log(res);
            this.dialogRef.close(asset);
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
        this.assetService.editTask(this.idAsset, asset).subscribe(
          res => {
            //console.log(res);
            this.dialogRef.close(asset);
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
