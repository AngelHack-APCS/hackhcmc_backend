import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { TaskDto } from './task.dto';

@Injectable()
export class ChildrenService {
    constructor(private readonly prisma: PrismaService) {}

    async listChildTasks(req: Request) {
        const child_id = req.cookies["child_id"];
        const management = await this.prisma.managements.findFirst({
            where: {
                child_id: child_id,
            },
        });
        const tasks = await this.prisma.tasks.findMany({
            where: {
                management_id: management.management_id,
            },
        });

        return tasks;
    }

    async finishTask(body: TaskDto, req: Request) {
        const child_id = req.cookies["child_id"];
        const management = await this.prisma.managements.findFirst({
            where: {
                child_id: child_id,
            },
        });
        const task = await this.prisma.tasks.findFirst({
            where: {
                management_id: management.management_id,
                name: body.name,
            },
        });

        await this.prisma.tasks.update({
            where: {
                task_id: task.task_id,
            },
            data: {
                status: "pending",
            },
        });

        return task;
    }

}
