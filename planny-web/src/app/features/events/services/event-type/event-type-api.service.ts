import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { IEventType } from '../../models/event-type.model';

@Injectable({
  providedIn: 'root'
})
export class EventTypeApiService  extends BaseApiService<IEventType>{

  constructor(private httpClient: HttpClient)
  {
    super(httpClient);
    super.actionName = 'EventType';
  }
}