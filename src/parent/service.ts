

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust the path based on your project structure
import { items as PrismaItem } from '@prisma/client'; // Import Prisma types
import { Request } from 'express';

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
            'WHERE child_id = ' + String(ChildId) + ' and t.status = \'finish\';';
        const children: PrismaItem[] = await this.prisma.$queryRawUnsafe(que);
        return children;
    }

    async detail_listchildTasks_unfinish(ChildId: number): Promise<PrismaItem[]> {
        const que = 
            'SELECT t.* ' + 
            'FROM managements as m ' + 
            'JOIN tasks as t on m.management_id = t.management_id ' + 
            'WHERE child_id = ' + String(ChildId) + ' and t.status = \'unfinish\';';
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
}

