import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import { SynthesisService } from 'src/app/services/synthesis.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-synthesis-test',
  templateUrl: './synthesis-test.component.html',
  styleUrls: ['./synthesis-test.component.css']
})
export class SynthesisTestComponent implements OnInit {


  editSynthesis: Boolean = false;
  editSynthId: String = null;
  synthesisForm: FormGroup;
  
  synthesisDB:any[] = [];
  constructor(private synthesisService: SynthesisService, private formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit() {
    this.synthesisForm = this.formBuilder.group({
      id: ['', Validators.required],
      title: ['', Validators.required]
    });
    this.getSynthesisDB();
  }

  getSynthesisDB(){
    this.synthesisService.getMySynthesis().subscribe(
      res => {
        this.synthesisDB = res['synthesis'];
      },
      err => {
        console.log(err);
      }
    );
  }

  loadSynthesis(synthesis: any){
    this.synthesisForm.controls['id'].setValue(synthesis.synthesisId);
    this.synthesisForm.controls['title'].setValue(synthesis.title);
    this.editSynthId = synthesis._id;
    this.editSynthesis = true;
  }

  cancelSynthesis(){
    this.synthesisForm.reset();
    this.editSynthesis = false;
  }

  deleteSynthesis(synthesis: any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: synthesis.synthesisId
      });
    dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.synthesisService.deleteSynthesis(synthesis._id).subscribe(
            res => {
              this.synthesisDB = this.synthesisDB.filter(q => q._id !== synthesis._id);
            },
            err => {
              console.log(err);
            }
          );
        }
      });
  }

  submitSynthesis(id?: String) {
    let newSynth = {};
    newSynth["title"] = this.synthesisForm.get('title').value;
    newSynth["synthesisId"] = this.synthesisForm.get('id').value;
    newSynth["user"] = localStorage.getItem('userId');
    if(!this.editSynthesis){
      this.synthesisService.newSynthesis(newSynth).subscribe(
        res => {
          this.synthesisDB.push(res['synthesis']);
          this.synthesisForm.reset();
        },
        err => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: err
          });
          //console.log(err);
        }
      );
    } else {
      this.synthesisService.editSynthesis(id, newSynth).subscribe(
        res => {
          this.synthesisForm.reset();
          this.editSynthesis = false;
          this.getSynthesisDB();
        },
        err => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: err
          });
          //console.log(err);
        }
      );
    }
    
  }

}
