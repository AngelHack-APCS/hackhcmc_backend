import { Prisma } from '@prisma/client';

export interface CartItem {
    item_id: number;
    name: string;
    type?: string;
    image_url?: string;
    stock: number;
    price: Prisma.Decimal;
    quantity: number;
}
