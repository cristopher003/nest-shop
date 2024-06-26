import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


interface ConnectedClients{
    [id:string]:
    {socket:Socket,
    user:User,
    }
}

@Injectable()
export class MessagesWsService {

    private connectedClients:ConnectedClients={}

    constructor(
        @InjectRepository(User) 
        private readonly userRepostory:Repository<User>){

    }
   
   async registerClient(client:Socket,id:string){
        const user = await this.userRepostory.findOneBy({id});
        if(!user) throw new Error("User not found");
        if (!user.isActive) new Error("User not active");
        this.checkUserConnection(user);
        this.connectedClients[client.id]={socket:client,user};
    }

    removeClient(clientId:string){
        delete this.connectedClients[clientId];
    }

    getConnetedClients():string[]{
        return Object.keys(this.connectedClients);
    }

    getUserFullName(socketId:string){
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserConnection(user:User){
        for (const clientId of Object.keys(this.connectedClients)) {
            const client=this.connectedClients[clientId];
            if(client.user.id===user.id){
                client.socket.disconnect();
                break;
            }
        }
    }
}
