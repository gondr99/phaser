import Phaser, { Scenes } from 'phaser';

export interface Zone 
{
    [key:string]: Phaser.Types.Tilemaps.TiledObject
}

export default class GameMap 
{
    scene: Phaser.Scene
    map:Phaser.Tilemaps.Tilemap;
    environments :Phaser.Tilemaps.TilemapLayer;
    platforms :Phaser.Tilemaps.TilemapLayer;
    colliders :Phaser.Tilemaps.TilemapLayer;
    playerZones: Zone;
    endZone: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    enemySpawns: Phaser.Types.Tilemaps.TiledObject[];

    constructor(scene: Phaser.Scene, key:string)
    {
        this.scene = scene;
        this.map = scene.make.tilemap({key});
        this.map.addTilesetImage("main_lev_build_1", "tiles-1");

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

        this.colliders = this.map.createLayer("Colliders", tileSet);
        this.colliders.setVisible(false);

        //모든 애들을 컬라이더 충돌로 놓느냐.. 몇몇 애들만 충돌로 놓느냐를 설정하는 것, 타일아이디로 가능하고 coliide라는 별도의 속성을 부여해서 쓰는 것도 가능하다.
        //this.colliders.setCollisionByExclusion([-1], true);
        this.colliders.setCollisionByProperty({collide:true}, true);
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