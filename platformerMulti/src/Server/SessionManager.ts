import { SessionInfo } from "../Network/Protocol";
import Session from "./Session";

export interface SessionMap 
{
    [key:string] : Session
}

export default class SessionManager 
{
    static Instance: SessionManager; //싱글톤 변수

    map:SessionMap = {};

    constructor()
    {

    }

    getSession(key:string) : Session | undefined
    {
        return this.map[key];
    }

    //새로운 사용자 추가
    addSession(key:string, session:Session):void
    {
        this.map[key] = session;
    }

    removeSession(key:string) : void 
    {
        delete this.map[key];
    }

    broadcast(protocol:string, msgJSON:object, senderKey:string, exceptSender:boolean = false): void 
    {
        for(let key in this.map)
        {
            if(key == senderKey && exceptSender) continue; //보낸사람은 예외라면 except
            this.map[key].send(protocol, msgJSON);
        }
    }

    getPlayerList() : SessionInfo[] 
    {
        let sessions: SessionInfo[] = [];

        for(let key in this.map)
        {
            sessions.push(this.map[key].toJson());
        }
        return sessions;
    }

}