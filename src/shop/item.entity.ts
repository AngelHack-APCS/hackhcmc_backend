import { Prisma } from '@prisma/client';

export interface Item {
    item_id: number;
    name: string;
    type?: string;
    image_url?: string;
    stock: number;
    price: Prisma.Decimal; // Adjust this type according to your Prisma-generated types
    // Add other fields as per your schema
}
