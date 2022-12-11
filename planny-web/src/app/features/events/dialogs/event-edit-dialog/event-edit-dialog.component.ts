import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IEvent } from '../../models/event.model';
import * as cloneDeep from 'lodash/cloneDeep';
import { EventAPIService } from '../../services/event/event-api.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
@Component({
  selector: 'app-event-edit-dialog',
  templateUrl: './event-edit-dialog.component.html',
  styleUrls: ['./event-edit-dialog.component.scss']
})
export class EventEditDialogComponent  {
  editForm: FormGroup;
  editedData:IEvent;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IEvent,private dialogRef: MatDialogRef<EventEditDialogComponent>,
  public fb: FormBuilder,private eventApiService : EventAPIService,
  private toaster: ToasterService) { 
this.editedData=cloneDeep(data);
this.editForm = this.fb.group({
  name: [data.name,[Validators.required]],
  date: [data.date,[]],
});
  }
  save() {
    this.editedData.name = this.editForm.value.name;
    this.editedData.date = this.editForm.value.date;
    this.eventApiService.update(this.data.id, this.editedData).subscribe({
      next: (value) => {
        this.toaster.success('Updated successfully');
        this.dialogRef.close({ data: {
          action:'Save',
          data: this.editedData
          }});
      },
    });   
  }
}
