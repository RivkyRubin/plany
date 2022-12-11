import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { IEventGroup } from '../../models/event-group.model';

@Injectable({
  providedIn: 'root'
})
export class EventGroupApiService extends BaseApiService<IEventGroup>{

  constructor(private httpClient: HttpClient)
  {
    super(httpClient);
    super.actionName = 'EventGroup';
  }
}