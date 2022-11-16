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
        this.load.tilemapTiledJSON("cmap", "assets/crystal_map.json");
        this.load.image("tiles-1", "assets/main_lev_build_1.png");
        this.load.image("tiles-2", "assets/main_lev_build_2.png");

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

        //버드맨 이미지 로드
        this.load.spritesheet("birdman", "assets/enemy/enemy_sheet.png", {
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
        
    }

    create(): void 
    {
        this.scene.start("PlayGameScene");
    }

}