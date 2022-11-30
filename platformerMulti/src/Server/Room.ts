import { Socket } from "socket.io";
import { SessionMap } from "./SessionManager";

export default class Room 
{
    socketMap:SessionMap = {}; //해당 룸에 들어온 소켓들

    broadcast(protocol:string, msgJSON:object, senderKey:string, exceptSender:boolean = false): void 
    {
        for(let key in this.socketMap)
        {
            if(key == senderKey && exceptSender) continue; //보낸사람은 예외라면 except
            this.socketMap[key].send(protocol, msgJSON);
        }
    }
}