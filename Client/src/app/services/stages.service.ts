import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StagesService {

  private myStagesUrl = environment.apiUrl + 'my-stages';
  private stagesUrl = environment.apiUrl + 'stages';
  private stageUrl = environment.apiUrl + 'stage/'

  constructor(private http: HttpClient) { }

  public getMyStages(){
    return this.http.get(this.myStagesUrl);
  }

  public getStage(id){
    return this.http.get(this.stageUrl + id);
  }

  public newStage(stage){
    return this.http.post(this.stagesUrl, stage);
  }

  public editStage(id, stage){
    return this.http.put(this.stageUrl + id, stage);
  }

  public deleteStage(id){
    return this.http.delete(this.stageUrl + id);
  }
}
