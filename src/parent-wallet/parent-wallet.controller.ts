import { Controller, Get, Req , Res} from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { Request, Response } from 'express';
import { ParentWalletService } from './parent-wallet.service';

@Controller('parent_wallet')
export class ParentWalletController {
    constructor(private parentWalletService: ParentWalletService) {}
    
    @Get('transactions')
    async getTransactions(@Req() req: Request, @Res() res: Response): Promise<void> {
        const transactions: Transaction[] = await this.parentWalletService.getTransactions(req);
        res.json(transactions);
    }
}
