import {Socket} from 'socket.io'
import { Position, SessionInfo } from './Network/ServerProtocol';

export default class Session 
{
    socket:Socket;
    name:string;
    position:Position;
    id:string;
    flipX:boolean;
    isMoving:boolean;

    constructor(socket:Socket)
    {
        this.socket = socket;
        this.id = socket.id;
        this.position = {x:0, y:0};
    }

    setPosition(position:Position):void 
    {   
        let {x, y} = position;
        this.position.x = x;        
        this.position.y = y;
    }

    //세션정보 셋팅
    setInfo(info: SessionInfo):void
    {
        this.setPosition(info.position);
        this.flipX = info.flipX;
        this.isMoving = info.isMoving;
    }

    setName(value:string):void{
        this.name = value;
    }

    send(protocol:string, data:any): void 
    {
        this.socket.emit(protocol, data);
    }

    toJson(): SessionInfo 
    {
        return {id:this.id, name:this.name, position:this.position, flipX:this.flipX, isMoving:this.isMoving};
    }
}