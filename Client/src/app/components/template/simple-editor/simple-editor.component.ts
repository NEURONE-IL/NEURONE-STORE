import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadService } from 'src/app/services/upload.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-simple-editor',
  templateUrl: './simple-editor.component.html',
  styleUrls: ['./simple-editor.component.css']
})
export class SimpleEditorComponent implements OnInit {

  publicSimple: boolean = false;
  editorForm: FormGroup;
  fileRichText: File;
  typeFile: string;

  @ViewChild('fileNameSimple') fileNameSimple
  @ViewChild('htmlTypeSimple') htmlTypeSimple

  constructor(public dialogRef: MatDialogRef<SimpleEditorComponent>, public uploadService: UploadService,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.editorForm = new FormGroup({
      'editor': new FormControl(null)
    });
    if(this.data === 1){
      this.typeFile = 'Modal';
    } else{
      this.typeFile = 'Template';
    }
  }

  get richText(){
    return this.editorForm.get("editor").value;
  }

  clearRichText(){
    this.editorForm.reset();
  }

  saveRichText(){
    let htmlType = this.data.toString();
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
        return this.dialogRef.close();
      },
      err => {
        //console.log(err);
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Error al crear el archivo. Reintentar.'
        });
        return this.dialogRef.close();
      }
    );
  }

}
