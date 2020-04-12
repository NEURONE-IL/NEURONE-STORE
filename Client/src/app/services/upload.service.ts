import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  //Upload services
  private imageUrl = environment.apiUrl + 'upload-image';
  private htmlUrl = environment.apiUrl + 'upload-html';
  private jsonUrl = environment.apiUrl + 'upload-locale';

  //Get uploaded files
  private myImagesUrl = environment.apiUrl + 'my-images';
  private myHtmlUrl = environment.apiUrl + 'my-html';
  private myJsonUrl = environment.apiUrl + 'my-json';

  //Download files
  private imageDownloadUrl = environment.apiUrl + 'download-image/';
  private htmlDownloadUrl = environment.apiUrl + 'download-html/';
  private localeDownloadUrl = environment.apiUrl + 'download-locale/';

  //Delete files
  private deleteImageUrl = environment.apiUrl + 'delete-image/';
  private deleteHtmlUrl = environment.apiUrl + 'delete-html/';
  private deleteLocaleUrl = environment.apiUrl + 'delete-locale/';

  //Public files
  private publicModals = environment.apiUrl + 'public-modals';
  private publicTemplates = environment.apiUrl + 'public-templates';
  private publicImages = environment.apiUrl + 'public-images';
  private publicLocales = environment.apiUrl + 'public-locales';
  private addAssetStore = environment.apiUrl + 'add-store-asset/';

  constructor( private http: HttpClient ) {}

  public uploadImage(file: File, publicContent = false){
    //Set public
    let headersObj = {
      'public': '0'
    };
    if(publicContent){
      headersObj.public = '1';
    }
    let headers = new HttpHeaders(headersObj);
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.imageUrl, formData, {headers});
  }

  public uploadHtml(file: File, type: string, publicContent = false){
    //Set type of html file and public
    let headersObj = {
      'type': type,
      'public': '0'
    };
    if(publicContent){
      headersObj.public = '1';
    }
    let headers = new HttpHeaders(headersObj);
    //Append file
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.htmlUrl, formData, {headers});
  }

  public uploadJson(file: File, publicContent = false){
    //Set public
    let headersObj = {
      'public': '0'
    };
    if(publicContent){
      headersObj.public = '1';
    }
    let headers = new HttpHeaders(headersObj);
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.jsonUrl, formData, {headers});
  }

  public getPublicModals(){
    return this.http.get(this.publicModals);
  }

  public getPublicImages(){
    return this.http.get(this.publicImages);
  }

  public getPublicTemplates(){
    return this.http.get(this.publicTemplates);
  }

  public getPublicLocales(){
    return this.http.get(this.publicLocales);
  }

  public getImages(){
    return this.http.get(this.myImagesUrl);
  }

  public getHtml(type: string){
    //Set type of html file
    let headers = new HttpHeaders({'type': type});
    return this.http.get(this.myHtmlUrl, {headers});
  }

  public getLocales(){
    return this.http.get(this.myJsonUrl);
  }

  public downloadFile(name, type, publicContent = false){
    //Set type of html file
    let typeHtml = (type - 1).toString();
    let headersObj = {
      'type': typeHtml,
      'public': '0'
    };
    if(publicContent){
      headersObj.public = '1';
    }
    let headers = new HttpHeaders(headersObj);
    switch (type){
      case 1:
        return this.http.post(this.localeDownloadUrl + name, '', {responseType: "arraybuffer", headers});
      case 2:
        return this.http.post(this.htmlDownloadUrl + name, '', {responseType: "arraybuffer", headers});
      case 3:
        return this.http.post(this.htmlDownloadUrl + name, '', {responseType: "arraybuffer", headers});
      case 4:
        return this.http.post(this.imageDownloadUrl + name, '', {responseType: "arraybuffer", headers})
    }
  }

  public copyAssetStore(name, type){
    let headers = new HttpHeaders({'type': type.toString()});
    switch (type){
      case 1:
        return this.http.post(this.addAssetStore + name, '', {headers});
      case 2:
        return this.http.post(this.addAssetStore + name, '', {headers});
      case 3:
        return this.http.post(this.addAssetStore + name, '', {headers});
      case 4:
        return this.http.post(this.addAssetStore + name, '', {headers})
    }
  }

  public deleteFile(name, type){
    //Set type of html file
    let typeHtml = (type - 1).toString();
    let headers = new HttpHeaders({'type': typeHtml});
    switch (type){
      case 1:
        return this.http.delete(this.deleteLocaleUrl + name);
      case 2:
        return this.http.delete(this.deleteHtmlUrl + name, {headers});
      case 3:
        return this.http.delete(this.deleteHtmlUrl + name, {headers});
      case 4:
        return this.http.delete(this.deleteImageUrl + name);
    }
  }

}
