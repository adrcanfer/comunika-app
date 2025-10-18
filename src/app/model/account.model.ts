import { Source } from "./source.model";

export interface Account {
    source: Source;
    subscriptors: number;
    events: number;

}