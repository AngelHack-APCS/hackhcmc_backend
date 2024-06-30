import { Controller, Get, Query, Res, Post, Body, Req } from '@nestjs/common';
import { ParentService } from './service'; // Adjust the path based on your project structure
import { Response, Request } from 'express';
import { TaskDto } from './task.dto';

@Controller('parent')
export class ParentController {
    constructor(private readonly ParentService: ParentService) {}

    @Get('all_children')
    async listChildren(
        @Query('parentID') parentID: number,
        @Res() res: Response,
    ): Promise<void> {
        var children = await this.ParentService.listChildren(parentID);

        // loop over children 
        for (let i = 0; i < children.length; i++) {
            var HEKEY = 0;
            HEKEY = parseInt(children[i]['child_id'], 10);
            children[i]['tasks'] = await this.ParentService.listchildTasks(HEKEY);
            var img = await this.ParentService.getChildAvatar(HEKEY);
            if(img == null)
                children[i]['avatar'] = 'https://www.gravatar.com/avatar';
            else children[i]['avatar'] = img;
        }
        res.json(children);
    }

    @Get('detailedTasks')
    async listDetailedTasks(
        @Query('parentID') parentID: number,
        @Res() res: Response,
    ): Promise<void> {
        
        var children = await this.ParentService.listChildren(parentID);
        
        for (let i = 0; i < children.length; i++) {
            var HEKEY = 0;
            HEKEY = parseInt(children[i]['child_id'], 10);
            
            children[i]['finished_tasks'] = await this.ParentService.detail_listchildTasks_finish(HEKEY);
            children[i]['unfinished_tasks'] = await this.ParentService.detail_listchildTasks_unfinish(HEKEY);
            children[i]['pending_tasks'] = await this.ParentService.detail_listchildTasks_pending(HEKEY);
        }

        res.json(children);
    }

    @Post('addTask')
    async addTask(
        @Body() body: TaskDto,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<void> {
        var task = await this.ParentService.addTask(body, req);
        res.json(task);
    }

    @Post('approveTask')
    async approveTask(
        @Body() body: TaskDto,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<void> {
        var task = await this.ParentService.approveTask(body, req);
        res.json(task);
    }
}

