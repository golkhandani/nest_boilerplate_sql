import { Module } from '@nestjs/common';
import { RedisModule} from 'nestjs-redis';

import { EventsGateway } from '@sockets/events/events.gateway';
import { AuthenticationModule } from '@services/authentication/authentication.module';
import { redisConstants } from '@shared/constants';

@Module({
    imports: [
        RedisModule.register({
            ...redisConstants,
            ...{
                keyPrefix: 'SOCKET',
                keepAlive: 500,
                autoResubscribe: true,
                maxRetriesPerRequest: 10,
            },
        }),
        AuthenticationModule,
    ],
    providers: [
        EventsGateway,
    ],
})
export class SocketAppModule { }
