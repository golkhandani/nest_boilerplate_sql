
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

/**
 * decorator for role base authentication
 * @param roles USER_ROLES
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Scopes = (...scopes: string[]) => SetMetadata('scopes', scopes);

@Injectable()
export class RoleGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        /**
         * retrun True if no role provided
         */
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        const scopes = this.reflector.get<string[]>('scopes', context.getHandler());
        // console.log('scopes', scopes, 'roles', roles);
        if (!roles && !scopes) {
            return true;
        }
        /**
         * retrun false if no user(token) provided
         */
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        // console.log('user.scopes', user.scopes, 'user.role', user.role);
        if (!user || !user.role) {
            throw new UnauthorizedException();
        }
        const hasRole = () => {
            if (!roles) {
                return true;
            } else {
                return roles.includes(user.role);
            }
        };
        const hasScope = () => {
            if (!scopes) {
                return true;
            } else if (!user.scopes) {
                return false;
            } else {
                return user.scopes.some((scope) => scopes.includes(scope));
            }
        };

        return user && user.role && hasRole() && hasScope();
    }

}
