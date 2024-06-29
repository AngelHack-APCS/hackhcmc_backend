import {
    Body,
    Controller,
    Post,
    Res,
    UseGuards,
    Get,
    Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ParentInfo } from './dto';
import { ChildAuthDto } from './dto/child-auth.dto';
import { Response } from 'express';
import { AuthenticatedParentGuard } from './guard/parentauth.guard';
import { Request } from 'express';
import { AuthenticatedChildGuard } from './guard/childauth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('ping_parent')
    @UseGuards(AuthenticatedParentGuard)
    ping() {
        return 'OK';
    }

    @Get('ping_child')
    @UseGuards(AuthenticatedChildGuard)
    pingChild() {
        return 'OK';
    }

    @Post('signup')
    signup(
        @Body() data: AuthDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.signup(data, response);
    }

    @Post('login')
    login(
        @Body() data: AuthDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.login(data, response);
    }

    @Post('loginChild')
    loginChild(
        @Body() data: ChildAuthDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.loginChild(data, response);
    }

    @Post('updateChildInfo')
    @UseGuards(AuthenticatedParentGuard)
    updateChildInfo(@Body() data: ChildAuthDto, @Req() req: Request) {
        return this.authService.updateChildInfo(data, req);
    }

    @Post('createLoginCode')
    @UseGuards(AuthenticatedParentGuard)
    createLoginCode(@Body() data: ChildAuthDto, @Req() req: Request) {
        return this.authService.createLoginCode(data, req);
    }

    @Post('createChild')
    @UseGuards(AuthenticatedParentGuard)
    createChild(@Body() data: ChildAuthDto, @Req() req: Request) {
        return this.authService.createChild(data, req);
    }

    @Post('updateParentInfo')
    @UseGuards(AuthenticatedParentGuard)
    updateParentInfo(@Body() data: ParentInfo, @Req() req: Request) {
        return this.authService.updateParentInfo(data, req);
    }
}
