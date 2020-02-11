import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { redisConstants } from '@shared/constants';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthorizationController } from '@services/authorization/authorization.controller';
import { AuthorizationProvider } from '@services/authorization/authorization.provider';
import { UserScopeModelName, UserScopeSchema, UserScopesRepository } from '@services/authorization/models';
import { JwtStrategy, LocalStrategy } from '@services/authorization/strategies';
import { PostgresModule } from '@shared/postgres/postgres.module';

@Module({
    imports: [
        PostgresModule,
        CacheModule.register({
            store: redisStore,
            redisConstants,
        }),
        MongooseModule.forFeature([
            { name: UserScopeModelName, schema: UserScopeSchema },
        ]),
    ],
    providers: [
        AuthorizationProvider,
        LocalStrategy,
        JwtStrategy,
        ...UserScopesRepository,
    ],
    controllers: [
        AuthorizationController,
    ],
    exports: [],
})
export class AuthorizationModule { }
