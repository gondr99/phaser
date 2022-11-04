import Phaser from 'phaser';
import Player from '../Entities/Player';
import { GameOption } from '../GameOption';

interface Zone 
{
    [key:string]: Phaser.Types.Tilemaps.TiledObject
}

export default class PlayGameScene extends Phaser.Scene {

    environments :Phaser.Tilemaps.TilemapLayer;
    platforms :Phaser.Tilemaps.TilemapLayer;
    colliders :Phaser.Tilemaps.TilemapLayer;
    player : Player;
    playerZones: Zone;
    constructor()
    {
        super({key:"PlayGameScene"});
    }

    create() : void
    {
        const map = this.createMap();
        this.createLayers(map);

        
        this.createPlayer(200, 350); //플레이어 이동속도 200으로 생성

        this.player.addCollider(this.colliders);
        //플레이어와 컬라이더를 충돌체로 구현한다.
        //this.physics.add.collider(this.player, this.colliders);   
        
        this.createFollowUpCam();
    }

    createMap(): Phaser.Tilemaps.Tilemap
    {
        const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({key:"cmap"});
        map.addTilesetImage("main_lev_build_1", "tiles-1");
        
        //const tileSet2 = map.addTilesetImage("main_lev_build_2", "tiles-2");
        return map;
    }

    createLayers(map : Phaser.Tilemaps.Tilemap)
    {
        //만든 순서대로
        const tileSet: Phaser.Tilemaps.Tileset = map.getTileset("main_lev_build_1");
        this.platforms = map.createLayer("platforms", tileSet);
        this.environments = map.createLayer("Environments", tileSet);

        //Phaser.Types.Tilemaps.TiledObject[];
        this.playerZones = map.getObjectLayer("Player_zones").objects.reduce( 
            (s:Zone, v:Phaser.Types.Tilemaps.TiledObject) : Zone => ({...s, [v.name]: v}), {} ); 

        // this.playerZones = map.getObjectLayer("Player_zones").objects.reduce( 
        // (s:Zone, v:Phaser.Types.Tilemaps.TiledObject) => {
        //     s[v.name] = v;
        //     return s;
        // }, {} ); 
        //존을 설정한 오브젝트 레이어에서 오브젝트 배열을 뽑아 온다.

        this.colliders = map.createLayer("Colliders", tileSet);
        this.colliders.setVisible(false);

        //모든 애들을 컬라이더 충돌로 놓느냐.. 몇몇 애들만 충돌로 놓느냐를 설정하는 것, 타일아이디로 가능하고 coliide라는 별도의 속성을 부여해서 쓰는 것도 가능하다.
        //this.colliders.setCollisionByExclusion([-1], true);
        this.colliders.setCollisionByProperty({collide:true}, true);
    }

    createPlayer(speed:number, jumpPower:number) : void 
    {
        let {x, y} = this.playerZones["startZone"]
        this.player = new Player(this, x as number, y as number, "player", speed, jumpPower);
    }

    // update(time: number, delta: number): void {
        
    // }

    createFollowUpCam(): void{
        const {width, height, mapOffset, cameraZoomFactor, bottomOffset} = GameOption;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + bottomOffset);
        this.cameras.main.setBounds(0, 0, width + mapOffset, height); 
        this.cameras.main.setZoom(cameraZoomFactor); //줌인
        this.cameras.main.startFollow(this.player);
    }
}