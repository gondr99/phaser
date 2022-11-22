import Phaser from "phaser";
import MapManager from "../Core/MapManager";
import Player from "../GameObjects/Player";
import {GameOption} from "../GameOption";
import {io, Socket} from "socket.io-client"
import { SessionInfo } from "../Network/Protocol";
import SocketManager from "../Core/SocketManager";
import ProjectilePool from "../GameObjects/Pools/ProjectilePool";

interface Players 
{
    [key:string]: Player
}

export default class PlayGameScene extends Phaser.Scene
{
    player: Player;

    syncTimer:number = 0; //플레이어 정보를 싱크할 타이머
    playerName:string;

    remotePlayers: Players = {}; //플레이어 객체

    constructor()
    {
        super({key:"PlayGame"});   
        const socket = io();
        SocketManager.Instance = new SocketManager(socket); //소켓 매니저로 만들고
    }

    create():void 
    {
        MapManager.Instance = new MapManager(this, "level1");
        ProjectilePool.Instance = new ProjectilePool(this);
        
        SocketManager.Instance.addProtocol(this);
        
        this.playerName = "gondr";
        SocketManager.Instance.sendData("enter", {id:SocketManager.Instance.socket.id, name:this.playerName});
    }

    onCompleteConnection(x:number, y:number): void 
    {
        this.createPlayer(x, y, 200, 350, SocketManager.Instance.socket.id); //플레이어 생성, 스피드 200, 점프 350
        this.cameraSetting(); //카메라 셋팅 호출
    }

    createPlayer(x:number, y:number, speed:number, jumpPower:number, id:string, isRemote:boolean = false) : void
    {
        if(isRemote) 
        {
            this.remotePlayers[id] = new Player(this, x, y, "player", speed, jumpPower, isRemote,id);
        }else {
            this.player = new Player(this, x, y, "player", speed, jumpPower, isRemote,id);
            this.physics.add.collider(this.player, MapManager.Instance.collisions);
        }
    }

    update(time: number, delta: number): void {
        if(this.player == undefined) return;
        this.syncTimer += delta;
        if(this.syncTimer >= 50) {
            this.syncTimer = 0;
            let playerInfo : SessionInfo = 
            {
                id:SocketManager.Instance.socket.id, 
                name:this.playerName, 
                flipX: this.player.flipX,
                isMoving: this.player.isMoving(),
                position:{x:this.player.x, y:this.player.y}
            };
            SocketManager.Instance.sendData("info_sync", playerInfo);
                
        }
    }

    removeRemotePlayer(id:string)
    {
        this.remotePlayers[id].destroy(); //실제 오브젝트 지우고 
        delete this.remotePlayers[id]; //원격 플레이어에서도 빼버리고
    }

    cameraSetting(): void 
    {
        const {width, height,mapOffset, cameraZoomFactor, bottomOffset} = GameOption;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + bottomOffset);
        this.cameras.main.setBounds(0, 0, width + mapOffset, height);
        this.cameras.main.setZoom(cameraZoomFactor);
        this.cameras.main.startFollow(this.player);
    }
}