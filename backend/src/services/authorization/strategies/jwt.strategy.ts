import { ExtractJwt, Strategy } from 'passport-jwt';

import { HttpException, Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from '@shared/constants';
import { JwtPayload } from '@shared/models/jwtPayload.model';

import { AuthorizationProvider } from '../authorization.provider';
import { UserScopes } from '../models/scope.model';
import { CacheManager } from '@shared/interfaces/cache.interface';

export const jwtBlockListKey = 'jwt_blocked';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private blocked: string[] = [];
    constructor(
        private readonly authorizationProvider: AuthorizationProvider,
        @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
            ignoreExpiration: true,
            secretOrKey: jwtConstants.public_key,
        });
        this.setBlockList(cacheManager);
    }

    private async setBlockList(cacheManager: CacheManager) {
        this.blocked.concat((await cacheManager.get('jwt_blocked')) || []);
    }

    /**
     * return unsign token
     * to reach this step should send a token with some requirment
     * for example structure , correct secret and valid expire time
     * @param payload JwtPayload
     */
    async validate(payload: JwtPayload) {
        // const unlocked = TokenSubject.unlock(payload.sub) as User;
        if (this.blocked.includes(payload._id)) {
            return new HttpException('you are blocked', 403);
        } else {
            payload.scopes = (await this.authorizationProvider.getScopes(payload._id) || []).concat([UserScopes.READ]);
            return payload;
        }
    }
}
