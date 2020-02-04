import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';
import { User } from '@shared/models';

@WebSocketGateway(3001)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    connectedUsers: string[] = [];
    constructor(private readonly authProvider: AuthenticationProvider) { }
    async handleConnection(socket) {
        const user: User = await this.authProvider.verify(
            socket.handshake.query.token,
            true,
        );

        this.connectedUsers = [...this.connectedUsers, String(user._id)];

        console.log(this.connectedUsers);
        // Send list of connected users
        this.server.emit('users', this.connectedUsers);
    }

    async handleDisconnect(socket) {
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
    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): string {
        this.server.emit('events', 'ok');
        console.log('HEQW');
        return 'hi' + JSON.stringify(data);
    }

    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
        return data;
    }
    @SubscribeMessage('join')
    async onRoomJoin(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ): Promise<any> {
        // console.log('join', data, client);
        client.join(data);
        client.broadcast.to(data).emit('events', 'salam');

        // const messages = await this.roomService.findMessages(data, 25);

        // Send last messages to the connected user
        client.emit('join', 'ok');
        return 'joined';
    }
}
