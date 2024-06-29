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
        if (limit) {
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
            }
                else {
                if (category) {
                    items = await this.prisma.items.findMany({
                        where: {
                            type: category,
                        },
                    });
                } else {
                    items = await this.prisma.items.findMany();
                }
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
}
