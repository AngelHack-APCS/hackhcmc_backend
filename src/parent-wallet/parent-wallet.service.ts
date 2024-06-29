import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ParentWalletService {
    constructor(private readonly prisma: PrismaService) {}

    async getTransactions(req: Request): Promise<any[]> {
        const parent_id = parseInt(req.cookies['parent_id']);
        
        // Fetch child_ids associated with the parent_id
        const managements = await this.prisma.managements.findMany({
            where: {
                parent_id,
            },
            select: {
                child_id: true,
            }
        });

        // Extract child_ids from managements
        const childIds = managements.map(management => management.child_id);

        // Fetch transactions with conditional image_url using items table
        const transactions = await this.prisma.transactions.findMany({
            where: {
                management_id: {
                    in: childIds, // Filter by child_ids associated with the parent
                },
            },
            select: {
                transaction_id: true,
                transaction_date: true,
                amount: true,
                direction: true,
                type: true,
                status: true,
                content: true,
                item_id: true // Include item_id to determine if it's an 'order' transaction
            },
        });

        // Fetch image_urls from items table for 'order' transactions
        const itemImageUrls = await this.prisma.items.findMany({
            where: {
                item_id: {
                    in: transactions
                        .filter(transaction => transaction.type === 'order')
                        .map(transaction => transaction.item_id),
                },
            },
            select: {
                item_id: true,
                image_url: true,
            },
        });

        // Map item_id to image_url for quick lookup
        const itemImageMap = itemImageUrls.reduce((acc, item) => {
            acc[item.item_id] = item.image_url;
            return acc;
        }, {});

        // Map transactions to desired output format
        const formattedTransactions = transactions.map(transaction => ({
            transaction_id: transaction.transaction_id,
            image_url: transaction.type === 'order' ? itemImageMap[transaction.item_id] || null : null,
            date: transaction.transaction_date.toLocaleDateString('en-GB'),
            amount: transaction.amount,
            direction: transaction.direction,
            type: transaction.type,
            status: transaction.status,
            content: transaction.content,
        }));

        return formattedTransactions;
    }
}
