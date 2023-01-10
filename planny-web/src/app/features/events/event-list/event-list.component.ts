import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  BehaviorSubject,
  concatMap,
  flatMap,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  switchMapTo,
  tap,
} from 'rxjs';
import { EventAPIService } from '../services/event/event-api.service';
import { IEvent } from '../models/event.model';
import { EventTypeApiService } from '../services/event-type/event-type-api.service';
import { EventService } from '../services/event/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  isEmptyList = false;
  events$: Observable<IEvent[]>;
  eventsSub$: BehaviorSubject<IEvent[]> = new BehaviorSubject<IEvent[]>([]);
  faPlus = faPlus;
  isReady = false;
  getNumber(number: number): Observable<number> {
    return of(number * 2);
  }

  constructor(
    private eventAPIService: EventAPIService,
    private eventTypeAPIService: EventTypeApiService,
    public eventService:EventService
  ) {}

  ngOnInit(): void {
    this.eventAPIService.getEvents().subscribe({
      next: (events) => {
        this.eventsSub$.next(events);
        if (events.length == 0) 
        this.isEmptyList = true;
        this.isReady = true;
      },
    });
  }
}
