import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IEventType } from '../../models/event-type.model';
import { IEvent } from '../../models/event.model';
import { EventAPIService } from '../../services/event/event-api.service';
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
    return this.eventAPIService.getTemplates().pipe(
      map(events=>{
         events.map((event)=>{
            event.eventType = event;
            return event;
        })
  return events;
      })
      );
  }


  getUserEvents():Observable<IEvent[]>{
    return this.eventAPIService.getAll().pipe(
      map(events=>{
         events.map((event)=>{

           return this.eventAPIService.getByID(event.eventTypeID).pipe(map(eventType=>{
              event.eventType = eventType;
              return event;
          })).subscribe({next: (value) => console.log('Final Value:', value)});
        })
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      })
      );
  }
  constructor(private eventAPIService:EventAPIService) { 
     this.eventTypes$ = this.getTemplates();
     this.userEvents$ = this.getUserEvents();
  }
  
  ngOnInit(): void {
  }
  selectEventType(value: IEvent) {
    this.selectedEventType=value;
    this.selectEventTypeEvent.emit(value);
  }
}
