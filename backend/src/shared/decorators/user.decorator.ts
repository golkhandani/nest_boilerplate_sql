import { createParamDecorator } from '@nestjs/common';
import { User, UserRoles } from '../models/users.model';
import { UserScopes } from '@services/authorization/models';
export interface UserInHeader {
    _id: string;
    role: UserRoles;
    scopes: UserScopes[];
}

export const UserFromWs = createParamDecorator((data: string, socket): User => {
    return  data ? socket[0].handshake.user[data] : socket[0].handshake.user;
});
export const UserFromHeader = createParamDecorator((data: string, req): User => {
    return data ? req.user && req.user[data] : req.user;
});
