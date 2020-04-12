import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionnairesService {

  private questionnairesURL = environment.apiUrl + "questionnaires";
  private questionnaireURL = environment.apiUrl + "questionnaire/";
  private myQuestionnairesURL = environment.apiUrl + "my-questionnaires";
  private publicQuestionnaires = environment.apiUrl + "public-questionnaires";

  constructor( private http: HttpClient) { }

  public getAllQuestionnaires(){
    return this.http.get(this.questionnairesURL);
  }

  public getMyQuestionnaires(){
    return this.http.get(this.myQuestionnairesURL);
  }

  public getPublicQuestionnaires(){
    return this.http.get(this.publicQuestionnaires);
  }

  public newQuestionnaire(questionnaire){
    return this.http.post(this.questionnairesURL, questionnaire);
  }

  public getQuestionnaire(id){
    return this.http.get(this.questionnaireURL + id);
  }

  public editQuestionnaire(id, questionnaire){
    return this.http.put(this.questionnaireURL + id, questionnaire);
  }

  public deleteQuestionnaire(id){
    return this.http.delete(this.questionnaireURL + id);
  }
}
