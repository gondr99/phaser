import {Socket} from 'socket.io';
import ServerMapManager from '../Server/ServerMapManager';
import Session from '../Server/Session';
import SessionManager from '../Server/SessionManager';
import { Iceball, SessionInfo } from './Protocol';

export const addServerSocketListener = (socket:Socket, session:Session) => {
    //이안에서 세션은 클로져 되어 보존됨.

    socket.on("enter", data => {
        let posIndex:number = Math.floor( Math.random() * ServerMapManager.Instance.spawnPoints.length);
        let pos = ServerMapManager.Instance.spawnPoints[posIndex];
        socket.emit("position", pos);
        session.setPosition(pos);
        //들어왔음을 모든 이들에게 알려야 함.
        
        let enterInfo = data as SessionInfo;
        session.setName(enterInfo.name);

        let list = SessionManager.Instance.getPlayerList(); 
        socket.emit("init_player_list", {list});
        SessionManager.Instance.broadcast("enter_player", session.toJson(), socket.id, true);
    });

    socket.on("info_sync", data => {
        let s = data as SessionInfo;
        SessionManager.Instance.getSession(s.id)?.setInfo(s); 
    });

    //발사체를 발사하겠다는 요청이 오면
    socket.on("fire_projectile", data => {
        let iceball = data as Iceball;

        SessionManager.Instance.broadcast("fire_projectile", iceball, socket.id, false); //발사자 포함 모두에게 전송
    });

    socket.on("disconnect", reason => {
        SessionManager.Instance.removeSession(socket.id);
        console.log(`${session.name} (${socket.id}) is disconnected`);
        SessionManager.Instance.broadcast("leave_player", session.toJson(), socket.id, true); 
    });
};