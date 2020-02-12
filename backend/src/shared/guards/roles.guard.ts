
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@shared/models/users.model';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationModule } from '@services/authentication/authentication.module';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';
import { WsException } from '@nestjs/websockets';

/**
 * decorator for role base authentication
 * @param roles USER_ROLES
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Scopes = (...scopes: string[]) => SetMetadata('scopes', scopes);

@Injectable()
export class RoleGuard extends AuthGuard('jwt') {
    constructor(
        private readonly reflector: Reflector,
        @Inject(AuthenticationProvider.name) private readonly auth: AuthenticationProvider) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const socket = context.switchToWs().getClient();
        const isSocket = socket.handshake && socket.handshake.query.token;

        if (isSocket) {
            const userWs: User = await this.auth.verify(
                socket.handshake.query.token,
                true,
            );
            return await wsHandler(this.reflector, context, userWs);
        } else {
            await super.canActivate(context);
            return httpHandler(this.reflector, context);

        }
    }
}

const httpHandler =  (reflector: Reflector, context: ExecutionContext) => {
    /**
     * retrun True if no role provided
     */
    const roles = reflector.get<string[]>('roles', context.getHandler());
    const scopes = reflector.get<string[]>('scopes', context.getHandler());
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
            return user.scopes.some((scope: string) => scopes.includes(scope));
        }
    };
    return user && user.role && hasRole() && hasScope();
};

const wsHandler = async (reflector: Reflector, context: ExecutionContext, user: any) => {
    /**
     * retrun True if no role provided
     */
    const roles = reflector.get<string[]>('roles', context.getHandler());
    const scopes = reflector.get<string[]>('scopes', context.getHandler());
     // console.log('scopes', scopes, 'roles', roles);
    if (!roles && !scopes) {
        return true;
    }

    // console.log('user.scopes', user.scopes, 'user.role', user.role);
    if (!user || !user.role) {
        throw new WsException('unauthorized');
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
            return user.scopes.some((scope: string) => scopes.includes(scope));
        }
    };
    return user && user.role && hasRole() && hasScope();
};
