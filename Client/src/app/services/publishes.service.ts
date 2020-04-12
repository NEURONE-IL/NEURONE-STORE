import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublishesService {

  private publishUrl = environment.apiUrl + 'publish';
  private myPublishesUrl = environment.apiUrl + 'my-publishes';

  constructor(private http: HttpClient) { }

  newPublish(publish){
    return this.http.post(this.publishUrl, publish);
  }

  getMyPublishes(){
    return this.http.get(this.myPublishesUrl);
  }

  deletePublish(id){
    return this.http.delete(`${this.publishUrl}/${id}`);
  }
}
