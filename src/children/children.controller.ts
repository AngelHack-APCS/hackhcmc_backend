import { Controller, Req, Res, Get , Post, Body} from '@nestjs/common';
import { Request, Response } from 'express';
import { ChildrenService } from './children.service';
import { TaskDto } from './task.dto';

@Controller('children')
export class ChildrenController {
    constructor(private readonly childrenService: ChildrenService) {}

    @Get("tasks")
    async getTasks(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<void> {
        var tasks = await this.childrenService.listChildTasks(req);
        res.json(tasks);
    }

    @Post("finishTask")
    async finishTask(
        @Body() body: TaskDto,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<void> {
        var task = await this.childrenService.finishTask(body, req);
        res.json(task);
    }
}
