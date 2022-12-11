import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IEventGroup } from '../../models/event-group.model';
import * as cloneDeep from 'lodash/cloneDeep';
@Component({
  selector: 'app-event-group-edit-dialog',
  templateUrl: './event-group-edit-dialog.component.html',
  styleUrls: ['./event-group-edit-dialog.component.scss']
})
export class EventGroupEditDialog  {
  editForm: FormGroup;
  faTrash = faTrash;
  editedData:IEventGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IEventGroup,private dialogRef: MatDialogRef<EventGroupEditDialog>,
  public fb: FormBuilder) { 
this.editedData=cloneDeep(data);
this.editForm = this.fb.group({
  name: [data.groupName,[Validators.required]],
});
  }
  save() {
    this.editedData.groupName = this.editForm.value.name;
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
