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


export const sortAlfaphetically = (sources: Source[]) => {
    sources.sort((a, b) => {
        const nombreA = a.name.toLowerCase();
        const nombreB = b.name.toLowerCase();

        if (nombreA < nombreB) {
            return -1;
        }
        if (nombreA > nombreB) {
            return 1;
        }
        return 0;
    });
}