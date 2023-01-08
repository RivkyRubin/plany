import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, map, Observable, Subscription } from 'rxjs';
import { IEvent } from '../models/event.model';
import { EventTypeApiService } from '../services/event-type/event-type-api.service';
import { EventAPIService } from '../services/event/event-api.service';

import {
  faUserGroup,
  faListOl,
  faTrash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { Meta } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/services/auth.service';
import { EventService } from '../services/event/event.service';
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  id: number;
  event$: Observable<IEvent | null>;
  faUserGroup = faUserGroup;
  faList = faListOl;
  faTrash = faTrash;
  faEdit = faEdit;
  isReady=false;
  eventSubscribe:Observable<IEvent>;
  constructor(
    private route: ActivatedRoute,
    private eventAPIService: EventAPIService,
    public eventService:EventService,
    private eventTypeAPIService: EventTypeApiService,
    public dialog: MatDialog,
    private toaster: ToasterService,
    private router: Router,
    private meta: Meta,
    public authService:AuthService
  ) {}

  ngOnInit(): void {
   
    // this.snackBar.open('Deleted successfully',undefined, {
    //   duration: 2000,
    // });
    this.route.parent?.params.subscribe((params) => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    //this.event$ = this.getEvent();

  }

  
  getEvent(): Observable<IEvent> {
    return this.eventAPIService.getEventWithDetails(this.id);
  }
  getEventDate(date: Date): Date {
    return new Date(date);
  }

}
