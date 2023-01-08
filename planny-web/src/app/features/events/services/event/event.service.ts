import { Injectable } from '@angular/core';
import { IEvent } from '../../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService{

  constructor() { }
  getEventTypeName(event:IEvent):string{
    if(event.eventType!=null)
    return event.eventType.name!;
    if(event.isTemplate)
    return event.name!;
    return 'Custom';
  }
}
