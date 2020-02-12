import {
    Controller, Get, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors, Body, CacheInterceptor,
} from '@nestjs/common';
import { FileInterceptor, MulterModuleOptions } from '@nestjs/platform-express';
import { UserScopes } from '@services/authorization/models';
import { UsersProfileProvider } from '@services/profiles/profiles.provider';
import { UserFromHeader, UserInHeader } from '@shared/decorators';
import { MulterFile } from '@shared/dtos';
import { RoleGuard, Roles, Scopes } from '@shared/guards';
import { User, UserRoles } from '@shared/models';
import { Api } from '@shared/interfaces';
import { UpdateUser } from './dtos';
import { ApiUseTags } from '@nestjs/swagger';

const controllerName = 'users';

@Controller(controllerName)
@ApiUseTags(controllerName)
@UseInterceptors(CacheInterceptor)
export class UsersProfileController {
    @Get('ping')
    @UseGuards(RoleGuard)
    @Roles(UserRoles.USER, UserRoles.GUEST)
    getPing(
        @Request() req,
        @UserFromHeader() user): any {
        return {
            authorization: req.headers.authorization,
            user,
        };
    }
    @Post('ping')
    @Roles(UserRoles.GUEST, UserRoles.USER)
    @Scopes(UserScopes.WRITE)
    @UseGuards(RoleGuard)
    postPing(
        @Request() req,
        @UserFromHeader() user): any {
        return {
            authorization: req.headers.authorization,
            user,
        };
    }
    constructor(
        private readonly usersProfileProvider: UsersProfileProvider,
    ) { }

    @Roles(UserRoles.USER)
    @UseGuards(RoleGuard)
    @Get('')
    async getProfiles(): Promise<Api<User[]>> {
        return {
            data: await this.usersProfileProvider.getProfiles(),
            message: 'users list for admin',
        };
    }

    @Roles(UserRoles.USER, UserRoles.GUEST)
    @Scopes(UserScopes.ME)
    @UseGuards(RoleGuard)
    @Get('me')
    async getProfile(@UserFromHeader() user: UserInHeader): Promise<Api<User>> {
        return {
            data: await this.usersProfileProvider.getProfile(user),
            message: 'user owner',
        };
    }

    @Scopes(UserScopes.ME)
    @Roles(UserRoles.USER)
    @UseGuards(RoleGuard)
    @Put('me')
    async updateProfile(
        @UserFromHeader() user: UserInHeader,
        @Body() updates: UpdateUser): Promise<Api<User>> {
        return {
            data: await this.usersProfileProvider.updateProfile(user, updates),
            message: 'user owner',
        };
    }

    @Scopes(UserScopes.ME)
    @UseGuards(RoleGuard)
    @Put('me/picture')
    @UseInterceptors(FileInterceptor('file'))
    async updateProfilePicture(
        @UserFromHeader() user: UserInHeader,
        @UploadedFile() file: MulterFile): Promise<Api<User>> {
        return {
            data: await this.usersProfileProvider.updateProfilePicture(user, file),
            message: 'user picture updated',
        };
    }
}
