import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private questionsURL = environment.apiUrl + "questions";
  private questionURL = environment.apiUrl + "question/";
  private myQuestionsURL = environment.apiUrl + "my-questions";

  constructor( private http: HttpClient) { }

  public getAllQuestions(){
    return this.http.get(this.questionsURL);
  }

  public getMyQuestions(){
    return this.http.get(this.myQuestionsURL);
  }

  public getQuestion(id){
    return this.http.get(this.questionURL + id);
  }

  public newQuestion(question){
    return this.http.post(this.questionsURL, question);
  }

  public editQuestion(id, question){
    return this.http.put(this.questionURL + id, question);
  }

  public deleteQuestion(id){
    return this.http.delete(this.questionURL + id);
  }
}
