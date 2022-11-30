import Phaser, { LEFT } from "phaser";
import { io } from "socket.io-client";
import SocketManager from "../Core/SocketManager";
import { GameOption } from "../GameOption";

export default class PreloadAssetScene extends Phaser.Scene
{
    popupDiv: HTMLDivElement;
    gameCanvas: HTMLCanvasElement;

    constructor()
    {
        super({key:"PreloadAsset"});
        
        const socket = io();
        SocketManager.Instance = new SocketManager(socket); //소켓 매니저로 만들고
        console.log("preload");
    }

    preload(): void 
    {
        //타일맵 데이터 및 타일 그림 로드
        this.load.tilemapTiledJSON("level1", "assets/level1_stage.json");
        this.load.image("tile_1", "assets/main_lev_build_1.png");

        //플레이어 이미지 로드
        this.load.spritesheet("player", "assets/player/move_sprite_1.png", {
            frameWidth:32,
            frameHeight:38,
            spacing:32
        });

        //플레이어 투척 애니메이션 로드
        this.load.spritesheet("player_throw", "assets/player/throw_attack_sheet_1.png", {
            frameWidth:32,
            frameHeight:38,
            spacing:32
        });

        //투사체 이미지 로드
        this.load.image("iceball", "assets/weapons/iceball_001.png");

        //배경 이미지 로드
        this.load.image('bg_sky', 'assets/background_0.png');
        this.load.image('bg_mountain', 'assets/background02.png');
        this.load.image('bg_spkie', 'assets/background03_spikes_light.png')
    }

    create(): void 
    {
        this.scene.start("Lobby");
    }

}