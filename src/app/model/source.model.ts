export interface Source {
    id?: string;
    name: string;
    email: string;
    icon?: string;
    public: boolean;
    plan: string; //'free'
    lastUpdate: number;

    //Aux
    selected?: boolean;
}