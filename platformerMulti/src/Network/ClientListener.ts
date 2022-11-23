import { Socket } from "socket.io-client";
import { Iceball, PlayerList, Position, ProjectileHitInfo, SessionInfo } from "./Protocol";
import PlayGameScene from "../Scenes/PlayGameScene";
import SocketManager from "../Core/SocketManager";
import ProjectilePool from "../GameObjects/Pools/ProjectilePool";

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
            if(p.id == SocketManager.Instance.socket.id) return; //자기 자신은 추가하지 않는다.
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
            if(p.id == SocketManager.Instance.socket.id) return; //자기 자신은 추가하지 않는다.
            if(scene.remotePlayers[p.id] != undefined)
            {
                scene.remotePlayers[p.id].setInfoSync(p);
            }
        });
    });

    //발사체를 발사하라는 허가가 오면
    socket.on("fire_projectile", data => {
        let iceball = data as Iceball;
        if(iceball.ownerId == socket.id) { //내가 쏜거면 발사
            scene.player.iceballAttack.fireProjectile(iceball);
        }else {
            //아니면 다른애가 발사하게 함.
            scene.remotePlayers[iceball.ownerId].iceballAttack.fireProjectile(iceball);
        }
    });

    //맞았다는 확인 오면
    socket.on("hit_confirm", data => {
        let hitInfo = data as ProjectileHitInfo;

        ProjectilePool.Instance.searchAndDestroy(hitInfo.projectileId, hitInfo.projectileLTPosition);

        if(hitInfo.playerId == socket.id) { //내가 맞은거면
            scene.player.takeHit(1); //이부분 정정 필요
            scene.player.removeWaiting(hitInfo.projectileId); //피격대기중이던거 정리
            console.log("아야");
            //내가 맞은거라면 나를 튕겨나가게 처리
            let dir = hitInfo.projectileLTPosition.x - scene.player.x < 0 ? 1 : -1; //왼쪽 오른쪽
            console.log(dir);
            scene.player.bounceOff(new Phaser.Math.Vector2( dir, -1));
        }else{
            let target = scene.remotePlayers[hitInfo.playerId];
            if(target == undefined) return;
            target.removeWaiting(hitInfo.projectileId); //피격대기중이던거 정리
            target.takeHit(1); //이부분 정정 필요
        }
    });
};