import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private typesStages:any[] = [
    {
      type: 'Affective(SAM)',
      id: 1
    },
    {
      type: 'Task Questions',
      id: 2
    },
    {
      type: 'Instructions',
      id: 3
    },
    {
      type: 'Tutorial',
      id: 4
    },
    {
      type: 'Search',
      id: 5
    },
    {
      type: 'Collection',
      id: 6
    },
    {
      type: 'Critical Evaluation',
      id: 7
    },
    {
      type: 'Synthesis',
      id: 8
    },
    {
      type: 'End',
      id: 9
    }];

  private typesQuestions:any[] = [
    {
      type: 'Text',
      typeId: 1
    },
    {
      type: 'Paragraph',
      typeId: 2
    },
    {
      type: 'Multiple Choice',
      typeId: 3
    },
    {
      type: 'Checkbox',
      typeId: 4
    },
    {
      type: 'List',
      typeId: 5
    },
    {
      type: 'Scale',
      typeId: 6
    },
    {
      type: 'Rating',
      typeId: 7
    },
    {
      type: 'Date',
      typeId: 8
    },
    {
      type: 'Time',
      typeId: 9
    }];

  constructor() { }

  getTypesQuestion(){
    return this.typesQuestions;
  }

  getTypesStages(){
    return this.typesStages;
  }

}
