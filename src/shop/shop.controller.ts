import { Controller, Get, Query, Res, Post, Body, Req } from '@nestjs/common';
import { ShopService } from './shop.service'; // Adjust the path based on your project structure
import { Item } from './item.entity'; // Import the Item interface
import { Response, Request } from 'express';

@Controller('shop')
export class ShopController {
    constructor(private readonly shopService: ShopService) {}

    @Get('items')
    async getItems(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('category') category: string,
        @Res() res: Response,
    ): Promise<void> {
        const parsedPage = page ? parseInt(page, 10) : 1; // Parse page string to integer
        const parsedLimit = limit ? parseInt(limit, 10) : null; // Parse limit string to integer
        const items: Item[] = await this.shopService.getItems(
            parsedPage,
            parsedLimit,
            category,
        ); // Pass parsedPage, parsedLimit, and category to service function
        res.json(items);
    }
}
