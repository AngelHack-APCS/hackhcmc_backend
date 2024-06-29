export interface Transaction {
    transaction_id: number;
    avt_url: string;
    image_url: string;
    date: Date;
    amount: number;
    direction: string;
    type: string;
    status: string;
    content: string;
}