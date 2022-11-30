import { Socket } from "socket.io-client";
import { addGameSceneProtocol, addLobbySceneProtocol } from "../Network/ClientListener";
import LobbyScene from "../Scenes/LobbyScene";
import PlayGameScene from "../Scenes/PlayGameScene";

export default class SocketManager
{
    static Instance: SocketManager;

    socket:Socket;
    constructor(socket: Socket)
    {
        this.socket = socket;

        this.socket.on("connect_error", (err)=>{
            console.log(err);
            alert("서버가 종료되었습니다. 점검페이지로 이동합니다. 잠시후 시도해주세요.");
            location.href = "/error";
        });
    }

    addLobbyProtocol(scene:LobbyScene): void 
    {
        addLobbySceneProtocol(this.socket, scene); //로비씬의 소켓을 더한다.
    }

    addGameProtocol(scene:PlayGameScene): void 
    {
        addGameSceneProtocol(this.socket, scene); //클라이언트 소켓 이벤트 더하기
    }

    sendData(protocol:string, data:object) : void 
    {
        this.socket.emit(protocol, data);
    }
}