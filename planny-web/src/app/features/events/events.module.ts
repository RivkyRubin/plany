import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventsRoutingModule } from './events-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import {MatFormFieldModule } from '@angular/material/form-field'
import {MatInputModule } from '@angular/material/input';
import { EventTypeListComponent } from './event-types/event-type-list/event-type-list.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import {  MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { EventLinesComponent } from './event-lines/event-lines.component';
import { EventComponent } from './event/event.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EventGroupEditDialog } from './dialogs/event-group-edit-dialog/event-group-edit-dialog.component';
import { EventFriendsDialogComponent } from './dialogs/event-friends-dialog/event-friends-dialog.component';
import { EventGroupLineEditDialog } from './dialogs/event-group-line-edit-dialog/event-group-line-edit-dialog.component';
import { EventEditDialogComponent } from './dialogs/event-edit-dialog/event-edit-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';

@NgModule({
  declarations: [
    EventListComponent,
    EventDetailComponent,
    EventCreateComponent,
    EventTypeListComponent,
    DeleteDialogComponent,
    EventLinesComponent,
    EventComponent,
    EventGroupEditDialog,
    EventFriendsDialogComponent,
    EventGroupLineEditDialog,
    EventEditDialogComponent,
    MessageDialogComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    SharedModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule,
    NgbModule,
    FormsModule,
    DragDropModule
  ],
  providers:[
    // EventAPIService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // }
  ]
})
export class EventsModule { }
