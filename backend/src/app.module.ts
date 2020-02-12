import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthenticationModule } from '@services/authentication/authentication.module';
import { UsersProfileModule } from '@services/profiles/profiles.modules';
import { AuthorizationModule } from '@services/authorization/authorization.module';
import { mongoConstants } from '@shared/constants/mongoConstants';

import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { WinstonOptions } from '@shared/winston/winston.logger';
import { SocketAppModule } from '@sockets/socketApp.module';

@Module({
  imports: [
    // BookModule,
    WinstonModule.forRoot(WinstonOptions),
    MongooseModule.forRoot(mongoConstants.uri, mongoConstants.options),
    // GraphQLModule.forRoot({
    //   installSubscriptionHandlers: true,
    //   autoSchemaFile: 'schema.gql',
    // }),
    AuthenticationModule,
    AuthorizationModule,

    UsersProfileModule,

    SocketAppModule,

  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule { }
