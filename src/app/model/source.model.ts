export interface Source {
    id?: string;
    name: string;
    email: string;
    icon?: string;
    public: boolean;
    customerId?: string;
    plan?: string; //productId
    lastUpdate?: number;
    shortId?: string;

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