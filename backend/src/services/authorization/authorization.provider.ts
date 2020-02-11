import { Model } from 'mongoose';

import { BadRequestException, Injectable, Inject, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserScope, UserScopeModelName, UserScopes, USER_SCOPE_REPOSITORY_NAME, UserScopeEntity } from '@services/authorization/models';

@Injectable()
export class AuthorizationProvider {
    constructor(
        @Inject(USER_SCOPE_REPOSITORY_NAME) private readonly userScopesRepository: typeof UserScopeEntity,

        // @InjectModel(UserScopeModelName) private readonly UserScopeModel: Model<UserScope>,
    ) { }
    async getScopes(userId: string): Promise<string[]> {
        console.log('getScopes', 1, userId);
        const userScopesObj: UserScopeEntity = await this.userScopesRepository.findOne({ where: { user_id: userId }});
        if (!userScopesObj) {
            throw new NotAcceptableException();
        }
        const scopes =  Object.keys(UserScopes).filter(item => userScopesObj[item] === true);
        // const userScopes = await this.UserScopeModel.findOne({ user: userId });
        // return (userScopes || {} as UserScope).scopes;
        return scopes;
    }
    async initScopes(userId: string, scopes: UserScopes[]) {
        const validatedScopes: any = {
            ME: false,
            READ: false,
            WRITE: false,
            GOD: false,
        };
        scopes.forEach((scope) => {
            scope = scope.toUpperCase() as UserScopes;
            if (!Object.values(UserScopes).includes(scope)) {
                throw new BadRequestException('scopes must be valid');
            } else {
                validatedScopes[scope] = true;
            }
        });
        return await this.userScopesRepository.upsert({
            user_id: userId,
            ...validatedScopes,
        });
    }
    async addScopes(userId: string, scopes: UserScopes[]): Promise<UserScope> {
        const validatedScopes: any = {};
        if (!scopes || scopes.length === 0) {
            throw new BadRequestException('scopes must not be empty');
        } else {
            scopes.forEach((scope) => {
                scope = scope.toUpperCase() as UserScopes;
                if (!Object.values(UserScopes).includes(scope)) {
                    throw new BadRequestException('scopes must be valid');
                } else {
                    validatedScopes[scope] = true;
                }
            });
        }

        // const newScopes = { $addToSet: { scopes } };
        // return await this.UserScopeModel.findOneAndUpdate({ user: userId }, newScopes, { new: true, upsert: true });

        const userScopes = await this.userScopesRepository.upsert({
            user_id: userId,
            ...validatedScopes,
        }, { returning: true });
        return userScopes;
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
        const newScopes = { $pull: { scopes } };
        // return await this.UserScopeModel.findOneAndUpdate({ user: userId }, newScopes, { new: true, upsert: true });

        const userScopes = await this.userScopesRepository.upsert({
            user_id: userId,
            ...validatedScopes,
        }, { returning: true });
        return userScopes;
    }
}
