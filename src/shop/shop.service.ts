import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust the path based on your project structure
import { items as PrismaItem } from '@prisma/client'; // Import Prisma types
import { Item } from './item.entity'; // Import the Item interface
import { CartItem } from './cart-item.entity';
import { OrderDto } from './dto/order.dto';
import { Request } from 'express';

@Injectable()
export class ShopService {
    constructor(private readonly prisma: PrismaService) {}

    async getItems(
        page: number,
        limit: number,
        category: string,
    ): Promise<Item[]> {
        let items: PrismaItem[] = [];
        if (category) {
            items = await this.prisma.items.findMany({
                where: {
                    type: category,
                },
                skip: (page - 1) * limit,
                take: limit,
            });
        } else {
            items = await this.prisma.items.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
        }

        // Map the PrismaItem objects to your Item type
        return items.map((item) => ({
            item_id: item.item_id,
            name: item.name,
            type: item.type,
            image_url: item.image_url,
            stock: item.stock,
            price: item.price, // Adjust type casting as necessary
            // Map other fields as needed
        }));
    }

    async getCartItems(child_id: number): Promise<CartItem[]> {
        const query = `
      SELECT i.item_id, i.name, i.description, i.type, i.image_url, i.stock, i.price, c.quantity
      FROM items i
      JOIN cart_items c ON i.item_id = c.item_id AND c.child_id = ${child_id}
    `;
        const cartItems: CartItem[] = await this.prisma.$queryRaw(query as any);
        return cartItems;
    }

    async getItemById(item_id: number): Promise<Item> {
        const item: PrismaItem | null = await this.prisma.items.findUnique({
            where: {
                item_id: item_id,
            },
        });
        if (!item) {
            return null;
        }
        return {
            item_id: item.item_id,
            name: item.name,
            type: item.type,
            image_url: item.image_url,
            stock: item.stock,
            price: item.price, // Adjust type casting as necessary
            // Map other fields as needed
        };
    }

    async orderItems(data: OrderDto, req: Request) {
        const management = await this.prisma.managements.findFirst({
            where: {
                child_id: parseInt(req.cookies['child_id']),
            },
        });

        let orders = [];

        let index = 0;

        for (const item_id of data.items_id) {
            const itemData = await this.prisma.items.findUnique({
                where: {
                    item_id: item_id,
                },
            });

            if (!itemData) {
                throw new Error(`Item with ID ${item_id} not found`);
            }

            const order = await this.prisma.orders.create({
                data: {
                    management_id: management.management_id,
                    item_id: item_id,
                    quantity: data.quantity[index++],
                    order_date: new Date(),
                    status: 'pending',
                },
            });

            orders.push(order);
        }

        return orders;
    }
}
