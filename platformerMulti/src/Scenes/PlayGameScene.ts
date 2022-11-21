import Phaser from "phaser";
import MapManager from "../Core/MapManager";
import Player from "../GameObjects/Player";
import {GameOption} from "../GameOption";
import {io, Socket} from "socket.io-client"
import { addClientProtocol } from "../Core/ClientProtocol";
import { SessionInfo } from "../Server/Network/ServerProtocol";

interface Players 
{
    [key:string]: Player
}

export default class PlayGameScene extends Phaser.Scene
{
    player: Player;

    socket:Socket; //접속 소켓
    syncTimer:number = 0; //플레이어 정보를 싱크할 타이머
    playerName:string;

    remotePlayers: Players = {}; //플레이어 객체

    constructor()
    {
        super({key:"PlayGame"});   
        this.socket = io();        
    }

    create():void 
    {
        MapManager.Instance = new MapManager(this, "level1");

        addClientProtocol(this.socket, this); //클라이언트 소켓 이벤트 더하기
        
        this.playerName = "gondr";
        this.socket.emit("enter", {id:this.socket.id, name:this.playerName});
    }

    onCompleteConnection(x:number, y:number): void 
    {
        this.createPlayer(x, y, 200, 350, this.socket.id); //플레이어 생성, 스피드 200, 점프 350
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
                id:this.socket.id, 
                name:this.playerName, 
                flipX: this.player.flipX,
                isMoving: this.player.isMoving(),
                position:{x:this.player.x, y:this.player.y}
            };
            this.socket.emit("info_sync", playerInfo);
                
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