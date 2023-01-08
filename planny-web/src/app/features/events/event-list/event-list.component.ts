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
  numbers: Observable<number[]> = of([1, 2, 3], [4, 5, 6]);
  isEmptyList = false;
  events$: Observable<IEvent[]>;
  eventsSub$: BehaviorSubject<IEvent[]> = new BehaviorSubject<IEvent[]>([]);
  faPlus = faPlus;
  isReady = false;
  //   getEvents():Observable<IEvent[]>{
  //     var eventsBase$ =  this.eventAPIService.getAll();
  //     return  eventsBase$
  //     .pipe(
  //     map(events=>{
  //       if(events.length==0)
  //       this.isEmptyList=true;
  //        events.map((event)=>{
  //         if(event.isTemplate)
  //         {
  //           event.eventType = event;
  //           return event;
  //         }
  //         if(event.eventTypeID==null)
  //         return event;
  //          return this.eventAPIService.getByID(event.eventTypeID).pipe(map(eventType=>{
  //             console.log("event"+eventType);
  //             event.eventType = eventType;
  //             return event;
  //         })).subscribe();
  //       })

  // return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  //     })
  //     )
  //   }

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

    of([1, 2, 3])
      .pipe(
        tap((value) => console.log('my first tap' + JSON.stringify(value))),
        switchMap((value) => {
          return forkJoin(
            value.map((val) => {
              // return val*2;
              return of(3).pipe(
                map((v) => {
                  return 'v:' + v + ' val:' + val;
                })
              );
            })
          );
        }),
        map((val) => {
          console.log('my second map' + JSON.stringify(val));
          return val;
        }),
        tap((value) => console.log('my second tap' + JSON.stringify(value)))
      )
      .subscribe({
        next: (value) => console.log('my final val:' + JSON.stringify(value)),
      });
  }
}
