import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ShopModule } from './shop/shop.module';
import { TaskModule } from './task/task.module';
import { ParentModule} from './parent/module';
import { ParentWalletController } from './parent-wallet/parent-wallet.controller';
import { ParentWalletService } from './parent-wallet/parent-wallet.service';
import { ParentWalletModule } from './parent-wallet/parent-wallet.module';
import { WalletModule } from './wallet/wallet.module';
import { ChildrenModule } from './children/children.module';

@Module({
    imports: [AuthModule, PrismaModule, ShopModule, AuthModule, TaskModule, ParentModule, ParentWalletModule, WalletModule, ChildrenModule],
    controllers: [AppController, ParentWalletController],
    providers: [AppService, ParentWalletService],
})
export class AppModule {}
