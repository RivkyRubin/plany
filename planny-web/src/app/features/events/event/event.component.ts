import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, delay, delayWhen, map, Observable, of } from 'rxjs';
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
import { EventFriendsDialogComponent } from '../dialogs/event-friends-dialog/event-friends-dialog.component';
import { EventEditDialogComponent } from '../dialogs/event-edit-dialog/event-edit-dialog.component';
import { EventDetailComponent } from '../event-detail/event-detail.component';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  id: number;
  eventSub$: BehaviorSubject<IEvent | null> =
    new BehaviorSubject<IEvent | null>(null);
  eventObs$ = this.eventSub$.asObservable();
  faUserGroup = faUserGroup;
  faList = faListOl;
  faTrash = faTrash;
  faEdit = faEdit;
  constructor(
    private route: ActivatedRoute,
    private eventAPIService: EventAPIService,
    private eventTypeAPIService: EventTypeApiService,
    public dialog: MatDialog,
    private toaster: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.snackBar.open('Deleted successfully',undefined, {
    //   duration: 2000,
    // });
    this.route.params.subscribe((params) => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    // this.eventSub$.subscribe({next:(val)=>{
    //      console.log('changed!');
    // }});

    this.getEvent().subscribe({
      next: (val) => {
        this.eventSub$.next(val);
      },
    });
  }

  getEvent(): Observable<IEvent> {
    return this.eventAPIService.getEventWithDetails(this.id);
  }
  private deleteEvent() {
    this.eventAPIService.delete(this.id).subscribe({
      next: (value) => {
        this.toaster.success('Deleted successfully');
        this.router.navigate(['events']);
      },
    });
  }
  openFriendsDialog(): void {
    this.dialog.open(EventFriendsDialogComponent);
  }
  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.deleteEvent();
      }
    });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EventEditDialogComponent, {
      data: this.eventSub$.getValue(),
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == null || result.data == null || result.data.action == null)
        return;
      if (result.data.action == 'Save') {
        this.eventSub$.next(result.data.data);
      }
    });
  }
  onOutletLoaded(component) {
    // if(component instanceof EventDetailComponent)
    component.event$ = this.eventObs$;
  }
}
