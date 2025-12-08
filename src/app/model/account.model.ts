import { Source } from "./source.model";

export interface Account {
    source: Source;
    events: number;
}