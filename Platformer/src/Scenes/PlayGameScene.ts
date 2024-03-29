import Phaser from 'phaser';
import GameMap from '../Entities/GameMap';
import Player from '../Entities/Player';
import { GameOption } from '../GameOption';
import Enemy from '../Entities/Enemy';
import Enemies from '../Groups/Enemies';
import UIManager from '../Core/UIManager';
import ProjectilePool from '../Entities/Weapons/ProjectilePool';
import Projectile from '../Entities/Weapons/Projectile';
import ExtraAnimation from '../Entities/Animations/ExtraAnimation';
import EffectManager from '../Entities/Effects/EffectManager';
import MeleeWeapon from '../Entities/Weapons/MeleeWeapon';
import Collectable from '../Entities/Collectables/Collectable';
import Collectables from '../Groups/Collectables';
import CollideableObject from '../Entities/CollideableObject';
import EventEmitter from '../Events/Emitter';

export default class PlayGameScene extends Phaser.Scene {
    
    player : Player;
    enemies: Enemies;
    
    collectables:Collectables;
    gameScore:number = 0;

    initPlayerHealth:number = 10;

    bgMusic:Phaser.Sound.BaseSound;
    constructor()
    {
        super({key:"PlayGameScene"});
    }

    create() : void
    {
        let level = this.registry.get("level") as string;

        GameMap.Instance = new GameMap( this, "cmap" + level);
        UIManager.Instance = new UIManager(this);
        ProjectilePool.Instance = new ProjectilePool(this);
        EffectManager.Instance = new EffectManager(this);
        EventEmitter.Instance = new EventEmitter(); //이벤트 에미터 생성

        ExtraAnimation(this.anims); //기타 애니메이션 로딩, 피격이펙트 스윙이펙트 등등

        this.createCollectable(); //이게 먼저 생겨야 플레이어랑 이거랑 충돌 설정이 가능
        this.createPlayer(200, 350); //플레이어 이동속도 200으로 생성
        
        this.createFollowUpCam(); //플레이어를 따라다니는 카메라 셋
        this.createEnemy(GameMap.Instance.enemySpawns);
        
        this.player.addCollider(GameMap.Instance.colliders, undefined, undefined); //맵의 충돌체와의 충돌처리        
        this.player.addOverlap(this.collectables, this.onCollect, this);
        this.player.addCollider(GameMap.Instance.traps, this.onPlayerHitByTrap, this)
            .addCollider(this.enemies, this.onPlayerHit, this);


        this.createGameEvent();

        this.playBackgroundMusic();

        this.gameScore = 0;
        const rightEnd = GameOption.width - (GameOption.width - GameOption.realWidth) * 0.5;
        const bottomEnd = GameOption.height - (GameOption.height - GameOption.realHeight) * 0.5;
        const backBtn = this.add.image( rightEnd - 10, bottomEnd - 10, 'back')
                            .setOrigin(1, 1)
                            .setScale(2)
                            .setInteractive()
                            .setScrollFactor(0);
        //백버튼 누르면 메뉴씬으로 이동한다.
        backBtn.on("pointerup", ()=>{
            this.cleanUp();
            this.scene.start("MenuScene");
        });
    }

    playBackgroundMusic():void 
    {
        if(!this.bgMusic)
        {
            this.bgMusic = this.sound.add("theme", {loop:true, volume:0.1});
        }
        
        this.bgMusic.play();
    }

    //보석 레이어 생성
    createCollectable() : void
    {
        this.collectables = new Collectables(this).setDepth(5);; //정적 그룹
        
        this.collectables.addFromLayer(GameMap.Instance.collectable);
        //전체 그룹에 애니메이션 적용
        this.collectables.playAnimation("diamond_shine");
        
    }


    createPlayer(speed:number, jumpPower:number) : void 
    {
        let {x, y} = GameMap.Instance.playerZones["startZone"]
        this.player = new Player(this, x as number, y as number, "player", speed, jumpPower, this.initPlayerHealth); //체력은 나중에 조절

        const EndOfLevelOverlap: Phaser.Physics.Arcade.Collider = this.physics.add.overlap(this.player, GameMap.Instance.endZone, ()=> {
            //닿았을 때 처리. 한번만 작동하고 멈추도록
            EndOfLevelOverlap.active = false;
            console.log("Player reach to endzone") ;
            // let nextLevel = this.registry.get('level') as number + 1;
            // this.registry.set('level', nextLevel);
            this.gotoNextLevel();            
        });
       
    }

    createGameEvent(): void 
    {
        EventEmitter.Instance.on("PLAYER_DEAD", () => {
            console.log("Gameover");
            this.setGameOver();
        });
    }


    onCollect(body1: Phaser.Types.Physics.Arcade.GameObjectWithBody, body2:Phaser.Types.Physics.Arcade.GameObjectWithBody):void 
    {
        let player = body1 as Player;
        
        let jewel = body2 as Collectable;

        jewel.disableBody(true, true);
        
        this.gameScore += jewel.score; //점수 증가

        UIManager.Instance.hud.updateScoreText(this.gameScore);
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
            .addCollider(ProjectilePool.Instance, this.onWeaponHit)
            .addOverlap(this.player.meleeWeapon, this.onMeleeWeaponHit);
    }

    onPlayerHitByTrap(body1:any, body2: any) : void
    {
        let player = body1 as Player;
        let tile = body2 as Phaser.Tilemaps.Tile;

        
        let direction = new Phaser.Math.Vector2(player.body.x - tile.pixelX > 0 ? 1 : -1, 0);
        player.takeHit(1, direction);
    }

    onPlayerHit(body1: Phaser.Types.Physics.Arcade.GameObjectWithBody, body2:Phaser.Types.Physics.Arcade.GameObjectWithBody):void 
    {
        let player : Player = body1 as Player;
        let other = body2 as Enemy;

        let direction = new Phaser.Math.Vector2(player.body.x - other.body.x, player.body.y - other.body.y);
        player.takeHit(other.getDamage(), direction);
    }

    onWeaponHit(body1: Phaser.Types.Physics.Arcade.GameObjectWithBody, body2:Phaser.Types.Physics.Arcade.GameObjectWithBody) 
    {
        let enemy: Enemy = body1 as Enemy;
        let projectile: Projectile = body2 as Projectile;

        enemy.takeHit(projectile.damage); //발사체의 데미지만큼 데미지 입히고
        projectile.createExplosion(enemy); //
    }

    onMeleeWeaponHit(body1: Phaser.Types.Physics.Arcade.GameObjectWithBody, body2:Phaser.Types.Physics.Arcade.GameObjectWithBody) 
    {
        let enemy: Enemy = body1 as Enemy;
        let melee: MeleeWeapon = body2 as MeleeWeapon;
        if(enemy.takeHit(melee.damage)) {
            melee.createExplosion(enemy); //성공했다면 피격 마크 띄움
        }; //칼의 데미지 만큼 입히고
        
    }

    gotoNextLevel():void 
    {
        this.registry.inc('level', 1); //레벨 증가
        let level:number = this.registry.get("level") as number;

        if(level > GameOption.lastLevel) 
        {
            this.scene.start("EndingScene");
            return;
        }

        let maxLevel:number = this.registry.get("unlocked-levels") as number;
        if(level > maxLevel){
            this.registry.set("unlocked-levels", level);
        }
        this.cleanUp();
        this.scene.restart();
    }

    cleanUp():void 
    {
        this.bgMusic.stop();
        this.events.off(Phaser.Scenes.Events.UPDATE);
    }

    setGameOver(): void 
    {
        //씬에 붙어있는 전역 레지스트리와 이벤트들을 리셋시켜줘야 사라진 에네미나 플레이어들이 문제다.
        //this.registry.destroy();
        this.cleanUp();
        this.scene.start("PlayGameScene");
    }

    update(time: number, delta: number): void {
        GameMap.Instance.updateMap(time, delta); //패럴렉스 업데이트
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

    // this.line = new Phaser.Geom.Line();

        // this.graphics.lineStyle(1, 0x00ff00);

        // this.isDraw = false;
        // this.input.on("pointerdown", this.startDrawing, this);
        // this.input.on("pointerup", this.stopDrawing, this);
