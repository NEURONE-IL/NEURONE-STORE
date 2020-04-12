import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { DocumentsService } from 'src/app/services/documents.service';
import Swal from 'sweetalert2';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { NewAssetComponent } from './new-asset/new-asset.component';
import { EditAssetComponent } from './edit-asset/edit-asset.component';
import { AssetsService } from 'src/app/services/assets.service';
import { PreviewComponent } from './preview/preview.component';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  documentForm: FormGroup;
  myDocuments: any = [];
  isEdit: Boolean = false;
  docIdEdit: String;
  myLocales: any = [];
  myDomains: any = [];
  myTasks: any = []; 

  constructor(private location: Location, private formBuilder: FormBuilder, private docService: DocumentsService, 
    public dialog: MatDialog, public assetService: AssetsService) { }

  ngOnInit() {
    this.getDocuments();
    this.getLocales();
    this.getDomains();
    this.getTasks();
    this.documentForm = this.formBuilder.group({
      docName: ['', Validators.required],
      docURL: ['', Validators.required],
      maskedURL: [''],
      docTitle: ['', [Validators.required, Validators.minLength(6)]],
      localeCode: ['', Validators.required],
      domain: ['', Validators.required],
      task: ['', Validators.required],
      keywords: this.formBuilder.array([]),
      searchSnippet: [''],
      relevant: [false],
      tags: new FormControl()
    });
  }

  getLocales(){
    this.assetService.getMyLocales().subscribe(
      res => {
        this.myLocales = res['locales']
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
        this.myDomains = res['domains']
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
        this.myTasks = res['tasks']
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

  getDocuments(){
    this.docService.getMyDocs().subscribe(
      res => {
        this.myDocuments = res['documents'];
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

  // convenience getter for easy access to form fields
  get f() { return this.documentForm.controls; }

  get getKeywords(){ return this.documentForm.get('keywords') as FormArray }

  addKeyword(){
    this.getKeywords.push(this.formBuilder.control(''));
  }

  addAsset(type: number){
    const dialogRef = this.dialog.open(NewAssetComponent, {
      width: '600px',
      data: type
    });
    dialogRef.afterClosed().subscribe(newAsset => {
      if(newAsset){
        switch(type){
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
      }
    });
  }

  editAsset(type: number){
    const dialogRef = this.dialog.open(EditAssetComponent, {
      width: '600px',
      data: type
    });
    dialogRef.afterClosed().subscribe(asset => {
      if(asset){
        this.documentForm.reset();
        switch(type){
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
      }
    });
  }

  editDoc(doc:any){
    let tagsObj = [];
    this.isEdit = true;
    this.documentForm.controls['docName'].setValue(doc.docName);
    this.documentForm.controls['docTitle'].setValue(doc.title);
    this.documentForm.controls['localeCode'].setValue(doc.locale);
    this.documentForm.controls['docURL'].setValue(doc.url);
    this.documentForm.controls['maskedURL'].setValue(doc.maskedUrl);
    this.documentForm.controls['relevant'].setValue(doc.relevant);
    this.documentForm.controls['searchSnippet'].setValue(doc.searchSnippet);
    this.documentForm.controls['domain'].setValue(doc.domain);
    this.documentForm.controls['task'].setValue(doc.task);
    doc.keywords.forEach(k => {
      tagsObj.push({display: k, value: k});
    });
    this.documentForm.controls['tags'].setValue(tagsObj);
    this.docIdEdit = doc._id;
  }

  clearEdit(){
    this.isEdit = false;
    this.documentForm.reset();
  }

  deleteDoc(doc:any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: doc.title
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.docService.deleteDoc(doc._id).subscribe(
          res => {
            this.myDocuments = this.myDocuments.filter(d => d._id !== doc._id);
            this.documentForm.reset();
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
    });
  }

  previewDoc() {
    let keyAux = [];
    if(this.documentForm.controls['tags'].value){

      this.documentForm.controls['tags'].value.forEach(tag => {
        keyAux.push(tag.value);
      });
    }
    let docObj = {
      docName: this.documentForm.controls['docName'].value,
      title: this.documentForm.controls['docTitle'].value,
      locale: this.documentForm.controls['localeCode'].value,
      relevant: this.documentForm.controls['relevant'].value,
      task: this.documentForm.controls['task'].value,
      domain: this.documentForm.controls['domain'].value,
      keywords: keyAux,
      date: new Date(),
      url: this.documentForm.controls['docURL'].value,
      maskedUrl: this.documentForm.controls['maskedURL'].value,
      searchSnippet: this.documentForm.controls['searchSnippet'].value,
      route: null
    }
    const dialogRef = this.dialog.open(PreviewComponent, {
      width: '1100px',
      height: '70%',
      data: docObj
    });
    dialogRef.afterClosed().subscribe();
  }

  onSubmit() {
    let keyAux = [];
    if(this.documentForm.controls['tags'].value){

      this.documentForm.controls['tags'].value.forEach(tag => {
        keyAux.push(tag.value);
      });
    }
    let docObj = {
      docName: this.documentForm.controls['docName'].value,
      title: this.documentForm.controls['docTitle'].value,
      locale: this.documentForm.controls['localeCode'].value,
      relevant: this.documentForm.controls['relevant'].value,
      task: this.documentForm.controls['task'].value,
      domain: this.documentForm.controls['domain'].value,
      keywords: keyAux,
      date: new Date(),
      url: this.documentForm.controls['docURL'].value,
      maskedUrl: this.documentForm.controls['maskedURL'].value,
      searchSnippet: this.documentForm.controls['searchSnippet'].value
    }
    //console.log(docObj);
    if(!this.isEdit){
      docObj['user'] = localStorage.getItem('userId');
      this.docService.newDoc(docObj).subscribe(
        res => {
          //console.log(res);
          this.getDocuments();
          this.documentForm.reset();
        },
        err => {
          //console.log(err);
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: err
          });
        }
      );
    } else {
      this.docService.editDoc(this.docIdEdit, docObj).subscribe(
        res => {
          this.getDocuments();
          this.documentForm.reset();
          this.isEdit = false;
        },
        err => {
          //console.log(err);
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: err
          });
        }
      );
    }
  }


}
