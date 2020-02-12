import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { redisConstants } from '@shared/constants';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthorizationController } from '@services/authorization/authorization.controller';
import { AuthorizationProvider } from '@services/authorization/authorization.provider';
import { UserScopeModelName, UserScopeSchema, UserScopesRepository, UserScopeEntity } from '@services/authorization/models';
import { JwtStrategy, LocalStrategy } from '@services/authorization/strategies';
import { PostgresModule } from '@shared/postgres/postgres.module';
import { UserEntity } from '@shared/models/users.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneVerificationEntity, RefreshTokenEntity } from '@services/authentication/models';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            PhoneVerificationEntity,
            RefreshTokenEntity,
            UserScopeEntity,
        ]),
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
    ],
    controllers: [
        AuthorizationController,
    ],
    exports: [],
})
export class AuthorizationModule { }
