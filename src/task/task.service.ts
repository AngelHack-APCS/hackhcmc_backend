import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}

    async getTasks(req: Request) {
        const child_id = parseInt(req.cookies['child_id']);

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

    async getTasksById(child_id: string, req: Request) {
        const parent_id = parseInt(req.cookies['parent_id']);

        const management = await this.prisma.managements.findFirst({
            where: {
                parent_id: parent_id,
                child_id: parseInt(child_id),
            },
        });

        const tasks = await this.prisma.tasks.findMany({
            where: {
                management_id: management.management_id,
            },
        });

        return tasks;
    }

    async createTask(data: TaskDto, req: Request) {
        const parent_id = parseInt(req.cookies['parent_id']);
        const child_id = data.child_id;

        const management = await this.prisma.managements.findFirst({
            where: {
                parent_id: parent_id,
                child_id: data.child_id,
            },
        });

        const task = this.prisma.tasks.create({
            data: {
                management_id: management.management_id,
                type: data.type,
                name: data.name,
                description: data.description,
                reward: data.reward,
                due_date: data.due_date,
                status: 'unfinished',
            },
        });

        return task;
    }
}
