import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { IEvent } from '../models/event.model';
import { EventAPIService } from '../services/event/event-api.service';
import {
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  createForm: FormGroup;
  newEvent:IEvent;
  eventType:IEvent
faInfo=faInfoCircle;
  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor( private fb: FormBuilder, private eventAPIService:EventAPIService,private router: Router,      private toaster: ToasterService,) { 
    this.createForm = this.fb.group({
      name: [''],
      date: [this.currentDate()],
    });
  }


  ngOnInit(): void {
  }
  create() {
    this.newEvent =<IEvent>this.createForm.value;
    this.newEvent.eventSourceID = this.eventType?.id;
    this.eventAPIService.create(this.newEvent).subscribe(
      {
        next:(value) => {
          this.toaster.success('Event Created!');
        this.router.navigate(['events/event',value]);
        }
      });
  } 
  
  currentDate() {
    // const currentDate = new Date();
    // return currentDate.toISOString().slice(0, -1);
    var now = new Date();
    var utcString = now.toISOString().substring(0,19);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var localDatetime = year + "-" +
                      (month < 10 ? "0" + month.toString() : month) + "-" +
                      (day < 10 ? "0" + day.toString() : day) + "T" +
                      (hour < 10 ? "0" + hour.toString() : hour) + ":" +
                      (minute < 10 ? "0" + minute.toString() : minute);
                      //  +
                      // utcString.substring(16,19);
    return localDatetime;
    //.substring(0,10);
  }

  selectEventType(eventType: IEvent) {
    this.eventType = eventType;
    //this.myStepper.next();
  }
}
