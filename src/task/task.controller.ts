import { Controller, Req, Get, Post, Body, Res, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Request, Response } from 'express';
import { TaskDto } from './dto/task.dto';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get('child')
    async getTasks(@Req() req: Request, @Res() res: Response) {
        const task = await this.taskService.getTasks(req);
        res.json(task);
    }

    @Get('parent')
    async getTasksById(
        @Query('child_id') child_id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const task = await this.taskService.getTasksById(child_id, req);
        res.json(task);
    }

    @Post()
    async createTask(@Body() data: TaskDto, @Req() req: Request) {
        return this.taskService.createTask(data, req);
    }
}
