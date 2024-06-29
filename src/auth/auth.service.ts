import { ForbiddenException, Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, ParentInfo } from './dto';
import { ChildAuthDto } from './dto/child-auth.dto';
import * as crypto from 'crypto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    async signup(data: AuthDto, response: Response) {
        try {
            const parent = await this.prisma.parents.findFirst({
                where: {
                    email: data.email,
                },
            });

            if (parent) {
                throw new ForbiddenException('Email has been taken');
            }

            const password = data.password;
            const hashedPassword = this.hashPassword(password);

            const createdParent = await this.prisma.parents.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                },
                select: {
                    parent_id: true,
                    email: true,
                    name: true,
                    dob: true,
                    role: true,
                },
            });

            const token = this.hashToken(data.email, hashedPassword);

            // Set JWT cookie
            response.cookie('access_token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                // secure: true, // Uncomment if using HTTPS
            });

            response.cookie('parent_id', createdParent.parent_id, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                // secure: true, // Uncomment if using HTTPS
            });

            return createdParent;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Email already exists');
            }
            throw error;
        }
    }

    async login(data: AuthDto, response: Response) {
        const parent = await this.prisma.parents.findFirst({
            where: {
                email: data.email,
            },
        });

        if (!parent) {
            throw new ForbiddenException('Invalid credentials');
        }

        const passwordMatch = this.validatePassword(
            data.password,
            parent.password,
        );

        if (!passwordMatch) {
            throw new ForbiddenException('Invalid credentials');
        }

        const token = this.hashToken(
            data.email,
            this.hashPassword(data.password),
        );

        // Set JWT cookie
        response.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            // secure: true, // Uncomment if using HTTPS
        });

        response.cookie('parent_id', parent.parent_id, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            // secure: true, // Uncomment if using HTTPS
        });

        const { password: _, ...parentWithoutPassword } = parent;

        return parentWithoutPassword;
    }

    async loginChild(data: ChildAuthDto, response: Response) {
        const hashedLoginCode = this.hashPassword(data.login_code);

        const child = await this.prisma.children.findFirst({
            where: {
                login_code: hashedLoginCode,
            },
        });

        if (!child) {
            throw new ForbiddenException('Invalid credentials');
        }

        const token = this.hashToken(
            child.child_id.toString(),
            this.hashPassword(data.login_code),
        );

        // Set JWT cookie
        response.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            // secure: true, // Uncomment if using HTTPS
        });

        response.cookie('child_id', child.child_id, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            // secure: true, // Uncomment if using HTTPS
        });

        const { login_code: _, ...childWithoutPassword } = child;

        return childWithoutPassword;
    }

    async updateParentInfo(data: ParentInfo, req: Request) {
        const parent_id = parseInt(req.cookies['parent_id']);
        try {
            const updatedParent = await this.prisma.parents.update({
                where: {
                    parent_id: parent_id
                },
                data: {
                    name: data.name,
                    dob: new Date(data.dob),
                    role: data.role,
                },
            });

            // Create a new object without the 'password' field
            const { password: _, ...updatedParentWithoutPassword } =
                updatedParent;

            return updatedParentWithoutPassword;
        } catch (error) {
            throw error; // Propagate the error to be handled by NestJS error handling
        }
    }

    async createChild(data: ChildAuthDto, req: Request) {
        try {
            const parent_id = parseInt(req.cookies['parent_id']);
            const createdChild = await this.prisma.children.create({
                data: {
                    name: data.name,
                    login_code: this.hashPassword(data.login_code),
                    sex: data.sex,
                    dob: new Date(data.dob),
                    balance: 0,
                },
            });
            const management = await this.prisma.managements.create({
                data: {
                    parent_id: parent_id,
                    child_id: createdChild.child_id,
                },
            });

            return createdChild;
        } catch (error) {
            throw error; // Propagate the error to be handled by NestJS error handling
        }
    }

    async createLoginCode(data: ChildAuthDto, req: Request) {
        try {
            const updatedChild = await this.prisma.children.update({
                where: {
                    child_id: data.child_id,
                },
                data: {
                    login_code: this.hashPassword(data.login_code),
                },
            });

            // Create a new object without the 'password' field
            const { login_code: _, ...updatedChildWithoutPassword } =
                updatedChild;

            return updatedChildWithoutPassword;
        } catch (error) {
            throw error; // Propagate the error to be handled by NestJS error handling
        }
    }

    async updateChildInfo(data: ChildAuthDto, req: Request) {
        try {
            const updatedChild = await this.prisma.children.update({
                where: {
                    child_id: data.child_id,
                },
                data: {
                    name: data.name,
                    sex: data.sex,
                    dob: data.dob,
                },
            });

            // Create a new object without the 'password' field
            const { login_code: _, ...updatedChildWithoutPassword } =
                updatedChild;

            return updatedChildWithoutPassword;
        } catch (error) {
            throw error; // Propagate the error to be handled by NestJS error handling
        }
    }

    private hashToken(email: string, password: string): string {
        const hash = crypto.createHash('md5');
        hash.update(email + password);
        return hash.digest('hex');
    }

    private validatePassword(
        inputPassword: string,
        storedPassword: string,
    ): boolean {
        // Implement your password validation logic here
        const hashedInputPassword = this.hashPassword(inputPassword);
        return hashedInputPassword === storedPassword;
    }

    private hashPassword(password: string): string {
        const hash = crypto.createHash('md5');
        hash.update(password);
        return hash.digest('hex');
    }
}
