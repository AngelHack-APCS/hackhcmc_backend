
import { Module } from '@nestjs/common';

import { ParentService } from './service';
import { ParentController } from './controller';

@Module({
    controllers: [ParentController],
    providers: [ParentService],
})
export class ParentModule {}
