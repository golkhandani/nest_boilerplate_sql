import { createParamDecorator } from '@nestjs/common';
import { User, UserRoles } from '../models/users.model';
import { UserScopes } from '@services/authorization/models';
export interface UserInHeader {
    _id: string;
    role: UserRoles;
    scopes: UserScopes[];
}
export const UserFromHeader = createParamDecorator((data: string, req): User => {
    return data ? req.user && req.user[data] : req.user;
});
