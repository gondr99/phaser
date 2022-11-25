import Phaser from 'phaser';
import CollideableObject from './CollideableObject';
import InitPlayerAnimation from './Animations/PlayerAnimation'
import UIManager from '../Core/UIManager';
import ProjectilePool from './Weapons/ProjectilePool';
import { GetTimestamp, CheckAnimationPlay } from '../Core/GameUtil';
import MeleeWeapon from './Weapons/MeleeWeapon';
import EventEmitter from '../Events/Emitter';
import { GameOption } from '../GameOption';


//export type ArcadeSpriteWithBody = Phaser.Physics.Arcade.Sprite & {body: Phaser.Physics.Arcade.Body};

export default class Player extends CollideableObject
{
    speed:number;
    jumpPower:number;
    cursorsKey : Phaser.Types.Input.Keyboard.CursorKeys;

    maxJumpCount:number = 2;
    currentJumpCount:number = 0;
    isGround:boolean = false;

    health:number;
    maxHealth:number;

    hasBeenHit: boolean = false; //맞았는지를 체크하는 불리언변수
    bouncePower:number = 250;

    lastProjectileTime: number = 0; 
    coolDown:number = 1000;//1초
    projectileDamage: number = 5;

    meleeWeapon: MeleeWeapon;
    meleeCoolDown:number = 400; //0.4초
    lastMeleeTime:number = 0;
    body:Phaser.Physics.Arcade.Body;
    
    constructor(scene:Phaser.Scene, x:number, y:number, key:string, speed:number, jumpPower:number, health:number)
    {
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;
        this.jumpPower = jumpPower;
        this.maxHealth = this.health = health;
        
        this.init();
        this.setDepth(20); //플레이어의 소팅레이어을 20으로 설정한다.
    }


    init():void 
    {
        this.setOrigin(0.5, 1); //아래쪽 중앙에 잡아준다.
        this.cursorsKey = this.scene.input.keyboard.createCursorKeys();
        this.setCollideWorldBounds(true); //월드 경계선과 충돌하도록 처리

        InitPlayerAnimation(this.scene.anims); //애니메이션 초기화

        this.body.setSize(20, 36);

        this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, "sword_default", 10);

        this.initEvents();
    }

    initEvents(): void
    {
        //스프라이트는 업데이트가 없으니까 업데이트시에 이것도 실행해달라고 요청해야 함.
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        
        this.scene.input.keyboard.on("keydown-Q", this.fireProjectile, this);
        this.scene.input.keyboard.on("keydown-E", this.meleeAttack, this);
    }

    meleeAttack(): void
    {
        if(this.hasBeenHit) {return;}
        
        if(this.meleeCoolDown + this.lastMeleeTime > GetTimestamp()) return;
        this.lastMeleeTime = GetTimestamp();

        this.play("throw", true);
        this.meleeWeapon.swing(this, this.flipX ? -1 : 1);
    }

    fireProjectile(): void 
    {
        if(this.hasBeenHit) {return;}

        let now:number = GetTimestamp();
        if(this.coolDown + this.lastProjectileTime > now) return;
        this.lastProjectileTime = GetTimestamp();

        const p = ProjectilePool.Instance.getProjectile();
        let dir:number = 1;
        if (this.flipX)
            dir = -1;

        let center = this.getCenter();

        p.fire(center, 500, 1, dir, this.projectileDamage);

        this.play("throw", true);
    }

    move(direction:number) : void 
    {
        this.setVelocityX(direction * this.speed);
    }

    jump(): void{
        
        this.currentJumpCount++;
        if(this.isGround || this.currentJumpCount <= this.maxJumpCount ){
            this.setVelocityY(-this.jumpPower);
        } 
    }

    //피격처리와 튕겨나갈 방향
    takeHit(damage:number, direction:Phaser.Math.Vector2): void 
    {
        if(this.hasBeenHit) return;
        
        this.hasBeenHit = true;
        let dir = direction.normalize();
        dir.y = -1;
        this.bounceOff(dir);
        
        this.health -= damage;

        if(this.health <= 0)
        {
            EventEmitter.Instance.emit("PLAYER_DEAD");
            return;
        }

        let tween = this.playDamageTweenAnimation();
        this.scene.time.delayedCall(1000, ()=> {
            this.hasBeenHit = false;
            tween.stop(0); //원래 상태로
        });

        UIManager.Instance.healthBar.setHealth(this.health / this.maxHealth);
    }

    bounceOff(dir: Phaser.Math.Vector2) {
        this.setVelocity(dir.x * this.bouncePower, dir.y * this.bouncePower);
    }

    playDamageTweenAnimation(): Phaser.Tweens.Tween 
    {
        return this.scene.tweens.add({
            targets:this,
            duration:200,
            repeat:-1,
            alpha: 0.2,
            yoyo:true
        });
    }
    
    update(time: number, delta: number): void {
        if(this.y > GameOption.height + 20) {
            EventEmitter.Instance.emit("PLAYER_DEAD");
        }
        if(this.hasBeenHit) {return;}
        
        const {left, right, space} = this.cursorsKey;
        const isSpaceJustDown :boolean = Phaser.Input.Keyboard.JustDown(space); //막 한번 눌린것만 체크
        this.isGround = this.body.onFloor();

        if(left.isDown) {
            this.move(-1);
            this.setFlipX(true);
        }else if(right.isDown)
        {
            this.move(1);
            this.setFlipX(false);
        }else {
            this.move(0);
        }

        if( isSpaceJustDown ) {
            this.jump();
        }

        if(this.isGround && this.body.velocity.y == 0){
            this.currentJumpCount = 0; //바닥에 닿아있다면 점프카운트를 0으로 만들어라.
        }
        //console.log(this.anims.currentAnim.key);
        if(CheckAnimationPlay(this.anims, "throw")) {
            return;
        }

        if(this.isGround == true)
        {
            if(Math.abs( this.body.velocity.x )<= 0.1) 
            {
                this.play('idle', true);
            }else{
                this.play('run', true);
            }
        }else {
            this.play("jump", true);
        }
    }

}

// this.scene.time.addEvent({
//     delay:1000,
//     callback: () => {
//         this.hasBeenHit = false;
//     }
// })