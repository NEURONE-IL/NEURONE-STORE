import { Component, OnInit, Inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-stage',
  templateUrl: './new-stage.component.html',
  styleUrls: ['./new-stage.component.css']
})
export class NewStageComponent implements OnInit {

  selectedType:any = {};
  typesStages = [];
  constructor(public dialogRef: MatDialogRef<NewStageComponent>, private utils: UtilsService) { }

  ngOnInit() {
    //Carga de tipos de etapas
    this.typesStages = this.utils.getTypesStages();
  }
  //Cierre de componente
  onNoClick(){
    this.dialogRef.close();
  }
  //Eleccion de tipo de etapa y envio de dato al padre
  loadStageType(){
    this.dialogRef.close(this.selectedType.type);
  }
}
