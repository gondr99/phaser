import Phaser from 'phaser';
import GameMap from '../Entities/GameMap';
import Player from '../Entities/Player';
import { GameOption } from '../GameOption';
import Birdman from '../Entities/Birdman';
import { EnemyCategory } from '../EnemyClass';
import Enemy from '../Entities/Enemy';


export default class PlayGameScene extends Phaser.Scene {

    map:GameMap;
    
    player : Player;
    
    constructor()
    {
        super({key:"PlayGameScene"});
    }

    create() : void
    {
        this.map = new GameMap( this, "cmap");

        this.createPlayer(200, 350); //플레이어 이동속도 200으로 생성
        this.player.addCollider(this.map.colliders); //맵의 충돌체와의 충돌처리
        
        this.createFollowUpCam(); //플레이어를 따라다니는 카메라 셋

        this.createEnemy(this.map.enemySpawns);
    }


    createPlayer(speed:number, jumpPower:number) : void 
    {
        let {x, y} = this.map.playerZones["startZone"]
        this.player = new Player(this, x as number, y as number, "player", speed, jumpPower);

        const EndOfLevelOverlap: Phaser.Physics.Arcade.Collider = this.physics.add.overlap(this.player, this.map.endZone, ()=> {
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
        for(let i = 0; i < spawnPoints.length; i++)
        {
            let className:string = spawnPoints[i].properties[0].value as string;
            let e : Enemy = new EnemyCategory[className](this, spawnPoints[i].x as number, spawnPoints[i].y as number, "birdman", 20) as Enemy;
            //let e = Reflect.construct(EnemyCategory[className] , [this, spawnPoints[i].x as number, spawnPoints[i].y as number, "birdman", 20]);
            
            // let enemy:Birdman = new Birdman(this, spawnPoints[i].x as number, spawnPoints[i].y as number, "birdman", 20);
            e.addCollider(this.map.colliders)
              .addCollider(this.player);
        }
        
    }
}