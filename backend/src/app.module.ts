import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthenticationModule } from './services/authentication/authentication.module';
import { UsersProfileModule } from './services/profiles/profiles.modules';
import { AuthorizationModule } from './services/authorization/authorization.module';
import { mongoConstants } from '@shared/constants/mongoConstants';
import { EventsModule } from './sockets/events/events.module';

@Module({
  imports: [
    // BookModule,
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
