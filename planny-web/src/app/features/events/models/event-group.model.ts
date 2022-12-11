import { IEventGroupLine } from "./event-group-line.model";

export interface IEventGroup{
    id?: number;
    eventId?:number;
    groupName: string;
    eventGroupLines?:IEventGroupLine[];
}