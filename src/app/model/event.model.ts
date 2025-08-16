import { Source } from "./source.model";

export interface Event {
    id: string;
    title: string;
    content: string;
    read: number;
    lastUpdate: number;

    //Aux
    source: Source;
}