import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { IEventGroupLine } from '../../models/event-group-line.model';

@Injectable({
  providedIn: 'root'
})
export class EventGroupLineApiService extends BaseApiService<IEventGroupLine>{

  constructor(private httpClient: HttpClient)
  {
    super(httpClient);
    super.actionName = 'EventGroupLine';
  }
}