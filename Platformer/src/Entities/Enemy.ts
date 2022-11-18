import { GetTimestamp } from "../Core/GameUtil";
import CollideableObject from "./CollideableObject";

export default abstract class Enemy extends CollideableObject
{
    speed:number;
    hp:number;
    isDead:boolean = false;

    hitCooltime:number = 300;
    lastHitTime:number = 0;


    constructor(scene:Phaser.Scene, x:number, y:number, key:string, speed:number)
    {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;

        this.init();
        this.initEvents();
    }

    setHP(value:number) : void 
    {
        this.hp = value;
    }

    abstract init():void ;
    abstract getDamage():number;

    takeHit(value:number) : boolean{
        if(this.hitCooltime + this.lastHitTime > GetTimestamp()) {
            return false;
        }
        this.hp -= value;
        this.lastHitTime = GetTimestamp();
        if(this.hp <= 0){
            this.isDead = true;
            this.die();
        }
        return true;
    }
    abstract die(): void;

    initEvents(): void
    {
        //스프라이트는 업데이트가 없으니까 업데이트시에 이것도 실행해달라고 요청해야 함.
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    abstract update(time: number, delta: number): void;


}