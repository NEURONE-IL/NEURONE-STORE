import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  private myStudiesUrl = environment.apiUrl + 'my-studies';
  private studiesUrl = environment.apiUrl + 'studies';
  private studyUrl = environment.apiUrl + 'study/'
  private publicStudiesUrl = environment.apiUrl + 'public-studies';

  constructor(private http: HttpClient) { }

  public getMyStudies(){
    return this.http.get(this.myStudiesUrl);
  }

  public newStudy(study){
    return this.http.post(this.studiesUrl, study);
  }

  public editStudy(id, study){
    return this.http.put(this.studyUrl + id, study);
  }

  public deleteStudy(id){
    return this.http.delete(this.studyUrl + id);
  }

  public getPublicStudies(){
    return this.http.get(this.publicStudiesUrl);
  }
}
