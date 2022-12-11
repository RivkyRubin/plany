import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IEventGroupLine } from '../../models/event-group-line.model';
import * as cloneDeep from 'lodash/cloneDeep';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-event-group-line-edit-dialog',
  templateUrl: './event-group-line-edit-dialog.component.html',
  styleUrls: ['./event-group-line-edit-dialog.component.scss']
})
export class EventGroupLineEditDialog  {
  editForm: FormGroup;
  faTrash = faTrash;
  editedData:IEventGroupLine;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IEventGroupLine,private dialogRef: MatDialogRef<EventGroupLineEditDialog>,
  public fb: FormBuilder) { 
this.editedData=cloneDeep(data);
this.editForm = this.fb.group({
  name: [data.name,[Validators.required]],
});
  }
  save() {
    this.editedData.name = this.editForm.value.name;
    this.dialogRef.close({ data: {
      action:'Save',
      data: this.editedData
      }});
  }
  delete(){
    this.dialogRef.close({ data: {
      action:'Delete'
      }});
  }
}
