import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from '@services/authentication/authentication.controller';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';
import {
    PhoneVerificationModelName, PhoneVerificationSchema, RefreshTokenModelName,
    RefreshTokenSchema,
} from '@services/authentication/models';
import { UserAlreadyExist } from '@services/authentication/validators';
import { jwtConstants } from '@shared/constants';
import { UserModelName, UserSchema } from '@shared/models/users.model';
import { AuthorizationModule } from '@services/authorization/authorization.module';

@Module({
    imports: [
        AuthorizationModule,
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
    ],
    controllers: [
        AuthenticationController,
    ],
    exports: [
        AuthenticationProvider,
    ],
})
export class AuthenticationModule { }
