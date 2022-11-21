import { Socket } from "socket.io-client";
import { PlayerList, Position, SessionInfo } from "../Server/Network/ServerProtocol";
import PlayGameScene from "../Scenes/PlayGameScene";

export const addClientProtocol = (socket:Socket, scene: PlayGameScene) => {
    socket.on("position", data => {
        let pos = data as Position;
        scene.onCompleteConnection(pos.x, pos.y);
    });

    socket.on("enter_player", data => {
        let sessionInfo = data as SessionInfo;
        scene.createPlayer(sessionInfo.position.x, sessionInfo.position.y, 200, 350, sessionInfo.id, true);
    });

    socket.on("init_player_list", data => {
        let playerList = data as PlayerList;
        playerList.list.forEach( (p: SessionInfo) => {
            if(p.id == scene.socket.id) return; //자기 자신은 추가하지 않는다.
            scene.createPlayer(p.position.x, p.position.y, 200, 350, p.id, true);
        });
    });

    socket.on("leave_player", data => {
        let sessionInfo = data as SessionInfo;
        scene.removeRemotePlayer(sessionInfo.id);
    });

    //정보 싱크 요청
    socket.on("info_sync", data => {
        let playerList = data as PlayerList;
        playerList.list.forEach( (p: SessionInfo) => {
            if(p.id == scene.socket.id) return; //자기 자신은 추가하지 않는다.
            if(scene.remotePlayers[p.id] != undefined)
            {
                scene.remotePlayers[p.id].setInfoSync(p);
            }
        });
    });
};