import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-preview-asset',
  templateUrl: './preview-asset.component.html',
  styleUrls: ['./preview-asset.component.css']
})
export class PreviewAssetComponent implements OnInit {

  blobResult: string | ArrayBuffer | null = null;
  reader: FileReader = new FileReader();

  constructor(public dialogRef: MatDialogRef<PreviewAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private uploadService: UploadService) { }

  ngOnInit() {
    this.uploadService.downloadFile(this.data.fileName, this.data.type, this.data.public).subscribe(
      res => {
        let blob;
        switch (this.data.type){
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
        this.reader.addEventListener("load", () => {
          this.blobResult = this.reader.result;
        }, false);
        if(this.data.type == 4){
          this.reader.readAsDataURL(blob);
        } else {
          this.reader.readAsText(blob);
        }
      }

    );
  }

}
