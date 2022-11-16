import Phaser, { Cameras, Scenes } from 'phaser';
import Enemy from './Enemy';
import { birdmanAnim as InitAnimation } from './Animations/EnemyAnimations';
import GameMap from './GameMap';
import GameUtil from '../Core/GameUtil';
import Vector2 = Phaser.Math.Vector2;

export default class Birdman extends Enemy
{
    rayGraphics: Phaser.GameObjects.Graphics;
    movingDirection:number = 1;
    body : Phaser.Physics.Arcade.Body;
    speed: number;
    prevX:number;

    
    damage:number = 1;
    maxPatrolDistance:number = 300;
    currentPatrolDistance:number = 0;
    constructor(scene:Phaser.Scene, x:number, y:number, key:string, speed:number)
    {
        console.log(key);
        super(scene, x, y, key, speed);
        
        this.prevX = x;
        this.speed = speed;
    }

    override init(): void 
    {
        this.setOrigin(0.5, 1); //아래쪽 중앙에 잡아준다.
        this.setCollideWorldBounds(true); //월드 경계선과 충돌하도록 처리

        if(this.scene.physics.config.debug)
            this.rayGraphics = this.scene.add.graphics({lineStyle:{width:2, color:0xff0000}});

        InitAnimation(this.scene.anims);
        
        
        this.body.setSize(this.width-10, this.height-20);
        this.body.setOffset(6, 20);
        this.setImmovable(true); //물리 현상에 의해 움직이지 않게    
    }

    override update(time: number, delta: number): void {
        this.play('birdman-idle', true);
        this.setVelocityX(this.speed * this.movingDirection);

        this.patrol(time);
        
    }

    override getDamage(): number {
        return this.damage;
    }

    override die(): void 
    {
        console.log("DEad");
    }

    patrol(time:number)
    {
        if(!this.body || !this.body.onFloor()) { return; }

        this.currentPatrolDistance += Math.abs(this.body.deltaX()); //이동한 거리만큼 계속 더한다.
        let deltaX:number = Math.abs(this.prevX - this.x);
        if(deltaX > 5)
        {
            this.prevX = this.x;
            let start: Vector2 = new Vector2(this.body.x, this.body.halfHeight + this.body.y);

            let direction:Vector2 = new Vector2(-0.5, 1);
            
            if(this.movingDirection > 0) {
                start.x += this.body.width; 
                direction.x = 0.5;
            }

            const {line, hasHit} = GameUtil.raycast(start, direction.normalize(), GameMap.Instance.colliders, 70);
            if(this.scene.physics.config.debug){
                this.rayGraphics.clear();
                this.rayGraphics.strokeLineShape(line);
            }

            if(!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance){
                this.turn();
            }
        }        
    }

    turn():void 
    {
        this.setFlipX(!this.flipX);
        this.movingDirection *= -1;
        this.currentPatrolDistance = 0;
    }

}