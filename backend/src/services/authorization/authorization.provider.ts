import { Model } from 'mongoose';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserScope, UserScopeModelName, UserScopes } from '@services/authorization/models';

@Injectable()
export class AuthorizationProvider {
    constructor(
        @InjectModel(UserScopeModelName) private readonly UserScopeModel: Model<UserScope>,
    ) { }
    async getScopes(userId: string): Promise<string[]> {
        const userScopes = await this.UserScopeModel.findOne({ user: userId });
        return (userScopes || {} as UserScope).scopes;
    }
    async addScopes(userId: string, scopes: UserScopes[]): Promise<UserScope> {
        if (!scopes || scopes.length === 0) {
            throw new BadRequestException('scopes must not be empty');
        } else {
            scopes.forEach((scope) => {
                if (!Object.values(UserScopes).includes(scope)) {
                    throw new BadRequestException('scopes must be valid');
                }
            });
        }
        const newScopes = { $addToSet: { scopes } };
        return await this.UserScopeModel.findOneAndUpdate({ user: userId }, newScopes, { new: true, upsert: true });
    }
    async removeScopes(userId: string, scopes: UserScopes[]): Promise<UserScope> {
        if (!scopes || scopes.length === 0) {
            throw new BadRequestException('scopes must not be empty');
        } else {
            scopes.forEach((scope: UserScopes) => {
                if (!Object.values(UserScopes).includes(scope)) {
                    throw new BadRequestException('scopes must be valid');
                }
            });
        }
        const newScopes = { $pull: { scopes } };
        return await this.UserScopeModel.findOneAndUpdate({ user: userId }, newScopes, { new: true, upsert: true });
    }
}
