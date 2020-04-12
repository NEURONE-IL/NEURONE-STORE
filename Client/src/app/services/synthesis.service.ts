import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SynthesisService {

  private synthesisURL = environment.apiUrl + "synthesis";
  private mySynthesisURL = environment.apiUrl + "my-synthesis";

  constructor( private http: HttpClient ) { }

  public getAllSynthesis(){
    return this.http.get(this.synthesisURL);
  }

  public getMySynthesis(){
    return this.http.get(this.mySynthesisURL);
  }

  public newSynthesis(synthesis){
    return this.http.post(this.synthesisURL, synthesis);
  }

  public editSynthesis(id, synthesis){
    return this.http.put(this.synthesisURL + '/' + id, synthesis);
  }

  public deleteSynthesis(id){
    return this.http.delete(this.synthesisURL + '/' + id);
  }
}
