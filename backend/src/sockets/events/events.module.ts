import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthenticationModule } from '@services/authentication/authentication.module';

@Module({
    imports: [
        AuthenticationModule,
    ],
    providers: [EventsGateway],
})
export class EventsModule { }
