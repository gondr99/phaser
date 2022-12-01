import {Socket} from 'socket.io';
import ServerMapManager from '../Server/ServerMapManager';
import Session, { SessionStatus } from '../Server/Session';
import SessionManager from '../Server/SessionManager';
import { DeadInfo, Iceball, ProjectileHitInfo, ReviveInfo, SessionInfo, UserInfo } from './Protocol';

export const addServerSocketListener = (socket:Socket, session:Session) => {
    //이안에서 세션은 클로져 되어 보존됨.

    socket.on("login_user", data => {
        let userInfo = data as UserInfo;
        session.setName(userInfo.name);
        session.status = SessionStatus.LOBBY; //로비로 세션을 진입시킴
        socket.emit("login_confirm", userInfo);
    });

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

    let projectileId:number = 0; //이 값은 클로징 되어 이 안에서 카운팅 된다.
    //발사체를 발사하겠다는 요청이 오면
    socket.on("fire_projectile", data => {
        let iceball = data as Iceball;
        projectileId++;
        iceball.projectileId = projectileId; //숫자 지정하고 보내준다.
        SessionManager.Instance.broadcast("fire_projectile", iceball, socket.id, false); //발사자 포함 모두에게 전송
    });

    //발사체에 내가 맞았다는 보고를 받으면
    socket.on("hit_report", data => {
        let hitInfo = data as ProjectileHitInfo;
        //플레이어 크기는 32X38, 투사체 크기는 20X20 이다.
        let session = SessionManager.Instance.getSession(hitInfo.playerId);
        if(session == undefined ) return; //만약 session이 undefined라면

        //서버쪽은 상당히 넉넉하게 잡아줘야 한다. 왜냐하면 충돌이 발생했을 때 관통되는 것이 아니기 때문에
        let sLTPos = {x: session.position.x - 32, y: session.position.y - 38};//플레이어 좌측 상단 좌표
        let pLTPos = hitInfo.projectileLTPosition;
        let verify:boolean = (sLTPos.x < pLTPos.x + 20) 
                            && (sLTPos.y < pLTPos.y + 20) 
                            && (sLTPos.x + 32 + 32 * 0.5 > pLTPos.x) 
                            && (sLTPos.y + 38 + 38 * 0.5> pLTPos.y);

        if(verify == false) return; //서버쪽에서 검증했을때 안맞은거면 false;
        
        SessionManager.Instance.broadcast("hit_confirm", hitInfo, socket.id, false); 
        
    });

    socket.on("player_dead", data => {
        let deadInfo = data as DeadInfo;
        SessionManager.Instance.broadcast("player_dead", deadInfo, socket.id, true); //센더 제외 알려주기
        //10초 후 부활
        setTimeout(()=> {
            let posIndex:number = Math.floor( Math.random() * ServerMapManager.Instance.spawnPoints.length);
            let pos = ServerMapManager.Instance.spawnPoints[posIndex];
            session.setPosition( pos); 

            let reviveInfo: ReviveInfo = {playerId:deadInfo.playerId, info:session.toJson()};
            SessionManager.Instance.broadcast("player_revive", reviveInfo, socket.id, false); //전원에게 알려주기
        }, 1000 * 5); 
    });

    socket.on("disconnect", reason => {
        SessionManager.Instance.removeSession(socket.id);
        console.log(`${session.name} (${socket.id}) is disconnected`);
        SessionManager.Instance.broadcast("leave_player", session.toJson(), socket.id, true); 
    });
};