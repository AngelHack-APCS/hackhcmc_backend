import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ShopModule } from './shop/shop.module';
import { TaskModule } from './task/task.module';
import { ParentModule} from './parent/module';

@Module({
    imports: [AuthModule, PrismaModule, ShopModule, AuthModule, TaskModule, ParentModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
