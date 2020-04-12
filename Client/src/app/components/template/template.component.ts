import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { UploadService } from 'src/app/services/upload.service';
import { UploadComponent } from './upload/upload.component';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ExampleComponent } from './example/example.component';
import { PreviewAssetComponent } from './preview-asset/preview-asset.component';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit, AfterViewInit {
  @ViewChild('codeeditor') private codeEditor;
  codedTemplate:string = `<h1>Load and Compile the example</h1>`;
  viewBuilder: boolean = false;
  viewUploader: boolean = false;
  assetsList: any[] = [];
  editorForm: FormGroup;
  fileRichText: File;
  fileHtmlCoded: File;
  assetType: number;
  showHtml: boolean = false;
  htmlTextButton: string = 'Show';
  publicSimple: boolean = false;
  publicCoded: boolean = false;
  
  @ViewChild('fileNameCoded') fileNameCoded
  @ViewChild('fileNameSimple') fileNameSimple
  @ViewChild('htmlTypeSimple') htmlTypeSimple
  @ViewChild('htmlTypeCoded') htmlTypeCoded

  constructor( private location: Location, public dialog: MatDialog, public uploadService: UploadService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.editorForm = new FormGroup({
      'editor': new FormControl(null)
    })
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  get richText(){
    return this.editorForm.get("editor").value;
  }

  get htmlCoded(){
    return this.codeEditor.codeMirror.getDoc().getValue();
  }

  show(){
    this.codedTemplate = this.codeEditor.codeMirror.getDoc().getValue(); 
  }

  activeBuilder(){
    this.viewUploader = false;
    this.viewBuilder = true;
  }

  activeUploader(){
    this.viewBuilder = false;
    this.viewUploader = true;
  }

  showHtmlFiles(type: number){
    this.showHtml = !this.showHtml;
    if(type == 1){
      this.fillAssetsList(2);
    } else {
      this.fillAssetsList(3);
    }
    if(this.showHtml){
      this.htmlTextButton = 'Hide';
    }else{
      this.htmlTextButton = 'Show';
    }
  }

  fillAssetsList(type: number){
    switch(type){
      //Locales
      case 1: {
        this.assetsList = [];
        this.uploadService.getLocales().subscribe(
          res => {
            this.assetsList = res['locales']
          },
          err => {
            //console.log(err);
          }
        );
        this.assetType = 1;
        break;
      }
      //Modals
      case 2: {
        this.assetsList = [];
        this.uploadService.getHtml("1").subscribe(
          res => {
            this.assetsList = res['html']
          },
          err => {
            //console.log(err);
          }
        );
        this.assetType = 2;
        break;
      }
      //Templates
      case 3: {
        this.assetsList = [];
        this.uploadService.getHtml("2").subscribe(
          res => {
            this.assetsList = res['html']
          },
          err => {
            //console.log(err);
          }
        );
        this.assetType = 3;
        break;
      }
      //Images
      case 4: {
        this.assetsList = [];
        this.uploadService.getImages().subscribe(
          res => {
            this.assetsList = res['images']
          },
          err => {
            //console.log(err);
          }
        );
        this.assetType = 4;
        break;
      }
    }
  }

  previewAsset(fileName: string, type: number){
    const dialogRef = this.dialog.open(PreviewAssetComponent, {
        width: '900px',
        data: {
          fileName,
          type,
          public: false
        }
      });
      dialogRef.afterClosed().subscribe();
  }

  downloadAsset(name: string){
    this.uploadService.downloadFile(name, this.assetType).subscribe(
      res => {
        let blob, file;
        switch (this.assetType){
          case 1:
            blob = new Blob([res], {type: 'application/json'});
            break;
          case 2:
            blob = new Blob([res], {type: 'text/html'});
            break;
          case 3:
            blob = new Blob([res], {type: 'text/html'});
            break;
          case 4:
            blob = new Blob([res], {type: 'image/jpg'});
            break;
        }
        let arrayOfBlob = new Array<Blob>();
        arrayOfBlob.push(blob);
        switch (this.assetType){
          case 1:
            file = new File(arrayOfBlob, name, {type: 'application/json'});
            break;
          case 2:
            file = new File(arrayOfBlob, name, {type: 'text/html'});
            break;
          case 3:
            file = new File(arrayOfBlob, name, {type: 'text/html'});
            break;
          case 4:
            file = new File(arrayOfBlob, name, {type: 'image/jpg'});
            break;
        }
        //Download file
        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(blob);
        a.download = file.name;
        a.href = url;
        a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        // For Firefox it is necessary to delay revoking the ObjectURL
        setTimeout(function () {
          window.URL.revokeObjectURL(url);
          a.remove();
        }, 100);
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

  editHtml(asset: string){
    this.showHtml = false;
    let filename = asset.split('.').reduce((a, c) => {
      if(c != 'html'){
        return c + a;
      } 
      return a;
    }, "");
    this.fileNameCoded.nativeElement.value = filename;
    this.uploadService.downloadFile(asset, this.assetType).subscribe(
      res => {
        let blob;
        switch (this.assetType){
          case 1:
            blob = new Blob([res], {type: 'application/json'});
            break;
          case 2:
            blob = new Blob([res], {type: 'text/html'});
            break;
          case 3:
            blob = new Blob([res], {type: 'text/html'});
            break;
          case 4:
            blob = new Blob([res], {type: 'image/jpg'});
            break;
        }
        let test = new FileReader();
        test.readAsText(blob);
        test.onload = () => {
          this.codeEditor.codeMirror.getDoc().setValue(test.result);
        }
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

  deleteAsset(name: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: name
      });
    dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.uploadService.deleteFile(name, this.assetType).subscribe(
            res => {
              //console.log(res);
              Swal.fire({
                type: 'success',
                title: res['message']
              });
              switch (this.assetType){
                case 1:
                  this.fillAssetsList(1);
                  break;
                case 2:
                  this.fillAssetsList(2);
                  break;
                case 3:
                  this.fillAssetsList(3);
                  break;
                case 4:
                  this.fillAssetsList(4);
                  break;
              }
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
      });
  }


  clearRichText(){
    this.editorForm.reset();
  }
  clearHtmlCoded(){
    this.codeEditor.codeMirror.getDoc().setValue(``);
  }

  example(type: number){
    let dialogRef = this.dialog.open(ExampleComponent, {
      width: '800px',
      height: '600px',
      data: type
    });
  }

  uploadDialog(type: number){
    let dialogRef = this.dialog.open(UploadComponent, {
      width: '600px',
      data: type
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fillAssetsList(type);
    });
  }

  saveRichText(){
    let htmlType = this.htmlTypeSimple.nativeElement.value;
    let fileName = this.fileNameSimple.nativeElement.value;
    if(fileName.length < 5){
      Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: "File name must have 5 characters"
            });
      return;
    }
    let htmlText = this.richText;
    let blob = new Blob([htmlText], {type: 'text/html'});
    let arrayOfBlob = new Array<Blob>();
    arrayOfBlob.push(blob);
    this.fileRichText = new File(arrayOfBlob, fileName + ".html", {type: 'text/html'});
    //console.log(this.fileRichText);
    this.uploadService.uploadHtml(this.fileRichText, htmlType, this.publicSimple).subscribe(
      res => {
        //console.log(res);
        Swal.fire({
          type: 'success',
          title: res['message']
        });
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

  saveHtmlCoded(){
    let fileName = this.fileNameCoded.nativeElement.value;
    let htmlType = this.htmlTypeCoded.nativeElement.value;
    if(fileName.length < 5){
      Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: "File name must have 5 characters"
            });
      return;
    }
    let codeText = this.htmlCoded;
    codeText = `<!doctype html>
    
    <head>
        <meta charset="utf-8">
        <base href="/">
    
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    
    </head>` + codeText;
    let blob = new Blob([codeText], {type: 'text/html'});
    let arrayOfBlob = new Array<Blob>();
    arrayOfBlob.push(blob);
    this.fileHtmlCoded = new File(arrayOfBlob, fileName + ".html", {type: 'text/html'});
    //console.log(this.fileHtmlCoded);
    this.uploadService.uploadHtml(this.fileHtmlCoded, htmlType, this.publicCoded).subscribe(
      res => {
        //console.log(res);
        Swal.fire({
          type: 'success',
          title: res['message']
        });
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

  exampleHtmlCode(){
    let editor = this.codeEditor.codeMirror;
    let doc = editor.getDoc();
    doc.setValue(`<div class="container" style="margin-top:30px">
      <div class="row">
        <div class="col-sm-4">
          <h2>About Me</h2>
          <h5>Photo of me:</h5>
          <div class="fakeimg">Fake Image</div>
          <p>Some text about me in culpa qui officia deserunt mollit anim..</p>
          <h3>Some Links</h3>
          <p>Lorem ipsum dolor sit ame.</p>
          <ul class="nav nav-pills flex-column">
            <li class="nav-item">
              <a class="nav-link active" href="#">Active</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
          <hr class="d-sm-none">
        </div>
        <div class="col-sm-8">
          <h2>TITLE HEADING</h2>
          <h5>Title description, Dec 7, 2017</h5>
          <div class="fakeimg">Fake Image</div>
          <p>Some text..</p>
          <p>Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
          <br>
          <h2>TITLE HEADING</h2>
          <h5>Title description, Sep 2, 2017</h5>
          <div class="fakeimg">Fake Image</div>
          <p>Some text..</p>
          <p>Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
        </div>
      </div>
    </div>`);
  }

}
