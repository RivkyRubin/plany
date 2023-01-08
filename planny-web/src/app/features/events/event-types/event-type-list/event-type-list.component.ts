import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IEventType } from '../../models/event-type.model';
import { IEvent } from '../../models/event.model';
import { EventAPIService } from '../../services/event/event-api.service';
import { EventService } from '../../services/event/event.service';
@Component({
  selector: 'app-event-type-list',
  templateUrl: './event-type-list.component.html',
  styleUrls: ['./event-type-list.component.scss']
})
export class EventTypeListComponent implements OnInit {
  @Output() selectEventTypeEvent = new EventEmitter<IEvent>();
  selectedEventType:IEvent | null;
  eventTypes$: Observable<IEvent[]>;
  userEvents$: Observable<IEvent[]>;

  getTemplates():Observable<IEvent[]>{
    return this.eventAPIService.getTemplatesWithDetails();
  }


  getUserEvents():Observable<IEvent[]>{
  //   return this.eventAPIService.getAll().pipe(
  //     map(events=>{
  //        events.map((event)=>{

  //          return this.eventAPIService.getByID(event.eventTypeID).pipe(map(eventType=>{
  //             event.eventType = eventType;
  //             return event;
  //         })).subscribe({next: (value) => console.log('Final Value:', value)});
  //       })
  // return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  //     })
  //     );
  return this.eventAPIService.getEvents();
  }
  constructor(private eventAPIService:EventAPIService,
    public eventService:EventService) { 
  
  }
  
  ngOnInit(): void {  
     this.eventTypes$ = this.getTemplates();
     this.userEvents$ = this.getUserEvents();
  }
  selectEventType(value: IEvent) {
    this.selectedEventType=value;
    this.selectEventTypeEvent.emit(value);
  }
}
