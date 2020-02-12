import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthenticationModule } from './services/authentication/authentication.module';
import { UsersProfileModule } from './services/profiles/profiles.modules';
import { AuthorizationModule } from './services/authorization/authorization.module';
import { mongoConstants } from '@shared/constants/mongoConstants';
import { EventsModule } from './sockets/events/events.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@shared/models';
import { PhoneVerificationEntity, RefreshTokenEntity } from '@services/authentication/models';
import { UserScopeEntity } from '@services/authorization/models';

@Module({
  imports: [
    // BookModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'test',
      entities: [
        UserEntity,
        PhoneVerificationEntity,
        RefreshTokenEntity,
        UserScopeEntity,
      ],
      synchronize: true,
      logging: true,
    }),
    MongooseModule.forRoot(mongoConstants.uri, mongoConstants.options),
    // GraphQLModule.forRoot({
    //   installSubscriptionHandlers: true,
    //   autoSchemaFile: 'schema.gql',
    // }),
    AuthenticationModule,
    AuthorizationModule,

    UsersProfileModule,

    EventsModule,

  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
