export interface Transaction {
    date: any,
    amount: number,
    invoice: string
}

export interface Transactions {
    transactions: Transaction[];
}