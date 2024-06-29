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
export class AuthenticatedChildGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies['access_token'];
        const child_id = request.cookies['child_id'];

        if (!token || !child_id) {
            throw new UnauthorizedException('Missing token or parent ID');
        }

        const child = await this.prisma.children.findFirst({
            where: {
                child_id: parseInt(child_id),
            },
        });

        if (!child) {
            throw new UnauthorizedException('Invalid parent ID');
        }

        const validatedToken = this.hashToken(
            child.child_id.toString(),
            child.login_code,
        );

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
