import Phaser from "phaser";
import CollideableObject from "../CollideableObject";
import EffectManager from "../Effects/EffectManager";
import SpriteEffect from "../Effects/SpriteEffect";

export default class Projectile extends CollideableObject
{
    speed:number;
    body:Phaser.Physics.Arcade.Body;
    lifeTime:number;
    maxLifeTime:number;
    damage:number = 1;
    direction:number = 1;
    constructor(scene:Phaser.Scene, x:number, y:number, key:string, speed:number, maxLifetime:number = 2)
    {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.speed = speed;
        this.maxLifeTime = maxLifetime;
    }

    preUpdate(time:number, delta:number)
    {
        //사거리로 하려면 this.body.deltaAbsX를 이용해서 이동거리를 측정
        super.preUpdate(time, delta);
        this.lifeTime += delta;
        if(this.lifeTime >= this.maxLifeTime*1000){
            this.setDisable();
        }
    }

    setDisable():void 
    {
        this.body.reset(0, 0); //위치이동하면서 속도랑 가속도도 전부 초기화
        this.setActive(false);
        this.setVisible(false);
    }

    createExplosion(target: CollideableObject): void 
    {
        //진행방향으로 조금 더 나아간 곳에 생성
        
        let center = this.getCenter(); 
        center.x += this.displayWidth * 0.7 * this.direction;

        EffectManager.Instance.PlayEffectOn("hiteffect", center, target);
        this.setDisable();
    }

    fire(center: Phaser.Math.Vector2, speed:number, lifeTime:number, direction:number, damage:number) : void 
    {
        this.damage = damage; //데미지 설정
        this.y = center.y;
        this.speed = speed;
        this.maxLifeTime = lifeTime;
        
        this.direction = direction;

        this.setFlipX(direction < 0);
        this.x = direction < 0 ? center.x - 5 : center.x + 5;
        this.setVelocityX(this.speed * direction);
    }
}