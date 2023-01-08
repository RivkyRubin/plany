import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faPlus, faEdit, faListDots } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api.service';
import { IEventGroup } from '../models/event-group.model';
import { IEvent } from '../models/event.model';
import { EventGroupLineApiService } from '../services/event-group-line/event-group-line-api.service';
import { EventGroupApiService } from '../services/event-group/event-group-api.service';
import { EventAPIService } from '../services/event/event-api.service';
import { ToasterService } from 'src/app/core/services/toaster/toaster.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { IEventGroupLine } from '../models/event-group-line.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventGroupEditDialog } from '../dialogs/event-group-edit-dialog/event-group-edit-dialog.component';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { EventGroupLineEditDialog } from '../dialogs/event-group-line-edit-dialog/event-group-line-edit-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { preventOverflow } from '@popperjs/core';

@Component({
  selector: 'app-event-lines',
  templateUrl: './event-lines.component.html',
  styleUrls: ['./event-lines.component.scss'],
})
export class EventLinesComponent implements OnInit {
  faPlus = faPlus;
  faBars = faEdit;
  faDots = faListDots;
  newGroup: string = '';
  id: number;
  addLineForm: FormGroup;
  selectedCategory: number;
  @ViewChild('mySelect') mySelect;
  eventSub: BehaviorSubject<IEvent | undefined> = new BehaviorSubject<
    IEvent | undefined
  >(undefined);
  constructor(
    private route: ActivatedRoute,
    private eventAPIService: EventAPIService,
    private eventGroupApiService: EventGroupApiService,
    private eventGroupLineApiService: EventGroupLineApiService,
    public fb: FormBuilder,
    private toaster: ToasterService,
    public dialog: MatDialog
  ) {
    this.addLineForm = this.fb.group({
      line: [''],
    });
  }

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params) => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.getEvent().subscribe();
      //this.eventSub.subscribe({next:(val)=>{this.event1 = val as IEvent;}})
    });

    //this.selectedCategory = this.getDefaultCategory();
  }
  getEvent(): Observable<IEvent> {
    return this.eventAPIService.getEventGroupDetails(this.id).pipe(
      tap((event) => {
        if (event.eventGroups == undefined || event.eventGroups.length == 0) {
          this.toaster.warn('no categories');
        } else this.selectedCategory = event.eventGroups![0].id ?? 0;
        this.eventSub.next(event);
      })
    );
  }

  addGroup(): void {
    var event = this.getCurrentEvent();
    this.eventGroupApiService
      .create({ groupName: this.newGroup, eventId: event.id })
      .subscribe((createdGroup) => {
        this.toaster.success('Added category');
        event.eventGroups?.push(createdGroup);
        this.selectedCategory = createdGroup.id!;
        this.eventSub.next(event);
        this.newGroup = '';
        this.mySelect.close();
      });
  }

  addLine(event: IEvent): void {
    if (
      this.addLineForm.value.line == null ||
      this.addLineForm.value.line == ''
    )
      return;
    var selectedGroupInd =
      event.eventGroups?.findIndex((x) => x.id == this.selectedCategory) ?? -1;
    if (selectedGroupInd != null && selectedGroupInd > -1) {
      if (event.eventGroups![selectedGroupInd].eventGroupLines == undefined)
        event.eventGroups![selectedGroupInd].eventGroupLines = [];
      this.eventGroupLineApiService
        .create({
          name: this.addLineForm.value.line,
          eventGroupId: this.selectedCategory,
        })
        .subscribe((createdGroupLine) => {
          event.eventGroups![selectedGroupInd].eventGroupLines?.push(createdGroupLine);
          this.eventSub.next(event);
          this.toaster.success('Added new item to list');
          this.addLineForm.reset();
        });
    }
  }

  onChangeCheckbox(ob: MatCheckboxChange, line: IEventGroupLine) {
    line.isDone = ob.checked;
    this.updateLine(line);
  }

  updateLine(line: IEventGroupLine) {
    this.eventGroupLineApiService
      .update(line.id, line)
      .subscribe((newLineId) => {
        this.toaster.success('Updated Successfully');
      });
  }

  private getCurrentEvent(): IEvent {
    return this.eventSub.getValue() as IEvent;
  }

  private deleteGroup(eventGroup: IEventGroup) {
    var event = this.getCurrentEvent();
    this.eventGroupApiService.delete(eventGroup.id).subscribe({
      next: (value) => {
        this.toaster.success('Deleted successfully');
        var selectedGroupInd =
          event.eventGroups?.findIndex((x) => x.id == eventGroup.id) ?? -1;
        if (selectedGroupInd > -1) {
          event.eventGroups?.splice(selectedGroupInd, 1);
          this.eventSub.next(event);
        }
      },
    });
  }

  private updateGroup(editedEventGroup: IEventGroup, eventGroup: IEventGroup) {
    this.eventGroupApiService
      .update(eventGroup.id, editedEventGroup)
      .subscribe({
        next: (value) => {
          eventGroup.groupName = editedEventGroup.groupName;
          this.toaster.success('Updated successfully');
        },
      });
  }

  private updateGroupLine(
    editedEventGroupLine: IEventGroupLine,
    eventGroupLine: IEventGroupLine
  ) {
    this.eventGroupLineApiService
      .update(eventGroupLine.id, editedEventGroupLine)
      .subscribe({
        next: (value) => {
          eventGroupLine.name = editedEventGroupLine.name;
          this.toaster.success('Updated successfully');
        },
      });
  }

  private deleteGroupLine(eventGroupLine: IEventGroupLine) {
    var event = this.getCurrentEvent();
    this.eventGroupLineApiService.delete(eventGroupLine.id).subscribe({
      next: (value) => {
        this.toaster.success('Deleted successfully');
        var selectedGroupInd =
          event.eventGroups?.findIndex(
            (x) => x.id == eventGroupLine.eventGroupId
          ) ?? -1;
        if (selectedGroupInd > -1 && event.eventGroups) {
          var selectedGroupLineInd =
            event?.eventGroups![selectedGroupInd]?.eventGroupLines?.findIndex(
              (x) => x.id == eventGroupLine.id
            ) ?? -1;
          if (selectedGroupLineInd > -1) {
            event.eventGroups[selectedGroupInd].eventGroupLines?.splice(
              selectedGroupLineInd,
              1
            );
            this.eventSub.next(event);
          }
        }
      },
    });
  }
  openDeleteGroupDialog(eventGroup: IEventGroup): void {
    const dialogGroupRef = this.dialog.open(DeleteDialogComponent, {
      width: '600px',
      data: `Are you sure you want to delete ${eventGroup.groupName} group? it will remove all its tasks`,
    });

    dialogGroupRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.deleteGroup(eventGroup);
      }
    });
  }

  openDeleteLineDialog(eventLine: IEventGroupLine): void {
    const dialogLineRef = this.dialog.open(DeleteDialogComponent, {
      width: '600px',
      data: `Are you sure you want to delete ${eventLine.name} task?`,
    });

    dialogLineRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.deleteGroupLine(eventLine);
      }
    });
  }

  editGroup(eventGroup: IEventGroup) {
    var dialog = this.dialog.open(EventGroupEditDialog, {
      data: eventGroup,
    });

    dialog.afterClosed().subscribe((result: any) => {
      if (result == null || result.data == null || result.data.action == null)
        return;
      if (result.data.action == 'Delete') {
        this.openDeleteGroupDialog(eventGroup);
      } else if (result.data.action == 'Save') {
        this.updateGroup(result.data.data, eventGroup);
      }
    });
  }

  editLine(eventGroupLine: IEventGroupLine) {
    var dialog = this.dialog.open(EventGroupLineEditDialog, {
      data: eventGroupLine,
    });

    dialog.afterClosed().subscribe((result: any) => {
      if (result == null || result.data == null || result.data.action == null)
        return;
      if (result.data.action == 'Delete') {
        this.openDeleteLineDialog(eventGroupLine);
      } else if (result.data.action == 'Save') {
        this.updateGroupLine(result.data.data, eventGroupLine);
      }
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex == event.currentIndex) return;

    moveItemInArray(
      this.eventSub.getValue()?.eventGroups!,
      event.previousIndex,
      event.currentIndex
    );
    this.reorderGroups(event.previousIndex, event.currentIndex);
  }

  reorderGroups(previousIndex: number, currentIndex: number) {
    let minIndex, maxIndex;
    var event = this.eventSub.getValue();
    if (previousIndex > currentIndex) {
      minIndex = currentIndex;
      maxIndex = previousIndex;
    } else {
      minIndex = previousIndex;
      maxIndex = currentIndex;
    }
    for (var i = minIndex; i <= maxIndex; i++) {
      var e = event?.eventGroups![i]!;
      e.order = i+1;
      this.eventGroupApiService.update(e.id, e).subscribe({
        next: (value) => {
          this.toaster.success('Updated successfully');
        },
      });
    }
  }
}
