import { Model } from 'mongoose';

import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserScope, UserScopeModelName, UserScopes } from '@services/authorization/models';

@Injectable()
export class AuthorizationProvider {
    constructor(
        @InjectModel(UserScopeModelName) private readonly UserScopeModel: Model<UserScope>,
    ) { }
    async getScopes(userId: string): Promise<string[]> {
        const userScopesObj = await this.UserScopeModel.findOne({ user: userId });
        if (!userScopesObj) {
            throw new NotAcceptableException();
        }
        const scopes =  Object.keys(UserScopes).filter(item => userScopesObj[item] === true);
        return scopes;
    }
    async initScopes(userId: string, scopes: UserScopes[]) {
        const validatedScopes: any = {
            [UserScopes.ME]: false,
            [UserScopes.READ]: false,
            [UserScopes.WRITE]: false,
            [UserScopes.GOD]: false,
        };
        scopes.forEach((scope) => {
            scope = scope.toUpperCase() as UserScopes;
            if (!Object.values(UserScopes).includes(scope)) {
                throw new BadRequestException('scopes must be valid');
            } else {
                validatedScopes[scope] = true;
            }
        });
        const savedScopes = await this.UserScopeModel.create({
            user: userId,
            ...validatedScopes,
        });
        return savedScopes;
    }
    async addScopes(userId: string, scopes: UserScopes[]): Promise<UserScope> {
        const validatedScopes: any = {};
        if (!scopes || scopes.length === 0) {
            throw new BadRequestException('scopes must not be empty');
        } else {
            scopes.forEach((scope) => {
                if (!Object.values(UserScopes).includes(scope)) {
                    throw new BadRequestException('scopes must be valid');
                } else {
                    validatedScopes[scope] = true;
                }
            });
        }
        const newScopes = { $set: { ...validatedScopes } };
        return await this.UserScopeModel.findOneAndUpdate({ user: userId }, newScopes, { new: true, upsert: true });
    }
    async removeScopes(userId: string, scopes: UserScopes[]): Promise<UserScope> {
        const validatedScopes: any = {};
        if (!scopes || scopes.length === 0) {
            throw new BadRequestException('scopes must not be empty');
        } else {
            scopes.forEach((scope: UserScopes) => {
                if (!Object.values(UserScopes).includes(scope)) {
                    throw new BadRequestException('scopes must be valid');
                } else {
                    validatedScopes[scope] = false;
                }

            });
        }
        const newScopes = { $set: { ...validatedScopes } };
        return await this.UserScopeModel.findOneAndUpdate({ user: userId }, newScopes, { new: true, upsert: true });
    }
}
