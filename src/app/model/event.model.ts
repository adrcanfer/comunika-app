import { Source } from "./source.model";

export interface Event {
    id?: string;
    title: string;
    content: string;
    showStats: boolean;
    read?: number;
    lastUpdate?: number;

    attachments: string[];

    //Aux
    source?: Source;
}

