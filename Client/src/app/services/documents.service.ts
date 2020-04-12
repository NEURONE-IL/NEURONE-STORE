import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private myDocumentsURL = environment.apiUrl + 'my-documents';
  private documentsURL = environment.apiUrl + 'documents';
  private previewDocUrl = environment.apiUrl + 'preview-document';

  constructor(private http: HttpClient) { }

  public getMyDocs(){
    return this.http.get(this.myDocumentsURL);
  }

  public newDoc(document){
    return this.http.post(this.documentsURL, document);
  }

  public previewDoc(document){
    return this.http.post(this.previewDocUrl, document);
  }

  public editDoc(id, document){
    return this.http.put(this.documentsURL + '/' + id, document);
  }

  public deleteDoc(id){
    return this.http.delete(this.documentsURL + '/' + id);
  }

}
