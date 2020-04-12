import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';
import { MatDialog } from '@angular/material';
import { PreviewAssetComponent } from '../preview-asset/preview-asset.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store-assets',
  templateUrl: './store-assets.component.html',
  styleUrls: ['./store-assets.component.css']
})
export class StoreAssetsComponent implements OnInit {

  images = [];
  locales = []; 
  modals = [];
  templates = [];
  filterImages = [];
  filterLocales = [];
  filterModals = [];
  filterTemplates = [];

  @ViewChild('group') group;

  constructor(private uploadService: UploadService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadAssetsStore();
  }

  loadAssetsStore(){
    this.uploadService.getPublicModals().subscribe(
      res => {
        this.modals = res['modals'];
        this.filterModals = this.modals;
      }
    );
    this.uploadService.getPublicImages().subscribe(
      res => {
        this.images = res['images'];
        this.filterImages = this.images;
      }
    );
    this.uploadService.getPublicLocales().subscribe(
      res => {
        this.locales = res['locales'];
        this.filterLocales = this.locales;
      }
    );
    this.uploadService.getPublicTemplates().subscribe(
      res => {
        this.templates = res['templates'];
        this.filterTemplates = this.templates;
      }
    );
  }

  searchAssetStore(name: string){
    switch(this.group.value){
      case 'modals':
        this.filterModalsStore(name.toLowerCase());
        break;
      case 'templates':
        this.filterTemplatesStore(name.toLowerCase());
        break;
      case 'images':
        this.filterImagesStore(name.toLowerCase());
        break;
      case 'locales':
        this.filterLocalesStore(name.toLowerCase());
        break;
      default:
        break;
    }
  }

  filterModalsStore(name: string){
    if(name == ''){
      this.filterModals = this.modals;
      return;
    }
    this.filterModals = this.modals.filter(
      q => q.toLowerCase().includes(name)
    );
  }

  filterTemplatesStore(name: string){
    if(name == ''){
      this.filterTemplates = this.templates;
      return;
    }
    this.filterTemplates = this.templates.filter(
      q => q.toLowerCase().includes(name)
    );
  }

  filterImagesStore(name: string){
    if(name == ''){
      this.filterImages = this.images;
      return;
    }
    this.filterImages = this.images.filter(
      q => q.toLowerCase().includes(name)
    );
  }

  filterLocalesStore(name: string){
    if(name == ''){
      this.filterLocales = this.locales;
      return;
    }
    this.filterLocales = this.locales.filter(
      q => q.toLowerCase().includes(name)
    );
  }

  previewAsset(fileName: string, type: number){
    const dialogRef = this.dialog.open(PreviewAssetComponent, {
        width: '900px',
        data: {
          fileName,
          type,
          public: true
        }
      });
      dialogRef.afterClosed().subscribe();
  }

  addAssetStore(file: string, type: number){
    this.uploadService.copyAssetStore(file, type).subscribe(
      res => {
        Swal.fire({
          type: 'success',
          title: 'Copied to your assets'
        });
      }
    );
  }

}
