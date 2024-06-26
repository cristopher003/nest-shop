import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-messageDto';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';


@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection,OnGatewayDisconnect{
  
  @WebSocketServer() wss:Server;
  
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    // recibimos el token
    const token=client.handshake.headers.authentication as string;
    let payload:JwtPayload;
    try {
      payload=this.jwtService.verify(token);
     await this.messagesWsService.registerClient(client,payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-update',
    this.messagesWsService.getConnetedClients());
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-update',
      this.messagesWsService.getConnetedClients());
  }

 @SubscribeMessage('message-client')
 handleMessageFromClient(client:Socket,payload:NewMessageDto){

  //emite solo a un cliente
  // client.emit('message-from-server',{
  //   fullName:"cristopher",
  //   message:payload.message || "vacio-"
  // });

  // emite a todos menos al cliente
  // client.broadcast.emit('message-from-server',{
  //   fullName:"cristopher",
  //   message:payload.message || "vacio-"
  // });

// emite a todos
  this.wss.emit('message-from-server',{
    fullName:this.messagesWsService.getUserFullName(client.id),
    message:payload.message || "vacio-"
  });

 }


}
