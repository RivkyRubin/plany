import { Time } from "@angular/common";
import { IEventGroup } from "./event-group.model";

export interface IEvent{
    id: number;
    name?: string;
    date: Date;
    location: string;
    eventSource: IEvent;
    eventType: IEvent;
    eventSourceID?: number;
    eventTypeID?:number;
    isTemplate?: boolean;
    eventGroups?:IEventGroup[];
    shareId:string;
}