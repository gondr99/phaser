import Phaser from 'phaser';

export default class PreloadAssetScene extends Phaser.Scene
{
    constructor()
    {
        super({key:"PreloadScene"});
    }

    preload() : void 
    {
        //타일맵 데이터 로드
        this.load.tilemapTiledJSON("cmap1", "assets/crystal_map_level1.json");
        this.load.tilemapTiledJSON("cmap2", "assets/crystal_map_level2.json");
        this.load.image("tiles-1", "assets/main_lev_build_1.png");
        this.load.image("tiles-2", "assets/main_lev_build_2.png");
        this.load.image("bg_spike_tileset_image", "assets/bg_spikes_tileset.png")

        //플레이어 이미지 로드
        //this.load.image("player", "assets/player/movements/idle01.png");
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
        //플레이어 칼질 애니메이션 로드
        this.load.spritesheet("sword_default", "assets/weapons/sword_sheet_1.png", {
            frameWidth:52, 
            frameHeight:32,
            spacing:16
        });

        //버드맨 이미지 로드
        this.load.spritesheet("birdman", "assets/enemy/enemy_sheet.png", {
            frameWidth:32,
            frameHeight:64, 
            spacing:32
        });

        //스네이크맨 이미지 로드
        this.load.spritesheet("snakeman", "assets/enemy/enemy_sheet_2.png", {
            frameWidth:32,
            frameHeight:64, 
            spacing:32
        });

        //투사체 이미지 로드
        this.load.image("iceball", "assets/weapons/iceball_001.png");

        //폭발 이미지 로드
        this.load.spritesheet("hit_effect", "assets/weapons/hit_effect_sheet.png", {
            frameWidth:32,
            frameHeight:32
        });

        //다이아몬드 이미지 로드

        this.load.image("diamond", "assets/collectables/diamond.png");
        this.load.image("diamond-1", "assets/collectables/diamond_big_01.png");
        this.load.image("diamond-2", "assets/collectables/diamond_big_02.png");
        this.load.image("diamond-3", "assets/collectables/diamond_big_03.png");
        this.load.image("diamond-4", "assets/collectables/diamond_big_04.png");
        this.load.image("diamond-5", "assets/collectables/diamond_big_05.png");
        this.load.image("diamond-6", "assets/collectables/diamond_big_06.png");


        //배경 이미지 로딩
        this.load.image("bg_spikes_dark", "assets/bg_spikes_dark.png");
        this.load.image("sky_play", "assets/sky_play.png");
        
        //메뉴씬 이미지 로딩
        this.load.image("menu_bg", "assets/background01.png");

        //loader 플러그인에 complete 이벤트에 한번만 리스너를 달아준다.
        this.load.once("complete", () => {
            this.startGame();
        });
    }

    //씬간의 데이터 전송을 위해 registry를 사용
    startGame() {
        this.registry.set("level", 1);
        this.scene.start("MenuScene");
    }

}