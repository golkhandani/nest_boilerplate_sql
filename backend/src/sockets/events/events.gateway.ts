import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsException,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket, Server } from 'socket.io';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';
import { User, UserRoles } from '@shared/models';
import { RedisService } from 'nestjs-redis';
import { UseGuards, Inject } from '@nestjs/common';
import { RoleGuard, Roles, Scopes } from '@shared/guards';
import { UserScopes } from '@services/authorization/models';
import { WLogger } from '@shared/winston/winston.ext';
import { Logger } from 'winston';
import { WINSTON_MODULE_NAME } from '@shared/winston/winston.logger';
const events = {
    new_location: '0',
    get_reports: '1',
    post_reports: '2',
};
@WebSocketGateway(3001, {namespace: ''})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    connectedUsers: string[] = [];
    constructor(
        @Inject(WINSTON_MODULE_NAME) private readonly logger: Logger,
        private readonly redisService: RedisService,
        private readonly authProvider: AuthenticationProvider,
    ) { }
    async handleConnection(socket: Socket) {
        const user: User = await this.authProvider.verify(
            socket.handshake.query.token,
            true,
        );
        if (!user) {
            throw new WsException('UNAT');
        }
        // console.log(user);

        this.connectedUsers = [...this.connectedUsers, String(user._id)];

        // console.log(this.connectedUsers);
        // Send list of connected users
        this.server.emit('users', this.connectedUsers);
    }

    async handleDisconnect(socket: { handshake: { query: { token: string; }; }; }) {
        const user: User = await this.authProvider.verify(
            socket.handshake.query.token,
            true,
        );
        const userPos = this.connectedUsers.indexOf(String(user._id));

        if (userPos > -1) {
            this.connectedUsers = [
                ...this.connectedUsers.slice(0, userPos),
                ...this.connectedUsers.slice(userPos + 1),
            ];
        }

        // Sends the new list of connected users
        this.server.emit('users', this.connectedUsers);
    }

    @Roles(UserRoles.GUEST, UserRoles.USER)
    @Scopes(UserScopes.ME)
    @UseGuards(RoleGuard)
    @SubscribeMessage(events.new_location)
    newLocationSubmit(
        @MessageBody() data: any,
    ): Observable<WsResponse<number>> {
        const event = events.new_location;
        const response = [1, 2, 3];

        return from(response).pipe(
            map(item => ({ event, data: item })),
        );
    }

    @Roles(UserRoles.GUEST, UserRoles.USER)
    @Scopes(UserScopes.ME)
    @UseGuards(RoleGuard)
    @SubscribeMessage(events.get_reports)
    newLocationReport(@MessageBody() data: any): Observable<WsResponse<number>> {
        const event = events.get_reports;
        const response = [1, 2, 3];
        this.logger.info('with guard');
        return from(response).pipe(
            map(item => ({ event, data: item })),
        );

        // return 'hi' + JSON.stringify(data);
    }

    /**
     *
     * @param data
     *
     *
     *
     *
     */
    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): string {
        this.server.emit('events', 'ok');
        this.logger.info('events', data);
        return 'hi' + JSON.stringify(data);
    }
    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
        return data;
    }
    @SubscribeMessage('join')
    async onRoomJoin(
        @MessageBody() data: {room_id: string},
        @ConnectedSocket() client: Socket,
    ): Promise<any> {
        this.logger.info('join', data);
        client.join(data.room_id);
        client.broadcast.to(data.room_id).emit('events', 'salam');

        // const messages = await this.roomService.findMessages(data, 25);

        // Send last messages to the connected user
        client.emit('join', 'ok');
        return 'joined';
    }
}
