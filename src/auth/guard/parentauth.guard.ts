import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';

@Injectable()
export class AuthenticatedParentGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies['access_token'];
        const parent_id = request.cookies['parent_id'];

        if (!token || !parent_id) {
            throw new UnauthorizedException('Missing token or parent ID');
        }

        const parent = await this.prisma.parents.findFirst({
            where: {
                parent_id: parseInt(parent_id),
            },
        });

        if (!parent) {
            throw new UnauthorizedException('Invalid parent ID');
        }

        const validatedToken = this.hashToken(parent.email, parent.password);

        if (token !== validatedToken) {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }

    private hashToken(email: string, password: string): string {
        const hash = crypto.createHash('md5');
        hash.update(email + password);
        return hash.digest('hex');
    }
}
