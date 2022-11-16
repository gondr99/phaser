import Phaser from 'phaser';
import GameMap from '../Entities/GameMap';
import Player from '../Entities/Player';
import { GameOption } from '../GameOption';
import Birdman from '../Entities/Birdman';
import Enemy from '../Entities/Enemy';
import Enemies from '../Groups/Enemies';
import UIManager from '../Core/UIManager';
import ProjectilePool from '../Entities/Weapons/ProjectilePool';
import CollideableObject from '../Entities/CollideableObject';
import Projectile from '../Entities/Weapons/Projectile';
import ExtraAnimation from '../Entities/Animations/ExtraAnimation';
import EffectManager from '../Entities/Effects/EffectManager';



export default class PlayGameScene extends Phaser.Scene {
    
    player : Player;
    enemies: Enemies;
    
    // graphics: Phaser.GameObjects.Graphics;
    // line : Phaser.Geom.Line;
    // isDraw: boolean;
    // hits: Phaser.Tilemaps.Tile[] = [];
    constructor()
    {
        super({key:"PlayGameScene"});
    }

    create() : void
    {
        GameMap.Instance = new GameMap( this, "cmap");
        UIManager.Instance = new UIManager(this);
        ProjectilePool.Instance = new ProjectilePool(this);
        EffectManager.Instance = new EffectManager(this);

        this.createPlayer(200, 350); //플레이어 이동속도 200으로 생성
        this.player.addCollider(GameMap.Instance.colliders); //맵의 충돌체와의 충돌처리
        
        this.createFollowUpCam(); //플레이어를 따라다니는 카메라 셋
        this.createEnemy(GameMap.Instance.enemySpawns);
        // this.line = new Phaser.Geom.Line();

        // this.graphics.lineStyle(1, 0x00ff00);

        // this.isDraw = false;
        // this.input.on("pointerdown", this.startDrawing, this);
        // this.input.on("pointerup", this.stopDrawing, this);
        
        ExtraAnimation(this.anims); //기타 애니메이션 로딩
    }

    createPlayer(speed:number, jumpPower:number) : void 
    {
        let {x, y} = GameMap.Instance.playerZones["startZone"]
        this.player = new Player(this, x as number, y as number, "player", speed, jumpPower, 10);

        const EndOfLevelOverlap: Phaser.Physics.Arcade.Collider = this.physics.add.overlap(this.player, GameMap.Instance.endZone, ()=> {
            //닿았을 때 처리. 한번만 작동하고 멈추도록
            EndOfLevelOverlap.active = false;
            console.log("Player reach to endzone") ;
        })
    }

    createFollowUpCam(): void{
        const {width, height, mapOffset, cameraZoomFactor, bottomOffset} = GameOption;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + bottomOffset);
        this.cameras.main.setBounds(0, 0, width + mapOffset, height); 
        this.cameras.main.setZoom(cameraZoomFactor); //줌인
        this.cameras.main.startFollow(this.player);
    }

    createEnemy(spawnPoints: Phaser.Types.Tilemaps.TiledObject[]): void 
    {
        this.enemies = new Enemies(this);
        //spawnPoints.length
        for(let i = 0; i < spawnPoints.length; i++)
        {
            let className:string = spawnPoints[i].properties[0].value as string; //첫번째 프로퍼티로 클래스 이름이 들어가 있음.
            let e : Enemy = new (this.enemies.getTypes(className))(this, spawnPoints[i].x as number, spawnPoints[i].y as number, className.toLocaleLowerCase(), 70) as Enemy;            
            e.setHP(40); //적의 체력을 어떻게?

            this.enemies.add(e); //그룹에 더한다.
        }

        //플레이어와 적이 충돌했을 때의 내용
        this.enemies.addCollider(GameMap.Instance.colliders, undefined)
            .addCollider(this.player, this.onPlayerCollision)
            .addCollider(ProjectilePool.Instance, this.onWeaponHit);
    }

    onPlayerCollision(body1: Phaser.Types.Physics.Arcade.GameObjectWithBody, body2:Phaser.Types.Physics.Arcade.GameObjectWithBody):void 
    {
        let enemy : Enemy = body1 as Enemy;
        let player : Player = body2 as Player;
        player.takeHit(enemy.getDamage(), enemy);
    }

    onWeaponHit(body1: Phaser.Types.Physics.Arcade.GameObjectWithBody, body2:Phaser.Types.Physics.Arcade.GameObjectWithBody) 
    {
        let enemy: Enemy = body1 as Enemy;
        let projectile: Projectile = body2 as Projectile;

        enemy.takeHit(projectile.damage); //발사체의 데미지만큼 데미지 입히고
        projectile.createExplosion(enemy); //
    }
}


// startDrawing(e: Phaser.Input.Pointer): void 
    // {
    //     this.hits.filter(x => x.index != -1).forEach(x => x.setCollision(false));
    //     let {worldX, worldY} = e;
    //     this.line.x1 = worldX;
    //     this.line.y1 = worldY;
    //     this.isDraw = true;
    // }

    // stopDrawing(e: Phaser.Input.Pointer): void 
    // {
    //     let {worldX, worldY} = e;
    //     this.line.x2 = worldX;
    //     this.line.y2 = worldY;

    //     this.graphics.clear();
    //     this.hits = GameMap.Instance.platforms.getTilesWithinShape(this.line); //이거랑 라인이 충돌하는지 검사해보자.

    //     this.hits.filter(x => x.index != -1).forEach(x => x.setCollision(true));
        
    //     this.graphics.strokeLineShape(this.line);
    //     this.isDraw = false;

    //     const collidingTileColor = new Phaser.Display.Color(243, 134, 48, 200);
    //     GameMap.Instance.platforms.renderDebug(this.graphics, {tileColor:null, collidingTileColor });
    // }

    // update(time: number, delta: number): void {
    //     if(this.isDraw)
    //     {
    //         let {worldX, worldY} = this.input.activePointer;
    //         this.line.x2 = worldX;
    //         this.line.y2 = worldY;
    //         this.graphics.clear();
    //         this.graphics.strokeLineShape(this.line);
    //     }
    // }
