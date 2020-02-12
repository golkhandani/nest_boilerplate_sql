import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from '@services/authentication/authentication.controller';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';
import {
    PhoneVerificationModelName, PhoneVerificationSchema, RefreshTokenModelName,
    RefreshTokenSchema,
    PhoneVerificationsRepository,
    RefreshTokensRepository,
    PhoneVerificationEntity,
    RefreshTokenEntity,
} from '@services/authentication/models';
import { UserAlreadyExist } from '@services/authentication/validators';
import { jwtConstants } from '@shared/constants';
import { UserModelName, UserSchema, UsersRepository, UserEntity } from '@shared/models/users.model';
import { PostgresModule } from '@shared/postgres/postgres.module';
import { AuthorizationProvider } from '@services/authorization/authorization.provider';
import { UserScopesRepository, UserScopeEntity } from '@services/authorization/models';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            PhoneVerificationEntity,
            RefreshTokenEntity,
            UserScopeEntity,
        ]),
        MongooseModule.forFeature([
            {
                name: UserModelName,
                schema: UserSchema,
            }]),
        MongooseModule.forFeature([{
            name: RefreshTokenModelName,
            schema: RefreshTokenSchema,
        }]),
        MongooseModule.forFeature([{
            name: PhoneVerificationModelName,
            schema: PhoneVerificationSchema,
        }]),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.private_key,
        }),
    ],
    providers: [
        UserAlreadyExist,
        AuthenticationProvider,
        AuthorizationProvider,
        // ...UsersRepository,
        // ...PhoneVerificationsRepository,
        // ...RefreshTokensRepository,
        // ...UserScopesRepository,
    ],
    controllers: [
        AuthenticationController,
    ],
    exports: [
        AuthenticationProvider,
    ],
})
export class AuthenticationModule { }
