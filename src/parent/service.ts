

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust the path based on your project structure
import { items as PrismaItem } from '@prisma/client'; // Import Prisma types
import { Request } from 'express';
import { TaskDto } from './task.dto';

@Injectable()
export class ParentService {
    constructor(private readonly prisma: PrismaService) {}

    async getChildAvatar(childID: number) : Promise<string> {
        const que = 
            'SELECT d.image_url ' + 
            'FROM DetailUserInfo as d ' +
            'JOIN children as c on d.id = c.detail_id ' + 
            'WHERE c.child_id = ' + String(childID) + ';';

        const avatar: PrismaItem[] = await this.prisma.$queryRawUnsafe(que);
        return avatar['image_url'];
    }

    async listChildren(parentId: number): Promise<PrismaItem[]> {
        const que = 
            'SELECT c.child_id, c.name ' +
            'FROM managements as m ' +
            'JOIN children as c on m.child_id = c.child_id ' +
            'WHERE parent_id = ' + String(parentId) + ';';
        const children: PrismaItem[] = await this.prisma.$queryRawUnsafe(que);
        return children;
    }
    async listchildTasks(ChildId: number): Promise<PrismaItem[]> {
        const que =
            'SELECT t.name, t.reward ' +
            'FROM managements as m ' +
            'join tasks as t on m.management_id = t.management_id ' +
            'WHERE child_id = ' + String(ChildId) + ';';
        const children: PrismaItem[] = await this.prisma.$queryRawUnsafe(que);
        return children;
    }

    async detail_listchildTasks_finish(ChildId: number): Promise<PrismaItem[]> {
        const que = 
            'SELECT t.* ' + 
            'FROM managements as m ' + 
            'JOIN tasks as t on m.management_id = t.management_id ' + 
            'WHERE child_id = ' + String(ChildId) + ' and t.status = \'finished\';';
        const children: PrismaItem[] = await this.prisma.$queryRawUnsafe(que);
        return children;
    }

    async detail_listchildTasks_unfinish(ChildId: number): Promise<PrismaItem[]> {
        const que = 
            'SELECT t.* ' + 
            'FROM managements as m ' + 
            'JOIN tasks as t on m.management_id = t.management_id ' + 
            'WHERE child_id = ' + String(ChildId) + ' and t.status = \'unfinished\';';
        const children: PrismaItem[] = await this.prisma.$queryRawUnsafe(que);
        return children;
    }

    async detail_listchildTasks_pending(ChildId: number): Promise<PrismaItem[]> {
        const que = 
            'SELECT t.* ' + 
            'FROM managements as m ' + 
            'JOIN tasks as t on m.management_id = t.management_id ' + 
            'WHERE child_id = ' + String(ChildId) + ' and t.status = \'pending\';';
        const children: PrismaItem[] = await this.prisma.$queryRawUnsafe(que);
        return children;
    }

    async addTask(data: TaskDto, req: Request): Promise<PrismaItem[]> {
        const parent_id = parseInt(req.cookies['parent_id']);
        const management = await this.prisma.managements.findFirst({
            where: {
                child_id: data.child_id,
                parent_id: parent_id,
            },
        });
        const management_id = management.management_id;
        const que = 
            'INSERT INTO tasks (management_id, name, reward, date, status) ' + 
            'VALUES (' + String(management_id) + ', \'' + data.name + '\', ' + String(data.reward) + ', \'' + data.date + '\', \'pending\');';
        const children: PrismaItem[] = await this.prisma.$queryRawUnsafe(que);
        return children;
    }

    async approveTask(data: TaskDto, req: Request): Promise<void> {
        const parent_id = parseInt(req.cookies['parent_id']);
        const management = await this.prisma.managements.findFirst({
            where: {
                child_id: data.child_id,
                parent_id: parent_id,
            },
        });
    
        if (!management) {
            throw new Error('Management not found');
        }
    
        const management_id = management.management_id;
    
        const task = await this.prisma.tasks.update({
            where: {
                task_id: data.task_id,
                management_id: management_id,
            },
            data: {
                status: 'finished',
            },
        });
    
        await this.prisma.transactions.create({
            data: {
                management_id: management_id,
                item_id: null,
                amount: data.reward,
                direction: 'credit', // Assuming reward adds to the balance
                transaction_date: new Date(),
                type: 'task',
                status: 'completed',
                content: `Complete ${data.name}`,
            },
        });
    }
    
    
}

