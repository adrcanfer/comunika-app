import { Event } from "./event.model";

export interface Events {
    items: Event[];
    lastKey?: string;
}