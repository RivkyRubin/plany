import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  catchError,
  delay,
  forkJoin,
  map,
  Observable,
  of,
  retry,
  switchMap,
  throwError,
} from 'rxjs';
import {
  ApiResponse,
  IApiResponse,
} from 'src/app/core/models/apiResponse.model';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';
import { IEvent } from '../../models/event.model';
import { EventTypeApiService } from '../event-type/event-type-api.service';

@Injectable({
  providedIn: 'root',
})
export class EventAPIService extends BaseApiService<IEvent> {
  constructor(
    private httpClient: HttpClient,
    private eventTypeApiService: EventTypeApiService
  ) {
    super(httpClient);
    super.actionName = 'Event';
  }

  getEventGroupDetails(id: number): Observable<IEvent> {
    return this.httpClient
      .get<IApiResponse<IEvent>>(
        this.apiURL + '/' + this.actionName + '/GetEventDetails/' + id
      )
      .pipe(
        map((res) => res.data),
        catchError(this.handleError),
        map((event) => {
          if (event.eventGroups && event.eventGroups.length > 0)
            event.eventGroups=event.eventGroups.sort(function (x, y) {
              return (x.order??1000)>(y.order??1000)?1:x.order??0<(y.order??1000)?-1:0;
            });
          return event;
        })
      );
  }

  getTemplates(): Observable<IEvent[]> {
    return this.httpClient
      .get<IApiResponse<IEvent[]>>(
        this.apiURL + '/' + this.actionName + '/GetTemplates'
      )
      .pipe(
        map((res) => res.data),
        catchError(this.handleError)
      );
  }

  getTemplatesWithDetails(): Observable<IEvent[]> {
    return this.getTemplates().pipe(
      switchMap((events) => {
        if (events == null || events.length == 0) return of(events);
        return forkJoin(
          events.map((event) => {
            return this.getEventDetails(event);
          })
        );
      }),
      map((events) => {
        return (events = events.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ));
      }),
      retry(1),
      catchError(this.handleError)
    );
  }

  getEvents(): Observable<IEvent[]> {
    var eventsBase$ = this.getAll();
    return eventsBase$.pipe(
      switchMap((events) => {
        if (events.length == 0) return of(events);
        return forkJoin(
          events.map((event) => {
            return this.getEventDetails(event);
          })
        );
      }),
      map((events) => {
        return (events = events.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ));
      })
    );
  }

  getEventDetails(event: IEvent): Observable<IEvent> {
    if (event.isTemplate) {
      return of(event);
    }
    if (event.eventTypeID == null) return of(event);
    return this.getByID(event.eventTypeID).pipe(
      map((eventType) => {
        event.eventType = eventType;
        return event;
      })
    );
  }

  getEventWithDetails(id: number): Observable<IEvent> {
    return this.getByID(id).pipe(
      switchMap((event) => {
        return this.getEventDetails(event);
      })
    );
  }
}
