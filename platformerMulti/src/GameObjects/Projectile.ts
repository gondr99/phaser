import { Position } from "../Network/Protocol";

export default class Projectile extends Phaser.Physics.Arcade.Sprite
{
    body:Phaser.Physics.Arcade.Body;
    lifeTime:number;
    maxLifeTime:number;
    damage:number = 1;
    direction:number = 1;

    ownerId:string;
    
    projectileId:number = 0;

    constructor(scene:Phaser.Scene, x:number, y:number, key:string)
    {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setSize(20, 20); //사이즈 조정 필요함.
    }

    //처음 할때는 그냥 발사부터 놓고 그걸 네트워크로 고치는 과정으로 수업
    initAndFire(pos:Position, lifeTime:number, speed:number, direction:number, ownerId:string, projectileId:number, damage:number): void 
    {
        this.projectileId = projectileId;
        this.lifeTime = 0;
        this.maxLifeTime = lifeTime;
        this.x = pos.x;
        this.y = pos.y;
        this.ownerId = ownerId;
        this.setFlipX(direction < 0); //뒤집을 준비

        this.damage = damage;
        this.setVelocityX(speed);
    }

    preUpdate(time:number, delta:number)
    {
        //사거리로 하려면 this.body.deltaAbsX를 이용해서 이동거리를 측정
        super.preUpdate(time, delta);
        this.lifeTime += delta;
        if(this.lifeTime >= this.maxLifeTime){
            this.setDisable();
        }
    }

    setDisable():void 
    {
        this.body.reset(0, 0); //위치이동하면서 속도랑 가속도도 전부 초기화
        this.setActive(false);
        this.setVisible(false);
    }

    addExplosion(pos:Position): void 
    {
        console.log(`${pos.x}, ${pos.y}에 폭발 이펙트를 남깁니다`);
    }
}