import Phaser, { Scenes } from 'phaser';
import UIManager from '../Core/UIManager';
import { GameOption } from '../GameOption';

export interface Zone 
{
    [key:string]: Phaser.Types.Tilemaps.TiledObject
}

export default class GameMap 
{
    static Instance:GameMap;

    scene: Phaser.Scene
    map:Phaser.Tilemaps.Tilemap;
    environments :Phaser.Tilemaps.TilemapLayer;
    platforms :Phaser.Tilemaps.TilemapLayer;
    colliders :Phaser.Tilemaps.TilemapLayer;
    collectable :Phaser.Tilemaps.ObjectLayer;
    playerZones: Zone;
    endZone: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    enemySpawns: Phaser.Types.Tilemaps.TiledObject[];

    traps:Phaser.Tilemaps.TilemapLayer;

    spikeImage: Phaser.GameObjects.TileSprite;
    skyImage: Phaser.GameObjects.TileSprite;

    constructor(scene: Phaser.Scene, key:string)
    {
        this.scene = scene;
        this.map = scene.make.tilemap({key});
        this.map.addTilesetImage("main_lev_build_1", "tiles-1");
        this.map.addTilesetImage("bg_spikes_tileset", "bg_spike_tileset_image");

        this.createBackground(); //배경 생성

        this.createLayer();
        this.createEndOfLevel();
    }


    createLayer():void 
    {
        //만든 순서대로
        const tileSet: Phaser.Tilemaps.Tileset = this.map.getTileset("main_lev_build_1");
        this.platforms = this.map.createLayer("platforms", tileSet);
        this.environments = this.map.createLayer("Environments", tileSet);

        //적생성위치
        this.enemySpawns = this.map.getObjectLayer("Enemy_Spawns").objects;

        this.playerZones = this.map.getObjectLayer("Player_zones").objects.reduce( 
            (s:Zone, v:Phaser.Types.Tilemaps.TiledObject) : Zone => ({...s, [v.name]: v}), {} ); 
        //존을 설정한 오브젝트 레이어에서 오브젝트 배열을 뽑아 온다.

        //아이템 레이어
        this.collectable = this.map.getObjectLayer("Collectables");
        
        //트랩 레이어
        this.traps = this.map.createLayer("Traps", tileSet);
        this.traps.setCollisionByExclusion([-1], true);


        this.colliders = this.map.createLayer("Colliders", tileSet);
        this.colliders.setVisible(false);

        //모든 애들을 컬라이더 충돌로 놓느냐.. 몇몇 애들만 충돌로 놓느냐를 설정하는 것, 타일아이디로 가능하고 coliide라는 별도의 속성을 부여해서 쓰는 것도 가능하다.
        //this.colliders.setCollisionByExclusion([-1], true);
        this.colliders.setCollisionByProperty({collide:true}, true);
    }
    
    createBackground():void 
    {
        const tileSet: Phaser.Tilemaps.Tileset = this.map.getTileset("bg_spikes_tileset");
        this.map.createLayer("Distance", tileSet);

        const bg: Phaser.Types.Tilemaps.TiledObject = this.map.getObjectLayer("Distance_BG").objects[0];
        let {width, height } = GameOption;
        this.spikeImage = this.scene.add.tileSprite(bg.x as number, bg.y as number, 
            width, bg.height as number, "bg_spikes_dark")
            .setOrigin(0, 1)
            .setDepth(-10)
            .setScrollFactor(0, 1);


        //const skyBG: Phaser.Types.Tilemaps.TiledObject = this.map.getObjectLayer("Distance_skyBG").objects[1];
        this.skyImage = this.scene.add.tileSprite(0, 0, width, 220 as number, "sky_play")
            .setOrigin(0, 0)
            .setDepth(-15)
            .setScale(1, 1)
            .setScrollFactor(0, 1);
    }

    updateMap(time:number, delta:number): void 
    {
        //이런거 안해도 스크롤팩터가 그런 역할을 해...-_-;; //근데 스크롤팩터는 좌표 자체를 이동시켜
        this.spikeImage.tilePositionX = this.scene.cameras.main.scrollX * 0.3;
        this.skyImage.tilePositionX = this.scene.cameras.main.scrollX * 0.1;
    }

    createEndOfLevel():void 
    {
        const end: Phaser.Types.Tilemaps.TiledObject = this.playerZones["endZone"];
        this.endZone =  this.scene.physics.add.sprite(end.x as number, end.y as number, 'end')
            .setAlpha(1)
            .setOrigin(0.5, 1)
            .setSize(5, 200)
            .setImmovable();
        this.endZone.body.setAllowGravity(false);
        
        this.endZone.body.setOffset(0, -150);
    }
}