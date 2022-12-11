import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventCreateComponent } from "./event-create/event-create.component";
import { EventDetailComponent } from "./event-detail/event-detail.component";
import { EventLinesComponent } from "./event-lines/event-lines.component";
import { EventListComponent } from "./event-list/event-list.component";
import { EventComponent } from "./event/event.component";

const routes: Routes = [
    {
        path: '',
        component: EventListComponent,
        children: [
            // {
            //     path: 'list',
            //     component: EventListComponent
            // },
            // { path: 'event/:id', component: EventDetailComponent},
            //{ path: 'event-create', component: EventCreateComponent}
        ]
    },
    { path: 'event-list', redirectTo: '', pathMatch: 'full' },
    { 
        path: 'event/:id', 
    component: EventComponent,
    children: [
        {path: '', redirectTo: 'details', pathMatch: 'full' },
        {path: 'details', component: EventDetailComponent},
        {path: 'lines', component: EventLinesComponent}, 
      ]},
    { path: 'lines/:id', component: EventLinesComponent},
    { path: 'event-create', component: EventCreateComponent}
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventsRoutingModule { }