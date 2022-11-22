import { Socket } from "socket.io-client";
import { addClientProtocol } from "../Network/ClientListener";
import PlayGameScene from "../Scenes/PlayGameScene";

export default class SocketManager
{
    static Instance: SocketManager;

    socket:Socket;
    constructor(socket: Socket)
    {
        this.socket = socket;
    }

    addProtocol(scene:PlayGameScene): void 
    {
        addClientProtocol(this.socket, scene); //클라이언트 소켓 이벤트 더하기
    }

    sendData(protocol:string, data:object) : void 
    {
        this.socket.emit(protocol, data);
    }
}