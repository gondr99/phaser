import { Socket } from "socket.io";
import { SessionInfo } from "../Network/Protocol";
import JobTimer from "./JobTimer";
import Session from "./Session";
import { SessionMap } from "./SessionManager";

export enum RoomStatus {
    IDLE = 1,
    RUNNING = 2
}

export default class Room 
{
    socketMap:SessionMap = {}; //해당 룸에 들어온 소켓들
    syncTimer:JobTimer;
    status:RoomStatus = RoomStatus.IDLE; //룸의 현재 상태

    count:number = 0;
    maxCount:number = 0;

    constructor(){
        this.syncTimer = new JobTimer(50, ()=>{
            let pList = this.getRoomPlayerList();
            //각 플레이어 정보 싱크
            this.broadcast("info_sync", {list:pList}, "none", false); //모두에게 브로드캐스팅
        });
    }

    getRoomPlayerList() : SessionInfo[] 
    {
        let sessions: SessionInfo[] = [];

        for(let key in this.socketMap)
        {
            sessions.push(this.socketMap[key].toJson());
        }
        return sessions;
    }
    enterRoom(session:Session):void 
    {
        this.socketMap[session.id] = session;
    }

    leaveRoom(socketID:string):void 
    {
        delete this.socketMap[socketID];
    }

    broadcast(protocol:string, msgJSON:object, senderKey:string, exceptSender:boolean = false): void 
    {
        for(let key in this.socketMap)
        {
            if(key == senderKey && exceptSender) continue; //보낸사람은 예외라면 except
            this.socketMap[key].send(protocol, msgJSON);
        }
    }
}