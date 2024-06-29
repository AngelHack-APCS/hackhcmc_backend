import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedChildGuard } from 'src/auth/guard/childauth.guard';

@Module({
    controllers: [ShopController],
    providers: [ShopService],
})
export class ShopModule {}
